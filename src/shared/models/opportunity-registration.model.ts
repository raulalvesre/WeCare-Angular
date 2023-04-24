import { Address } from "./address.model";
import { OpportunityCause } from "./opportunity-cause.model";

export interface OpportunityRegistration {
  name: string,
  description: string,
  opportunityDate: Date,
  photo: File,
  address: Address,
  opportunityCauses: OpportunityCause[]
}
