// src/app/api/roles/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getCurrentUserServer();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const membership = await db.member.findFirst({
            where: { userId: currentUser.id },
            include: { organization: true },
        });
        if (!membership) {
            return NextResponse.json(
                { error: "User is not part of any organization" },
                { status: 404 }
            );
        }
        const roles = await db.role.findMany({
            select: { id: true, name: true, description: true },
            orderBy: { name: "asc" },
        });
        return NextResponse.json({ data: roles });
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch roles" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUserServer();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const membership = await db.member.findFirst({
            where: { userId: currentUser.id },
            include: { role: true },
        });
        if (!membership?.isAdmin && !membership?.role?.isSuperAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const body = await req.json() as { name: string; description?: string };
        if (!body.name?.trim()) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }
        const role = await db.role.create({
            data: { name: body.name.trim(), description: body.description ?? null },
            select: { id: true, name: true, description: true },
        });
        return NextResponse.json({ data: role });
    } catch {
        return NextResponse.json(
            { error: "Failed to create role" },
            { status: 500 }
        );
    }
}