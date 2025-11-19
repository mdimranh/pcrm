// src/types/election.ts
export type ElectionStatus = 
  | "APPEAL_PERIOD"
  | "APPEAL_CLOSED"
  | "APPROVAL_PERIOD"
  | "VOTING_PERIOD"
  | "VOTING_CLOSED"
  | "COMPLETED"
  | "CANCELLED";

export type CandidateStatus = "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";

export interface Election {
  id: string;
  title: string;
  description?: string;
  organizationId: string;
  appealStartDate: string;
  appealEndDate: string;
  voteStartDate?: string;
  voteEndDate?: string;
  status: ElectionStatus;
  isCounted: boolean;
  countedAt?: string;
  positions: ElectionPosition[];
  createdAt: string;
  updatedAt: string;
}

export interface ElectionPosition {
  id: string;
  electionId: string;
  name: string;
  description?: string;
  maxCandidates?: number;
  displayOrder: number;
  candidates: Candidate[];
  _count?: {
    candidates: number;
    votes: number;
  };
}

export interface Candidate {
  id: string;
  positionId: string;
  userId: string;
  statement?: string;
  status: CandidateStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  voteCount: number;
  user: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  position?: {
    id: string;
    name: string;
  };
}

export interface Vote {
  id: string;
  electionId: string;
  positionId: string;
  candidateId: string;
  voterId: string;
  position: {
    id: string;
    name: string;
  };
  createdAt: string;
}