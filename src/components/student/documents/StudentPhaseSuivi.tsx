
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, BarChart3, AlertCircle, CheckCircle, Loader2, MessageSquare, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentCard } from './DocumentCard';
import { DocumentSignatureModal } from './DocumentSignatureModal';
import { StudentDocumentPreviewModal } from './StudentDocumentPreviewModal';
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
  type: 'satisfaction_froid';
  date: string;
  size: string;
  status: 'available' | 'completed' | 'pending';
  requiresSignature?: boolean;
  htmlContent?: string;
  learnerSignature?: string;
  signedAt?: string;
  url?: string;
  signatureFields?: any[];
  signedFieldValues?: Record<string, string>;
}

interface StudentPhaseSuiviProps {
  selectedFormation: string;
  formations: Formation[];
}

export const StudentPhaseSuivi = ({ selectedFormation, formations }: StudentPhaseSuiviProps) => {
  const { toast } = useToast();
  const { user: currentUser } = useFastAPIAuth();

  const { data: assignments, isLoading: isLoadingDocs, refetch: refetchDocs } = useMyDocuments();
  const signDocumentMutation = useSignDocument();
  const signFieldsMutation = useSignDocumentFields();

  const [localDocuments, setLocalDocuments] = useState<PhaseDocument[]>([]);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PhaseDocument | null>(null);
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
        .filter(a => a.phase === 'suivi' || a.phase === 'phase-suivi')
        .map(a => {
          if (a._isNewSystem) {
            return {
              id: a._docId,
              assignmentId: undefined,
              name: a.media_asset?.filename || 'Document',
              formationId: formations.length > 0 ? formations[0].id : '',
              type: a._type || 'satisfaction_froid',
              date: new Date(a.assigned_at).toISOString(),
              size: a.media_asset ? `${Math.round(a.media_asset.size / 1024)} KB` : '0 KB',
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

          return {
            id: `api-${a.id}`,
            assignmentId: a.id,
            name: a.media_asset?.filename || 'Document',
            formationId: formations.length > 0 ? formations[0].id : '',
            type: 'satisfaction_froid' as const,
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
    satisfaction_froid: {
      label: 'Questionnaire à froid',
      icon: MessageSquare,
      description: 'Évaluation 3 mois après la formation',
      color: 'text-blue-500'
    }
  };

  const filteredDocuments = localDocuments.filter(doc =>
    selectedFormation === 'all' || doc.formationId === selectedFormation || true
  );

  const pendingSignatures = filteredDocuments.filter(doc => doc.requiresSignature && doc.status === 'available');
  const completedCount = filteredDocuments.filter(doc => doc.status === 'completed').length;

  const handleSign = (doc: PhaseDocument) => {
    setPendingSignDoc(doc);
    setIdentityModalOpen(true);
  };

  const handleIdentityVerified = (proof: IdentityProof) => {
    setIdentityProof(proof);
    const doc = pendingSignDoc;
    if (!doc) return;

    if (doc.type === 'satisfaction_froid') {
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
    if (doc.status === 'completed' && doc.signatureFields && doc.signatureFields.length > 0 && doc.assignmentId) {
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
    if (doc.status === 'pending') {
      toast({ title: "Document non disponible", description: "Ce questionnaire ne sera disponible que 3 mois après la fin de votre formation.", variant: "destructive" });
      return;
    }
    if (doc.type === 'satisfaction_froid') {
      setActiveInteractiveDoc(doc);
      setInteractiveModalOpen(true);
      return;
    }
    if (doc.status === 'completed' && doc.signatureFields && doc.signatureFields.length > 0) {
      setSelectedDocument(doc);
      setInteractiveViewerReadOnly(true);
      setInteractiveViewerOpen(true);
      return;
    }
    if (doc.url) {
      window.open(doc.url, '_blank');
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
          <div className="p-2 bg-violet-100 rounded-xl">
            <Clock className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Phase : +3 mois</h2>
            <p className="text-muted-foreground">Questionnaire à froid</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {pendingSignatures.length > 0 && (
            <Badge variant="destructive" className="gap-1.5 py-1.5 px-3">
              <AlertCircle className="h-4 w-4" />
              {pendingSignatures.length} à remplir
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

      {/* Info notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Information :</strong> Le questionnaire de satisfaction à froid est envoyé automatiquement 3 mois après la fin de votre formation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents list */}
      {filteredDocuments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Documents de la phase +3 mois</CardTitle>
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
      />

      {/* Interactive Document Modal (Questionnaire Suivi) */}
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
