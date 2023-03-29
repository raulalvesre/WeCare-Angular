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
  address: UserAddress
}

export interface UserAddress {
  street: string,
  number: number;
  complement: string;
  city: string;
  neighborhood: string;
  state: string;
  postalCode: string;
}
