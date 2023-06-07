import { VolunteerOpportunity } from "./volunteer-opportunity.model";

export interface OpportunityInvitation {
  id: number;
  status: string;
  invitationMessage: string;
  responseMessage?: string;
  opportunityId: number;
  opportunity?: VolunteerOpportunity,
  candidateId: number;
  candidateHasResponded: boolean;
}
