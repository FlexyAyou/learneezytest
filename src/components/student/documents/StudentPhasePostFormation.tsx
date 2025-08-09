
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Award, CheckCircle, MessageSquare, FileCheck } from 'lucide-react';
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
  type: 'test_final' | 'satisfaction_chaud' | 'attestation' | 'certificat';
  date: string;
  size: string;
  status: 'available' | 'completed' | 'received';
}

interface StudentPhasePostFormationProps {
  selectedFormation: string;
  formations: Formation[];
}

export const StudentPhasePostFormation = ({ selectedFormation, formations }: StudentPhasePostFormationProps) => {
  const { toast } = useToast();
  
  const [documents] = useState<PhaseDocument[]>([
    { id: '1', name: 'Test_Final_Math.pdf', formationId: '1', type: 'test_final', date: '2024-02-01', size: '1.8 MB', status: 'completed' },
    { id: '2', name: 'Satisfaction_Chaud_Math.pdf', formationId: '1', type: 'satisfaction_chaud', date: '2024-02-02', size: '0.5 MB', status: 'completed' },
    { id: '3', name: 'Attestation_Math.pdf', formationId: '1', type: 'attestation', date: '2024-02-03', size: '1.2 MB', status: 'received' },
    { id: '4', name: 'Certificat_Math.pdf', formationId: '1', type: 'certificat', date: '2024-02-04', size: '1.5 MB', status: 'received' },
    { id: '5', name: 'Test_Final_Francais.pdf', formationId: '2', type: 'test_final', date: '2024-01-30', size: '1.9 MB', status: 'available' },
  ]);

  const documentTypes = {
    test_final: {
      label: 'Test de fin de formation',
      icon: FileCheck,
      description: 'Évaluation finale des acquis',
      color: 'text-blue-500'
    },
    satisfaction_chaud: {
      label: 'Questionnaire de satisfaction (à chaud)',
      icon: MessageSquare,
      description: 'Évaluation immédiate de la formation',
      color: 'text-green-500'
    },
    attestation: {
      label: 'Attestation de fin de formation',
      icon: Award,
      description: 'Certification de participation',
      color: 'text-orange-500'
    },
    certificat: {
      label: 'Certificat de réalisation',
      icon: CheckCircle,
      description: 'Certification de réalisation',
      color: 'text-purple-500'
    }
  };

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const getStatusBadge = (status: string) => {
    const config = {
      available: { variant: 'secondary' as const, label: 'À faire' },
      completed: { variant: 'default' as const, label: 'Effectué' },
      received: { variant: 'outline' as const, label: 'Reçu' },
    };
    
    return <Badge variant={config[status as keyof typeof config].variant}>
      {config[status as keyof typeof config].label}
    </Badge>;
  };

  const handleDownload = (document: PhaseDocument) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${document.name} en cours...`,
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
        <Award className="h-6 w-6 text-orange-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phase : Post-formation</h2>
          <p className="text-gray-600">Test final, satisfaction à chaud, attestation et certificat</p>
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
                    <p className="font-medium text-sm">{info.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedFormation === 'all' ? (
        <div className="space-y-6">
          {Object.values(groupedByFormation).map(({ formation, documents }) => (
            <Card key={formation.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{formation.name} - {formation.level}</span>
                  <Badge variant="outline">{documents.length} document(s)</Badge>
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
                        {getStatusBadge(doc.status)}
                        <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
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
            <CardTitle>Documents de la phase post-formation</CardTitle>
            <CardDescription>
              {filteredDocuments.length} document(s) pour la formation sélectionnée
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
                    {getStatusBadge(doc.status)}
                    <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
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
