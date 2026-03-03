/**
 * Types TypeScript pour le module Documents (alignés sur l'OpenAPI backend)
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
  of_id: number;
  type: DocumentTemplateType;
  phase: DocumentTemplatePhase;
  title: string;
  description?: string;
  html_content: string;
  requires_signature: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplateUpdate {
  title?: string;
  description?: string;
  html_content?: string;
  requires_signature?: boolean;
  is_active?: boolean;
  type?: DocumentTemplateType;
  phase?: DocumentTemplatePhase;
}

// ============= DOCUMENT SEND =============

/** Send 1 template → N learners */
export interface DocumentSendRequest {
  template_id: number;
  learner_ids: number[];
  html_content?: string; // Contenu personnalisé (variables déjà remplacées)
  custom_fields?: Record<string, string>;
}

/** Send N templates → 1 learner (bulk) */
export interface DocumentBulkSendRequest {
  learner_id: number;
  template_ids: number[];
  html_contents?: Record<number, string>; // template_id → html personnalisé
  custom_fields?: Record<string, string>;
}

// ============= DOCUMENT RESPONSE =============

export interface DocumentResponse {
  id: number;
  template_id?: number;
  of_id: number;
  learner_id: number;
  learner_name?: string;
  learner_email?: string;
  formation_id?: string;
  formation_name?: string;
  type: DocumentTemplateType;
  phase: DocumentTemplatePhase;
  title: string;
  html_content?: string;
  status: DocumentStatusEnum;
  requires_signature: boolean;
  unique_code?: string;
  sent_at?: string;
  read_at?: string;
  signed_at?: string;
  signature_data?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentUpdateStatus {
  status: DocumentStatusEnum;
}

// ============= DOCUMENT SIGN (Learner) =============

export interface DocumentSignRequest {
  signature_data: string; // Base64 de la signature
  signature_metadata?: {
    ip_address?: string;
    user_agent?: string;
    timestamp?: string;
    session_fingerprint?: string;
    honor_declaration?: boolean;
  };
}

// ============= OF SIGNATURE =============

export interface OfSignatureResponse {
  id: number;
  of_id: number;
  signature_data: string; // Base64 de la signature
  created_at: string;
  updated_at: string;
}

export interface OfSignatureUpdate {
  signature_data: string; // Base64 de la signature
}

// ============= UPLOADED DOCUMENTS (PDF) =============

export interface UploadedDocumentResponse {
  id: number;
  of_id: number;
  title: string;
  file_key: string;
  file_name: string;
  file_size?: number;
  phase?: DocumentTemplatePhase;
  signature_fields?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
    type: 'signature' | 'name' | 'date';
    label?: string;
  }>;
  created_at: string;
  updated_at?: string;
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
  document_type: DocumentTemplateType;
  status: DocumentStatusEnum;
  signed_at?: string;
  signature_data?: string;
  signature_metadata?: Record<string, any>;
}

export interface EmargementLearnerResponse {
  learner_id: number;
  learner_name: string;
  learner_email: string;
  documents: EmargementDocumentResponse[];
  total_documents: number;
  signed_documents: number;
}

export interface EmargementListResponse {
  of_id: number;
  learners: EmargementLearnerResponse[];
  total_learners: number;
  total_documents: number;
  total_signed: number;
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
