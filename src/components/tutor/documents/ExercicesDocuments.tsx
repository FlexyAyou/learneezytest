
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Upload, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

interface ExerciceDocument {
  id: string;
  name: string;
  formationId: string;
  category: string;
  date: string;
  size: string;
  type: 'exercice' | 'correction' | 'evaluation';
  status: 'completed' | 'pending';
}

interface ExercicesDocumentsProps {
  selectedFormation: string;
  formations: Formation[];
}

export const ExercicesDocuments = ({ selectedFormation, formations }: ExercicesDocumentsProps) => {
  const { toast } = useToast();
  
  const [documents] = useState<ExerciceDocument[]>([
    { id: '1', name: 'Exercices_Additions_CE2.pdf', formationId: '1', category: 'Mathématiques', date: '2024-01-20', size: '1.2 MB', type: 'exercice', status: 'completed' },
    { id: '2', name: 'Correction_Additions_CE2.pdf', formationId: '1', category: 'Mathématiques', date: '2024-01-20', size: '0.8 MB', type: 'correction', status: 'completed' },
    { id: '3', name: 'Exercices_Grammaire_CM1.pdf', formationId: '2', category: 'Français', date: '2024-01-18', size: '1.5 MB', type: 'exercice', status: 'completed' },
    { id: '4', name: 'Evaluation_Histoire_6eme.pdf', formationId: '3', category: 'Histoire-Géographie', date: '2024-01-15', size: '2.1 MB', type: 'evaluation', status: 'pending' },
    { id: '5', name: 'TP_Sciences_CM2.pdf', formationId: '4', category: 'Sciences', date: '2024-01-12', size: '1.7 MB', type: 'exercice', status: 'completed' },
  ]);

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const getTypeBadge = (type: string) => {
    const config = {
      exercice: { variant: 'default' as const, label: 'Exercice', color: 'bg-blue-100 text-blue-800' },
      correction: { variant: 'secondary' as const, label: 'Correction', color: 'bg-green-100 text-green-800' },
      evaluation: { variant: 'outline' as const, label: 'Évaluation', color: 'bg-orange-100 text-orange-800' },
    };
    
    return <Badge variant={config[type as keyof typeof config].variant}>
      {config[type as keyof typeof config].label}
    </Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { variant: 'default' as const, label: 'Disponible' },
      pending: { variant: 'secondary' as const, label: 'En préparation' },
    };
    
    return <Badge variant={config[status as keyof typeof config].variant}>
      {config[status as keyof typeof config].label}
    </Badge>;
  };

  const handleDownload = (document: ExerciceDocument) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${document.name} en cours...`,
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload d'exercice",
      description: "Sélectionnez un fichier à téléverser",
    });
  };

  const groupedByFormation = formations.reduce((acc, formation) => {
    const formationDocs = filteredDocuments.filter(doc => doc.formationId === formation.id);
    if (formationDocs.length > 0) {
      acc[formation.id] = { formation, documents: formationDocs };
    }
    return acc;
  }, {} as Record<string, { formation: Formation; documents: ExerciceDocument[] }>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <PenTool className="h-6 w-6 text-green-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Exercices et Évaluations</h2>
            <p className="text-gray-600">Exercices, corrections et évaluations par formation</p>
          </div>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Ajouter un exercice
        </Button>
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
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTypeBadge(doc.type)}
                      {getStatusBadge(doc.status)}
                      <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Exercices et évaluations</CardTitle>
            <CardDescription>
              {filteredDocuments.length} document(s) pour la formation sélectionnée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.size} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTypeBadge(doc.type)}
                  {getStatusBadge(doc.status)}
                  <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
