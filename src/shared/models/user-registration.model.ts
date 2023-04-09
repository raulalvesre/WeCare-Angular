import { Address } from "./address.model";
import { UserDocumentType } from "./document-type.model";

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
  telephone: number;
  document: string;
  documentType: UserDocumentType,
  birthDate: Date;
  bio: string;
  address: Address
}
