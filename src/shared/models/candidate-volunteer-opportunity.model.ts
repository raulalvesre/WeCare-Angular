import { Candidate } from "./candidate.model";

export interface VolunteerOpportunityRegistration {
  id: number;
  status: string;
  candidate: Candidate
}
