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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const paramsRes = await params;
        const body = await req.json() as {
            firstName?: string;
            lastName?: string;
            phoneNumber?: string;
            email?: string;
            gender?: "MALE" | "FEMALE" | "THIRD_GENDER";
            nid?: string;
            status?: "ACTIVE" | "REJECTED" | "SUSPENDED" | "PENDING";
            designation?: string;
            divisionId?: string;
            districtId?: string;
            upazilaId?: string;
            unionId?: string;
            pollingUnitId?: string;
        };
        const updated = await db.user.update({
            where: { id: paramsRes.id },
            data: {
                ...(body.firstName ? { firstName: body.firstName } : {}),
                ...(body.lastName ? { lastName: body.lastName } : {}),
                ...(body.gender ? { gender: body.gender } : {}),
                ...(body.nid ? { nid: body.nid } : {}),
                ...(body.status ? { status: body.status } : {}),
            },
            include: { membership: true },
        });
        if (body.email) {
            await db.email.upsert({
                where: { userId: paramsRes.id },
                create: { userId: paramsRes.id, email: body.email },
                update: { email: body.email },
            });
        }
        if (body.phoneNumber) {
            await db.phoneNumber.upsert({
                where: { userId: paramsRes.id },
                create: { userId: paramsRes.id, phoneNumber: body.phoneNumber },
                update: { phoneNumber: body.phoneNumber },
            });
        }
        if (body.designation) {
            await db.member.upsert({
                where: { userId: paramsRes.id },
                create: {
                    userId: paramsRes.id,
                    roleId: body.designation,
                    organizationId: updated.membership?.organizationId ?? undefined as unknown as string,
                },
                update: { roleId: body.designation },
            });
        }
        if (body.divisionId) {
            await db.area.upsert({
                where: { userId: paramsRes.id },
                create: {
                    userId: paramsRes.id,
                    divisionId: body.divisionId,
                    districtId: body.districtId ?? null,
                    upazilaId: body.upazilaId ?? null,
                    unionId: body.unionId ?? null,
                    pollingUnitId: body.pollingUnitId ?? null,
                },
                update: {
                    divisionId: body.divisionId,
                    districtId: body.districtId ?? null,
                    upazilaId: body.upazilaId ?? null,
                    unionId: body.unionId ?? null,
                    pollingUnitId: body.pollingUnitId ?? null,
                },
            });
        }
        return NextResponse.json({ success: true, userId: updated.id });
    } catch {
        return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.$transaction([
            db.email.deleteMany({ where: { userId: id } }),
            db.phoneNumber.deleteMany({ where: { userId: id } }),
            db.member.deleteMany({ where: { userId: id } }),
            db.area.deleteMany({ where: { userId: id } }),
        ]);
        await db.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 });
    }
}