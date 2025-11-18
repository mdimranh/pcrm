// src/core/auth/current-user-client.ts
import { type CurrentUser } from "./current-user";

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