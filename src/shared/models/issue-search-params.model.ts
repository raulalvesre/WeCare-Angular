export interface IssueSearchParams {
  status?: PublicIssueStatus;
  reporterId?: number;
  reportedUserId?: number;
  description?: string;
  resolutionNotes?: string;
  periodStart?: Date;
  periodEnd?: Date;
}

type PublicIssueStatus = "OPEN" | "CLOSED" | "RESOLVED";
