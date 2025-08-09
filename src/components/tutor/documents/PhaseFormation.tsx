
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Upload, School, BookOpen, Calendar, CheckSquare } from 'lucide-react';
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
  type: 'cgv_ri' | 'programme' | 'convocation' | 'emargement';
  date: string;
  size: string;
  status: 'completed' | 'pending' | 'sent';
}

interface PhaseFormationProps {
  selectedFormation: string;
  formations: Formation[];
}

export const PhaseFormation = ({ selectedFormation, formations }: PhaseFormationProps) => {
  const { toast } = useToast();
  
  const [documents] = useState<PhaseDocument[]>([
    { id: '1', name: 'CGV_RI_Math_CE2.pdf', formationId: '1', type: 'cgv_ri', date: '2024-01-23', size: '2.1 MB', status: 'sent' },
    { id: '2', name: 'Programme_Formation_Math_CE2.pdf', formationId: '1', type: 'programme', date: '2024-01-24', size: '3.2 MB', status: 'sent' },
    { id: '3', name: 'Convocation_Math_CE2.pdf', formationId: '1', type: 'convocation', date: '2024-01-25', size: '0.8 MB', status: 'sent' },
    { id: '4', name: 'Emargement_Math_CE2.pdf', formationId: '1', type: 'emargement', date: '2024-01-26', size: '1.1 MB', status: 'completed' },
    { id: '5', name: 'Programme_Formation_Francais_CM1.pdf', formationId: '2', type: 'programme', date: '2024-01-20', size: '2.9 MB', status: 'pending' },
  ]);

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
      color: 'text-green-500'
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
      description: 'Suivi de présence',
      color: 'text-purple-500'
    }
  };

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { variant: 'default' as const, label: 'Signé' },
      pending: { variant: 'secondary' as const, label: 'En attente' },
      sent: { variant: 'outline' as const, label: 'Envoyé' },
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
          <School className="h-6 w-6 text-green-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Phase : Formation</h2>
            <p className="text-gray-600">CGV/RI, programme, convocation et émargement</p>
          </div>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>

      {/* Types de documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(documentTypes).map(([type, info]) => {
          const Icon = info.icon;
          const count = filteredDocuments.filter(doc => doc.type === type).length;
          
          return (
            <Card key={type} className="border-l-4 border-l-green-500">
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
            <CardTitle>Documents de la phase formation</CardTitle>
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
