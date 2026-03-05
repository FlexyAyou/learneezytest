import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, ClipboardList, BookOpen, FileSignature, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentCard } from './DocumentCard';
import { StudentInteractiveDocumentModal } from './StudentInteractiveDocumentModal';
import { useSignDocument } from '@/hooks/useDocuments';
import type { MappedPhaseDocument, MappedFormation } from '@/hooks/useMyDocuments';
import type { IdentityVerificationResult } from './IdentityVerificationModal';
import { useQueryClient } from '@tanstack/react-query';
import { personalizeDocumentContent, getTemplateForType } from '@/utils/personalizeDocumentContent';

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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<MappedPhaseDocument | null>(null);

  const documentTypes: Record<string, { label: string; icon: React.ElementType; description: string; color: string }> = {
    analyse_besoin: { label: 'Analyse du besoin', icon: ClipboardList, description: 'Évaluation de vos besoins de formation', color: 'text-blue-500' },
    test_positionnement: { label: 'Test de positionnement', icon: BookOpen, description: 'Évaluation de vos compétences initiales', color: 'text-emerald-500' },
    convention: { label: 'Convention de formation', icon: FileSignature, description: 'Accord contractuel de formation', color: 'text-violet-500' },
  };

  const filteredDocuments = apiDocuments.filter(doc =>
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const pendingSignatures = filteredDocuments.filter(doc => doc.requiresSignature && doc.status === 'available');
  const signedCount = filteredDocuments.filter(doc => doc.status === 'signed' || doc.status === 'completed').length;

  const getDocumentHtml = (doc: MappedPhaseDocument): string | undefined => {
    if (doc.htmlContent) return doc.htmlContent;
    const template = getTemplateForType(doc.type);
    if (!template) return undefined;
    const formation = formations.find(f => f.id === doc.formationId);
    return personalizeDocumentContent(template, { id: doc.formationId, name: formation?.name || doc.formationName }, doc.learnerSignature);
  };

  const handleOpenDoc = (doc: MappedPhaseDocument) => {
    setSelectedDocument(doc);
    setModalOpen(true);
  };

  const handleSignatureComplete = async (documentId: string, signatureData: string, metadata: IdentityVerificationResult['metadata']) => {
    if (!learnerId) return;
    await signDocumentMutation.mutateAsync({
      learnerId, documentId,
      data: {
        signature_data: signatureData,
        signature_metadata: metadata,
      },
    });
    queryClient.invalidateQueries({ queryKey: ['my-documents', learnerId] });
    setModalOpen(false);
    setSelectedDocument(null);
  };

  const handleDownload = (doc: MappedPhaseDocument) => {
    toast({ title: "Téléchargement", description: `Téléchargement de ${doc.name} en cours...` });
  };

  const getFormationName = (formationId: string) => formations.find(f => f.id === formationId)?.name || '';

  const groupedByFormation = formations.reduce((acc, formation) => {
    const formationDocs = filteredDocuments.filter(doc => doc.formationId === formation.id);
    if (formationDocs.length > 0) acc[formation.id] = { formation, documents: formationDocs };
    return acc;
  }, {} as Record<string, { formation: MappedFormation; documents: MappedPhaseDocument[] }>);

  return (
    <div className="p-6 space-y-6">
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
        <div className="flex items-center gap-4">
          {pendingSignatures.length > 0 && (
            <Badge variant="destructive" className="gap-1.5 py-1.5 px-3">
              <AlertCircle className="h-4 w-4" />{pendingSignatures.length} document(s) à signer
            </Badge>
          )}
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 bg-background">
            <CheckCircle className="h-4 w-4 text-green-500" />{signedCount}/{filteredDocuments.length} complétés
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(documentTypes).map(([type, info]) => {
          const Icon = info.icon;
          const count = filteredDocuments.filter(doc => doc.type === type).length;
          const pending = filteredDocuments.filter(doc => doc.type === type && doc.status === 'available' && doc.requiresSignature).length;
          return (
            <Card key={type} className="border-l-4 border-l-primary/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg"><Icon className={`h-5 w-5 ${info.color}`} /></div>
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

      {filteredDocuments.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun document</h3>
            <p className="text-muted-foreground">Aucun document disponible pour cette phase.</p>
          </CardContent>
        </Card>
      )}

      {selectedFormation === 'all' ? (
        <div className="space-y-6">
          {Object.values(groupedByFormation).map(({ formation, documents }) => (
            <Card key={formation.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{formation.name}</CardTitle>
                  <Badge variant="outline">{documents.length} document(s)</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => {
                  const typeInfo = documentTypes[doc.type] || { label: doc.type, icon: ClipboardList, color: 'text-gray-500' };
                  return (
                    <DocumentCard key={doc.id} id={doc.id} name={doc.name} type={doc.type} typeLabel={typeInfo.label}
                      typeIcon={typeInfo.icon} typeColor={typeInfo.color} date={doc.date} size={doc.size}
                      status={doc.status} requiresSignature={doc.requiresSignature}
                      onSign={() => handleOpenDoc(doc)} onDownload={() => handleDownload(doc)} onPreview={() => handleOpenDoc(doc)}
                    />
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        filteredDocuments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Documents de la phase inscription</CardTitle>
              <CardDescription>{filteredDocuments.length} document(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredDocuments.map((doc) => {
                const typeInfo = documentTypes[doc.type] || { label: doc.type, icon: ClipboardList, color: 'text-gray-500' };
                return (
                  <DocumentCard key={doc.id} id={doc.id} name={doc.name} type={doc.type} typeLabel={typeInfo.label}
                    typeIcon={typeInfo.icon} typeColor={typeInfo.color} date={doc.date} size={doc.size}
                    status={doc.status} requiresSignature={doc.requiresSignature}
                    onSign={() => handleOpenDoc(doc)} onDownload={() => handleDownload(doc)} onPreview={() => handleOpenDoc(doc)}
                  />
                );
              })}
            </CardContent>
          </Card>
        )
      )}

      <StudentInteractiveDocumentModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedDocument(null); }}
        document={selectedDocument ? {
          id: selectedDocument.id, name: selectedDocument.name, type: selectedDocument.type,
          typeLabel: documentTypes[selectedDocument.type]?.label || selectedDocument.type,
          formationName: getFormationName(selectedDocument.formationId),
          date: selectedDocument.date, size: selectedDocument.size,
        } : null}
        htmlContent={selectedDocument ? getDocumentHtml(selectedDocument) : undefined}
        learnerSignature={selectedDocument?.learnerSignature}
        signedAt={selectedDocument?.signedAt}
        onSignatureComplete={handleSignatureComplete}
      />
    </div>
  );
};
