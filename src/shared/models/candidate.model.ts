import { Address } from "./address.model";
import { OpportunityCause } from "./opportunity-cause.model";
import { Qualification } from "./qualification.model";

export interface Candidate {
  id: number;
  email: string;
  name: string;
  telephone: string;
  bio: string;
  address: Address;
  cpf: string;
  birthDate: string;
  qualificationsIds?: Qualification[] | number[];
  interestedInCausesIds?: OpportunityCause[] | number[];
}
