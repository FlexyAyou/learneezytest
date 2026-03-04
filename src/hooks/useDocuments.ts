/**
 * React Query hooks pour le module Documents
 * Couvre: templates, envoi, gestion, signature, émargements, documents uploadés
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fastAPIClient } from '@/services/fastapi-client';
import { toast } from '@/hooks/use-toast';

/** Extract a safe, human-readable error message from an Axios error */
function safeErrorMessage(error: any, fallback: string): string {
  const detail = error?.response?.data?.detail;
  if (typeof detail === 'string') {
    // Reject if it looks like HTML (template content leaked into error)
    if (detail.length > 300 || detail.startsWith('<')) return fallback;
    return detail;
  }
  if (detail && typeof detail === 'object') {
    // FastAPI validation: detail might be an array of { msg }
    if (Array.isArray(detail)) {
      const msgs = detail.map((d: any) => d.msg || d.message || JSON.stringify(d)).join(', ');
      return msgs.length > 300 ? fallback : msgs;
    }
    if (detail.message && typeof detail.message === 'string') return detail.message;
    if (detail.msg && typeof detail.msg === 'string') return detail.msg;
  }
  if (error?.message && typeof error.message === 'string' && error.message.length < 200) {
    return error.message;
  }
  return fallback;
}
import type {
  DocumentTemplateCreate,
  DocumentTemplateResponse,
  DocumentTemplateUpdate,
  DocumentSendRequest,
  DocumentBulkSendRequest,
  DocumentResponse,
  DocumentSignRequest,
  DocumentFilters,
  OfSignatureResponse,
  OfSignatureUpdate,
  UploadedDocumentResponse,
  UploadedDocumentSendRequest,
  EmargementListResponse,
} from '@/types/document-types';

// ============= DOCUMENT TEMPLATES =============

export const useDocumentTemplates = (ofId: number | string | undefined) => {
  return useQuery<DocumentTemplateResponse[]>({
    queryKey: ['document-templates', ofId],
    queryFn: () => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.listDocumentTemplates(ofId);
    },
    enabled: !!ofId,
  });
};

export const useDocumentTemplate = (ofId: number | string | undefined, templateId: number | string | undefined) => {
  return useQuery<DocumentTemplateResponse>({
    queryKey: ['document-template', ofId, templateId],
    queryFn: () => {
      if (!ofId || !templateId) throw new Error('OF ID and Template ID required');
      return fastAPIClient.getDocumentTemplate(ofId, templateId);
    },
    enabled: !!ofId && !!templateId,
  });
};

export const useCreateDocumentTemplate = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DocumentTemplateCreate) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.createDocumentTemplate(ofId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates', ofId] });
      toast({ title: 'Modèle créé', description: 'Le modèle de document a été créé avec succès.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: safeErrorMessage(error, 'Impossible de créer le modèle.'),
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateDocumentTemplate = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: number | string; data: DocumentTemplateUpdate }) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.updateDocumentTemplate(ofId, templateId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document-templates', ofId] });
      queryClient.invalidateQueries({ queryKey: ['document-template', ofId, variables.templateId] });
      toast({ title: 'Modèle mis à jour', description: 'Les modifications ont été enregistrées.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: safeErrorMessage(error, 'Impossible de mettre à jour le modèle.'),
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteDocumentTemplate = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: number | string) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.deleteDocumentTemplate(ofId, templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates', ofId] });
      toast({ title: 'Modèle supprimé', description: 'Le modèle a été supprimé.', variant: 'destructive' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: safeErrorMessage(error, 'Impossible de supprimer le modèle.'),
        variant: 'destructive',
      });
    },
  });
};

// ============= DOCUMENT SEND =============

export const useSendDocument = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DocumentSendRequest) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.sendDocument(ofId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', ofId] });
      queryClient.invalidateQueries({ queryKey: ['emargements', ofId] });
      toast({ title: 'Documents envoyés', description: 'Les documents ont été envoyés avec succès.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur d\'envoi',
        description: safeErrorMessage(error, 'Impossible d\'envoyer les documents.'),
        variant: 'destructive',
      });
    },
  });
};

export const useSendDocumentsBulk = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DocumentBulkSendRequest) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.sendDocumentsBulk(ofId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', ofId] });
      queryClient.invalidateQueries({ queryKey: ['emargements', ofId] });
      toast({ title: 'Documents envoyés', description: 'Les documents ont été envoyés en lot avec succès.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur d\'envoi',
        description: safeErrorMessage(error, 'Impossible d\'envoyer les documents.'),
        variant: 'destructive',
      });
    },
  });
};

