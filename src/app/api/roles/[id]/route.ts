import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUserServer();
        if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const membership = await db.member.findFirst({ where: { userId: currentUser.id }, include: { role: true } });
        if (!membership?.isAdmin && !membership?.role?.isSuperAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json() as { name?: string; description?: string };
        const updated = await db.role.update({
            where: { id },
            data: {
                ...(body.name ? { name: body.name } : {}),
                ...(body.description !== undefined ? { description: body.description } : {}),
            },
            select: { id: true, name: true, description: true },
        });
        return NextResponse.json({ data: updated });
    } catch {
        return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUserServer();
        if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const membership = await db.member.findFirst({ where: { userId: currentUser.id }, include: { role: true } });
        if (!membership?.isAdmin && !membership?.role?.isSuperAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const usageCount = await db.member.count({ where: { roleId: id } });
        if (usageCount > 0) {
            return NextResponse.json({ error: "Role is in use by members" }, { status: 409 });
        }

        await db.role.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
    }
}