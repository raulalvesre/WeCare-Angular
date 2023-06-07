import {Registration} from "./registration.model";

export interface ParticipationCertificate {
  id: number;
  registration: Registration;
  authenticityCode: string;
  displayedQualifications: string[];
  creationDate: string;

}
