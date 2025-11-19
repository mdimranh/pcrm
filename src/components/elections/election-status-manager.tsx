// src/components/elections/election-status-manager.tsx
"use client";

import { useState } from "react";
import { Election, ElectionStatus } from "@/types/election";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/election-utils";

interface ElectionStatusManagerProps {
  election: Election;
  onUpdate: () => void;
}

const statusOptions: { value: ElectionStatus; label: string; description: string }[] = [
  {
    value: "APPEAL_PERIOD",
    label: "Appeal Period",
    description: "Candidates can submit applications",
  },
  {
    value: "APPEAL_CLOSED",
    label: "Appeal Closed",
    description: "No new applications accepted",
  },
  {
    value: "APPROVAL_PERIOD",
    label: "Approval Period",
    description: "Admin reviewing applications",
  },
  {
    value: "VOTING_PERIOD",
    label: "Voting Active",
    description: "Members can cast their votes",
  },
  {
    value: "VOTING_CLOSED",
    label: "Voting Closed",
    description: "Voting ended, ready for counting",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    description: "Election finished with results",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    description: "Election cancelled",
  },
];

export function ElectionStatusManager({ election, onUpdate }: ElectionStatusManagerProps) {
  const [status, setStatus] = useState<ElectionStatus>(election.status);
  const [voteStartDate, setVoteStartDate] = useState(
    election.voteStartDate
      ? new Date(election.voteStartDate).toISOString().slice(0, 16)
      : ""
  );
  const [voteEndDate, setVoteEndDate] = useState(
    election.voteEndDate
      ? new Date(election.voteEndDate).toISOString().slice(0, 16)
      : ""
  );
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    try {
      setLoading(true);

      const response = await fetch(`/api/elections/${election.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          voteStartDate: voteStartDate ? new Date(voteStartDate).toISOString() : undefined,
          voteEndDate: voteEndDate ? new Date(voteEndDate).toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update election");
      }

      toast.success("Election status updated successfully");
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const currentStatus = statusOptions.find((s) => s.value === election.status);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
          <CardDescription>
            The election is currently in <strong>{currentStatus?.label}</strong> status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Appeal Period</span>
                </div>
                <p className="text-sm">{formatDateTime(election.appealStartDate)}</p>
                <p className="text-sm">to {formatDateTime(election.appealEndDate)}</p>
              </div>

              {election.voteStartDate && election.voteEndDate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Voting Period</span>
                  </div>
                  <p className="text-sm">{formatDateTime(election.voteStartDate)}</p>
                  <p className="text-sm">to {formatDateTime(election.voteEndDate)}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
          <CardDescription>
            Change the election status and update voting dates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Election Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ElectionStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(status === "VOTING_PERIOD" || status === "VOTING_CLOSED" || status === "COMPLETED") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="voteStart">Vote Start Date</Label>
                <Input
                  id="voteStart"
                  type="datetime-local"
                  value={voteStartDate}
                  onChange={(e) => setVoteStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voteEnd">Vote End Date</Label>
                <Input
                  id="voteEnd"
                  type="datetime-local"
                  value={voteEndDate}
                  onChange={(e) => setVoteEndDate(e.target.value)}
                />
              </div>
            </>
          )}

          {status === "VOTING_PERIOD" && (
            <Alert>
              <Play className="h-4 w-4" />
              <AlertDescription>
                Setting status to "Voting Active" will allow members to cast their votes.
                Make sure all candidates are approved first.
              </AlertDescription>
            </Alert>
          )}

          {status === "VOTING_CLOSED" && (
            <Alert>
              <Square className="h-4 w-4" />
              <AlertDescription>
                Closing the voting period will prevent any new votes from being cast.
                You can then count the votes from the Results tab.
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleUpdate} disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Election Status"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}