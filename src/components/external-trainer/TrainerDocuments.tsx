
import React, { useState } from 'react';
import { FileText, Upload, Download, Eye, Filter, FolderOpen, Award, BookOpen, ClipboardList, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  date: string;
  size: string;
  status: 'Validé' | 'En attente' | 'Expiré' | 'Brouillon';
}

const TrainerDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');

  const documents: Document[] = [
    // Documents contractuels
    { id: '1', name: 'Contrat de formateur indépendant', type: 'PDF', category: 'contractuel', date: '2024-01-15', size: '2.1 MB', status: 'Validé' },
    { id: '2', name: 'Convention de formation', type: 'PDF', category: 'contractuel', date: '2024-01-10', size: '1.8 MB', status: 'Validé' },
    { id: '3', name: 'Avenant au contrat', type: 'PDF', category: 'contractuel', date: '2024-01-20', size: '756 KB', status: 'En attente' },
    
    // Certifications
    { id: '4', name: 'Certification Datadock', type: 'PDF', category: 'certification', date: '2024-01-05', size: '1.2 MB', status: 'Validé' },
    { id: '5', name: 'Certification Qualiopi', type: 'PDF', category: 'certification', date: '2024-01-08', size: '2.5 MB', status: 'Validé' },
    { id: '6', name: 'Diplôme de formateur', type: 'PDF', category: 'certification', date: '2023-12-15', size: '1.8 MB', status: 'Validé' },
    
    // Supports pédagogiques
    { id: '7', name: 'Support React - Module 1', type: 'PDF', category: 'pedagogique', date: '2024-01-18', size: '3.2 MB', status: 'Validé' },
    { id: '8', name: 'Exercices JavaScript', type: 'PDF', category: 'pedagogique', date: '2024-01-16', size: '2.1 MB', status: 'Brouillon' },
    { id: '9', name: 'Guide UI/UX Design', type: 'PDF', category: 'pedagogique', date: '2024-01-12', size: '4.5 MB', status: 'Validé' },
    
    // Documents administratifs
    { id: '10', name: 'Feuille de présence - Session 1', type: 'PDF', category: 'administratif', date: '2024-01-19', size: '1.1 MB', status: 'Validé' },
    { id: '11', name: 'Bilan de formation', type: 'PDF', category: 'administratif', date: '2024-01-17', size: '1.4 MB', status: 'En attente' },
    { id: '12', name: 'Attestation de présence', type: 'PDF', category: 'administratif', date: '2024-01-14', size: '950 KB', status: 'Validé' },
    
    // Factures
    { id: '13', name: 'Facture Janvier 2024', type: 'PDF', category: 'facture', date: '2024-01-31', size: '680 KB', status: 'Validé' },
    { id: '14', name: 'Facture Décembre 2023', type: 'PDF', category: 'facture', date: '2023-12-31', size: '720 KB', status: 'Validé' },
  ];

  const categories = [
    { id: 'tous', name: 'Tous les documents', icon: FolderOpen, count: documents.length },
    { id: 'contractuel', name: 'Documents contractuels', icon: FileText, count: documents.filter(d => d.category === 'contractuel').length },
    { id: 'certification', name: 'Certifications', icon: Award, count: documents.filter(d => d.category === 'certification').length },
    { id: 'pedagogique', name: 'Supports pédagogiques', icon: BookOpen, count: documents.filter(d => d.category === 'pedagogique').length },
    { id: 'administratif', name: 'Documents administratifs', icon: ClipboardList, count: documents.filter(d => d.category === 'administratif').length },
    { id: 'facture', name: 'Factures', icon: DollarSign, count: documents.filter(d => d.category === 'facture').length },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'tous' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'Validé':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Validé</Badge>;
      case 'En attente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case 'Expiré':
        return <Badge variant="destructive">Expiré</Badge>;
      case 'Brouillon':
        return <Badge variant="outline">Brouillon</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes documents</h1>
          <p className="text-muted-foreground">Gérez vos documents de formation</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Télécharger un document
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Catégories et documents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar des catégories */}
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{category.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Liste des documents */}
        <div className="lg:col-span-3 space-y-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(doc.status)}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun document trouvé</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Essayez de modifier votre recherche" : "Commencez par télécharger vos premiers documents"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDocuments;
