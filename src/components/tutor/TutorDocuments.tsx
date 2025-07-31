
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Upload, Filter, PenTool, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: 'cours' | 'exercice' | 'administratif';
  category: string;
  date: string;
  size: string;
  status: 'signed' | 'pending' | 'completed';
  needsSignature?: boolean;
}

export const TutorDocuments = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [documents] = useState<Document[]>([
    { id: '1', name: 'Programme_Mathematiques_2024.pdf', type: 'cours', category: 'Mathématiques', date: '2024-01-20', size: '2.3 MB', status: 'completed' },
    { id: '2', name: 'Exercices_Francais_Niveau_A1.pdf', type: 'exercice', category: 'Français', date: '2024-01-18', size: '1.8 MB', status: 'completed' },
    { id: '3', name: 'Contrat_Formation_Marie.pdf', type: 'administratif', category: 'Contrats', date: '2024-01-15', size: '0.5 MB', status: 'pending', needsSignature: true },
    { id: '4', name: 'Evaluation_Trimestrielle.pdf', type: 'cours', category: 'Évaluations', date: '2024-01-12', size: '1.2 MB', status: 'signed' },
    { id: '5', name: 'Fiche_Presence_Janvier.pdf', type: 'administratif', category: 'Présence', date: '2024-01-10', size: '0.8 MB', status: 'pending', needsSignature: true },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'default' as const, label: 'Terminé' },
      pending: { variant: 'secondary' as const, label: 'En attente' },
      signed: { variant: 'outline' as const, label: 'Signé' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredDocuments = documents.filter(doc => 
    filter === 'all' || doc.type === filter
  );

  const documentsToSign = documents.filter(doc => doc.needsSignature && doc.status === 'pending');

  const handleDownload = (document: Document) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${document.name} en cours...`,
    });
  };

  const handleSign = (document: Document) => {
    toast({
      title: "Signature électronique",
      description: `Ouverture de la signature pour ${document.name}`,
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload de document",
      description: "Sélectionnez un fichier à téléverser",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
          <p className="text-gray-600">Gérez vos documents pédagogiques et administratifs</p>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Téléverser un document
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Tous les documents</TabsTrigger>
            <TabsTrigger value="to-sign">À signer ({documentsToSign.length})</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="cours">Cours</SelectItem>
                <SelectItem value="exercice">Exercices</SelectItem>
                <SelectItem value="administratif">Administratifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['cours', 'exercice', 'administratif'].map((type) => {
              const typeDocuments = filteredDocuments.filter(doc => doc.type === type);
              const typeLabels = {
                cours: 'Cours',
                exercice: 'Exercices', 
                administratif: 'Documents administratifs'
              };
              
              return (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="text-lg">{typeLabels[type as keyof typeof typeLabels]}</CardTitle>
                    <CardDescription>{typeDocuments.length} documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {typeDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
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
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="to-sign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenTool className="h-5 w-5 mr-2" />
                Documents à signer
              </CardTitle>
              <CardDescription>
                {documentsToSign.length} document(s) nécessitent votre signature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {documentsToSign.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.category} • {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button size="sm" onClick={() => handleSign(doc)}>
                      <PenTool className="h-4 w-4 mr-2" />
                      Signer
                    </Button>
                  </div>
                </div>
              ))}
              {documentsToSign.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">Aucun document en attente de signature</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
