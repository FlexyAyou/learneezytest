
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, FileText, BookOpen, Calendar, CheckSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentCard } from './DocumentCard';
import { DocumentSignatureModal } from './DocumentSignatureModal';
import { StudentDocumentPreviewModal } from './StudentDocumentPreviewModal';
import { personalizeDocumentContent, getTemplateForType } from '@/utils/personalizeDocumentContent';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

interface PhaseDocument {
  id: string;
  name: string;
  formationId: string;
  type: 'cgv_ri' | 'programme' | 'convocation' | 'emargement';
  date: string;
  size: string;
  status: 'available' | 'signed' | 'received';
  requiresSignature?: boolean;
  learnerSignature?: string;
  signedAt?: string;
}

interface StudentPhaseFormationProps {
  selectedFormation: string;
  formations: Formation[];
}

export const StudentPhaseFormation = ({ selectedFormation, formations }: StudentPhaseFormationProps) => {
  const { toast } = useToast();
  
  const [documents, setDocuments] = useState<PhaseDocument[]>([
    { id: '1', name: 'CGV_RI_Math.pdf', formationId: '1', type: 'cgv_ri', date: '2024-01-23', size: '2.1 MB', status: 'available', requiresSignature: true },
    { id: '2', name: 'Programme_Formation_Math.pdf', formationId: '1', type: 'programme', date: '2024-01-24', size: '3.2 MB', status: 'received' },
    { id: '3', name: 'Convocation_Math.pdf', formationId: '1', type: 'convocation', date: '2024-01-25', size: '0.8 MB', status: 'received' },
    { id: '4', name: 'Emargement_Math.pdf', formationId: '1', type: 'emargement', date: '2024-01-26', size: '1.1 MB', status: 'signed' },
    { id: '5', name: 'Programme_Formation_Francais.pdf', formationId: '2', type: 'programme', date: '2024-01-20', size: '2.9 MB', status: 'received' },
    { id: '6', name: 'CGV_RI_Francais.pdf', formationId: '2', type: 'cgv_ri', date: '2024-01-21', size: '2.0 MB', status: 'available', requiresSignature: true },
  ]);

  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PhaseDocument | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{ title: string; content: string } | null>(null);

  const documentTypes = {
    cgv_ri: {
      label: 'CGV / Règlement Intérieur',
      icon: FileText,
      description: 'Conditions générales et règles de fonctionnement',
      color: 'text-blue-500'
    },
    programme: {
      label: 'Programme de formation',
      icon: BookOpen,
      description: 'Détails du programme pédagogique',
      color: 'text-emerald-500'
    },
    convocation: {
      label: 'Convocation',
      icon: Calendar,
      description: 'Invitation à la formation',
      color: 'text-orange-500'
    },
    emargement: {
      label: 'Feuille d\'émargement',
      icon: CheckSquare,
      description: 'Feuille de présence à signer',
      color: 'text-violet-500'
    }
  };

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const pendingSignatures = filteredDocuments.filter(doc => doc.requiresSignature && doc.status === 'available');
  const signedCount = filteredDocuments.filter(doc => doc.status === 'signed' || doc.status === 'received').length;

  const handleSign = (doc: PhaseDocument) => {
    setSelectedDocument(doc);
    setSignatureModalOpen(true);
  };

  const handleSignatureComplete = (documentId: string, signatureData: string) => {
    setDocuments(prev => prev.map(doc => 
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
  };

  const handleDownload = (doc: PhaseDocument) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${doc.name} en cours...`,
    });
  };

  const handlePreview = (doc: PhaseDocument) => {
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
    return formation ? `${formation.name} - ${formation.level}` : '';
  };

  const groupedByFormation = formations.reduce((acc, formation) => {
    const formationDocs = filteredDocuments.filter(doc => doc.formationId === formation.id);
    if (formationDocs.length > 0) {
      acc[formation.id] = { formation, documents: formationDocs };
    }
    return acc;
  }, {} as Record<string, { formation: Formation; documents: PhaseDocument[] }>);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <School className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Phase : Formation</h2>
            <p className="text-muted-foreground">CGV/RI, programme, convocation et émargement</p>
          </div>
        </div>
        
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <p className="font-medium text-xs">{info.label}</p>
                      <div className="flex items-center gap-1">
                        {pending > 0 && (
                          <Badge variant="destructive" className="text-[10px] px-1.5">{pending}</Badge>
                        )}
                        <Badge variant="outline" className="text-[10px] px-1.5">{count}</Badge>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{info.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
                      <CardTitle className="text-lg">{formation.name} - {formation.level}</CardTitle>
                      <CardDescription>{formation.category}</CardDescription>
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
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Documents de la phase formation</CardTitle>
            <CardDescription>
              {filteredDocuments.length} document(s) pour la formation sélectionnée
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
          typeLabel: documentTypes[selectedDocument.type].label,
          formationName: getFormationName(selectedDocument.formationId),
          date: selectedDocument.date,
          size: selectedDocument.size
        } : null}
        onSignatureComplete={handleSignatureComplete}
        htmlContent={selectedDocument ? (() => {
          const formation = formations.find(f => f.id === selectedDocument.formationId);
          const template = getTemplateForType(selectedDocument.type);
          return template && formation ? personalizeDocumentContent(template, formation, selectedDocument.learnerSignature) : undefined;
        })() : undefined}
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
