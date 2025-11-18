import db from "@/core/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const organizations = await db.organization.findMany();
  return NextResponse.json(organizations);
}
