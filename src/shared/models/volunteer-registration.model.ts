import { VolunteerOpportunity } from "./volunteer-opportunity.model";

export interface VolunteerRegistration {
  id: number;
  status: string;
  opportunity: VolunteerOpportunity
}
