import { DOCUMENT_TYPE } from '../entities/legal-document.model';

// src/legal/dto/create-legal-document.dto.ts
export class CreateLegalDocumentDto {
  type: DOCUMENT_TYPE;
  title: string;
  content: string;
}

export class AcceptLegalDocumentDto {
  user_id: number;
  document_id: number;
  accepted: boolean;
}

export type LegalDocumentCreationAttributes = {
  type: DOCUMENT_TYPE;
  title: string;
  content: string;
  is_active?: boolean;
};
