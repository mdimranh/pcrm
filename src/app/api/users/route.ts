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
            area: {
                include: {
                    division: {
                        select: {
                            name: true,
                        },
                    },
                    district: {
                        select: {
                            name: true,
                        },
                    },
                    upazila: {
                        select: {
                            name: true,
                        },
                    },
                    union: {
                        select: {
                            name: true,
                        },
                    },
                    pollingUnit: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users as Users[]);
}