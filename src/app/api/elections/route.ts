// src/app/api/elections/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { z } from "zod";

const createElectionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  appealStartDate: z.string().datetime(),
  appealEndDate: z.string().datetime(),
  voteStartDate: z.string().datetime().optional(),
  voteEndDate: z.string().datetime().optional(),
  positions: z.array(
    z.object({
      name: z.string().min(2).max(100),
      description: z.string().optional(),
      maxCandidates: z.number().int().positive().optional(),
      displayOrder: z.number().int().default(0),
    })
  ).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUserServer();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const membership = await db.member.findFirst({
      where: { userId: currentUser.id },
      include: { organization: true, role: true },
    });

    if (!membership?.isAdmin && !membership?.role?.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = createElectionSchema.parse(body);

    // Validate dates
    const appealStart = new Date(data.appealStartDate);
    const appealEnd = new Date(data.appealEndDate);
    
    if (appealEnd <= appealStart) {
      return NextResponse.json(
        { error: "Appeal end date must be after start date" },
        { status: 400 }
      );
    }

    if (data.voteStartDate && data.voteEndDate) {
      const voteStart = new Date(data.voteStartDate);
      const voteEnd = new Date(data.voteEndDate);
      
      if (voteStart <= appealEnd) {
        return NextResponse.json(
          { error: "Vote start date must be after appeal end date" },
          { status: 400 }
        );
      }
      
      if (voteEnd <= voteStart) {
        return NextResponse.json(
          { error: "Vote end date must be after vote start date" },
          { status: 400 }
        );
      }
    }

    // Create election with positions
    const election = await db.election.create({
      data: {
        title: data.title,
        description: data.description,
        organizationId: membership.organizationId,
        appealStartDate: appealStart,
        appealEndDate: appealEnd,
        voteStartDate: data.voteStartDate ? new Date(data.voteStartDate) : null,
        voteEndDate: data.voteEndDate ? new Date(data.voteEndDate) : null,
        status: appealStart <= new Date() ? "APPEAL_PERIOD" : "APPEAL_PERIOD",
        positions: {
          create: data.positions,
        },
      },
      include: {
        positions: true,
      },
    });

    return NextResponse.json({ data: election }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating election:", error);
    return NextResponse.json(
      { error: "Failed to create election" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUserServer();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await db.member.findFirst({
      where: { userId: currentUser.id },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "User is not part of any organization" },
        { status: 404 }
      );
    }

    const elections = await db.election.findMany({
      where: { organizationId: membership.organizationId },
      include: {
        positions: {
          include: {
            _count: {
              select: { candidates: true },
            },
          },
          orderBy: { displayOrder: "asc" },
        },
        _count: {
          select: { 
            positions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: elections });
  } catch (error) {
    console.error("Error fetching elections:", error);
    return NextResponse.json(
      { error: "Failed to fetch elections" },
      { status: 500 }
    );
  }
}