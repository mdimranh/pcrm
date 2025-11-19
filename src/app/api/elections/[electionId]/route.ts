// src/app/api/elections/[electionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum([
    "APPEAL_PERIOD",
    "APPEAL_CLOSED",
    "APPROVAL_PERIOD",
    "VOTING_PERIOD",
    "VOTING_CLOSED",
    "COMPLETED",
    "CANCELLED",
  ]),
  voteStartDate: z.string().datetime().optional(),
  voteEndDate: z.string().datetime().optional(),
});

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

    const election = await db.election.findUnique({
      where: { id: electionId },
      include: {
        positions: {
          include: {
            candidates: {
              where: { status: "APPROVED" },
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                  },
                },
              },
              orderBy: { voteCount: "desc" },
            },
          },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    return NextResponse.json({ data: election });
  } catch (error) {
    console.error("Error fetching election:", error);
    return NextResponse.json(
      { error: "Failed to fetch election" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ electionId: string }> }
) {
  try {
    const { electionId } = await params;
    const currentUser = await getCurrentUserServer();
    
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await db.member.findFirst({
      where: { userId: currentUser.id },
      include: { role: true },
    });

    if (!membership?.isAdmin && !membership?.role?.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = updateStatusSchema.parse(body);

    const election = await db.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    if (election.organizationId !== membership.organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.election.update({
      where: { id: electionId },
      data: {
        status: data.status,
        voteStartDate: data.voteStartDate ? new Date(data.voteStartDate) : undefined,
        voteEndDate: data.voteEndDate ? new Date(data.voteEndDate) : undefined,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error updating election:", error);
    return NextResponse.json(
      { error: "Failed to update election" },
      { status: 500 }
    );
  }
}