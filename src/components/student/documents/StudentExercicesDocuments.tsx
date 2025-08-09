
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Upload, CheckCircle, Clock } from 'lucide-react';
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
  status: 'available' | 'submitted' | 'pending';
  dueDate?: string;
}

interface StudentExercicesDocumentsProps {
  selectedFormation: string;
  formations: Formation[];
}

export const StudentExercicesDocuments = ({ selectedFormation, formations }: StudentExercicesDocumentsProps) => {
  const { toast } = useToast();
  
  const [documents] = useState<ExerciceDocument[]>([
    { id: '1', name: 'Exercice_Matrices.pdf', formationId: '1', category: 'Mathématiques', date: '2024-01-20', size: '1.2 MB', status: 'submitted', dueDate: '2024-01-25' },
    { id: '2', name: 'Analyse_Texte_Camus.pdf', formationId: '2', category: 'Français', date: '2024-01-18', size: '0.8 MB', status: 'available', dueDate: '2024-01-28' },
    { id: '3', name: 'Dissertation_Guerre_Froide.pdf', formationId: '3', category: 'Histoire', date: '2024-01-15', size: '1.5 MB', status: 'submitted', dueDate: '2024-01-22' },
    { id: '4', name: 'TP_Optique.pdf', formationId: '4', category: 'Sciences', date: '2024-01-12', size: '2.1 MB', status: 'pending', dueDate: '2024-01-30' },
  ]);

  const filteredDocuments = documents.filter(doc => 
    selectedFormation === 'all' || doc.formationId === selectedFormation
  );

  const getStatusBadge = (status: string) => {
    const config = {
      available: { variant: 'secondary' as const, label: 'À faire', icon: Clock },
      submitted: { variant: 'default' as const, label: 'Rendu', icon: CheckCircle },
      pending: { variant: 'outline' as const, label: 'Bientôt disponible', icon: Clock },
    };
    
    const { variant, label, icon: Icon } = config[status as keyof typeof config];
    return (
      <Badge variant={variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </Badge>
    );
  };

  const handleDownload = (document: ExerciceDocument) => {
    if (document.status === 'pending') {
      toast({
        title: "Document non disponible",
        description: "Cet exercice sera bientôt accessible.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${document.name} en cours...`,
    });
  };

  const handleSubmit = (document: ExerciceDocument) => {
    toast({
      title: "Remise de devoir",
      description: `Sélectionnez votre fichier pour ${document.name}`,
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
      <div className="flex items-center space-x-3">
        <FileText className="h-6 w-6 text-pink-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exercices et Devoirs</h2>
          <p className="text-gray-600">Téléchargez vos exercices et rendez vos devoirs</p>
        </div>
      </div>

      {selectedFormation === 'all' ? (
        <div className="space-y-6">
          {Object.values(groupedByFormation).map(({ formation, documents }) => (
            <Card key={formation.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{formation.name} - {formation.level}</span>
                  <Badge variant="outline">{documents.length} exercice(s)</Badge>
                </CardTitle>
                <CardDescription>{formation.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-pink-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.size} • {doc.date} • Date limite: {doc.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(doc.status)}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDownload(doc)}
                        disabled={doc.status === 'pending'}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      {doc.status === 'available' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSubmit(doc)}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Rendre
                        </Button>
                      )}
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
            <CardTitle>Exercices et devoirs</CardTitle>
            <CardDescription>
              {filteredDocuments.length} exercice(s) pour la formation sélectionnée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-pink-500" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {doc.size} • {doc.date} • Date limite: {doc.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(doc.status)}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDownload(doc)}
                    disabled={doc.status === 'pending'}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  {doc.status === 'available' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleSubmit(doc)}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Rendre
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
