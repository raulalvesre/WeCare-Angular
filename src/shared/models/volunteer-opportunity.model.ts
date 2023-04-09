import { Address } from "./address.model";
import { Institution } from "./institution.model";

export interface VolunteerOpportunity {
  id: number;
  institutionId: number;
  institution?: Institution;
  name: string;
  description: string;
  opportunityDate: Date;
  photo: string;
  address: Address;
  creationDate: Date;
  causes: string[];
}
