import React, { useState } from 'react';
import {
  FileText,
  Send,
  CheckSquare,
  Search,
  Users,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  User,
  BookOpen,
  Award,
  FileSignature,
  Calendar,
  ClipboardList,
  MessageSquare,
  Mail,
  CheckCircle,
  Clock,
  FolderOpen,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OFDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');

  // Catégories de documents
  const categories = [
    { id: 'all', name: 'Tous les documents', icon: FileText },
    { id: 'inscription', name: 'Phase d\'inscription', icon: ClipboardList },
    { id: 'formation', name: 'Phase de formation', icon: BookOpen },
    { id: 'evaluation', name: 'Évaluations', icon: Award },
    { id: 'administratif', name: 'Documents administratifs', icon: FileSignature },
    { id: 'suivi', name: 'Suivi et certification', icon: CheckCircle }
  ];

  // Documents avec catégorisation
  const documents = [
    // Phase d'inscription
    { 
      id: '1', 
      type: 'analyse_besoin', 
      title: 'Analyse du besoin', 
      description: 'Évaluation des besoins de formation', 
      icon: ClipboardList, 
      category: 'inscription',
      phase: 'Inscription',
      status: 'template'
    },
    { 
      id: '2', 
      type: 'test_positionnement', 
      title: 'Test de positionnement', 
      description: 'Évaluation des compétences initiales', 
      icon: BookOpen, 
      category: 'inscription',
      phase: 'Inscription',
      status: 'template'
    },
    { 
      id: '3', 
      type: 'convention', 
      title: 'Convention de formation', 
      description: 'Accord contractuel de formation', 
      icon: FileSignature, 
      category: 'administratif',
      phase: 'Inscription',
      status: 'signed'
    },
    
    // Phase de formation
    { 
      id: '4', 
      type: 'programme', 
      title: 'Programme de formation', 
      description: 'Détails du programme pédagogique', 
      icon: BookOpen, 
      category: 'formation',
      phase: 'Formation',
      status: 'sent'
    },
    { 
      id: '5', 
      type: 'reglement_interieur', 
      title: 'Règlement intérieur', 
      description: 'Règles de fonctionnement', 
      icon: FileText, 
      category: 'administratif',
      phase: 'Formation',
      status: 'sent'
    },
    { 
      id: '7', 
      type: 'convocation', 
      title: 'Convocation', 
      description: 'Invitation à la formation', 
      icon: Calendar, 
      category: 'formation',
      phase: 'Formation',
      status: 'sent'
    },
    { 
      id: '8', 
      type: 'emargement', 
      title: 'Feuille d\'émargement', 
      description: 'Suivi de présence', 
      icon: CheckSquare, 
      category: 'formation',
      phase: 'Formation',
      status: 'completed'
    },
    
    // Évaluations
    { 
      id: '9', 
      type: 'test_niveau', 
      title: 'Test de niveau durant formation', 
      description: 'Évaluation continue', 
      icon: Award, 
      category: 'evaluation',
      phase: 'Formation',
      status: 'completed'
    },
    { 
      id: '10', 
      type: 'comparatif_notes', 
      title: 'Comparatif des notes', 
      description: 'Analyse progression positionnement/examens', 
      icon: Award, 
      category: 'evaluation',
      phase: 'Formation',
      status: 'generated'
    },
    
    // Suivi et certification
    { 
      id: '11', 
      type: 'satisfaction', 
      title: 'Formulaire de satisfaction', 
      description: 'Évaluation de la formation', 
      icon: MessageSquare, 
      category: 'suivi',
      phase: 'Post-formation',
      status: 'sent'
    },
    { 
      id: '12', 
      type: 'attestation', 
      title: 'Attestation de formation', 
      description: 'Certification de fin de formation', 
      icon: Award, 
      category: 'suivi',
      phase: 'Post-formation',
      status: 'sent'
    },
    { 
      id: '13', 
      type: 'certificat', 
      title: 'Certificat de réalisation', 
      description: 'Certification de réalisation', 
      icon: Award, 
      category: 'suivi',
      phase: 'Post-formation',
      status: 'sent'
    }
  ];

  // Liste des utilisateurs
  const users = [
    { id: '1', name: 'Marie Dupont', email: 'marie.dupont@email.com', role: 'Apprenante' },
    { id: '2', name: 'Jean Martin', email: 'jean.martin@email.com', role: 'Apprenant' },
    { id: '3', name: 'Sophie Bernard', email: 'sophie.bernard@email.com', role: 'Apprenante' },
    { id: '4', name: 'Pierre Durand', email: 'pierre.durand@email.com', role: 'Apprenant' },
    { id: '5', name: 'Lucie Moreau', email: 'lucie.moreau@email.com', role: 'Apprenante' }
  ];

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map(doc => doc.id));
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handlePreFill = () => {
    const prefilledIds = getPrefilledDocuments();
    const matchingDocuments = documents
      .filter(doc => prefilledIds.includes(doc.type))
      .map(doc => doc.id);
    setSelectedDocuments(matchingDocuments);
  };

  const handleSendDocuments = () => {
    // Logique d'envoi des documents
    console.log('Envoi documents:', selectedDocuments, 'vers utilisateurs:', selectedUsers);
    setShowSendDialog(false);
    setSelectedDocuments([]);
    setSelectedUsers([]);
  };

  const getPrefilledDocuments = () => {
    return [
      'analyse_besoin',
      'test_positionnement',
      'convention',
      'programme',
      'reglement_interieur',
      'cgv',
      'convocation',
      'emargement',
      'test_niveau',
      'comparatif_notes',
      'satisfaction',
      'attestation',
      'certificat'
    ];
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'template': { variant: 'outline' as const, label: '📄 Modèle', color: 'text-gray-600' },
      'sent': { variant: 'default' as const, label: '📤 Envoyé', color: 'text-blue-600' },
      'signed': { variant: 'default' as const, label: '✍️ Signé', color: 'text-green-600' },
      'completed': { variant: 'secondary' as const, label: '✅ Terminé', color: 'text-green-600' },
      'generated': { variant: 'secondary' as const, label: '🔄 Généré', color: 'text-purple-600' }
    };

    const config = statusMap[status as keyof typeof statusMap] || { variant: 'outline' as const, label: '⏳ En attente', color: 'text-gray-500' };
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesPhase = selectedPhase === 'all' || doc.phase === selectedPhase;
    
    return matchesSearch && matchesCategory && matchesPhase;
  });

  const documentsByCategory = categories.map(category => ({
    ...category,
    documents: documents.filter(doc => category.id === 'all' || doc.category === category.id),
    count: documents.filter(doc => category.id === 'all' || doc.category === category.id).length
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Documents</h1>
          <p className="text-gray-600">Personnalisation et envoi de documents aux utilisateurs par catégorie</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreFill}>
            <Plus className="w-4 h-4 mr-2" />
            Pré-remplir tout
          </Button>
          <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
            <DialogTrigger asChild>
              <Button disabled={selectedDocuments.length === 0}>
                <Send className="w-4 h-4 mr-2" />
                Envoyer sélection ({selectedDocuments.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Envoyer les documents sélectionnés</DialogTitle>
                <DialogDescription>
                  Sélectionnez les utilisateurs qui recevront ces documents
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Documents à envoyer ({selectedDocuments.length})</Label>
                  <div className="mt-2 space-y-1">
                    {selectedDocuments.map(docId => {
                      const doc = documents.find(d => d.id === docId);
                      return doc ? (
                        <div key={docId} className="flex items-center gap-2 text-sm">
                          <doc.icon className="w-4 h-4" />
                          {doc.title}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div>
                  <Label>Destinataires</Label>
                  <ScrollArea className="h-48 mt-2 border rounded-md p-3">
                    <div className="space-y-2">
                      {users.map(user => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={user.id}
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleUserSelect(user.id)}
                          />
                          <Label htmlFor={user.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email} - {user.role}</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleSendDocuments}
                    disabled={selectedUsers.length === 0}
                  >
                    Envoyer à {selectedUsers.length} utilisateur(s)
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navigation par catégories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            const count = documentsByCategory.find(c => c.id === category.id)?.count || 0;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <CategoryIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
                <Badge variant="secondary" className="ml-1">{count}</Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Filtres */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedPhase} onValueChange={setSelectedPhase}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les phases</SelectItem>
              <SelectItem value="Inscription">Phase d'inscription</SelectItem>
              <SelectItem value="Formation">Phase de formation</SelectItem>
              <SelectItem value="Post-formation">Post-formation</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleSelectAll}>
            <CheckSquare className="w-4 h-4 mr-2" />
            {selectedDocuments.length === filteredDocuments.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </Button>
        </div>

        {/* Contenu des onglets */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.name}
                  <Badge variant="outline">
                    {filteredDocuments.filter(doc => category.id === 'all' || doc.category === category.id).length} documents
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {category.id === 'all' 
                    ? 'Tous les documents disponibles dans le système'
                    : `Documents de la catégorie ${category.name.toLowerCase()}`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedDocuments.length === filteredDocuments.filter(doc => category.id === 'all' || doc.category === category.id).length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Phase</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments
                      .filter(doc => category.id === 'all' || doc.category === category.id)
                      .map((document) => {
                        const Icon = document.icon;
                        return (
                          <TableRow key={document.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedDocuments.includes(document.id)}
                                onCheckedChange={() => handleDocumentSelect(document.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-gray-500" />
                                <div>
                                  <div className="font-medium">{document.title}</div>
                                  <div className="text-sm text-gray-500">{document.description}</div>
                                  <div className="text-xs text-gray-400 mt-1">{document.type}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{document.phase}</Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(document.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>

                {filteredDocuments.filter(doc => category.id === 'all' || doc.category === category.id).length === 0 && (
                  <div className="text-center py-8">
                    <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun document trouvé</h3>
                    <p className="text-gray-600">
                      {searchTerm || selectedPhase !== 'all'
                        ? "Aucun document ne correspond aux critères de recherche."
                        : `Aucun document dans la catégorie ${category.name.toLowerCase()}.`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default OFDocuments;
