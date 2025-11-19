// src/components/elections/voting-panel.tsx
"use client";

import { useState, useEffect } from "react";
import { Election, Vote } from "@/types/election";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle2, Vote as VoteIcon } from "lucide-react";
import { toast } from "sonner";
import { isVotingPeriodActive, getFullName } from "@/lib/election-utils";

interface VotingPanelProps {
  election: Election;
}

export function VotingPanel({ election }: VotingPanelProps) {
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVotes, setMyVotes] = useState<Vote[]>([]);
  const [checkingVotes, setCheckingVotes] = useState(true);

  const votingActive = isVotingPeriodActive(election);

  useEffect(() => {
    checkIfVoted();
  }, [election.id]);

  async function checkIfVoted() {
    try {
      setCheckingVotes(true);
      const response = await fetch(`/api/elections/${election.id}/vote`);
      if (response.ok) {
        const data = await response.json();
        setHasVoted(data.hasVoted);
        setMyVotes(data.data || []);
      }
    } catch (error) {
      console.error("Error checking votes:", error);
    } finally {
      setCheckingVotes(false);
    }
  }

  function handleVoteChange(positionId: string, candidateId: string) {
    setVotes((prev) => ({
      ...prev,
      [positionId]: candidateId,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const voteArray = Object.entries(votes).map(([positionId, candidateId]) => ({
      positionId,
      candidateId,
    }));

    if (voteArray.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/elections/${election.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: voteArray }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit votes");
      }

      toast.success("Votes submitted successfully");
      setHasVoted(true);
      checkIfVoted();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (checkingVotes) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasVoted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle>You Have Already Voted</CardTitle>
          </div>
          <CardDescription>
            Thank you for participating in this election
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myVotes.map((vote) => (
              <div
                key={vote.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium">{vote.position.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Vote recorded successfully
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!votingActive) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Voting is not currently active for this election. Please check back during the voting period.
        </AlertDescription>
      </Alert>
    );
  }

  const approvedPositions = election.positions.filter(
    (p) => p.candidates.some((c) => c.status === "APPROVED")
  );

  if (approvedPositions.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No approved candidates are available for voting yet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>
        <VoteIcon className="h-4 w-4" />
        <AlertDescription>
          Select one candidate for each position. You can only vote once.
        </AlertDescription>
      </Alert>

      {approvedPositions.map((position) => {
        const approvedCandidates = position.candidates.filter(
          (c) => c.status === "APPROVED"
        );

        return (
          <Card key={position.id}>
            <CardHeader>
              <CardTitle>{position.name}</CardTitle>
              {position.description && (
                <CardDescription>{position.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={votes[position.id] || ""}
                onValueChange={(value) => handleVoteChange(position.id, value)}
              >
                <div className="space-y-3">
                  {approvedCandidates.map((candidate) => {
                    const fullName = getFullName(candidate.user);
                    const initials = `${candidate.user.firstName[0]}${candidate.user.lastName[0]}`;

                    return (
                      <div
                        key={candidate.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      >
                        <RadioGroupItem
                          value={candidate.id}
                          id={candidate.id}
                        />
                        <Label
                          htmlFor={candidate.id}
                          className="flex items-center gap-4 flex-1 cursor-pointer"
                        >
                          <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{fullName}</p>
                            {candidate.statement && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {candidate.statement}
                              </p>
                            )}
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={loading || Object.keys(votes).length === 0}
        >
          {loading ? (
            "Submitting Votes..."
          ) : (
            <>
              <VoteIcon className="mr-2 h-4 w-4" />
              Submit Votes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}