
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Clock, MessageSquare, Building, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

interface StudentPhaseSuiviProps {
  selectedFormation: string;
  formations: Formation[];
}

export const StudentPhaseSuivi = ({ selectedFormation, formations }: StudentPhaseSuiviProps) => {
  const { toast } = useToast();
  
  const [documents] = useState<PhaseDocument[]>([
    { id: '1', name: 'Satisfaction_Froid_Math.pdf', formationId: '1', type: 'satisfaction_froid', date: '2024-05-01', size: '0.8 MB', status: 'completed' },
    { id: '2', name: 'Satisfaction_OPCO_Math.pdf', formationId: '1', type: 'satisfaction_financeur', date: '2024-05-02', size: '1.1 MB', status: 'completed', financeur: 'OPCO' },
    { id: '3', name: 'Satisfaction_France_Travail_Francais.pdf', formationId: '2', type: 'satisfaction_financeur', date: '2024-04-28', size: '1.0 MB', status: 'available', financeur: 'France Travail' },
    { id: '4', name: 'Satisfaction_Froid_Histoire.pdf', formationId: '3', type: 'satisfaction_froid', date: '2024-04-25', size: '0.9 MB', status: 'completed' },
    { id: '5', name: 'Satisfaction_FAF_Sciences.pdf', formationId: '4', type: 'satisfaction_financeur', date: '2024-04-30', size: '1.2 MB', status: 'pending', financeur: 'FAF' },
  ]);

  const documentTypes = {
    satisfaction_froid: {
      label: 'Questionnaire de satisfaction (à froid)',
      icon: MessageSquare,
      description: 'Évaluation 3 mois après la formation',
      color: 'text-blue-500'
    },
    satisfaction_financeur: {
      label: 'Questionnaire satisfaction financeur',
      icon: Building,
      description: 'OPCO / France Travail / FAF',
      color: 'text-purple-500'
    }
  };

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const getStatusBadge = (status: string) => {
    const config = {
      available: { variant: 'secondary' as const, label: 'À remplir' },
      completed: { variant: 'default' as const, label: 'Effectué' },
      pending: { variant: 'outline' as const, label: 'Pas encore disponible' },
    };
    
    return <Badge variant={config[status as keyof typeof config].variant}>
      {config[status as keyof typeof config].label}
    </Badge>;
  };

  const getFinanceurBadge = (financeur?: string) => {
    if (!financeur) return null;
    
    const config = {
      'OPCO': { variant: 'default' as const, label: 'OPCO' },
      'France Travail': { variant: 'secondary' as const, label: 'France Travail' },
      'FAF': { variant: 'outline' as const, label: 'FAF' },
    };
    
    return <Badge variant={config[financeur as keyof typeof config]?.variant || 'outline'}>
      {financeur}
    </Badge>;
  };

  const handleDownload = (document: PhaseDocument) => {
    if (document.status === 'pending') {
      toast({
        title: "Document non disponible",
        description: "Ce questionnaire ne sera disponible que 3 mois après la fin de votre formation.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Questionnaire",
      description: `Accès au questionnaire ${document.name}`,
    });
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
      <div className="flex items-center space-x-3">
        <Clock className="h-6 w-6 text-purple-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phase : +3 mois</h2>
          <p className="text-gray-600">Questionnaires de satisfaction à froid et financeur</p>
        </div>
      </div>

      {/* Types de documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(documentTypes).map(([type, info]) => {
          const Icon = info.icon;
          const count = filteredDocuments.filter(doc => doc.type === type).length;
          
          return (
            <Card key={type} className="border-l-4 border-l-pink-500">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${info.color}`} />
                  <div className="flex-1">
                    <p className="font-medium">{info.label}</p>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </div>
                  <Badge variant="outline">{count}</Badge>
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
            <Info className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>Information :</strong> Les questionnaires de satisfaction à froid sont envoyés automatiquement 3 mois après la fin de votre formation.
              Les questionnaires financeurs dépendent du type de financement de votre formation (OPCO, France Travail, FAF).
            </p>
          </div>
        </CardContent>
      </Card>

      {selectedFormation === 'all' ? (
        <div className="space-y-6">
          {Object.values(groupedByFormation).map(({ formation, documents }) => (
            <Card key={formation.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{formation.name} - {formation.level}</span>
                  <Badge variant="outline">{documents.length} questionnaire(s)</Badge>
                </CardTitle>
                <CardDescription>{formation.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => {
                  const typeInfo = documentTypes[doc.type];
                  const Icon = typeInfo.icon;
                  
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-4 w-4 ${typeInfo.color}`} />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {typeInfo.label} • {doc.size} • {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.financeur && getFinanceurBadge(doc.financeur)}
                        {getStatusBadge(doc.status)}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDownload(doc)}
                          disabled={doc.status === 'pending'}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
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
              const Icon = typeInfo.icon;
              
              return (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4 w-4 ${typeInfo.color}`} />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {typeInfo.label} • {doc.size} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.financeur && getFinanceurBadge(doc.financeur)}
                    {getStatusBadge(doc.status)}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownload(doc)}
                      disabled={doc.status === 'pending'}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
