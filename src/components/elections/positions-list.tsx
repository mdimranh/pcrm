// src/components/elections/positions-list.tsx
"use client";

import { Election, Candidate } from "@/types/election";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getFullName, getCandidateStatusBadge } from "@/lib/election-utils";
import { Trophy, Users } from "lucide-react";

interface PositionsListProps {
  election: Election;
}

export function PositionsList({ election }: PositionsListProps) {
  if (election.positions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No positions available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {election.positions.map((position) => (
        <Card key={position.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{position.name}</CardTitle>
                {position.description && (
                  <CardDescription className="mt-2">
                    {position.description}
                  </CardDescription>
                )}
              </div>
              <Badge variant="secondary">
                <Users className="mr-1 h-3 w-3" />
                {position.candidates?.filter((c) => c.status === "APPROVED").length || 0} candidates
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {position.candidates && position.candidates.length > 0 ? (
              <div className="space-y-3">
                {position.candidates
                  .filter((c) => c.status === "APPROVED")
                  .sort((a, b) => b.voteCount - a.voteCount)
                  .map((candidate, index) => (
                    <CandidateItem
                      key={candidate.id}
                      candidate={candidate}
                      rank={index + 1}
                      showVotes={election.isCounted}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No approved candidates yet
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface CandidateItemProps {
  candidate: Candidate;
  rank: number;
  showVotes: boolean;
}

function CandidateItem({ candidate, rank, showVotes }: CandidateItemProps) {
  const fullName = getFullName(candidate.user);
  const initials = `${candidate.user.firstName[0]}${candidate.user.lastName[0]}`;

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
      {showVotes && rank <= 3 && (
        <div className="flex items-center justify-center w-8 h-8">
          {rank === 1 && <Trophy className="h-6 w-6 text-yellow-500" />}
          {rank === 2 && <Trophy className="h-5 w-5 text-gray-400" />}
          {rank === 3 && <Trophy className="h-5 w-5 text-amber-600" />}
        </div>
      )}
      
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{fullName}</p>
        {candidate.statement && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {candidate.statement}
          </p>
        )}
      </div>

      {showVotes && (
        <div className="text-right">
          <p className="font-semibold text-lg">{candidate.voteCount}</p>
          <p className="text-xs text-muted-foreground">votes</p>
        </div>
      )}
    </div>
  );
}