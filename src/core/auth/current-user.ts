// src/core/auth/current-user.ts
import db from "@/core/db";
import { cookies } from "next/headers";
import { area, Member } from "../db/client";

export type CurrentUser = {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  status: string;
  organizationId?: string;
  roleId?: string;
  membership?: Member;
  area?: area;
  isSuperAdmin: boolean;
};
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
    isSuperAdmin: u.isSuperAdmin,
  };
}

export async function getCurrentUserClient(): Promise<CurrentUser | null> {
  const res = await fetch("/api/me", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { success: boolean; user?: CurrentUser };
  if (!json.success || !json.user) return null;
  return json.user;
}
