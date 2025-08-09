
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Upload, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

interface CoursDocument {
  id: string;
  name: string;
  formationId: string;
  category: string;
  date: string;
  size: string;
  status: 'completed' | 'pending';
}

interface CoursDocumentsProps {
  selectedFormation: string;
  formations: Formation[];
}

export const CoursDocuments = ({ selectedFormation, formations }: CoursDocumentsProps) => {
  const { toast } = useToast();
  
  const [documents] = useState<CoursDocument[]>([
    { id: '1', name: 'Leçon_1_Additions.pdf', formationId: '1', category: 'Mathématiques', date: '2024-01-20', size: '2.3 MB', status: 'completed' },
    { id: '2', name: 'Cours_Grammaire_CM1.pdf', formationId: '2', category: 'Français', date: '2024-01-18', size: '1.8 MB', status: 'completed' },
    { id: '3', name: 'Histoire_Moyen_Age.pdf', formationId: '3', category: 'Histoire-Géographie', date: '2024-01-15', size: '3.2 MB', status: 'pending' },
    { id: '4', name: 'Sciences_Cycle_Eau.pdf', formationId: '4', category: 'Sciences', date: '2024-01-12', size: '1.9 MB', status: 'completed' },
  ]);

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { variant: 'default' as const, label: 'Disponible' },
      pending: { variant: 'secondary' as const, label: 'En préparation' },
    };
    
    return <Badge variant={config[status as keyof typeof config].variant}>
      {config[status as keyof typeof config].label}
    </Badge>;
  };

  const handleDownload = (document: CoursDocument) => {
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
  }, {} as Record<string, { formation: Formation; documents: CoursDocument[] }>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-6 w-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Documents de Cours</h2>
            <p className="text-gray-600">Organisés par formation selon les filtres du catalogue</p>
          </div>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Ajouter un document
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
                      <FileText className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
            <CardTitle>Documents de cours</CardTitle>
            <CardDescription>
              {filteredDocuments.length} document(s) pour la formation sélectionnée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.size} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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
