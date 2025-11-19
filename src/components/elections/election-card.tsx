// src/components/elections/election-card.tsx
"use client";

import { Election } from "@/types/election";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Vote } from "lucide-react";
import Link from "next/link";
import { formatDate, getElectionStatusBadge } from "@/lib/election-utils";

interface ElectionCardProps {
  election: Election;
}

export function ElectionCard({ election }: ElectionCardProps) {
  const statusBadge = getElectionStatusBadge(election.status);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2">
            {election.title}
          </h3>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>
        {election.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {election.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Appeal: {formatDate(election.appealEndDate)}</span>
        </div>

        {election.voteStartDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Vote className="mr-2 h-4 w-4" />
            <span>Voting: {formatDate(election.voteStartDate)}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{election.positions.length} positions</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/elections/${election.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}