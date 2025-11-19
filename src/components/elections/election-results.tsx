// src/components/elections/election-results.tsx
"use client";

import { useState } from "react";
import { Election } from "@/types/election";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, BarChart3, Trophy, Calculator } from "lucide-react";
import { toast } from "sonner";
import { getFullName } from "@/lib/election-utils";

interface ElectionResultsProps {
  election: Election;
  onUpdate: () => void;
}

export function ElectionResults({ election, onUpdate }: ElectionResultsProps) {
  const [loading, setLoading] = useState(false);

  async function handleCountVotes() {
    try {
      setLoading(true);

      const response = await fetch(`/api/elections/${election.id}/count`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to count votes");
      }

      toast.success("Votes counted successfully");
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (election.status !== "VOTING_CLOSED" && election.status !== "COMPLETED") {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Results will be available after the voting period closes.
        </AlertDescription>
      </Alert>
    );
  }

  if (!election.isCounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Count Votes</CardTitle>
          <CardDescription>
            The voting period has closed. Click below to count all votes and publish results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCountVotes} disabled={loading} size="lg" className="w-full">
            {loading ? (
              "Counting Votes..."
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Count Votes & Publish Results
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <BarChart3 className="h-4 w-4" />
        <AlertDescription>
          Election results have been counted and published on{" "}
          {election.countedAt && new Date(election.countedAt).toLocaleString()}
        </AlertDescription>
      </Alert>

      {election.positions.map((position) => {
        const approvedCandidates = position.candidates
          .filter((c) => c.status === "APPROVED")
          .sort((a, b) => b.voteCount - a.voteCount);

        const totalVotes = approvedCandidates.reduce((sum, c) => sum + c.voteCount, 0);

        if (approvedCandidates.length === 0) return null;

        return (
          <Card key={position.id}>
            <CardHeader>
              <CardTitle>{position.name}</CardTitle>
              <CardDescription>
                Total votes cast: {totalVotes}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedCandidates.map((candidate, index) => {
                  const fullName = getFullName(candidate.user);
                  const initials = `${candidate.user.firstName[0]}${candidate.user.lastName[0]}`;
                  const percentage = totalVotes > 0
                    ? ((candidate.voteCount / totalVotes) * 100).toFixed(1)
                    : 0;

                  return (
                    <div key={candidate.id} className="space-y-2">
                      <div className="flex items-center gap-4">
                        {index < 3 && (
                          <div className="flex-shrink-0 w-8">
                            {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                            {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                            {index === 2 && <Trophy className="h-5 w-5 text-amber-600" />}
                          </div>
                        )}

                        <Avatar>
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{fullName}</p>
                              {index === 0 && (
                                <Badge variant="default" className="mt-1">
                                  Winner
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">{candidate.voteCount}</p>
                              <p className="text-sm text-muted-foreground">{percentage}%</p>
                            </div>
                          </div>
                          <Progress value={Number(percentage)} className="h-2" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}