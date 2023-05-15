import { UserDocumentType } from "./document-type.model";

export interface AccessCredential {
  email: string;
  password: string;
  documentType: UserDocumentType
}
