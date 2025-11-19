// src/app/api/elections/[electionId]/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { z } from "zod";

const applySchema = z.object({
  positionId: z.string().cuid(),
  statement: z.string().min(10).max(2000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ electionId: string }> }
) {
  try {
    const { electionId } = await params;
    const currentUser = await getCurrentUserServer();
    
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = applySchema.parse(body);

    // Verify election exists and is in appeal period
    const election = await db.election.findUnique({
      where: { id: electionId },
      include: {
        positions: {
          where: { id: data.positionId },
        },
      },
    });

    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    if (election.positions.length === 0) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    const now = new Date();
    if (now < election.appealStartDate || now > election.appealEndDate) {
      return NextResponse.json(
        { error: "Appeal period is not active" },
        { status: 400 }
      );
    }

    if (election.status !== "APPEAL_PERIOD") {
      return NextResponse.json(
        { error: "Appeals are closed for this election" },
        { status: 400 }
      );
    }

    // Verify user is member of the organization
    const membership = await db.member.findFirst({
      where: {
        userId: currentUser.id,
        organizationId: election.organizationId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You must be a member of the organization to apply" },
        { status: 403 }
      );
    }

    // Check if user already applied for this position
    const existing = await db.candidate.findUnique({
      where: {
        positionId_userId: {
          positionId: data.positionId,
          userId: currentUser.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied for this position" },
        { status: 400 }
      );
    }

    // Create candidate application
    const candidate = await db.candidate.create({
      data: {
        positionId: data.positionId,
        userId: currentUser.id,
        statement: data.statement,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
        position: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ data: candidate }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error applying for position:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}