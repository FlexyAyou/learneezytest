
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, Building, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentCard } from './DocumentCard';
import { DocumentSignatureModal } from './DocumentSignatureModal';

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
  type: 'satisfaction_froid' | 'satisfaction_financeur';
  date: string;
  size: string;
  status: 'available' | 'completed' | 'pending';
  financeur?: string;
  requiresSignature?: boolean;
}

interface StudentPhaseSuiviProps {
  selectedFormation: string;
  formations: Formation[];
}

export const StudentPhaseSuivi = ({ selectedFormation, formations }: StudentPhaseSuiviProps) => {
  const { toast } = useToast();
  
  const [documents, setDocuments] = useState<PhaseDocument[]>([
    { id: '1', name: 'Satisfaction_Froid_Math.pdf', formationId: '1', type: 'satisfaction_froid', date: '2024-05-01', size: '0.8 MB', status: 'completed' },
    { id: '2', name: 'Satisfaction_OPCO_Math.pdf', formationId: '1', type: 'satisfaction_financeur', date: '2024-05-02', size: '1.1 MB', status: 'completed', financeur: 'OPCO' },
    { id: '3', name: 'Satisfaction_France_Travail_Francais.pdf', formationId: '2', type: 'satisfaction_financeur', date: '2024-04-28', size: '1.0 MB', status: 'available', financeur: 'France Travail', requiresSignature: true },
    { id: '4', name: 'Satisfaction_Froid_Histoire.pdf', formationId: '3', type: 'satisfaction_froid', date: '2024-04-25', size: '0.9 MB', status: 'completed' },
    { id: '5', name: 'Satisfaction_FAF_Sciences.pdf', formationId: '4', type: 'satisfaction_financeur', date: '2024-04-30', size: '1.2 MB', status: 'pending', financeur: 'FAF' },
  ]);

  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PhaseDocument | null>(null);

  const documentTypes = {
    satisfaction_froid: {
      label: 'Questionnaire satisfaction (à froid)',
      icon: MessageSquare,
      description: 'Évaluation 3 mois après la formation',
      color: 'text-blue-500'
    },
    satisfaction_financeur: {
      label: 'Questionnaire satisfaction financeur',
      icon: Building,
      description: 'OPCO / France Travail / FAF',
      color: 'text-violet-500'
    }
  };

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const pendingSignatures = filteredDocuments.filter(doc => doc.requiresSignature && doc.status === 'available');
  const completedCount = filteredDocuments.filter(doc => doc.status === 'completed').length;

  const handleSign = (doc: PhaseDocument) => {
    setSelectedDocument(doc);
    setSignatureModalOpen(true);
  };

  const handleSignatureComplete = (documentId: string, signatureData: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'completed' as const, requiresSignature: false }
        : doc
    ));
    setSignatureModalOpen(false);
    setSelectedDocument(null);
  };

  const handleDownload = (doc: PhaseDocument) => {
    if (doc.status === 'pending') {
      toast({
        title: "Document non disponible",
        description: "Ce questionnaire ne sera disponible que 3 mois après la fin de votre formation.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Questionnaire",
      description: `Accès au questionnaire ${doc.name}`,
    });
  };

  const handlePreview = (doc: PhaseDocument) => {
    if (doc.status === 'pending') {
      toast({
        title: "Document non disponible",
        description: "Ce questionnaire ne sera disponible que 3 mois après la fin de votre formation.",
        variant: "destructive"
      });
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
          <div className="p-2 bg-violet-100 rounded-xl">
            <Clock className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Phase : +3 mois</h2>
            <p className="text-muted-foreground">Questionnaires de satisfaction à froid et financeur</p>
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

      {/* Informations importantes */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Information :</strong> Les questionnaires de satisfaction à froid sont envoyés automatiquement 3 mois après la fin de votre formation.
              Les questionnaires financeurs dépendent du type de financement de votre formation (OPCO, France Travail, FAF).
            </p>
          </div>
        </CardContent>
      </Card>

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
                          {pendingDocs.length} à remplir
                        </Badge>
                      )}
                      <Badge variant="outline">{documents.length} questionnaire(s)</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {documents.map((doc) => {
                    const typeInfo = documentTypes[doc.type];
                    
                    return (
                      <div key={doc.id} className="relative">
                        {doc.financeur && (
                          <Badge 
                            variant="secondary" 
                            className="absolute -top-2 right-2 text-[10px] z-10"
                          >
                            {doc.financeur}
                          </Badge>
                        )}
                        <DocumentCard
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
                      </div>
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
            <CardTitle>Questionnaires de la phase +3 mois</CardTitle>
            <CardDescription>
              {filteredDocuments.length} questionnaire(s) pour la formation sélectionnée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredDocuments.map((doc) => {
              const typeInfo = documentTypes[doc.type];
              
              return (
                <div key={doc.id} className="relative">
                  {doc.financeur && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 right-2 text-[10px] z-10"
                    >
                      {doc.financeur}
                    </Badge>
                  )}
                  <DocumentCard
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
                </div>
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
    </div>
  );
};
