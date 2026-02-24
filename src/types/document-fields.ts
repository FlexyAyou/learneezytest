import { DocumentPhase } from '@/components/admin/documents/types';

export type SignatureFieldType = 'signature' | 'date' | 'name' | 'initials' | 'text' | 'mention' | 'checkbox';

export interface SignatureField {
  id: string;
  type: SignatureFieldType;
  page: number;
  x: number;       // % of page width
  y: number;       // % of page height
  width: number;   // % of page width
  height: number;  // % of page height
  required: boolean;
  label?: string;
  value?: string;  // pre-filled for mention/text
}

export interface PreparedDocument {
  fileKey: string;
  fileName: string;
  fields: SignatureField[];
  signatories: string[];
  phase: DocumentPhase;
}

export const FIELD_CONFIG: Record<SignatureFieldType, { label: string; icon: string; color: string; defaultWidth: number; defaultHeight: number }> = {
  signature:  { label: 'Signature',          icon: '✍️', color: '#ec4899', defaultWidth: 25, defaultHeight: 8 },
  date:       { label: 'Date de signature',  icon: '📅', color: '#3b82f6', defaultWidth: 20, defaultHeight: 4 },
  name:       { label: 'Nom du signataire',  icon: '👤', color: '#8b5cf6', defaultWidth: 20, defaultHeight: 4 },
  initials:   { label: 'Paraphes',           icon: '🔤', color: '#f59e0b', defaultWidth: 8,  defaultHeight: 5 },
  text:       { label: 'Saisie de texte',    icon: '📝', color: '#10b981', defaultWidth: 25, defaultHeight: 4 },
  mention:    { label: 'Mention',            icon: '📌', color: '#6366f1', defaultWidth: 30, defaultHeight: 4 },
  checkbox:   { label: 'Case à cocher',      icon: '☑️', color: '#64748b', defaultWidth: 4,  defaultHeight: 4 },
};
