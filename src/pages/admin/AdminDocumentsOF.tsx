
import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  QrCode,
  Shield,
  Archive,
  FileSignature,
  Mail,
  Calendar,
  User,
  BookOpen,
  Award,
  Settings,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentTemplate {
  id: string;
  type: 'certification' | 'attestation' | 'emargement' | 'convention' | 'planning' | 'evaluation';
  title: string;
  description: string;
  isActive: boolean;
  isCustomizable: boolean;
  lastModified: string;
  usageCount: number;
}

const AdminDocumentsOF = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentTemplate | null>(null);

  // Templates par catégorie
  const documentTemplates: DocumentTemplate[] = [
    // Certifications
    {
      id: '1',
      type: 'certification',
      title: 'Certificat React.js Développeur',
      description: 'Certificat de compétences pour les développeurs React.js',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-15',
      usageCount: 45
    },
    {
      id: '2',
      type: 'certification',
      title: 'Certificat Python Full-Stack',
      description: 'Certificat de réalisation pour la formation Python Full-Stack',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-12',
      usageCount: 32
    },
    // Attestations de fin de formation
    {
      id: '3',
      type: 'attestation',
      title: 'Attestation JavaScript ES6+',
      description: 'Attestation de fin de formation JavaScript moderne',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-18',
      usageCount: 67
    },
    {
      id: '4',
      type: 'attestation',
      title: 'Attestation DevOps Docker/Kubernetes',
      description: 'Attestation de participation à la formation DevOps',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-10',
      usageCount: 28
    },
    // Émargements
    {
      id: '5',
      type: 'emargement',
      title: 'Feuille d\'émargement standard',
      description: 'Template de feuille d\'émargement pour toutes formations',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-20',
      usageCount: 156
    },
    {
      id: '6',
      type: 'emargement',
      title: 'Émargement formation courte',
      description: 'Feuille d\'émargement adaptée aux formations de moins de 7h',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-14',
      usageCount: 89
    },
    // Conventions
    {
      id: '7',
      type: 'convention',
      title: 'Convention de formation professionnelle',
      description: 'Convention type pour les formations professionnelles',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-08',
      usageCount: 124
    },
    {
      id: '8',
      type: 'convention',
      title: 'Convention formation courte durée',
      description: 'Convention adaptée aux formations de moins de 30h',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-05',
      usageCount: 76
    },
    // Planning
    {
      id: '9',
      type: 'planning',
      title: 'Planning formation présentielle',
      description: 'Template de planning pour les formations en présentiel',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-16',
      usageCount: 93
    },
    {
      id: '10',
      type: 'planning',
      title: 'Planning formation distancielle',
      description: 'Template de planning pour les formations à distance',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-11',
      usageCount: 67
    },
    // Évaluations
    {
      id: '11',
      type: 'evaluation',
      title: 'Bilan d\'évaluation technique',
      description: 'Grille d\'évaluation pour les compétences techniques',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-13',
      usageCount: 54
    },
    {
      id: '12',
      type: 'evaluation',
      title: 'Évaluation satisfaction stagiaire',
      description: 'Questionnaire de satisfaction de fin de formation',
      isActive: true,
      isCustomizable: true,
      lastModified: '2024-01-17',
      usageCount: 142
    }
  ];

  const categories = [
    { value: 'certification', label: 'Certifications', icon: Award, color: 'bg-yellow-100 text-yellow-800', count: documentTemplates.filter(d => d.type === 'certification').length },
    { value: 'attestation', label: 'Attestations', icon: FileText, color: 'bg-blue-100 text-blue-800', count: documentTemplates.filter(d => d.type === 'attestation').length },
    { value: 'emargement', label: 'Émargements', icon: FileSignature, color: 'bg-green-100 text-green-800', count: documentTemplates.filter(d => d.type === 'emargement').length },
    { value: 'convention', label: 'Conventions', icon: Shield, color: 'bg-purple-100 text-purple-800', count: documentTemplates.filter(d => d.type === 'convention').length },
    { value: 'planning', label: 'Plannings', icon: Calendar, color: 'bg-orange-100 text-orange-800', count: documentTemplates.filter(d => d.type === 'planning').length },
    { value: 'evaluation', label: 'Évaluations', icon: BookOpen, color: 'bg-teal-100 text-teal-800', count: documentTemplates.filter(d => d.type === 'evaluation').length }
  ];

  const filteredDocuments = documentTemplates.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCustomizeTemplate = (document: DocumentTemplate) => {
    setSelectedDocument(document);
    setShowCustomizeDialog(true);
  };

  const handleSendTemplate = (document: DocumentTemplate) => {
    setSelectedDocument(document);
    setShowSendDialog(true);
  };

  const getCategoryInfo = (type: string) => {
    return categories.find(cat => cat.value === type) || categories[0];
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-500 text-white">Actif</Badge> : 
      <Badge variant="outline">Inactif</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents OF</h1>
          <p className="text-gray-600 mt-2">
            Gestion des templates de documents pour l'organisme de formation
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Nouveau template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Créer un nouveau template</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau template de document
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
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
                  <Label htmlFor="title">Titre du template</Label>
                  <Input id="title" placeholder="Ex: Certificat React.js" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Description du template" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => setShowUploadDialog(false)}>
                    Créer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques par catégorie */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.value} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{category.count}</p>
                    <p className="text-sm text-gray-600">{category.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des templates..."
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
                  <SelectItem value="all">Toutes les catégories</SelectItem>
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

      {/* Liste des templates par catégorie */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">Tous</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tous les templates</CardTitle>
              <CardDescription>
                Gérez tous vos templates de documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Utilisation</TableHead>
                    <TableHead>Modifié</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => {
                    const categoryInfo = getCategoryInfo(doc.type);
                    const Icon = categoryInfo.icon;
                    return (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium">{doc.title}</div>
                              <div className="text-sm text-gray-500">{doc.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={categoryInfo.color}>
                            {categoryInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{doc.usageCount}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {doc.lastModified}
                        </TableCell>
                        <TableCell>{getStatusBadge(doc.isActive)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCustomizeTemplate(doc)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendTemplate(doc)}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {categories.map((category) => {
          const Icon = category.icon;
          const categoryDocs = documentTemplates.filter(doc => doc.type === category.value);
          
          return (
            <TabsContent key={category.value} value={category.value} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-6 w-6" />
                    <div>
                      <CardTitle>{category.label}</CardTitle>
                      <CardDescription>
                        Templates de {category.label.toLowerCase()} disponibles
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryDocs.map((doc) => (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{doc.title}</CardTitle>
                            {getStatusBadge(doc.isActive)}
                          </div>
                          <CardDescription className="text-sm">
                            {doc.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <span>Utilisé {doc.usageCount} fois</span>
                            <span>Modifié le {doc.lastModified}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="w-3 w-3 mr-1" />
                              Voir
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCustomizeTemplate(doc)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendTemplate(doc)}
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Dialog de personnalisation */}
      <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Personnaliser le template</DialogTitle>
            <DialogDescription>
              Modifiez le template "{selectedDocument?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-title">Titre du document</Label>
              <Input 
                id="template-title" 
                defaultValue={selectedDocument?.title}
                placeholder="Titre personnalisé"
              />
            </div>
            <div>
              <Label htmlFor="template-content">Contenu personnalisé</Label>
              <Textarea 
                id="template-content" 
                rows={8}
                placeholder="Personnalisez le contenu du template ici..."
                className="font-mono text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
                Annuler
              </Button>
              <Button onClick={() => setShowCustomizeDialog(false)}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog d'envoi */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer le template</DialogTitle>
            <DialogDescription>
              Sélectionnez les apprenants pour envoyer "{selectedDocument?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipients">Sélectionner les apprenants</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir les destinataires" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les apprenants</SelectItem>
                  <SelectItem value="react-students">Apprenants React.js</SelectItem>
                  <SelectItem value="python-students">Apprenants Python</SelectItem>
                  <SelectItem value="js-students">Apprenants JavaScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="send-message">Message d'accompagnement (optionnel)</Label>
              <Textarea 
                id="send-message" 
                placeholder="Ajouter un message personnalisé..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                Annuler
              </Button>
              <Button onClick={() => setShowSendDialog(false)}>
                <Mail className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDocumentsOF;
