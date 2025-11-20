import { getCurrentUserServer } from "@/core/auth/current-user";
import db from "@/core/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getCurrentUserServer();
        if (!currentUser) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }
        const searchParam = new URL(req.url).searchParams.get("org");
        const orgid = searchParam?.toString();
        if (!orgid) {
            return NextResponse.json(
                { success: false, error: "Organization ID is required" },
                { status: 400 }
            );
        }
        const updateSession = await db.session.updateMany({
            where: {
                userId: currentUser.id
            },
            data: {
                activeOrgId: orgid
            }
        })
        if (updateSession.count === 0) {
            return NextResponse.json(
                { success: false, error: "Session not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json(
            { success: false, error: e instanceof Error ? e.message : "Unknown error" },
            { status: 500 }
        );
    }
}