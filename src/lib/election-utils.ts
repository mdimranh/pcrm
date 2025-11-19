// src/lib/election-utils.ts
import { ElectionStatus } from "@/types/election";

export function getElectionStatusBadge(status: ElectionStatus) {
  const badges = {
    APPEAL_PERIOD: { label: "Appeal Open", variant: "default" as const },
    APPEAL_CLOSED: { label: "Appeal Closed", variant: "secondary" as const },
    APPROVAL_PERIOD: { label: "Under Review", variant: "secondary" as const },
    VOTING_PERIOD: { label: "Voting Active", variant: "default" as const },
    VOTING_CLOSED: { label: "Voting Closed", variant: "secondary" as const },
    COMPLETED: { label: "Completed", variant: "outline" as const },
    CANCELLED: { label: "Cancelled", variant: "destructive" as const },
  };
  return badges[status];
}

export function getCandidateStatusBadge(status: string) {
  const badges = {
    PENDING: { label: "Pending", variant: "secondary" as const },
    APPROVED: { label: "Approved", variant: "default" as const },
    REJECTED: { label: "Rejected", variant: "destructive" as const },
    WITHDRAWN: { label: "Withdrawn", variant: "outline" as const },
  };
  return badges[status] || badges.PENDING;
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isAppealPeriodActive(election: {
  appealStartDate: string;
  appealEndDate: string;
  status: ElectionStatus;
}) {
  const now = new Date();
  const start = new Date(election.appealStartDate);
  const end = new Date(election.appealEndDate);
  return now >= start && now <= end && election.status === "APPEAL_PERIOD";
}

export function isVotingPeriodActive(election: {
  voteStartDate?: string;
  voteEndDate?: string;
  status: ElectionStatus;
}) {
  if (!election.voteStartDate || !election.voteEndDate) return false;
  const now = new Date();
  const start = new Date(election.voteStartDate);
  const end = new Date(election.voteEndDate);
  return now >= start && now <= end && election.status === "VOTING_PERIOD";
}

export function getFullName(user: {
  firstName: string;
  middleName?: string;
  lastName: string;
}) {
  return [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ");
}