// src/app/api/users/[id]/suspend/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await req.json().catch(() => ({}));
        await db.user.update({
            where: { id },
            data: { status: "SUSPENDED" },
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, error: "Failed to suspend user" },
            { status: 500 }
        );
    }
}