// ============= DOCUMENT MANAGEMENT =============

export const useDocuments = (ofId: number | string | undefined, filters?: DocumentFilters) => {
  return useQuery<DocumentResponse[]>({
    queryKey: ['documents', ofId, filters],
    queryFn: () => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.listDocuments(ofId, filters);
    },
    enabled: !!ofId,
  });
};

export const useDocument = (ofId: number | string | undefined, documentId: number | string | undefined) => {
  return useQuery<DocumentResponse>({
    queryKey: ['document', ofId, documentId],
    queryFn: () => {
      if (!ofId || !documentId) throw new Error('IDs required');
      return fastAPIClient.getDocument(ofId, documentId);
    },
    enabled: !!ofId && !!documentId,
  });
};

export const useUpdateDocumentStatus = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, status }: { documentId: number | string; status: string }) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.updateDocumentStatus(ofId, documentId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', ofId] });
      toast({ title: 'Statut mis à jour' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: safeErrorMessage(error, 'Impossible de mettre à jour le statut.'),
        variant: 'destructive',
      });
    },
  });
};

// ============= LEARNER DOCUMENTS =============

export const useLearnerDocuments = (learnerId: number | string | undefined) => {
  return useQuery<DocumentResponse[]>({
    queryKey: ['learner-documents', learnerId],
    queryFn: () => {
      if (!learnerId) throw new Error('Learner ID is required');
      return fastAPIClient.getLearnerDocuments(learnerId);
    },
    enabled: !!learnerId,
  });
};

export const useSignDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ learnerId, documentId, data }: {
      learnerId: number | string;
      documentId: number | string;
      data: DocumentSignRequest;
    }) => {
      return fastAPIClient.signDocument(learnerId, documentId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['learner-documents', variables.learnerId] });
      toast({ title: 'Document signé', description: 'Votre signature a été enregistrée avec succès.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur de signature',
        description: safeErrorMessage(error, 'Impossible de signer le document.'),
        variant: 'destructive',
      });
    },
  });
};

// ============= OF SIGNATURE =============

export const useOFSignature = (ofId: number | string | undefined) => {
  return useQuery<OfSignatureResponse>({
    queryKey: ['of-signature', ofId],
    queryFn: () => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.getOFSignature(ofId);
    },
    enabled: !!ofId,
    retry: false, // 404 si pas encore configurée
  });
};

export const useUpsertOFSignature = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OfSignatureUpdate) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.upsertOFSignature(ofId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['of-signature', ofId] });
      toast({ title: 'Signature enregistrée', description: 'La signature officielle a été mise à jour.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: safeErrorMessage(error, 'Impossible de sauvegarder la signature.'),
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteOFSignature = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.deleteOFSignature(ofId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['of-signature', ofId] });
      toast({ title: 'Signature supprimée', variant: 'destructive' });
    },
  });
};

// ============= UPLOADED DOCUMENTS =============

export const useUploadedDocuments = (ofId: number | string | undefined) => {
  return useQuery<UploadedDocumentResponse[]>({
    queryKey: ['uploaded-documents', ofId],
    queryFn: () => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.listUploadedDocuments(ofId);
    },
    enabled: !!ofId,
  });
};

export const useUploadDocument = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.uploadDocument(ofId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-documents', ofId] });
      toast({ title: 'Document uploadé', description: 'Le document a été ajouté avec succès.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur d\'upload',
        description: safeErrorMessage(error, 'Impossible d\'uploader le document.'),
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteUploadedDocument = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: number | string) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.deleteUploadedDocument(ofId, documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-documents', ofId] });
      toast({ title: 'Document supprimé', variant: 'destructive' });
    },
  });
};

export const useSendUploadedDocument = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, data }: { documentId: number | string; data: UploadedDocumentSendRequest }) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.sendUploadedDocument(ofId, documentId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-documents', ofId] });
      queryClient.invalidateQueries({ queryKey: ['emargements', ofId] });
      toast({ title: 'Document envoyé', description: 'Le document a été envoyé aux apprenants sélectionnés.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur d\'envoi',
        description: safeErrorMessage(error, 'Impossible d\'envoyer le document.'),
        variant: 'destructive',
      });
    },
  });
};

// ============= EMARGEMENTS =============

export const useEmargements = (ofId: number | string | undefined) => {
  return useQuery<EmargementListResponse>({
    queryKey: ['emargements', ofId],
    queryFn: () => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.getEmargements(ofId);
    },
    enabled: !!ofId,
  });
};
