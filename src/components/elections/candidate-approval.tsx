// src/components/elections/candidate-approval.tsx
"use client";

import { useState, useEffect } from "react";
import { Election, Candidate } from "@/types/election";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getFullName, getCandidateStatusBadge } from "@/lib/election-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CandidateApprovalProps {
  election: Election;
  onUpdate: () => void;
}

export function CandidateApproval({ election, onUpdate }: CandidateApprovalProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [action, setAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  const allCandidates = election.positions.flatMap((p) =>
    p.candidates.map((c) => ({ ...c, positionName: p.name }))
  );

  const pendingCandidates = allCandidates.filter((c) => c.status === "PENDING");
  const reviewedCandidates = allCandidates.filter((c) => c.status !== "PENDING");

  function openApprovalDialog(candidate: Candidate, approveAction: "APPROVED" | "REJECTED") {
    setSelectedCandidate(candidate);
    setAction(approveAction);
    setRejectionReason("");
  }

  function closeDialog() {
    setSelectedCandidate(null);
    setAction(null);
    setRejectionReason("");
  }

  async function handleApproval() {
    if (!selectedCandidate || !action) return;

    if (action === "REJECTED" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/candidates/${selectedCandidate.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          rejectionReason: action === "REJECTED" ? rejectionReason : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update candidate status");
      }

      toast.success(
        action === "APPROVED"
          ? "Candidate approved successfully"
          : "Candidate rejected"
      );
      onUpdate();
      closeDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (allCandidates.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No candidates have applied for this election yet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {pendingCandidates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Review and approve or reject candidate applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingCandidates.map((candidate) => (
                  <CandidateApprovalItem
                    key={candidate.id}
                    candidate={candidate}
                    onApprove={() => openApprovalDialog(candidate, "APPROVED")}
                    onReject={() => openApprovalDialog(candidate, "REJECTED")}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {reviewedCandidates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Candidates</CardTitle>
              <CardDescription>
                Candidates that have been approved or rejected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewedCandidates.map((candidate) => (
                  <ReviewedCandidateItem key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedCandidate} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "APPROVED" ? "Approve Candidate" : "Reject Candidate"}
            </DialogTitle>
            <DialogDescription>
              {selectedCandidate &&
                `${getFullName(selectedCandidate.user)} for ${
                  selectedCandidate.position?.name
                }`}
            </DialogDescription>
          </DialogHeader>

          {action === "REJECTED" && (
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this application is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant={action === "APPROVED" ? "default" : "destructive"}
              onClick={handleApproval}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : action === "APPROVED"
                ? "Approve"
                : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface CandidateApprovalItemProps {
  candidate: Candidate & { positionName: string };
  onApprove: () => void;
  onReject: () => void;
}

function CandidateApprovalItem({
  candidate,
  onApprove,
  onReject,
}: CandidateApprovalItemProps) {
  const fullName = getFullName(candidate.user);
  const initials = `${candidate.user.firstName[0]}${candidate.user.lastName[0]}`;

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <Avatar className="mt-1">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{fullName}</p>
            <p className="text-sm text-muted-foreground">{candidate.positionName}</p>
          </div>
          <Badge variant="secondary">Pending</Badge>
        </div>

        {candidate.statement && (
          <p className="text-sm text-muted-foreground mt-2">{candidate.statement}</p>
        )}

        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={onApprove}>
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={onReject}>
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ReviewedCandidateItemProps {
  candidate: Candidate & { positionName: string };
}

function ReviewedCandidateItem({ candidate }: ReviewedCandidateItemProps) {
  const fullName = getFullName(candidate.user);
  const initials = `${candidate.user.firstName[0]}${candidate.user.lastName[0]}`;
  const statusBadge = getCandidateStatusBadge(candidate.status);

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/50">
      <Avatar className="mt-1">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{fullName}</p>
            <p className="text-sm text-muted-foreground">{candidate.positionName}</p>
          </div>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>

        {candidate.statement && (
          <p className="text-sm text-muted-foreground mt-2">{candidate.statement}</p>
        )}

        {candidate.status === "REJECTED" && candidate.rejectionReason && (
          <p className="text-sm text-destructive mt-2">
            <strong>Rejection reason:</strong> {candidate.rejectionReason}
          </p>
        )}
      </div>
    </div>
  );
}