import db from "@/core/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const org = new URL(req.url).searchParams.get("org") ?? undefined;
    const roles = await db.role.findMany({
        where: {
            isSystem: false,
            ...(org ? { organizationId: org } : {}),
        },
        orderBy: { name: "asc" },
    });
    return NextResponse.json(roles);
}
