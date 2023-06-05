export interface Issue {
  id: number;
  status: string;
  opportunityId: number;
  title: string;
  description: string;
  resolutionNotes: string;
  reportedUserId: number;
  reporterId: number;
  creationDate: string;
}
