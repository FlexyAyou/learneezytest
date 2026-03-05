/**
 * Types TypeScript pour le module Documents (alignés sur l'OpenAPI backend)
 * Source: https://api.plateforme-test-infinitiax.com/openapi.json
 */

// ============= ENUMS =============

export type DocumentTemplatePhase = 'inscription' | 'formation' | 'post-formation' | 'suivi';

export type DocumentTemplateType =
  | 'analyse_besoin'
  | 'test_positionnement'
  | 'convention'
  | 'programme'
  | 'reglement_interieur'
  | 'cgv'
  | 'convocation'
  | 'emargement'
  | 'test_niveau'
  | 'satisfaction_chaud'
  | 'attestation'
  | 'certificat'
  | 'satisfaction_froid'
  | 'questionnaire_financeur'
  | 'attestation_honneur'
  | 'test_sortie';

export type DocumentStatusEnum =
  | 'template'
  | 'draft'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'signed'
  | 'completed'
  | 'expired';

// ============= DOCUMENT TEMPLATES =============

export interface DocumentTemplateCreate {
  type: DocumentTemplateType;
  phase: DocumentTemplatePhase;
  title: string;
  description?: string;
  html_content: string;
  requires_signature?: boolean;
  is_active?: boolean;
}

export interface DocumentTemplateResponse {
  id: number;
  of_id: number | null;
  type: DocumentTemplateType;
  phase: DocumentTemplatePhase;
  title: string;
  description?: string | null;
  html_content: string;
  requires_signature: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplateUpdate {
  title?: string | null;
  description?: string | null;
  html_content?: string | null;
  requires_signature?: boolean | null;
  is_active?: boolean | null;
}

// ============= DOCUMENT SEND =============

/** Send 1 template → N learners (aligned with backend DocumentSendRequest) */
export interface DocumentSendRequest {
  template_id: number;
  learner_ids: number[];
  formation_id?: string | null;
  formation_name?: string | null;
  custom_data?: Record<string, any> | null;
}

/** Send N templates → 1 learner (bulk) — aligned with backend DocumentBulkSendRequest */
export interface DocumentBulkSendRequest {
  learner_id: number;
  template_ids: number[];
  phase: DocumentTemplatePhase;
  formation_id?: string | null;
  formation_name?: string | null;
  date_debut?: string | null;
  date_fin?: string | null;
  duree?: string | null;
  date_signature?: string | null;
  lieu?: string | null;
  prix?: string | null;
  custom_fields?: Record<string, any> | null;
  uploaded_document_ids?: number[] | null;
  include_of_signature?: boolean;
}

// ============= DOCUMENT RESPONSE =============

export interface DocumentResponse {
  id: number;
  template_id?: number | null;
  of_id: number;
  type: DocumentTemplateType;
  phase: DocumentTemplatePhase;
  title: string;
  html_content: string;
  learner_id: number;
  learner_name: string;
  learner_email: string;
  formation_id?: string | null;
  formation_name?: string | null;
  status: DocumentStatusEnum;
  requires_signature: boolean;
  sent_at?: string | null;
  read_at?: string | null;
  signed_at?: string | null;
  signature_data?: string | null;
  unique_code: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentUpdateStatus {
  status: DocumentStatusEnum;
}

// ============= DOCUMENT SIGN (Learner) — aligned with backend DocumentSignRequest =============

export interface DocumentSignRequest {
  signature_data: string;
  honor_declaration: boolean;
}

// ============= OF SIGNATURE =============

export interface OfSignatureResponse {
  id: number;
  of_id: number;
  signature_data: string;
  created_at: string;
  updated_at: string;
}

export interface OfSignatureUpdate {
  signature_data: string;
}

// ============= UPLOADED DOCUMENTS (PDF) =============

export interface UploadedDocumentResponse {
  id: number;
  of_id: number;
  title: string;
  phase: DocumentTemplatePhase;
  file_key: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface UploadedDocumentSendRequest {
  learner_ids: number[];
  signature_fields?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
    type: 'signature' | 'name' | 'date';
    label?: string;
  }>;
}

// ============= EMARGEMENTS =============

export interface EmargementDocumentResponse {
  id: number;
  document_id: number;
  document_title: string;
  document_type: string;
  status: string;
  signed_at?: string | null;
  signature_data?: string | null;
  signature_metadata?: Record<string, any> | null;
}

export interface EmargementLearnerResponse {
  learner_id: number;
  learner_name: string;
  learner_email: string;
  total_documents: number;
  signed_documents: number;
  documents: EmargementDocumentResponse[];
}

export interface EmargementListResponse {
  of_id: number;
  total_learners: number;
  total_documents: number;
  total_signed: number;
  learners: EmargementLearnerResponse[];
}

// ============= FILTERS =============

export interface DocumentFilters {
  status?: DocumentStatusEnum;
  phase?: DocumentTemplatePhase;
  type?: DocumentTemplateType;
  learner_id?: number;
  formation_id?: string;
  search?: string;
  page?: number;
  per_page?: number;
}
