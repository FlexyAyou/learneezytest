
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Upload, UserPlus, ClipboardList, BookOpen, FileSignature } from 'lucide-react';
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
  type: 'analyse_besoin' | 'test_positionnement' | 'convention';
  date: string;
  size: string;
  status: 'completed' | 'pending' | 'signed';
}

interface PhaseInscriptionProps {
  selectedFormation: string;
  formations: Formation[];
}

export const PhaseInscription = ({ selectedFormation, formations }: PhaseInscriptionProps) => {
  const { toast } = useToast();
  
  const [documents] = useState<PhaseDocument[]>([
    { id: '1', name: 'Analyse_Besoin_Math_CE2.pdf', formationId: '1', type: 'analyse_besoin', date: '2024-01-20', size: '1.2 MB', status: 'completed' },
    { id: '2', name: 'Test_Positionnement_Math_CE2.pdf', formationId: '1', type: 'test_positionnement', date: '2024-01-21', size: '0.8 MB', status: 'completed' },
    { id: '3', name: 'Convention_Formation_Math_CE2.pdf', formationId: '1', type: 'convention', date: '2024-01-22', size: '1.5 MB', status: 'signed' },
    { id: '4', name: 'Analyse_Besoin_Francais_CM1.pdf', formationId: '2', type: 'analyse_besoin', date: '2024-01-18', size: '1.1 MB', status: 'completed' },
    { id: '5', name: 'Test_Positionnement_Francais_CM1.pdf', formationId: '2', type: 'test_positionnement', date: '2024-01-19', size: '0.9 MB', status: 'pending' },
  ]);

  const documentTypes = {
    analyse_besoin: {
      label: 'Analyse du besoin',
      icon: ClipboardList,
      description: 'Évaluation des besoins de formation',
      color: 'text-blue-500'
    },
    test_positionnement: {
      label: 'Test de positionnement',
      icon: BookOpen,
      description: 'Évaluation des compétences initiales',
      color: 'text-green-500'
    },
    convention: {
      label: 'Convention de formation',
      icon: FileSignature,
      description: 'Accord contractuel de formation',
      color: 'text-purple-500'
    }
  };

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { variant: 'default' as const, label: 'Terminé' },
      pending: { variant: 'secondary' as const, label: 'En attente' },
      signed: { variant: 'outline' as const, label: 'Signé' },
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

  const handleUpload = () => {
    toast({
      title: "Upload de document",
      description: "Sélectionnez un fichier à téléverser",
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserPlus className="h-6 w-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Phase : Inscription</h2>
            <p className="text-gray-600">Analyse du besoin, test de positionnement et convention de formation</p>
          </div>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>

      {/* Types de documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(documentTypes).map(([type, info]) => {
          const Icon = info.icon;
          const count = filteredDocuments.filter(doc => doc.type === type).length;
          
          return (
            <Card key={type} className="border-l-4 border-l-blue-500">
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
            <CardTitle>Documents de la phase inscription</CardTitle>
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
