// src/app/api/elections/[electionId]/count/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";

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

    const membership = await db.member.findFirst({
      where: { userId: currentUser.id },
      include: { role: true },
    });

    if (!membership?.isAdmin && !membership?.role?.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const election = await db.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    if (election.organizationId !== membership.organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (election.status !== "VOTING_CLOSED") {
      return NextResponse.json(
        { error: "Voting must be closed before counting" },
        { status: 400 }
      );
    }

    // Count votes for each candidate
    const voteCounts = await db.vote.groupBy({
      by: ["candidateId"],
      where: { electionId: electionId },
      _count: {
        id: true,
      },
    });

    // Update candidate vote counts in transaction
    await db.$transaction([
      ...voteCounts.map((count) =>
        db.candidate.update({
          where: { id: count.candidateId },
          data: { voteCount: count._count.id },
        })
      ),
      db.election.update({
        where: { id: electionId },
        data: {
          isCounted: true,
          countedAt: new Date(),
          status: "COMPLETED",
        },
      }),
    ]);

    // Get results
    const results = await db.election.findUnique({
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
            _count: {
              select: { votes: true },
            },
          },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ 
      data: results,
      message: "Votes counted successfully" 
    });
  } catch (error) {
    console.error("Error counting votes:", error);
    return NextResponse.json(
      { error: "Failed to count votes" },
      { status: 500 }
    );
  }
}