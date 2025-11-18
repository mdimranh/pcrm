// src/app/api/users/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await db.user.update({
            where: { id: params.id },
            data: { status: "ACTIVE" },
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: "Failed to approve user" }, { status: 500 });
    }
}