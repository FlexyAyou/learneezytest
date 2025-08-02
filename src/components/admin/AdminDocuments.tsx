import React, { useState } from 'react';
import {
  FileText,
  Mail,
  CheckSquare,
  Search,
  Users,
  Plus,
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
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const AdminDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  // Liste des documents disponibles
  const documents = [
    { id: '1', type: 'analyse_besoin', title: 'Analyse du besoin', description: 'Évaluation des besoins de formation', icon: ClipboardList },
    { id: '2', type: 'test_positionnement', title: 'Test de positionnement', description: 'Évaluation des compétences initiales', icon: BookOpen },
    { id: '3', type: 'convention', title: 'Convention de formation', description: 'Accord contractuel de formation', icon: FileSignature },
    { id: '4', type: 'programme', title: 'Programme de formation', description: 'Détails du programme pédagogique', icon: BookOpen },
    { id: '5', type: 'reglement_interieur', title: 'Règlement intérieur', description: 'Règles de fonctionnement', icon: FileText },
    { id: '6', type: 'cgv', title: 'Conditions générales de vente', description: 'Conditions commerciales', icon: FileText },
    { id: '7', type: 'convocation', title: 'Convocation', description: 'Invitation à la formation', icon: Calendar },
    { id: '8', type: 'emargement', title: 'Feuille d\'émargement', description: 'Suivi de présence', icon: CheckSquare },
    { id: '9', type: 'test_niveau', title: 'Test de niveau durant formation', description: 'Évaluation continue', icon: Award },
    { id: '10', type: 'comparatif_notes', title: 'Comparatif des notes', description: 'Analyse progression positionnement/examens', icon: Award },
    { id: '11', type: 'satisfaction', title: 'Formulaire de satisfaction', description: 'Évaluation de la formation', icon: MessageSquare },
    { id: '12', type: 'attestation', title: 'Attestation de formation', description: 'Certification de fin de formation', icon: Award },
    { id: '13', type: 'certificat', title: 'Certificat de réalisation', description: 'Certification de réalisation', icon: Award }
  ];

  // Liste des utilisateurs
  const users = [
    { 
      id: '1', 
      name: 'Marie Dupont', 
      email: 'marie.dupont@email.com', 
      role: 'Apprenante',
      details: {
        formation: 'Développement Web',
        niveau: 'Intermédiaire',
        dateInscription: '2024-01-15'
      }
    },
    { 
      id: '2', 
      name: 'Jean Martin', 
      email: 'jean.martin@email.com', 
      role: 'Apprenant',
      details: {
        formation: 'Data Science',
        niveau: 'Débutant',
        dateInscription: '2024-01-20'
      }
    },
    { 
      id: '3', 
      name: 'Sophie Bernard', 
      email: 'sophie.bernard@email.com', 
      role: 'Apprenante',
      details: {
        formation: 'Intelligence Artificielle',
        niveau: 'Avancé',
        dateInscription: '2024-01-10'
      }
    },
    { 
      id: '4', 
      name: 'Pierre Durand', 
      email: 'pierre.durand@email.com', 
      role: 'Apprenant',
      details: {
        formation: 'Cybersécurité',
        niveau: 'Intermédiaire',
        dateInscription: '2024-01-25'
      }
    },
    { 
      id: '5', 
      name: 'Lucie Moreau', 
      email: 'lucie.moreau@email.com', 
      role: 'Apprenante',
      details: {
        formation: 'UX/UI Design',
        niveau: 'Débutant',
        dateInscription: '2024-01-18'
      }
    }
  ];

  // Documents pré-remplis selon le type d'utilisateur
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

    // Auto-remplir les documents quand on sélectionne un utilisateur
    if (!selectedUsers.includes(userId)) {
      const prefilledIds = getPrefilledDocuments();
      const matchingDocuments = documents
        .filter(doc => prefilledIds.includes(doc.type))
        .map(doc => doc.id);
      setSelectedDocuments(prev => [...new Set([...prev, ...matchingDocuments])]);
    }
  };

  const handlePreFill = () => {
    const prefilledIds = getPrefilledDocuments();
    const matchingDocuments = documents
      .filter(doc => prefilledIds.includes(doc.type))
      .map(doc => doc.id);
    setSelectedDocuments(matchingDocuments);
  };

  const personalizeAndSendDocuments = () => {
    // Logique de personnalisation et d'envoi par email
    const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
    const selectedDocumentData = documents.filter(doc => selectedDocuments.includes(doc.id));
    
    // Simuler la personnalisation des documents avec les informations utilisateur
    selectedUserData.forEach(user => {
      selectedDocumentData.forEach(doc => {
        console.log(`Personnalisation du document "${doc.title}" pour ${user.name}`);
        console.log(`Formation: ${user.details.formation}, Niveau: ${user.details.niveau}`);
        console.log(`Envoi par email à: ${user.email}`);
      });
    });

    toast({
      title: "Documents envoyés",
      description: `${selectedDocuments.length} document(s) personnalisé(s) et envoyé(s) par email à ${selectedUsers.length} utilisateur(s)`,
    });

    setShowSendDialog(false);
    setSelectedDocuments([]);
    setSelectedUsers([]);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (type: string) => {
    const statusMap = {
      'analyse_besoin': { variant: 'outline' as const, label: 'À faire' },
      'test_positionnement': { variant: 'outline' as const, label: 'À faire' },
      'convention': { variant: 'default' as const, label: 'Signé' },
      'programme': { variant: 'default' as const, label: 'Envoyé' },
      'reglement_interieur': { variant: 'default' as const, label: 'Envoyé' },
      'cgv': { variant: 'default' as const, label: 'Envoyé' },
      'convocation': { variant: 'default' as const, label: 'Envoyé' },
      'emargement': { variant: 'default' as const, label: 'Signé' },
      'test_niveau': { variant: 'secondary' as const, label: 'Effectué' },
      'comparatif_notes': { variant: 'secondary' as const, label: 'Généré' },
      'satisfaction': { variant: 'default' as const, label: 'Envoyé' },
      'attestation': { variant: 'default' as const, label: 'Envoyé' },
      'certificat': { variant: 'default' as const, label: 'Envoyé' }
    };

    const config = statusMap[type as keyof typeof statusMap] || { variant: 'outline' as const, label: 'En attente' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Documents</h1>
          <p className="text-gray-600">Personnalisation et envoi de documents par email aux utilisateurs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreFill}>
            <Plus className="w-4 h-4 mr-2" />
            Pré-remplir tout
          </Button>
          <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
            <DialogTrigger asChild>
              <Button disabled={selectedDocuments.length === 0}>
                <Mail className="w-4 h-4 mr-2" />
                Envoyer par email ({selectedDocuments.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Envoyer les documents par email</DialogTitle>
                <DialogDescription>
                  Sélectionnez les utilisateurs qui recevront ces documents personnalisés par email
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
                  <Label>Destinataires (les documents seront personnalisés automatiquement)</Label>
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
                                <div className="text-xs text-gray-500">
                                  {user.email} - {user.details.formation}
                                </div>
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
                    onClick={personalizeAndSendDocuments}
                    disabled={selectedUsers.length === 0}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Personnaliser et envoyer à {selectedUsers.length} utilisateur(s)
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleSelectAll}>
          <CheckSquare className="w-4 h-4 mr-2" />
          {selectedDocuments.length === documents.length ? 'Tout désélectionner' : 'Tout sélectionner'}
        </Button>
      </div>

      {/* Liste des documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents disponibles</CardTitle>
          <CardDescription>
            Sélectionnez les documents à personnaliser et envoyer par email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedDocuments.length === documents.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => {
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
                          <div className="text-sm text-gray-500">{document.type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {document.description}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(document.type)}
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
                          <Mail className="w-4 h-4" />
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
    </div>
  );
};

export default AdminDocuments;