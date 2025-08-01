
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  title: string;
  description?: string;
  category: 'pedagogique' | 'administratif' | 'ressource' | 'guide' | 'template' | 'autre';
  type: string;
  size: string;
  url: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  downloadCount: number;
  tags: string[];
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Guide pédagogique - Mathématiques CM2',
    description: 'Guide complet pour l\'enseignement des mathématiques en CM2',
    category: 'pedagogique',
    type: 'PDF',
    size: '2.4 MB',
    url: '#',
    isPublic: true,
    createdBy: 'Marie Dupont',
    createdAt: '2024-01-15',
    downloadCount: 145,
    tags: ['mathématiques', 'cm2', 'guide']
  },
  {
    id: '2',
    title: 'Modèle de convention de formation',
    description: 'Template de convention pour les formations professionnelles',
    category: 'administratif',
    type: 'DOCX',
    size: '156 KB',
    url: '#',
    isPublic: false,
    createdBy: 'Admin Système',
    createdAt: '2024-01-10',
    downloadCount: 89,
    tags: ['convention', 'template', 'formation']
  },
  {
    id: '3',
    title: 'Ressources interactives - Français',
    description: 'Collection d\'exercices interactifs en français',
    category: 'ressource',
    type: 'ZIP',
    size: '15.2 MB',
    url: '#',
    isPublic: true,
    createdBy: 'Jean Martin',
    createdAt: '2024-01-08',
    downloadCount: 267,
    tags: ['français', 'exercices', 'interactif']
  }
];

const categories = [
  { value: 'pedagogique', label: 'Pédagogique', icon: GraduationCap, color: 'bg-blue-100 text-blue-800' },
  { value: 'administratif', label: 'Administratif', icon: FileText, color: 'bg-gray-100 text-gray-800' },
  { value: 'ressource', label: 'Ressource', icon: BookOpen, color: 'bg-green-100 text-green-800' },
  { value: 'guide', label: 'Guide', icon: Settings, color: 'bg-purple-100 text-purple-800' },
  { value: 'template', label: 'Template', icon: Settings, color: 'bg-orange-100 text-orange-800' },
  { value: 'autre', label: 'Autre', icon: FileText, color: 'bg-gray-100 text-gray-800' }
];

const AdminLibrary = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'tous' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (document: Document) => {
    console.log(`Téléchargement du document: ${document.title}`);
    toast({
      title: "Téléchargement démarré",
      description: `${document.title} est en cours de téléchargement`,
    });
  };

  const handleUpload = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'upload de documents sera bientôt disponible",
    });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[5];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bibliothèque</h1>
          <p className="text-gray-600 mt-2">
            Gestion centralisée de tous les documents et ressources
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau document</DialogTitle>
              <DialogDescription>
                Ajoutez un document à la bibliothèque partagée
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" placeholder="Titre du document" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Description du document" />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input id="tags" placeholder="tag1, tag2, tag3" />
              </div>
              <div>
                <Button onClick={handleUpload} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Téléverser le fichier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Publics</p>
                <p className="text-2xl font-bold">{documents.filter(d => d.isPublic).length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Privés</p>
                <p className="text-2xl font-bold">{documents.filter(d => !d.isPublic).length}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Téléchargements</p>
                <p className="text-2xl font-bold">{documents.reduce((acc, d) => acc + d.downloadCount, 0)}</p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents par catégorie */}
      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Vue grille</TabsTrigger>
          <TabsTrigger value="list">Vue liste</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => {
              const categoryInfo = getCategoryInfo(document.category);
              const Icon = categoryInfo.icon;

              return (
                <Card key={document.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <Badge className={categoryInfo.color}>
                          {categoryInfo.label}
                        </Badge>
                      </div>
                      {!document.isPublic && (
                        <Shield className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{document.title}</CardTitle>
                    {document.description && (
                      <CardDescription className="line-clamp-2">
                        {document.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{document.type} • {document.size}</span>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{document.downloadCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{document.createdBy}</span>
                        <Calendar className="h-3 w-3 ml-2" />
                        <span>{document.createdAt}</span>
                      </div>

                      {document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {document.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {document.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{document.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(document)}
                          className="flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                        <Button size="sm" variant="ghost" className="p-2">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-2 text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créé par
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Téléchargements
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((document) => {
                      const categoryInfo = getCategoryInfo(document.category);
                      return (
                        <tr key={document.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-medium text-gray-900">
                                    {document.title}
                                  </p>
                                  {!document.isPublic && (
                                    <Shield className="h-3 w-3 text-orange-500" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">
                                  {document.type} • {document.size}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={categoryInfo.color}>
                              {categoryInfo.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {document.createdBy}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {document.createdAt}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {document.downloadCount}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(document)}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Télécharger
                              </Button>
                              <Button size="sm" variant="ghost" className="p-2">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="p-2 text-red-500">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun document trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              Aucun document ne correspond à vos critères de recherche.
            </p>
            <Button onClick={() => setSearchTerm('')}>
              Effacer les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminLibrary;
