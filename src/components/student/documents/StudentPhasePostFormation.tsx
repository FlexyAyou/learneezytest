
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, FileText, BookOpen, Calendar, ClipboardCheck, CheckCircle, AlertCircle, Loader2, FileCheck, MessageSquare, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentCard } from './DocumentCard';
import { DocumentSignatureModal } from './DocumentSignatureModal';
import { StudentDocumentPreviewModal } from './StudentDocumentPreviewModal';
import { StudentAssignedDocuments } from './StudentAssignedDocuments';
import { personalizeDocumentContent, getTemplateForType } from '@/utils/personalizeDocumentContent';
import { useMyDocuments, useSignDocument, useSignDocumentFields } from '@/hooks/useApi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { fastAPIClient } from '@/services/fastapi-client';
import { DocumentSignerViewer } from './DocumentSignerViewer';
import { StudentInteractiveDocumentModal } from './StudentInteractiveDocumentModal';
import { IdentityVerificationModal, IdentityProof } from './IdentityVerificationModal';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

interface PhaseDocument {
  id: string;
  assignmentId?: number;
  name: string;
  formationId: string;
  type: 'test_sortie' | 'satisfaction_chaud' | 'certificat' | 'emargement';
  date: string;
  size: string;
  status: 'available' | 'completed' | 'received';
  requiresSignature?: boolean;
  htmlContent?: string;
  learnerSignature?: string;
  signedAt?: string;
  url?: string;
  signatureFields?: any[];
  signedFieldValues?: Record<string, string>;
}

interface StudentPhasePostFormationProps {
  selectedFormation: string;
  formations: Formation[];
}

