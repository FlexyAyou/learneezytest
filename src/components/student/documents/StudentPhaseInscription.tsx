import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, ClipboardList, BookOpen, FileSignature, AlertCircle, CheckCircle, ScrollText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentCard } from './DocumentCard';
import { DocumentSignatureModal } from './DocumentSignatureModal';
import { StudentDocumentPreviewModal } from './StudentDocumentPreviewModal';
import { DEFAULT_TEMPLATES } from '@/components/admin/documents/defaultTemplates';

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
  type: 'analyse_besoin' | 'test_positionnement' | 'convention' | 'cgv';
  date: string;
  size: string;
  status: 'available' | 'signed' | 'completed';
  requiresSignature?: boolean;
  htmlContent?: string;
}

interface StudentPhaseInscriptionProps {
  selectedFormation: string;
  formations: Formation[];
}

// Helper pour personnaliser le contenu HTML avec les données réelles
const personalizeContent = (template: string, formation: Formation): string => {
  // Récupérer la signature OF depuis localStorage
  const storedSignature = localStorage.getItem('of_official_signature');
  const signatureHtml = storedSignature 
    ? `<img src="${storedSignature}" alt="Signature OF" style="max-height: 60px; max-width: 200px;" />`
    : '<span style="color: #999; font-style: italic;">[Signature OF]</span>';

  return template
    .replace(/\{\{of\.nom\}\}/g, 'InfinitiAX Formation')
    .replace(/\{\{of\.siret\}\}/g, '123 456 789 00012')
    .replace(/\{\{of\.nda\}\}/g, '11 75 12345 75')
    .replace(/\{\{of\.adresse\}\}/g, '15 Rue de la Formation')
    .replace(/\{\{of\.codePostal\}\}/g, '75001')
    .replace(/\{\{of\.ville\}\}/g, 'Paris')
    .replace(/\{\{of\.telephone\}\}/g, '01 23 45 67 89')
    .replace(/\{\{of\.email\}\}/g, 'contact@infinitiax.com')
    .replace(/\{\{of\.responsable\}\}/g, 'Jean Dupont')
    .replace(/\{\{of\.signature\}\}/g, signatureHtml)
    .replace(/\{\{formation\.nom\}\}/g, formation.name)
    .replace(/\{\{formation\.duree\}\}/g, '35 heures')
    .replace(/\{\{formation\.lieu\}\}/g, 'Paris - En présentiel')
    .replace(/\{\{formation\.prix\}\}/g, '1 500,00 €')
    .replace(/\{\{dates\.debut\}\}/g, '15/01/2024')
    .replace(/\{\{dates\.fin\}\}/g, '19/01/2024')
    .replace(/\{\{date\.jour\}\}/g, new Date().toLocaleDateString('fr-FR'))
    .replace(/\{\{apprenant\.nom\}\}/g, 'Martin')
    .replace(/\{\{apprenant\.prenom\}\}/g, 'Sophie');
};

export const StudentPhaseInscription = ({ selectedFormation, formations }: StudentPhaseInscriptionProps) => {
  const { toast } = useToast();
  
  const [documents, setDocuments] = useState<PhaseDocument[]>([
    { id: '1', name: 'Analyse_Besoin_Math.pdf', formationId: '1', type: 'analyse_besoin', date: '2024-01-20', size: '1.2 MB', status: 'completed' },
    { id: '2', name: 'Test_Positionnement_Math.pdf', formationId: '1', type: 'test_positionnement', date: '2024-01-21', size: '0.8 MB', status: 'completed' },
    { id: '3', name: 'Convention_Formation_Math.pdf', formationId: '1', type: 'convention', date: '2024-01-22', size: '1.5 MB', status: 'available', requiresSignature: true },
    { id: '4', name: 'CGV_Formation_Math.pdf', formationId: '1', type: 'cgv', date: '2024-01-22', size: '0.5 MB', status: 'signed' },
    { id: '5', name: 'Analyse_Besoin_Francais.pdf', formationId: '2', type: 'analyse_besoin', date: '2024-01-18', size: '1.1 MB', status: 'completed' },
    { id: '6', name: 'Test_Positionnement_Francais.pdf', formationId: '2', type: 'test_positionnement', date: '2024-01-19', size: '0.9 MB', status: 'available', requiresSignature: true },
    { id: '7', name: 'Convention_Formation_Francais.pdf', formationId: '2', type: 'convention', date: '2024-01-20', size: '1.4 MB', status: 'signed' },
    { id: '8', name: 'CGV_Formation_Francais.pdf', formationId: '2', type: 'cgv', date: '2024-01-20', size: '0.5 MB', status: 'available', requiresSignature: true },
  ]);

  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PhaseDocument | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{ title: string; content: string } | null>(null);

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
    },
    cgv: {
      label: 'Conditions Générales de Vente',
      icon: ScrollText,
      description: 'Conditions commerciales et légales',
      color: 'text-amber-500'
    }
  };

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const pendingSignatures = filteredDocuments.filter(doc => doc.requiresSignature && doc.status === 'available');
  const signedCount = filteredDocuments.filter(doc => doc.status === 'signed' || doc.status === 'completed').length;

  const handleSign = (doc: PhaseDocument) => {
    setSelectedDocument(doc);
    setSignatureModalOpen(true);
  };

  const handleSignatureComplete = (documentId: string, signatureData: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'signed' as const, requiresSignature: false }
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
    // Récupérer la formation associée
    const formation = formations.find(f => f.id === doc.formationId);
    
    // Pour les CGV et Convention, afficher le template HTML personnalisé
    if ((doc.type === 'cgv' || doc.type === 'convention') && formation) {
      const template = doc.type === 'cgv' ? DEFAULT_TEMPLATES.cgv : DEFAULT_TEMPLATES.convention;
      if (template) {
        const personalizedContent = personalizeContent(template, formation);
        setPreviewDocument({
          title: documentTypes[doc.type].label,
          content: personalizedContent
        });
        setPreviewModalOpen(true);
        return;
      }
    }
    
    // Pour les autres types, afficher un toast
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
            <CardTitle>Documents de la phase inscription</CardTitle>
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
    </div>
  );
};
