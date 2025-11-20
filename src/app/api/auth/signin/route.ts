import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcrypt";
import db from "@/core/db";
import { PrismaClient } from "@/core/db/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(7),
});

function generateToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function defaultOrgId() {
    const defaultOrg = await db.organization.findFirst({
        where: {
            isDefault: true
        },
    });
    if (!defaultOrg) {
        const org = await db.organization.findFirst({
            orderBy: {
                createdAt: "asc"
            }
        });
        if (!org) {
            throw new Error("No organization found");
        }
        await db.organization.update({
            where: {
                id: org.id
            },
            data: {
                isDefault: true
            }
        });
        return org.id;
    } else {
        return defaultOrg.id;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = signinSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
                { status: 400 }
            );
        }

        const prisma = new PrismaClient().$extends(withAccelerate());
        const emailRecord = await prisma.email.findUnique({
            where: { email: parsed.data.email },
            include: { user: true },
        });

        if (!emailRecord || !emailRecord.user) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        if (emailRecord.user.status !== "ACTIVE") {
            return NextResponse.json(
                { success: false, error: "Account is not active" },
                { status: 403 }
            );
        }

        const valid = await compare(parsed.data.password, (emailRecord.user as any).password);
        if (!valid) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        const token = generateToken();
        const accessToken = token;
        const refreshToken = `${token}.${generateToken()}`;
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const ipAddress = req.headers.get("x-forwarded-for") ?? undefined;
        const userAgent = req.headers.get("user-agent") ?? undefined;

        await db.session.create({
            data: {
                token,
                expiresAt,
                ipAddress,
                userAgent,
                activeOrgId: await defaultOrgId() ?? null,
                userId: emailRecord.user.id,
            },
        });

        const res = NextResponse.json({ success: true, userId: emailRecord.user.id, firstName: emailRecord.user.firstName, lastName: emailRecord.user.lastName });
        const isProd = process.env.NODE_ENV === "production";
        res.cookies.set("access_token", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProd,
            path: "/",
            maxAge: 15 * 60,
        });
        res.cookies.set("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProd,
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });
        return res;
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to sign in" }, { status: 500 });
    }
}