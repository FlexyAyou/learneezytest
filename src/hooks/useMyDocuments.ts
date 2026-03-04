/**
 * Hook pour récupérer les documents de l'apprenant connecté
 * Mappe les DocumentResponse du backend vers le format attendu par les composants de phase
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fastAPIClient } from '@/services/fastapi-client';
import { useFastAPIAuth } from './useFastAPIAuth';
import type { DocumentResponse, DocumentTemplatePhase, DocumentTemplateType } from '@/types/document-types';

export interface MappedPhaseDocument {
  id: string;
  name: string;
  formationId: string;
  formationName: string;
  type: DocumentTemplateType;
  date: string;
  size: string;
  status: 'available' | 'signed' | 'completed' | 'received' | 'pending';
  requiresSignature: boolean;
  htmlContent?: string;
  learnerSignature?: string;
  signedAt?: string;
}

export interface MappedFormation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

/** Map backend status → UI status */
function mapStatus(doc: DocumentResponse): MappedPhaseDocument['status'] {
  switch (doc.status) {
    case 'signed':
    case 'completed':
      return doc.status;
    case 'sent':
    case 'delivered':
      return doc.requires_signature ? 'available' : 'received';
    case 'read':
      return doc.requires_signature ? 'available' : 'received';
    case 'draft':
    case 'template':
      return 'pending';
    case 'expired':
      return 'pending';
    default:
      return 'pending';
  }
}

/** Map backend phase → phases used in sidebar tabs */
export function mapPhaseToTab(phase: DocumentTemplatePhase): string {
  switch (phase) {
    case 'inscription': return 'phase-inscription';
    case 'formation': return 'phase-formation';
    case 'post-formation': return 'phase-post-formation';
    case 'suivi': return 'phase-suivi';
    default: return 'phase-inscription';
  }
}

function mapDocument(doc: DocumentResponse): MappedPhaseDocument {
  return {
    id: String(doc.id),
    name: doc.title || `Document_${doc.id}`,
    formationId: doc.formation_id || 'unknown',
    formationName: doc.formation_name || 'Formation',
    type: doc.type,
    date: doc.sent_at || doc.created_at || new Date().toISOString(),
    size: '—',
    status: mapStatus(doc),
    requiresSignature: doc.requires_signature && doc.status !== 'signed' && doc.status !== 'completed',
    htmlContent: doc.html_content || undefined,
    learnerSignature: doc.signature_data || undefined,
    signedAt: doc.signed_at || undefined,
  };
}

export const useMyDocuments = () => {
  const { user } = useFastAPIAuth();
  const learnerId = user?.id;

  const query = useQuery<DocumentResponse[]>({
    queryKey: ['my-documents', learnerId],
    queryFn: async () => {
      if (!learnerId) throw new Error('Not authenticated');
      return fastAPIClient.getLearnerDocuments(learnerId);
    },
    enabled: !!learnerId,
  });

  // Map raw documents
  const allDocuments: MappedPhaseDocument[] = (query.data || []).map(mapDocument);

  // Extract unique formations from documents
  const formations: MappedFormation[] = Object.values(
    allDocuments.reduce((acc, doc) => {
      if (!acc[doc.formationId]) {
        acc[doc.formationId] = {
          id: doc.formationId,
          name: doc.formationName,
          category: '',
          level: '',
          status: 'active' as const,
        };
      }
      return acc;
    }, {} as Record<string, MappedFormation>)
  );

  // Group by phase
  const rawByPhase = (query.data || []).reduce((acc, doc) => {
    const tab = mapPhaseToTab(doc.phase);
    if (!acc[tab]) acc[tab] = [];
    acc[tab].push(mapDocument(doc));
    return acc;
  }, {} as Record<string, MappedPhaseDocument[]>);

  // Phase progress for sidebar
  const phaseProgress = {
    'phase-inscription': computePhaseProgress(rawByPhase['phase-inscription'] || []),
    'phase-formation': computePhaseProgress(rawByPhase['phase-formation'] || []),
    'phase-post-formation': computePhaseProgress(rawByPhase['phase-post-formation'] || []),
    'phase-suivi': computePhaseProgress(rawByPhase['phase-suivi'] || []),
  };

  return {
    documents: allDocuments,
    documentsByPhase: rawByPhase,
    formations,
    phaseProgress,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    learnerId,
  };
};

function computePhaseProgress(docs: MappedPhaseDocument[]) {
  const total = docs.length;
  const signed = docs.filter(d => d.status === 'signed' || d.status === 'completed').length;
  const pending = docs.filter(d => d.requiresSignature).length;
  return { total, signed, pending };
}
