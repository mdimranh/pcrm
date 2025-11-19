// src/app/api/candidates/[candidateId]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/core/db";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import { z } from "zod";

const approvalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  try {
    const { candidateId } = await params;
    const currentUser = await getCurrentUserServer();
    
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = approvalSchema.parse(body);

    // Check if user is admin
    const membership = await db.member.findFirst({
      where: { userId: currentUser.id },
      include: { role: true },
    });

    if (!membership?.isAdmin && !membership?.role?.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get candidate with election details
    const candidate = await db.candidate.findUnique({
      where: { id: candidateId },
      include: {
        position: {
          include: {
            election: true,
          },
        },
      },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    if (candidate.position.election.organizationId !== membership.organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (data.status === "REJECTED" && !data.rejectionReason) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Update candidate status
    const updated = await db.candidate.update({
      where: { id: candidateId },
      data: {
        status: data.status,
        approvedBy: currentUser.id,
        approvedAt: new Date(),
        rejectionReason: data.rejectionReason,
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

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error approving candidate:", error);
    return NextResponse.json(
      { error: "Failed to update candidate status" },
      { status: 500 }
    );
  }
}