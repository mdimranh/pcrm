// src/components/elections/candidates-management.tsx
"use client";

import { useState, useEffect } from "react";
import { Election, Candidate } from "@/types/election";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { isAppealPeriodActive, getCandidateStatusBadge } from "@/lib/election-utils";

interface CandidatesManagementProps {
  election: Election;
  onUpdate: () => void;
}

export function CandidatesManagement({ election, onUpdate }: CandidatesManagementProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [statement, setStatement] = useState("");
  const [loading, setLoading] = useState(false);
  const [myCandidacies, setMyCandidacies] = useState<Candidate[]>([]);

  const appealActive = isAppealPeriodActive(election);

  useEffect(() => {
    fetchMyCandidacies();
  }, [election.id]);

  async function fetchMyCandidacies() {
    try {
      // Fetch user's applications for this election
      const response = await fetch(`/api/elections/${election.id}/my-applications`);
      if (response.ok) {
        const data = await response.json();
        setMyCandidacies(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching candidacies:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedPosition) {
      toast.error("Please select a position");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/elections/${election.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positionId: selectedPosition,
          statement,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit application");
      }

      toast.success("Application submitted successfully");
      setSelectedPosition("");
      setStatement("");
      fetchMyCandidacies();
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {!appealActive ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The appeal period for this election is not currently active. Applications can only be submitted during the appeal period.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit Application</CardTitle>
            <CardDescription>
              Apply for a position in this election
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {election.positions.map((position) => {
                      const alreadyApplied = myCandidacies.some(
                        (c) => c.positionId === position.id
                      );
                      return (
                        <SelectItem
                          key={position.id}
                          value={position.id}
                          disabled={alreadyApplied}
                        >
                          {position.name}
                          {alreadyApplied && " (Applied)"}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statement">Statement (Optional)</Label>
                <Textarea
                  id="statement"
                  placeholder="Share your vision and why you're running for this position..."
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  rows={5}
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {statement.length}/2000 characters
                </p>
              </div>

              <Button type="submit" disabled={loading || !selectedPosition}>
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {myCandidacies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
            <CardDescription>
              Track the status of your candidacy applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myCandidacies.map((candidacy) => {
                const statusBadge = getCandidateStatusBadge(candidacy.status);
                return (
                  <div
                    key={candidacy.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{candidacy.position?.name}</p>
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                      {candidacy.statement && (
                        <p className="text-sm text-muted-foreground">
                          {candidacy.statement}
                        </p>
                      )}
                      {candidacy.status === "REJECTED" && candidacy.rejectionReason && (
                        <p className="text-sm text-destructive mt-2">
                          Reason: {candidacy.rejectionReason}
                        </p>
                      )}
                    </div>
                    {candidacy.status === "APPROVED" && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}