
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
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Settings,
  BookOpen,
  Users,
  DollarSign,
  Award,
  ClipboardCheck,
  Building,
  Mail,
  Database,
  Lock,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  title: string;
  description?: string;
  category: 'technique' | 'juridique' | 'pedagogique' | 'administratif' | 'securite' | 'formation' | 'communication' | 'finance';
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
  // Documents techniques
  {
    id: '1',
    title: 'Architecture système de la plateforme',
    description: 'Documentation technique complète de l\'architecture',
    category: 'technique',
    type: 'PDF',
    size: '5.2 MB',
    url: '#',
    isPublic: false,
    createdBy: 'Équipe Technique',
    createdAt: '2024-01-15',
    downloadCount: 45,
    tags: ['architecture', 'système', 'technique']
  },
  {
    id: '2',
    title: 'Guide d\'installation et configuration',
    description: 'Instructions d\'installation et de configuration du système',
    category: 'technique',
    type: 'PDF',
    size: '3.8 MB',
    url: '#',
    isPublic: false,
    createdBy: 'Admin Système',
    createdAt: '2024-01-12',
    downloadCount: 67,
    tags: ['installation', 'configuration', 'guide']
  },
  
  // Documents juridiques
  {
    id: '3',
    title: 'Conditions générales d\'utilisation',
    description: 'CGU de la plateforme Learneezy',
    category: 'juridique',
    type: 'PDF',
    size: '1.2 MB',
    url: '#',
    isPublic: true,
    createdBy: 'Service Juridique',
    createdAt: '2024-01-10',
    downloadCount: 234,
    tags: ['cgu', 'juridique', 'conditions']
  },
  {
    id: '4',
    title: 'Politique de confidentialité',
    description: 'Politique RGPD et protection des données',
    category: 'juridique',
    type: 'PDF',
    size: '980 KB',
    url: '#',
    isPublic: true,
    createdBy: 'DPO',
    createdAt: '2024-01-08',
    downloadCount: 189,
    tags: ['rgpd', 'confidentialité', 'données']
  },
  
  // Documents pédagogiques
  {
    id: '5',
    title: 'Guide de création de contenu pédagogique',
    description: 'Méthodologie pour créer du contenu de qualité',
    category: 'pedagogique',
    type: 'PDF',
    size: '4.5 MB',
    url: '#',
    isPublic: true,
    createdBy: 'Équipe Pédagogique',
    createdAt: '2024-01-18',
    downloadCount: 156,
    tags: ['pédagogie', 'création', 'contenu']
  },
  {
    id: '6',
    title: 'Standards qualité des formations',
    description: 'Référentiel qualité pour les formations',
    category: 'pedagogique',
    type: 'PDF',
    size: '2.1 MB',
    url: '#',
    isPublic: false,
    createdBy: 'Responsable Qualité',
    createdAt: '2024-01-16',
    downloadCount: 78,
    tags: ['qualité', 'standards', 'formation']
  },
  
  // Documents administratifs
  {
    id: '7',
    title: 'Procédures d\'inscription des organismes',
    description: 'Guide complet pour l\'inscription des OF',
    category: 'administratif',
    type: 'PDF',
    size: '1.8 MB',
    url: '#',
    isPublic: false,
    createdBy: 'Service Admin',
    createdAt: '2024-01-14',
    downloadCount: 92,
    tags: ['inscription', 'organisme', 'procédure']
  },
  {
    id: '8',
    title: 'Modèles de conventions de formation',
    description: 'Templates de conventions standardisées',
    category: 'administratif',
    type: 'DOCX',
    size: '756 KB',
    url: '#',
    isPublic: false,
    createdBy: 'Service Juridique',
    createdAt: '2024-01-12',
    downloadCount: 134,
    tags: ['convention', 'template', 'formation']
  },
  
  // Documents sécurité
  {
    id: '9',
    title: 'Politique de sécurité informatique',
    description: 'Règles et procédures de sécurité',
    category: 'securite',
    type: 'PDF',
    size: '2.3 MB',
    url: '#',
    isPublic: false,
    createdBy: 'RSSI',
    createdAt: '2024-01-20',
    downloadCount: 56,
    tags: ['sécurité', 'politique', 'informatique']
  },
  
  // Documents formation
  {
    id: '10',
    title: 'Catalogue des formations certifiantes',
    description: 'Liste complète des formations disponibles',
    category: 'formation',
    type: 'PDF',
    size: '6.2 MB',
    url: '#',
    isPublic: true,
    createdBy: 'Équipe Formation',
    createdAt: '2024-01-22',
    downloadCount: 312,
    tags: ['catalogue', 'formations', 'certifications']
  },
  
  // Documents communication
  {
    id: '11',
    title: 'Guide de communication visuelle',
    description: 'Charte graphique et éléments de communication',
    category: 'communication',
    type: 'PDF',
    size: '8.1 MB',
    url: '#',
    isPublic: false,
    createdBy: 'Service Marketing',
    createdAt: '2024-01-19',
    downloadCount: 87,
    tags: ['communication', 'charte', 'graphique']
  },
  
  // Documents finance
  {
    id: '12',
    title: 'Grilles tarifaires 2024',
    description: 'Tarification officielle des services',
    category: 'finance',
    type: 'XLSX',
    size: '428 KB',
    url: '#',
    isPublic: false,
    createdBy: 'Direction Financière',
    createdAt: '2024-01-25',
    downloadCount: 123,
    tags: ['tarifs', 'grille', 'finance']
  }
];

