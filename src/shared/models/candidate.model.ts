import {OpportunityCause} from "./opportunity-cause.model";
import {Qualification} from "./qualification.model";
import {Address} from "./address.model";

export interface Candidate {
  id: number;
  email: string;
  name: string;
  telephone: string;
  bio: string;
  photo: string;
  linkedIn: string;
  address: Address;
  cpf: string;
  birthDate: string;
  qualifications: Qualification[];
  causesCandidateIsInterestedIn: OpportunityCause[];
}
