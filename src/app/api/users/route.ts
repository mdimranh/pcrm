// src/app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { userReagion } from "@/utils/region";

export async function GET(req: NextRequest) {
    const currentUser = await getCurrentUserServer();
    const region: { label: string; key: string } = userReagion(currentUser?.area);
    const users = await db.user.findMany({
        where: {
            NOT: { id: currentUser?.id },
            ...(region.key === "central"
                ? { area: null }
                : {
                      area: {
                          [region.key]: currentUser?.area?.[
                              region.key as keyof typeof currentUser.area
                          ],
                      },
                  }),
        },
        include: {
            email: true,
            phoneNumber: true,
            membership: { include: { role: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    const mapStatus: Record<string, "active" | "inactive" | "invited" | "suspended"> = {
        ACTIVE: "active",
        SUSPENDED: "suspended",
        REJECTED: "inactive",
        PENDING: "invited",
    };

    const data = users.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        username:
            (u.email?.email ? u.email.email.split("@")[0] : undefined) ??
            `${u.firstName}.${u.lastName}`.toLowerCase(),
        email: u.email?.email ?? "",
        phoneNumber: u.phoneNumber?.phoneNumber ?? "",
        status: mapStatus[String(u.status)] ?? "invited",
        role: u.membership?.role?.isSuperAdmin
            ? "superadmin"
            : "admin",
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
    }));

    return NextResponse.json(data);
}