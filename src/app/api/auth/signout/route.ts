// src/app/api/auth/signout/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";

export async function POST(req: NextRequest) {
    const isProd = process.env.NODE_ENV === "production";

    const access = req.cookies.get("access_token")?.value;
    const refresh = req.cookies.get("refresh_token")?.value;
    const sessionToken =
        req.cookies.get("session_token")?.value ??
        access ??
        (refresh ? refresh.split(".")[0] : undefined);

    if (sessionToken) {
        try {
            await db.session.delete({ where: { token: sessionToken } });
        } catch { }
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("access_token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 0,
    });
    res.cookies.set("refresh_token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 0,
    });
    res.cookies.set("session_token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 0,
    });
    return res;
}