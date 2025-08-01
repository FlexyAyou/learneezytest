
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
  Users,
  ExternalLink,
  Share
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

interface GeneratedDocument {
  id: string;
  type: 'attestation' | 'certificat' | 'emargement' | 'convention' | 'planning' | 'evaluation';
  title: string;
  formation: string;
  apprenant: string;
  status: 'generated' | 'signed' | 'sent' | 'archived';
  createdAt: string;
  uniqueCode: string;
  signedBy?: string;
  sentAt?: string;
}

const AdminDocumentsOF = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);

  // Documents générés automatiquement
  const generatedDocuments: GeneratedDocument[] = [
    {
      id: '1',
      type: 'attestation',
      title: 'Attestation de fin de formation - Marie Dupont',
      formation: 'React Avancé',
      apprenant: 'Marie Dupont',
      status: 'sent',
      createdAt: '2024-01-15',
      uniqueCode: 'ATT-2024-001',
      sentAt: '2024-01-15'
    },
    {
      id: '2',
      type: 'certificat',
      title: 'Certificat de réalisation - Jean Martin',
      formation: 'JavaScript ES6',
      apprenant: 'Jean Martin',
      status: 'signed',
      createdAt: '2024-01-12',
      uniqueCode: 'CERT-2024-002',
      signedBy: 'Jean Martin'
    },
    {
      id: '3',
      type: 'emargement',
      title: 'Feuille d\'émargement - Formation Python',
      formation: 'Python Full-Stack',
      apprenant: 'Sophie Laurent',
      status: 'generated',
      createdAt: '2024-01-18',
      uniqueCode: 'EMG-2024-003'
    },
    {
      id: '4',
      type: 'convention',
      title: 'Convention de formation - DevOps',
      formation: 'DevOps Docker/Kubernetes',
      apprenant: 'Pierre Moreau',
      status: 'signed',
      createdAt: '2024-01-10',
      uniqueCode: 'CONV-2024-004',
      signedBy: 'Pierre Moreau'
    }
  ];

  const documentTypes = [
    { value: 'attestation', label: 'Attestations', color: 'bg-blue-100 text-blue-800' },
    { value: 'certificat', label: 'Certificats', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'emargement', label: 'Émargements', color: 'bg-green-100 text-green-800' },
    { value: 'convention', label: 'Conventions', color: 'bg-purple-100 text-purple-800' },
    { value: 'planning', label: 'Plannings', color: 'bg-orange-100 text-orange-800' },
    { value: 'evaluation', label: 'Évaluations', color: 'bg-teal-100 text-teal-800' }
  ];

  const statuses = [
    { value: 'generated', label: 'Généré', color: 'bg-gray-100 text-gray-800', icon: FileText },
    { value: 'signed', label: 'Signé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'sent', label: 'Envoyé', color: 'bg-pink-100 text-pink-800', icon: Send },
    { value: 'archived', label: 'Archivé', color: 'bg-gray-100 text-gray-600', icon: Archive }
  ];

  const filteredDocuments = generatedDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.apprenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.formation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeInfo = (type: string) => {
    return documentTypes.find(t => t.value === type) || documentTypes[0];
  };

  const getStatusInfo = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const handleSendDocument = (document: GeneratedDocument) => {
    setSelectedDocument(document);
    setShowSendDialog(true);
  };

  const totalDocuments = generatedDocuments.length;
  const signedDocuments = generatedDocuments.filter(d => d.status === 'signed').length;
  const libraryDocuments = 3; // From the library/templates
  const sentThisMonth = generatedDocuments.filter(d => d.status === 'sent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Documents OF</h1>
          <p className="text-gray-600 mt-2">
            Génération automatique, bibliothèque OF et suivi des envois
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Déposer un document
          </Button>
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Générer document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Générer un nouveau document</DialogTitle>
                <DialogDescription>
                  Créez un document personnalisé pour un apprenant
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document-type">Type de document</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="formation">Formation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une formation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React Avancé</SelectItem>
                      <SelectItem value="js">JavaScript ES6</SelectItem>
                      <SelectItem value="python">Python Full-Stack</SelectItem>
                      <SelectItem value="devops">DevOps Docker/Kubernetes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="apprenant">Apprenant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un apprenant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marie">Marie Dupont</SelectItem>
                      <SelectItem value="jean">Jean Martin</SelectItem>
                      <SelectItem value="sophie">Sophie Laurent</SelectItem>
                      <SelectItem value="pierre">Pierre Moreau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => setShowGenerateDialog(false)}>
                    Générer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalDocuments}</p>
                <p className="text-sm text-gray-600">Documents générés</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{signedDocuments}</p>
                <p className="text-sm text-gray-600">Documents signés</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <FileSignature className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{libraryDocuments}</p>
                <p className="text-sm text-gray-600">Bibliothèque OF</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{sentThisMonth}</p>
                <p className="text-sm text-gray-600">Envois ce mois</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs defaultValue="generated" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generated">Documents générés</TabsTrigger>
          <TabsTrigger value="library">Bibliothèque OF</TabsTrigger>
          <TabsTrigger value="tracking">Suivi des envois</TabsTrigger>
          <TabsTrigger value="automation">Automatisation</TabsTrigger>
        </TabsList>

        <TabsContent value="generated" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents générés automatiquement</CardTitle>
              <CardDescription>
                Attestations, certificats, émargements et autres documents générés par la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtres et recherche */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher par titre, apprenant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="lg:w-48">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:w-48">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:w-32">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="js">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tableau des documents */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Formation</TableHead>
                      <TableHead>Apprenant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Code unique</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => {
                      const typeInfo = getTypeInfo(doc.type);
                      const statusInfo = getStatusInfo(doc.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Badge className={typeInfo.color}>
                              {typeInfo.label.slice(0, -1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{doc.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{doc.formation}</TableCell>
                          <TableCell>{doc.apprenant}</TableCell>
                          <TableCell>
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {doc.uniqueCode}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="p-1">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="p-1">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="p-1">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="p-1"
                                onClick={() => handleSendDocument(doc)}
                              >
                                <Share className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>Bibliothèque OF</CardTitle>
              <CardDescription>
                Templates et modèles de documents pour l'organisme de formation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Contenu de la bibliothèque OF à venir...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Suivi des envois</CardTitle>
              <CardDescription>
                Tracking et historique des documents envoyés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Suivi des envois à venir...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automatisation</CardTitle>
              <CardDescription>
                Paramètres d'automatisation de génération et d'envoi de documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                Paramètres d'automatisation à venir...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog d'envoi */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer le document</DialogTitle>
            <DialogDescription>
              Envoyez "{selectedDocument?.title}" à l'apprenant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="send-method">Méthode d'envoi</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="platform">Via la plateforme</SelectItem>
                  <SelectItem value="sms">SMS (lien)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Message d'accompagnement (optionnel)</Label>
              <Textarea 
                id="message" 
                placeholder="Ajouter un message personnalisé..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                Annuler
              </Button>
              <Button onClick={() => setShowSendDialog(false)}>
                <Send className="w-4 h-4 mr-2" />
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
