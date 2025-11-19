// src/app/api/elections/[electionId]/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { z } from "zod";

const voteSchema = z.object({
  votes: z.array(
    z.object({
      positionId: z.string().cuid(),
      candidateId: z.string().cuid(),
    })
  ).min(1),
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
    const data = voteSchema.parse(body);

    // Verify election and voting period
    const election = await db.election.findUnique({
      where: { id: electionId },
      include: {
        positions: {
          include: {
            candidates: {
              where: { status: "APPROVED" },
            },
          },
        },
      },
    });

    if (!election) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    const now = new Date();
    if (!election.voteStartDate || !election.voteEndDate) {
      return NextResponse.json(
        { error: "Voting dates not set" },
        { status: 400 }
      );
    }

    if (now < election.voteStartDate || now > election.voteEndDate) {
      return NextResponse.json(
        { error: "Voting period is not active" },
        { status: 400 }
      );
    }

    if (election.status !== "VOTING_PERIOD") {
      return NextResponse.json(
        { error: "Voting is not open" },
        { status: 400 }
      );
    }

    // Verify user is member
    const membership = await db.member.findFirst({
      where: {
        userId: currentUser.id,
        organizationId: election.organizationId,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate all votes
    for (const vote of data.votes) {
      const position = election.positions.find((p) => p.id === vote.positionId);
      if (!position) {
        return NextResponse.json(
          { error: `Invalid position: ${vote.positionId}` },
          { status: 400 }
        );
      }

      const candidate = position.candidates.find((c) => c.id === vote.candidateId);
      if (!candidate) {
        return NextResponse.json(
          { error: `Invalid candidate: ${vote.candidateId}` },
          { status: 400 }
        );
      }

      // Check if already voted for this position
      const existingVote = await db.vote.findUnique({
        where: {
          positionId_voterId: {
            positionId: vote.positionId,
            voterId: currentUser.id,
          },
        },
      });

      if (existingVote) {
        return NextResponse.json(
          { error: `You have already voted for ${position.name}` },
          { status: 400 }
        );
      }
    }

    // Record votes in transaction
    const votes = await db.$transaction(
      data.votes.map((vote) =>
        db.vote.create({
          data: {
            electionId: electionId,
            positionId: vote.positionId,
            candidateId: vote.candidateId,
            voterId: currentUser.id,
            ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
            userAgent: req.headers.get("user-agent"),
          },
        })
      )
    );

    return NextResponse.json({ 
      data: votes,
      message: "Votes recorded successfully" 
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error recording votes:", error);
    return NextResponse.json(
      { error: "Failed to record votes" },
      { status: 500 }
    );
  }
}

// Check if user has voted
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

    const votes = await db.vote.findMany({
      where: {
        electionId: electionId,
        voterId: currentUser.id,
      },
      include: {
        position: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      data: votes,
      hasVoted: votes.length > 0 
    });
  } catch (error) {
    console.error("Error checking votes:", error);
    return NextResponse.json(
      { error: "Failed to check votes" },
      { status: 500 }
    );
  }
}