export const StudentPhasePostFormation = ({ selectedFormation, formations }: StudentPhasePostFormationProps) => {
  const { toast } = useToast();
  const { user: currentUser } = useFastAPIAuth();

  const { data: assignments, isLoading: isLoadingDocs, refetch: refetchDocs } = useMyDocuments();
  const signDocumentMutation = useSignDocument();
  const signFieldsMutation = useSignDocumentFields();

  const [localDocuments, setLocalDocuments] = useState<PhaseDocument[]>([]);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PhaseDocument | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{ title: string; content: string } | null>(null);
  const [interactiveViewerOpen, setInteractiveViewerOpen] = useState(false);
  const [interactiveViewerReadOnly, setInteractiveViewerReadOnly] = useState(false);
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [identityProof, setIdentityProof] = useState<IdentityProof | null>(null);
  const [pendingSignDoc, setPendingSignDoc] = useState<PhaseDocument | null>(null);

  // States for interactive documents
  const [interactiveModalOpen, setInteractiveModalOpen] = useState(false);
  const [activeInteractiveDoc, setActiveInteractiveDoc] = useState<PhaseDocument | null>(null);

  useEffect(() => {
    if (assignments) {
      const mappedDocs: PhaseDocument[] = (assignments as any[])
        .filter(a => a.phase === 'post-formation' || a.phase === 'phase-post-formation')
        .map(a => {
          if (a._isNewSystem) {
            return {
              id: a._docId,
              assignmentId: undefined,
              name: a.media_asset.filename,
              formationId: formations.length > 0 ? formations[0].id : '',
              type: a._type || (
                (a.media_asset.filename || '').toLowerCase().includes('test') || (a.media_asset.filename || '').toLowerCase().includes('sortie') ? 'test_sortie' :
                  (a.media_asset.filename || '').toLowerCase().includes('satisfaction') || (a.media_asset.filename || '').toLowerCase().includes('chaud') ? 'satisfaction_chaud' :
                    (a.media_asset.filename || '').toLowerCase().includes('emargement') || (a.media_asset.filename || '').toLowerCase().includes('émargement') || (a.media_asset.filename || '').toLowerCase().includes('réalisation') ? 'emargement' : 'certificat'
              ),
              date: new Date(a.assigned_at).toISOString(),
              size: `${Math.round(a.media_asset.size / 1024)} KB`,
              status: a.is_signed ? 'completed' : 'available',
              requiresSignature: a._requiresSignature && !a.is_signed,
              htmlContent: a._htmlContent,
              learnerSignature: a.signature_data,
              signedAt: a.signed_at,
              url: undefined,
              _isNewSystem: true,
              _uniqueCode: a._uniqueCode
            } as PhaseDocument;
          }

          const lowerName = (a.media_asset?.filename || '').toLowerCase();
          let legacyType: PhaseDocument['type'] = 'certificat';
          if (lowerName.includes('test') || lowerName.includes('sortie')) legacyType = 'test_sortie';
          else if (lowerName.includes('satisfaction') || lowerName.includes('chaud')) legacyType = 'satisfaction_chaud';
          else if (lowerName.includes('emargement') || lowerName.includes('émargement')) legacyType = 'emargement';

          return {
            id: `api-${a.id}`,
            assignmentId: a.id,
            name: a.media_asset?.filename || 'Document',
            formationId: formations.length > 0 ? formations[0].id : '',
            type: legacyType,
            date: new Date(a.assigned_at).toISOString(),
            size: a.media_asset ? `${Math.round(a.media_asset.size / 1024)} KB` : '0 KB',
            status: a.is_signed ? 'completed' : 'available',
            requiresSignature: !a.is_signed && !!a.signature_fields?.length,
            url: a.media_asset?.url,
            learnerSignature: a.signature_data,
            signedAt: a.signed_at,
            signatureFields: a.signature_fields,
            signedFieldValues: a.signed_field_values,
          } as PhaseDocument;
        });

      setLocalDocuments(mappedDocs);
    }
  }, [assignments, formations]);

  const documentTypes = {
    test_sortie: { label: 'Test de sortie', icon: FileCheck, description: 'Évaluation des acquis en fin de formation', color: 'text-blue-500' },
    satisfaction_chaud: { label: 'Questionnaire satisfaction à chaud', icon: MessageSquare, description: 'Évaluation immédiate de la formation', color: 'text-emerald-500' },
    certificat: { label: 'Certificat de réalisation', icon: CheckCircle, description: 'Certification de réalisation de la formation', color: 'text-violet-500' },
    emargement: { label: 'Attestation de réalisation (émargements)', icon: CheckSquare, description: 'Feuille de présence attestant la réalisation', color: 'text-orange-500' }
  };

  const filteredDocuments = localDocuments.filter(doc =>
    selectedFormation === 'all' || doc.formationId === selectedFormation || true
  );

  const pendingSignatures = filteredDocuments.filter(doc => doc.requiresSignature && doc.status === 'available');
  const completedCount = filteredDocuments.filter(doc => doc.status === 'completed' || doc.status === 'received').length;

  const handleSign = (doc: PhaseDocument) => {
    setPendingSignDoc(doc);
    setIdentityModalOpen(true);
  };

  const handleIdentityVerified = (proof: IdentityProof) => {
    setIdentityProof(proof);
    const doc = pendingSignDoc;
    if (!doc) return;

    if (doc.type === 'test_sortie' || doc.type === 'satisfaction_chaud' || doc.type === 'emargement') {
      setActiveInteractiveDoc(doc);
      setInteractiveModalOpen(true);
    } else if (doc.signatureFields && doc.signatureFields.length > 0) {
      setSelectedDocument(doc);
      setInteractiveViewerReadOnly(false);
      setInteractiveViewerOpen(true);
    } else {
      setSelectedDocument(doc);
      setSignatureModalOpen(true);
    }
  };

  const handleSignatureComplete = (documentId: string, signatureData: string) => {
    if (selectedDocument && selectedDocument.assignmentId) {
      return new Promise<void>((resolve, reject) => {
        signDocumentMutation.mutate({
          assignment_id: selectedDocument.assignmentId!,
          signature_data: signatureData,
          signature_metadata: identityProof || undefined,
        }, {
          onSuccess: () => {
            refetchDocs();
            setSignatureModalOpen(false);
            setSelectedDocument(null);
            resolve();
          },
          onError: (error) => {
            console.error("Erreur signature:", error);
            reject(error);
          }
        });
      });
    }
    return Promise.resolve();
  };

  const handleInteractiveSignatureComplete = async (fieldValues: Record<string, string>) => {
    if (!selectedDocument || !selectedDocument.assignmentId) return;
    try {
      await signFieldsMutation.mutateAsync({
        assignment_id: selectedDocument.assignmentId,
        field_values: fieldValues,
        signature_metadata: identityProof || undefined,
      });
      refetchDocs();
      setInteractiveViewerOpen(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Erreur signature interactive:", error);
      throw error;
    }
  };

  const handleDownload = async (doc: PhaseDocument) => {
    if ((doc.status === 'completed' || doc.status === 'received') && doc.signatureFields && doc.signatureFields.length > 0 && doc.assignmentId) {
      try {
        await fastAPIClient.downloadSignedPdf(doc.assignmentId);
        return;
      } catch (error) {
        console.error("Erreur téléchargement PDF signé:", error);
        toast({ title: "Erreur", description: "Impossible de générer le PDF signé.", variant: "destructive" });
      }
    }
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else {
      toast({ title: "Téléchargement", description: `Téléchargement de ${doc.name} en cours...` });
    }
  };

  const handlePreview = (doc: PhaseDocument) => {
    if (doc.type === 'test_sortie' || doc.type === 'satisfaction_chaud' || doc.type === 'emargement') {
      setActiveInteractiveDoc(doc);
      setInteractiveModalOpen(true);
      return;
    }
    if (doc.htmlContent) {
      setPreviewDocument({ title: documentTypes[doc.type]?.label || doc.name, content: doc.htmlContent });
      setPreviewModalOpen(true);
      return;
    }
    if ((doc.status === 'completed' || doc.status === 'received') && doc.signatureFields && doc.signatureFields.length > 0) {
      setSelectedDocument(doc);
      setInteractiveViewerReadOnly(true);
      setInteractiveViewerOpen(true);
      return;
    }
    if (doc.url) {
      window.open(doc.url, '_blank');
      return;
    }
    const formation = formations.find(f => f.id === doc.formationId);
    const template = getTemplateForType(doc.type);
    if (template && formation) {
      const personalizedContent = personalizeDocumentContent(template, formation, undefined, undefined, doc.learnerSignature);
      setPreviewDocument({ title: documentTypes[doc.type].label, content: personalizedContent });
      setPreviewModalOpen(true);
      return;
    }
    toast({ title: "Aperçu", description: `Ouverture de ${doc.name}...` });
  };

  const getFormationName = (formationId: string) => {
    const formation = formations.find(f => f.id === formationId);
    return formation ? `${formation.name} - ${formation.level}` : 'Formation';
  };

  if (isLoadingDocs) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Award className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Phase : Post-formation</h2>
            <p className="text-muted-foreground">Test de sortie, satisfaction à chaud, certificat et émargements</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {pendingSignatures.length > 0 && (
            <Badge variant="destructive" className="gap-1.5 py-1.5 px-3">
              <AlertCircle className="h-4 w-4" />
              {pendingSignatures.length} document(s) à compléter
            </Badge>
          )}
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 bg-background">
            <CheckCircle className="h-4 w-4 text-green-500" />
            {completedCount}/{filteredDocuments.length} complétés
          </Badge>
        </div>
      </div>

      {/* Types de documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(documentTypes).map(([type, info]) => {
          const Icon = info.icon;
          const count = filteredDocuments.filter(doc => doc.type === type).length;
          const pending = filteredDocuments.filter(doc => doc.type === type && doc.status === 'available' && doc.requiresSignature).length;
          return (
            <Card key={type} className="border-l-4 border-l-primary/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Icon className={`h-5 w-5 ${info.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{info.label}</p>
                      <div className="flex items-center gap-2">
                        {pending > 0 && <Badge variant="destructive" className="text-xs">{pending}</Badge>}
                        <Badge variant="outline" className="text-xs">{count}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Documents list */}
      {filteredDocuments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Documents de la phase post-formation</CardTitle>
            <CardDescription>{filteredDocuments.length} document(s) assignés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredDocuments.map((doc) => {
              const typeInfo = documentTypes[doc.type];
              return (
                <DocumentCard
                  key={doc.id}
                  id={doc.id}
                  name={doc.name}
                  type={doc.type}
                  typeLabel={typeInfo.label}
                  typeIcon={typeInfo.icon}
                  typeColor={typeInfo.color}
                  date={doc.date}
                  size={doc.size}
                  status={doc.status}
                  requiresSignature={doc.requiresSignature}
                  onSign={() => handleSign(doc)}
                  onDownload={() => handleDownload(doc)}
                  onPreview={() => handlePreview(doc)}
                />
              );
            })}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-12 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">Aucun document assigné pour cette phase.</p>
        </div>
      )}


      {/* Identity Verification Modal */}
      <IdentityVerificationModal
        isOpen={identityModalOpen}
        onClose={() => { setIdentityModalOpen(false); setPendingSignDoc(null); }}
        onVerified={handleIdentityVerified}
      />

      {/* Signature Modal */}
      <DocumentSignatureModal
        isOpen={signatureModalOpen}
        onClose={() => { setSignatureModalOpen(false); setSelectedDocument(null); }}
        document={selectedDocument ? {
          id: selectedDocument.id,
          name: selectedDocument.name,
          type: selectedDocument.type,
          typeLabel: documentTypes[selectedDocument.type].label,
          formationName: getFormationName(selectedDocument.formationId),
          date: selectedDocument.date,
          size: selectedDocument.size
        } : null}
        //@ts-ignore
        onSignatureComplete={handleSignatureComplete}
        htmlContent={selectedDocument ? (() => {
          const formation = formations.find(f => f.id === selectedDocument.formationId);
          const template = getTemplateForType(selectedDocument.type);
          return template && formation ? personalizeDocumentContent(template, formation, undefined, undefined, selectedDocument.learnerSignature) : undefined;
        })() : undefined}
      />

      {/* Preview Modal */}
      <StudentDocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => { setPreviewModalOpen(false); setPreviewDocument(null); }}
        title={previewDocument?.title || ''}
        htmlContent={previewDocument?.content || ''}
        onDownload={() => { toast({ title: "Téléchargement", description: "Document téléchargé avec succès" }); }}
      />

      {/* Interactive Document Modal (Tests, Satisfaction, etc.) */}
      {activeInteractiveDoc && (
        <StudentInteractiveDocumentModal
          isOpen={interactiveModalOpen}
          onClose={() => {
            setInteractiveModalOpen(false);
            setActiveInteractiveDoc(null);
          }}
          assignmentId={activeInteractiveDoc.assignmentId || activeInteractiveDoc.id}
          title={documentTypes[activeInteractiveDoc.type].label}
          url={activeInteractiveDoc.url}
          docType={activeInteractiveDoc.type}
          learnerData={currentUser ? {
            firstName: currentUser.first_name || '',
            lastName: currentUser.last_name || ''
          } : undefined}
          formationData={formations.find(f => f.id === activeInteractiveDoc.formationId) || (formations.length > 0 ? formations[0] : undefined)}
          initialHtmlContent={activeInteractiveDoc.htmlContent}
          onSuccess={() => {
            refetchDocs();
          }}
        />
      )}

      {/* Interactive Signer Viewer */}
      {selectedDocument && interactiveViewerOpen && (
        <DocumentSignerViewer
          isOpen={interactiveViewerOpen}
          onClose={() => { setInteractiveViewerOpen(false); setSelectedDocument(null); }}
          pdfUrl={selectedDocument.url || ''}
          fields={selectedDocument.signatureFields || []}
          documentName={selectedDocument.name}
          learnerName={currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : undefined}
          readOnly={interactiveViewerReadOnly}
          initialFieldValues={selectedDocument.signedFieldValues}
          onComplete={handleInteractiveSignatureComplete}
        />
      )}
    </div>
  );
};
