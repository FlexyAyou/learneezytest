
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
  UserCheck,
  GraduationCap,
  Trophy,
  Target
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SuperAdminDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activePhase, setActivePhase] = useState('all');

  // Documents organisés par phases
  const documentsByPhase = {
    inscription: [
      { id: '1', type: 'analyse_besoin', title: 'Analyse du besoin', description: 'Évaluation des besoins de formation', icon: ClipboardList },
      { id: '2', type: 'test_positionnement', title: 'Test de positionnement', description: 'Évaluation des compétences initiales', icon: BookOpen },
      { id: '3', type: 'convention', title: 'Convention de formation', description: 'Accord contractuel de formation', icon: FileSignature },
    ],
    formation: [
      { id: '4', type: 'cgv', title: 'Conditions générales de vente', description: 'Conditions commerciales', icon: FileText },
      { id: '5', type: 'reglement_interieur', title: 'Règlement intérieur', description: 'Règles de fonctionnement', icon: FileText },
      { id: '6', type: 'programme', title: 'Programme de formation', description: 'Détails du programme pédagogique', icon: BookOpen },
      { id: '7', type: 'convocation', title: 'Convocation', description: 'Invitation à la formation', icon: Calendar },
      { id: '8', type: 'emargement', title: 'Feuille d\'émargement', description: 'Suivi de présence', icon: CheckSquare },
    ],
    postFormation: [
      { id: '9', type: 'test_fin', title: 'Test de fin de formation', description: 'Évaluation finale', icon: Award },
      { id: '10', type: 'satisfaction_chaud', title: 'Questionnaire de satisfaction (à chaud)', description: 'Évaluation immédiate de la formation', icon: MessageSquare },
      { id: '11', type: 'attestation', title: 'Attestation de fin de formation', description: 'Certification de fin de formation', icon: Award },
      { id: '12', type: 'certificat', title: 'Certificat de réalisation', description: 'Certification de réalisation', icon: Award }
    ],
    plus3Mois: [
      { id: '13', type: 'satisfaction_froid', title: 'Questionnaire de satisfaction (à froid)', description: 'Évaluation différée de la formation', icon: MessageSquare },
      { id: '14', type: 'satisfaction_financeur_opco', title: 'Questionnaire satisfaction financeur (OPCO)', description: 'Évaluation pour OPCO', icon: MessageSquare },
      { id: '15', type: 'satisfaction_financeur_ft', title: 'Questionnaire satisfaction financeur (France Travail)', description: 'Évaluation pour France Travail', icon: MessageSquare },
      { id: '16', type: 'satisfaction_financeur_faf', title: 'Questionnaire satisfaction financeur (FAF)', description: 'Évaluation pour FAF', icon: MessageSquare },
    ]
  };

  // Tous les documents
  const allDocuments = [
    ...documentsByPhase.inscription,
    ...documentsByPhase.formation,
    ...documentsByPhase.postFormation,
    ...documentsByPhase.plus3Mois
  ];

  // Phases de navigation
  const phases = [
    { id: 'all', name: 'Documents administratifs', icon: FileText, description: 'Tous les documents' },
    { id: 'inscription', name: 'Phase : Inscription', icon: UserCheck, description: 'Documents d\'inscription' },
    { id: 'formation', name: 'Phase : Formation', icon: GraduationCap, description: 'Documents de formation' },
    { id: 'postFormation', name: 'Phase : Post-formation', icon: Trophy, description: 'Documents post-formation' },
    { id: 'plus3Mois', name: 'Phase : +3 mois', icon: Target, description: 'Évaluations à froid' }
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
    const currentDocuments = activePhase === 'all' 
      ? allDocuments 
      : documentsByPhase[activePhase as keyof typeof documentsByPhase] || [];
    
    if (selectedDocuments.length === currentDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(currentDocuments.map(doc => doc.id));
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
    const currentDocuments = activePhase === 'all' 
      ? allDocuments 
      : documentsByPhase[activePhase as keyof typeof documentsByPhase] || [];
    setSelectedDocuments(currentDocuments.map(doc => doc.id));
  };

  const handleSendDocuments = () => {
    console.log('Envoi documents:', selectedDocuments, 'vers utilisateurs:', selectedUsers);
    setShowSendDialog(false);
    setSelectedDocuments([]);
    setSelectedUsers([]);
  };

  const getCurrentDocuments = () => {
    if (activePhase === 'all') return allDocuments;
    return documentsByPhase[activePhase as keyof typeof documentsByPhase] || [];
  };

  const filteredDocuments = getCurrentDocuments().filter(doc =>
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
      'test_fin': { variant: 'secondary' as const, label: 'Effectué' },
      'satisfaction_chaud': { variant: 'default' as const, label: 'Envoyé' },
      'satisfaction_froid': { variant: 'default' as const, label: 'Envoyé' },
      'satisfaction_financeur_opco': { variant: 'default' as const, label: 'Envoyé' },
      'satisfaction_financeur_ft': { variant: 'default' as const, label: 'Envoyé' },
      'satisfaction_financeur_faf': { variant: 'default' as const, label: 'Envoyé' },
      'attestation': { variant: 'default' as const, label: 'Envoyé' },
      'certificat': { variant: 'default' as const, label: 'Envoyé' }
    };

    const config = statusMap[type as keyof typeof statusMap] || { variant: 'outline' as const, label: 'En attente' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar de navigation des phases */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Parcours de formation</h2>
          <p className="text-sm text-gray-600">Gérer les documents par phase</p>
        </div>
        
        <nav className="space-y-2">
          {phases.map((phase) => {
            const Icon = phase.icon;
            const isActive = activePhase === phase.id;
            const documentsCount = phase.id === 'all' 
              ? allDocuments.length 
              : (documentsByPhase[phase.id as keyof typeof documentsByPhase] || []).length;
            
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <div className="flex-1">
                  <div className="font-medium">{phase.name}</div>
                  <div className={`text-xs ${isActive ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                    {documentsCount} document{documentsCount > 1 ? 's' : ''}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {phases.find(p => p.id === activePhase)?.name || 'Documents'}
              </h1>
              <p className="text-gray-600">
                {phases.find(p => p.id === activePhase)?.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreFill}>
                <Plus className="w-4 h-4 mr-2" />
                Tout sélectionner
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
                          const doc = allDocuments.find(d => d.id === docId);
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
              {selectedDocuments.length === filteredDocuments.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </Button>
          </div>
        </div>

        {/* Liste des documents */}
        <div className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Documents - {phases.find(p => p.id === activePhase)?.name}
              </CardTitle>
              <CardDescription>
                {filteredDocuments.length} document(s) disponible(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
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
                              <Download className="w-4 h-4" />
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
      </div>
    </div>
  );
};

export default SuperAdminDocuments;
