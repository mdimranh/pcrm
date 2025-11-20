// src/core/auth/current-user-server.ts
import db from "@/core/db";
import { cookies } from "next/headers";
import { type CurrentUser } from "./current-user";

export async function getCurrentUserServer(): Promise<CurrentUser | null> {
    const token =
        (await cookies()).get("session_token")?.value ??
        (await cookies()).get("access_token")?.value;
    if (!token) return null;

    const session = await db.session.findUnique({
        where: { token },
        include: {
            user: {
                include: {
                    email: true,
                    membership: { include: { organization: true, role: true } },
                    area: true
                },
            },
        },
    });
    if (!session || session.expiresAt <= new Date()) return null;

    const u = session.user;
    return {
        id: u.id,
        email: u.email?.email,
        firstName: u.firstName,
        lastName: u.lastName,
        status: u.status,
        organizationId: u.membership?.organizationId,
        roleId: u.membership?.roleId ?? undefined,
        membership: u.membership
            ? {
                ...u.membership,
                role: u.membership.role ?? undefined,
            }
            : undefined,
        area: u.area ?? undefined,
        isSuperAdmin: u.isSuperAdmin,
        session,
    };
}