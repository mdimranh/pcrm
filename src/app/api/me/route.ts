// src/app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";

export async function GET(req: NextRequest) {
    const token =
        req.cookies.get("session_token")?.value ??
        req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const session = await db.session.findUnique({
        where: { token },
        include: {
            user: {
                include: {
                    email: true,
                    membership: { include: { organization: true, role: true } },
                    area: true,
                },
            },
        },
    });
    if (!session || session.expiresAt <= new Date()) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    const u = session.user;
    const user = {
        id: u.id,
        isSuperAdmin: u.isSuperAdmin,
        email: u.email?.email,
        firstName: u.firstName,
        lastName: u.lastName,
        status: u.status,
        organization: u.membership?.organization,
        organizationId: u.membership?.organizationId,
        roleId: u.membership?.roleId ?? undefined,
        membership: u.membership ?? undefined,
        area: u.area ?? undefined,
    };
    return NextResponse.json({ success: true, user });
}