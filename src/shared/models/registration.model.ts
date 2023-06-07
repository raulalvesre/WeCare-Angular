import {VolunteerOpportunity} from "./volunteer-opportunity.model";
import {Candidate} from "./candidate.model";

export interface Registration {
  id: number;
  status: string;
  feedbackMessage: string;
  candidate: Candidate;
  opportunity: VolunteerOpportunity;
}
