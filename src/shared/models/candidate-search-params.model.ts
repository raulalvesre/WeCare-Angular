import {State} from "./state.model";

export interface CandidateSearchParams {
  id?: number;
  email?: string;
  name?: string;
  city?: string;
  state?: State;
  qualificationIds?: number[];
  pageNumber: number,
  pageSize: number
}
