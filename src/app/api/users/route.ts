// src/app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { userReagion } from "@/utils/region";
import { Role, User } from "@/core/db/client";

export type Users = User & {
    email: { email: string };
    phoneNumber: { phoneNumber: string };
    membership: { role: Role };
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
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users as Users[]);
}