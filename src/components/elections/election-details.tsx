// src/components/elections/election-details.tsx
"use client";

import { useEffect, useState } from "react";
import { Election } from "@/types/election";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar, Users, Vote } from "lucide-react";
import {
  formatDateTime,
  getElectionStatusBadge,
  isAppealPeriodActive,
  isVotingPeriodActive,
} from "@/lib/election-utils";
import { PositionsList } from "./positions-list";
import { CandidatesManagement } from "./candidates-management";
import { VotingPanel } from "./voting-panel";
import { ElectionAdmin } from "./election-admin";

interface ElectionDetailsProps {
  electionId: string;
}

export function ElectionDetails({ electionId }: ElectionDetailsProps) {
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchElection();
  }, [electionId]);

  async function fetchElection() {
    try {
      const response = await fetch(`/api/elections/${electionId}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error("Election not found");
        throw new Error("Failed to fetch election");
      }
      const data = await response.json();
      setElection((data as { data: Election }).data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-48 bg-muted rounded-lg" />
      <div className="h-96 bg-muted rounded-lg" />
    </div>;
  }

  if (error || !election) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error || "Election not found"}</AlertDescription>
      </Alert>
    );
  }

  const statusBadge = getElectionStatusBadge(election.status);
  const appealActive = isAppealPeriodActive(election);
  const votingActive = isVotingPeriodActive(election);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{election.title}</CardTitle>
              {election.description && (
                <CardDescription className="mt-2 text-base">
                  {election.description}
                </CardDescription>
              )}
            </div>
            <Badge variant={statusBadge.variant} className="text-sm">
              {statusBadge.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Appeal Period</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(election.appealStartDate)}
                </p>
                <p className="text-sm text-muted-foreground">
                  to {formatDateTime(election.appealEndDate)}
                </p>
                {appealActive && (
                  <Badge variant="default" className="mt-2">
                    Active Now
                  </Badge>
                )}
              </div>
            </div>

            {election.voteStartDate && election.voteEndDate && (
              <div className="flex items-start gap-3">
                <Vote className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Voting Period</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(election.voteStartDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    to {formatDateTime(election.voteEndDate)}
                  </p>
                  {votingActive && (
                    <Badge variant="default" className="mt-2">
                      Vote Now
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Positions</p>
                <p className="text-sm text-muted-foreground">
                  {election.positions.length} positions available
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="apply">Apply</TabsTrigger>
          <TabsTrigger value="vote">Vote</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="mt-6">
          <PositionsList election={election} />
        </TabsContent>

        <TabsContent value="apply" className="mt-6">
          <CandidatesManagement election={election} onUpdate={fetchElection} />
        </TabsContent>

        <TabsContent value="vote" className="mt-6">
          <VotingPanel election={election} />
        </TabsContent>

        <TabsContent value="admin" className="mt-6">
          <ElectionAdmin election={election} onUpdate={fetchElection} />
        </TabsContent>
      </Tabs>
    </div>
  );
}