// src/app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { userReagion } from "@/utils/region";
import { area, Role, User } from "@/core/db/client";

export type Users = User & {
    email: { email: string };
    phoneNumber: { phoneNumber: string };
    membership: { role: Role };
    area: area & {
        division: {
            name: string;
        },
        district: {
            name: string;
        },
        upazila: {
            name: string;
        },
        union: {
            name: string;
        },
        pollingUnit: {
            name: string;
        },
    };
};

function areaQuery(
    divisionId?: string,
    districtId?: string,
    upazilaId?: string,
    unionId?: string,
    pollingUnitId?: string,
) {
    if (pollingUnitId) {
        return {
            pollingUnitId,
        }
    } else if (unionId) {
        return {
            unionId,
            pollingUnitId: null,
        }
    } else if (upazilaId) {
        return {
            upazilaId,
            unionId: null,
            pollingUnitId: null,
        }
    } else if (districtId) {
        return {
            districtId,
            upazilaId: null,
            unionId: null,
            pollingUnitId: null,
        }
    } else if (divisionId) {
        return {
            divisionId,
            districtId: null,
            upazilaId: null,
            unionId: null,
            pollingUnitId: null,
        }
    }
}

export async function GET(req: NextRequest) {
    const currentUser = await getCurrentUserServer();
    const url = new URL(req.url);
    const divisionId = url.searchParams.get("divisionId");
    const districtId = url.searchParams.get("districtId");
    const upazilaId = url.searchParams.get("upazilaId");
    const unionId = url.searchParams.get("unionId");
    const pollingUnitId = url.searchParams.get("pollingUnitId");

    const isSuper = !!currentUser?.isSuperAdmin;
    const region: { label: string; key: string } = userReagion(currentUser?.area);


    const whereArea = isSuper
        ? (divisionId || districtId || upazilaId || unionId || pollingUnitId
            ? {
                area: areaQuery(
                    divisionId ?? undefined,
                    districtId ?? undefined,
                    upazilaId ?? undefined,
                    unionId ?? undefined,
                    pollingUnitId ?? undefined,
                ),
            }
            : {})
        : (region.key === "central"
            ? { area: null }
            : {
                area: {
                    [region.key]: currentUser?.area?.[
                        region.key as keyof typeof currentUser.area
                    ],
                },
            });

    const users = await db.user.findMany({
        where: {
            NOT: { id: currentUser?.id },
            ...whereArea,
        },
        include: {
            email: true,
            phoneNumber: true,
            membership: { include: { role: true } },
            area: {
                include: {
                    division: { select: { name: true } },
                    district: { select: { name: true } },
                    upazila: { select: { name: true } },
                    union: { select: { name: true } },
                    pollingUnit: { select: { name: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users as Users[]);
}