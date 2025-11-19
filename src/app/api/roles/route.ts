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

        // Get the user's organization
        const membership = await db.member.findFirst({
            where: {
                userId: currentUser.id,
            },
            include: {
                organization: true,
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "User is not part of any organization" },
                { status: 404 }
            );
        }

        // Fetch all roles for the organization
        const roles = await db.role.findMany({
            // where: {
            //     organizationId: membership.organizationId,
            // },
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({ data: roles });
    } catch (error) {
        console.error("Error fetching roles:", error);
        return NextResponse.json(
            { error: "Failed to fetch roles" },
            { status: 500 }
        );
    }
}