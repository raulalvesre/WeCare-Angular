import { Address } from "./address.model";
import { Institution } from "./institution.model";

export interface VolunteerOpportunity {
  id: number;
  institutionId: number;
  institution?: Institution;
  name: string;
  description: string;
  opportunityDate: Date | string;
  photo: string;
  address: Address;
  creationDate: Date;
  causes: string[];
  desirableQualifications: string[];
  isCandidateRegistered: boolean;

  collapseDescription: boolean;
}
