import { Address } from "./address.model";

export interface Institution {
  id: number;
  email: string;
  name: string;
  telephone: string;
  bio: string;
  address: Address;
  cnpj: string;
}
