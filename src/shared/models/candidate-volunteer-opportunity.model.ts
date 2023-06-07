import { Candidate } from "./candidate.model";
import {VolunteerOpportunity} from "./volunteer-opportunity.model";

export interface VolunteerOpportunityRegistration {
  id: number;
  status: string;
  candidate: Candidate;
  opportunity: VolunteerOpportunity;
  institutionEmittedCertificate: boolean;
}
