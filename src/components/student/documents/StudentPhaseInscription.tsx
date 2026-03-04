
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, ClipboardList, BookOpen, FileSignature, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentCard } from './DocumentCard';
import { DocumentSignatureModal } from './DocumentSignatureModal';
import { StudentDocumentPreviewModal } from './StudentDocumentPreviewModal';
import { useSignDocument } from '@/hooks/useDocuments';
import type { MappedPhaseDocument, MappedFormation } from '@/hooks/useMyDocuments';
import { useQueryClient } from '@tanstack/react-query';

interface StudentPhaseInscriptionProps {
  selectedFormation: string;
  formations: MappedFormation[];
  documents: MappedPhaseDocument[];
  learnerId?: number;
}

export const StudentPhaseInscription = ({ selectedFormation, formations, documents: apiDocuments, learnerId }: StudentPhaseInscriptionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const signDocumentMutation = useSignDocument();

  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<MappedPhaseDocument | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{ title: string; content: string } | null>(null);

  const documentTypes: Record<string, { label: string; icon: React.ElementType; description: string; color: string }> = {
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

  const filteredDocuments = apiDocuments.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const pendingSignatures = filteredDocuments.filter(doc => doc.requiresSignature && doc.status === 'available');
  const signedCount = filteredDocuments.filter(doc => doc.status === 'signed' || doc.status === 'completed').length;

  const handleSign = (doc: MappedPhaseDocument) => {
    setSelectedDocument(doc);
    setSignatureModalOpen(true);
  };

  const handleSignatureComplete = async (documentId: string, signatureData: string) => {
    if (!learnerId) return;
    
    try {
      await signDocumentMutation.mutateAsync({
        learnerId,
        documentId,
        data: {
          signature_data: signatureData,
          signature_metadata: {
            ip_address: 'auto',
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            honor_declaration: true,
          },
        },
      });
      // Refresh documents
      queryClient.invalidateQueries({ queryKey: ['my-documents', learnerId] });
    } catch {
      // Error already handled by the hook's onError
    }
    setSignatureModalOpen(false);
    setSelectedDocument(null);
  };

  const handleDownload = (doc: MappedPhaseDocument) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${doc.name} en cours...`,
    });
  };

  const handlePreview = (doc: MappedPhaseDocument) => {
    if (doc.htmlContent) {
      const typeInfo = documentTypes[doc.type];
      setPreviewDocument({
        title: typeInfo?.label || doc.name,
        content: doc.htmlContent,
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
    return formation ? formation.name : '';
  };

  const groupedByFormation = formations.reduce((acc, formation) => {
    const formationDocs = filteredDocuments.filter(doc => doc.formationId === formation.id);
    if (formationDocs.length > 0) {
      acc[formation.id] = { formation, documents: formationDocs };
    }
    return acc;
  }, {} as Record<string, { formation: MappedFormation; documents: MappedPhaseDocument[] }>);

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

      {/* Empty state */}
      {filteredDocuments.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun document</h3>
            <p className="text-muted-foreground">Aucun document disponible pour cette phase.</p>
          </CardContent>
        </Card>
      )}

      {/* Documents list */}
      {selectedFormation === 'all' ? (
        <div className="space-y-6">
          {Object.values(groupedByFormation).map(({ formation, documents }) => {
            const pendingDocs = documents.filter(d => d.requiresSignature && d.status === 'available');
            
            return (
              <Card key={formation.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{formation.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {pendingDocs.length > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {pendingDocs.length} à signer
                        </Badge>
                      )}
                      <Badge variant="outline">{documents.length} document(s)</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {documents.map((doc) => {
                    const typeInfo = documentTypes[doc.type] || { label: doc.type, icon: ClipboardList, color: 'text-gray-500' };
                    
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
            );
          })}
        </div>
      ) : (
        filteredDocuments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Documents de la phase inscription</CardTitle>
              <CardDescription>
                {filteredDocuments.length} document(s) pour la formation sélectionnée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredDocuments.map((doc) => {
                const typeInfo = documentTypes[doc.type] || { label: doc.type, icon: ClipboardList, color: 'text-gray-500' };
                
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
        )
      )}

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
          typeLabel: documentTypes[selectedDocument.type]?.label || selectedDocument.type,
          formationName: getFormationName(selectedDocument.formationId),
          date: selectedDocument.date,
          size: selectedDocument.size
        } : null}
        onSignatureComplete={handleSignatureComplete}
        htmlContent={selectedDocument?.htmlContent}
      />

      {/* Preview Modal */}
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
    </div>
  );
};
