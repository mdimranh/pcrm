// src/app/api/elections/[electionId]/my-applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ electionId: string }> }
) {
  try {
    const { electionId } = await params;
    const currentUser = await getCurrentUserServer();
    
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const candidacies = await db.candidate.findMany({
      where: {
        userId: currentUser.id,
        position: {
          electionId: electionId,
        },
      },
      include: {
        position: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: candidacies });
  } catch (error) {
    console.error("Error fetching candidacies:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidacies" },
      { status: 500 }
    );
  }
}