const categories = [
  { value: 'technique', label: 'Technique', icon: Settings, color: 'bg-blue-100 text-blue-800' },
  { value: 'juridique', label: 'Juridique', icon: Shield, color: 'bg-red-100 text-red-800' },
  { value: 'pedagogique', label: 'Pédagogique', icon: BookOpen, color: 'bg-green-100 text-green-800' },
  { value: 'administratif', label: 'Administratif', icon: ClipboardCheck, color: 'bg-gray-100 text-gray-800' },
  { value: 'securite', label: 'Sécurité', icon: Lock, color: 'bg-orange-100 text-orange-800' },
  { value: 'formation', label: 'Formation', icon: Award, color: 'bg-purple-100 text-purple-800' },
  { value: 'communication', label: 'Communication', icon: Mail, color: 'bg-pink-100 text-pink-800' },
  { value: 'finance', label: 'Finance', icon: DollarSign, color: 'bg-yellow-100 text-yellow-800' }
];

const AdminRessources = () => {
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
    return categories.find(cat => cat.value === category) || categories[3];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ressources</h1>
          <p className="text-gray-600 mt-2">
            Gestion centralisée de toutes les ressources et documents de la plateforme
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une ressource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle ressource</DialogTitle>
              <DialogDescription>
                Ajoutez une ressource à la bibliothèque centralisée
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" placeholder="Titre de la ressource" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Description de la ressource" />
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
                <p className="text-sm text-gray-600">Total Ressources</p>
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
                <p className="text-sm text-gray-600">Publiques</p>
                <p className="text-2xl font-bold">{documents.filter(d => d.isPublic).length}</p>
              </div>
              <Globe className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confidentielles</p>
                <p className="text-2xl font-bold">{documents.filter(d => !d.isPublic).length}</p>
              </div>
              <Lock className="h-8 w-8 text-orange-500" />
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
                  placeholder="Rechercher des ressources..."
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

      {/* Ressources par catégorie */}
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
                        <Lock className="h-4 w-4 text-orange-500" />
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
                        Ressource
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
                                    <Lock className="h-3 w-3 text-orange-500" />
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
              Aucune ressource trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              Aucune ressource ne correspond à vos critères de recherche.
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

export default AdminRessources;
