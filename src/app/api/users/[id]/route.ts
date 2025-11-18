// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const u = await db.user.findUnique({
        where: { id: params.id },
        include: {
            email: true,
            phoneNumber: true,
            membership: { include: { role: true, organization: true } },
            area: true,
        },
    });
    if (!u) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, user: u });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json() as { firstName: string; lastName: string; phoneNumber?: string };
        const updated = await db.user.update({
            where: { id: params.id },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
            },
        });
        if (body.phoneNumber) {
            await db.phoneNumber.upsert({
                where: { userId: params.id },
                create: { userId: params.id, phoneNumber: body.phoneNumber },
                update: { phoneNumber: body.phoneNumber },
            });
        }
        return NextResponse.json({ success: true, userId: updated.id });
    } catch {
        return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
    }
}