import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, ClipboardList, BookOpen, FileSignature, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentCard } from './DocumentCard';
import { DocumentSignatureModal } from './DocumentSignatureModal';
import { StudentDocumentPreviewModal } from './StudentDocumentPreviewModal';
import { StudentAssignedDocuments } from './StudentAssignedDocuments';
import { StudentNeedsAnalysisModal } from './StudentNeedsAnalysisModal';
import { personalizeDocumentContent, getTemplateForType } from '@/utils/personalizeDocumentContent';
import { useMyDocuments, useSignDocument } from '@/hooks/useApi';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

interface PhaseDocument {
  id: string;
  assignmentId?: number; // Lien avec l'API
  name: string;
  formationId: string;
  type: 'analyse_besoin' | 'test_positionnement' | 'convention';
  date: string;
  size: string;
  status: 'available' | 'signed' | 'completed';
  requiresSignature?: boolean;
  htmlContent?: string;
  learnerSignature?: string;
  signedAt?: string;
  url?: string; // URL directe du fichier
}

interface StudentPhaseInscriptionProps {
  selectedFormation: string;
  formations: Formation[];
}

export const StudentPhaseInscription = ({ selectedFormation, formations }: StudentPhaseInscriptionProps) => {
  const { toast } = useToast();

  // Hooks API
  const { data: assignments, isLoading: isLoadingDocs, refetch: refetchDocs } = useMyDocuments();
  const signDocumentMutation = useSignDocument();

  const [localDocuments, setLocalDocuments] = useState<PhaseDocument[]>([]);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PhaseDocument | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{ title: string; content: string } | null>(null);

  // States for interactive Needs Analysis
  const [needsAnalysisOpen, setNeedsAnalysisOpen] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<PhaseDocument | null>(null);

  useEffect(() => {
    console.log('StudentPhaseInscription: Recieved assignments', assignments);
    if (assignments) {
      const mappedDocs: PhaseDocument[] = (assignments as any[])
        .filter(a => !a.phase || a.phase === 'inscription' || a.phase === 'phase-inscription')
        .map(a => {
          // Détection du type basé sur le nom du fichier (heuristique)
          let type: 'analyse_besoin' | 'test_positionnement' | 'convention' = 'convention';
          const lowerName = a.media_asset.filename.toLowerCase();
          if (lowerName.includes('analyse') || lowerName.includes('besoin')) type = 'analyse_besoin';
          else if (lowerName.includes('test') || lowerName.includes('positionnement')) type = 'test_positionnement';

          return {
            id: `api-${a.id}`,
            assignmentId: a.id,
            name: a.media_asset.filename,
            formationId: formations.length > 0 ? formations[0].id : '', // Fallback, devrait être lié à la formation réelle
            type: type,
            date: new Date(a.assigned_at).toISOString(),
            size: `${Math.round(a.media_asset.size / 1024)} KB`,
            status: a.is_signed ? 'signed' : 'available',
            requiresSignature: !a.is_signed, // On suppose que tout doc dans cette phase nécessite signature si non signé
            url: a.media_asset.url,
            learnerSignature: a.signature_data,
            signedAt: a.signed_at
          };
        });

      setLocalDocuments(mappedDocs);
    }
  }, [assignments, formations]);

  const documentTypes = {
    analyse_besoin: {
      label: 'Analyse du besoin',
      icon: ClipboardList,
      description: 'Évaluation de vos besoins de formation',
      color: 'text-blue-500'
    },
    test_positionnement: {
      label: 'Test de positionnement',
      icon: BookOpen,
      description: 'Évaluation de vos compétences initiales',
      color: 'text-emerald-500'
    },
    convention: {
      label: 'Convention de formation',
      icon: FileSignature,
      description: 'Accord contractuel de formation',
      color: 'text-violet-500'
    }
  };

  const filteredDocuments = localDocuments.filter(doc =>
    selectedFormation === 'all' || doc.formationId === selectedFormation || true // Hack pour afficher tout si formationId manquant
  );

  const pendingSignatures = filteredDocuments.filter(doc => doc.requiresSignature && doc.status === 'available');
  const signedCount = filteredDocuments.filter(doc => doc.status === 'signed' || doc.status === 'completed').length;

  const handleSign = (doc: PhaseDocument) => {
    if (doc.type === 'analyse_besoin') {
      setActiveAnalysis(doc);
      setNeedsAnalysisOpen(true);
    } else {
      setSelectedDocument(doc);
      setSignatureModalOpen(true);
    }
  };

  const handleSignatureComplete = (documentId: string, signatureData: string) => {
    // Note: DocumentSignatureModal calls this function. 
    // We initiate the mutation and return the promise so the modal waits.

    if (selectedDocument && selectedDocument.assignmentId) {
      return new Promise<void>((resolve, reject) => {
        signDocumentMutation.mutate({
          assignment_id: selectedDocument.assignmentId!,
          signature_data: signatureData
        }, {
          onSuccess: () => {
            refetchDocs(); // Rafraîchir les données API
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
    } else {
      // Fallback local pour démo sans API
      setLocalDocuments(prev => prev.map(doc =>
        doc.id === documentId
          ? {
            ...doc,
            status: 'signed' as const,
            requiresSignature: false,
            learnerSignature: signatureData,
            signedAt: new Date().toISOString()
          }
          : doc
      ));
      setSignatureModalOpen(false);
      setSelectedDocument(null);
      return Promise.resolve();
    }
  };

  const handleDownload = (doc: PhaseDocument) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else {
      toast({
        title: "Téléchargement",
        description: `Téléchargement de ${doc.name} en cours...`,
      });
    }
  };

  const handlePreview = (doc: PhaseDocument) => {
    if (doc.type === 'analyse_besoin') {
      setActiveAnalysis(doc);
      setNeedsAnalysisOpen(true);
      return;
    }

    if (doc.url) {
      window.open(doc.url, '_blank');
      return;
    }

    const formation = formations.find(f => f.id === doc.formationId);
    const template = getTemplateForType(doc.type);

    if (template && formation) {
      const personalizedContent = personalizeDocumentContent(template, formation, doc.learnerSignature);
      setPreviewDocument({
        title: documentTypes[doc.type].label,
        content: personalizedContent
      });
      setPreviewModalOpen(true);
      return;
    }

    toast({
      title: "Aperçu",
      description: `Ouverture de ${doc.name}...`,
    });
  };

  const getFormationName = (formationId: string) => {
    const formation = formations.find(f => f.id === formationId);
    return formation ? `${formation.name} - ${formation.level}` : 'Formation';
  };

  const groupedByFormation = formations.reduce((acc, formation) => {
    const formationDocs = filteredDocuments.filter(doc => doc.formationId === formation.id);
    if (formationDocs.length > 0) {
      acc[formation.id] = { formation, documents: formationDocs };
    }
    return acc;
  }, {} as Record<string, { formation: Formation; documents: PhaseDocument[] }>);

  // Si chargement
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
          <div className="p-2 bg-blue-100 rounded-xl">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Phase : Inscription</h2>
            <p className="text-muted-foreground">Analyse du besoin, test de positionnement et convention</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {pendingSignatures.length > 0 && (
            <Badge variant="destructive" className="gap-1.5 py-1.5 px-3">
              <AlertCircle className="h-4 w-4" />
              {pendingSignatures.length} document(s) à signer
            </Badge>
          )}
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 bg-background">
            <CheckCircle className="h-4 w-4 text-green-500" />
            {signedCount}/{filteredDocuments.length} complétés
          </Badge>
        </div>
      </div>

      {/* Types de documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {pending > 0 && (
                          <Badge variant="destructive" className="text-xs">{pending}</Badge>
                        )}
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
            <CardTitle>Documents de la phase inscription</CardTitle>
            <CardDescription>
              {filteredDocuments.length} document(s) assignés
            </CardDescription>
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

      {/* Additional Assigned Documents (fallback pour autres documents non classifiés) */}
      <div className="pt-8 border-t">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">Historique complet des documents</h3>
        </div>
        <StudentAssignedDocuments targetPhase="inscription" />
      </div>

      {/* Signature Modal */}
      <DocumentSignatureModal
        isOpen={signatureModalOpen}
        onClose={() => {
          setSignatureModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument ? {
          id: selectedDocument.id,
          name: selectedDocument.name,
          type: selectedDocument.type,
          typeLabel: documentTypes[selectedDocument.type].label,
          formationName: getFormationName(selectedDocument.formationId),
          date: selectedDocument.date,
          size: selectedDocument.size
        } : null}
        //@ts-ignore - DocumentSignatureModal attend une Promise, ce qu'on retourne
        onSignatureComplete={handleSignatureComplete}
        htmlContent={selectedDocument ? (() => {
          // Si on a une URL, on ne peut pas afficher le contenu HTML directement,
          // mais DocumentSignatureModal gère peut-être l'affichage d'iframe/PDF si type='convention'?
          // Pour l'instant on garde la logique de template fictif si pas d'URL,
          // ou si c'est un PDF, on espère que la modale gère (elle semble gérer signature pad + preview).
          const formation = formations.find(f => f.id === selectedDocument.formationId);
          const template = getTemplateForType(selectedDocument.type);
          return template && formation ? personalizeDocumentContent(template, formation, selectedDocument.learnerSignature) : undefined;
        })() : undefined}
      />

      {/* Preview Modal for CGV and other HTML documents */}
      <StudentDocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setPreviewDocument(null);
        }}
        title={previewDocument?.title || ''}
        htmlContent={previewDocument?.content || ''}
        onDownload={() => {
          toast({
            title: "Téléchargement",
            description: "Document téléchargé avec succès",
          });
        }}
      />

      {/* Interactive Needs Analysis Modal */}
      {activeAnalysis && (
        <StudentNeedsAnalysisModal
          isOpen={needsAnalysisOpen}
          onClose={() => {
            setNeedsAnalysisOpen(false);
            setActiveAnalysis(null);
          }}
          assignmentId={activeAnalysis.assignmentId!}
          title={documentTypes[activeAnalysis.type].label}
          url={activeAnalysis.url}
          onSuccess={() => {
            refetchDocs();
          }}
        />
      )}
    </div>
  );
};
