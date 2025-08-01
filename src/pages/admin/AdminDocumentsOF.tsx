
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
import { OFDocumentEditor } from '@/components/admin/OFDocumentEditor';

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
  content?: string;
}

interface TemplateDocument {
  id: string;
  type: 'attestation' | 'certificat' | 'emargement' | 'convention' | 'planning' | 'evaluation';
  title: string;
  description?: string;
  content: string;
  isActive: boolean;
  lastModified: string;
  modifiedBy: string;
}

interface TrackingRecord {
  id: string;
  documentId: string;
  documentTitle: string;
  recipient: string;
  sentAt: string;
  method: 'email' | 'platform' | 'sms';
  status: 'sent' | 'opened' | 'downloaded' | 'signed';
  openedAt?: string;
  downloadedAt?: string;
  signedAt?: string;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: 'formation_complete' | 'enrollment' | 'session_end' | 'evaluation_complete';
  documentType: string;
  isActive: boolean;
  conditions?: any;
}

const AdminDocumentsOF = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDocument | null>(null);

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
      sentAt: '2024-01-15',
      content: 'Nous certifions que Mme Marie Dupont a suivi avec assiduité la formation "React Avancé" du 10 au 15 janvier 2024...'
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
      signedBy: 'Jean Martin',
      content: 'Il est certifié que M. Jean Martin a terminé avec succès la formation "JavaScript ES6"...'
    },
    {
      id: '3',
      type: 'emargement',
      title: 'Feuille d\'émargement - Formation Python',
      formation: 'Python Full-Stack',
      apprenant: 'Sophie Laurent',
      status: 'generated',
      createdAt: '2024-01-18',
      uniqueCode: 'EMG-2024-003',
      content: 'Feuille de présence pour la formation Python Full-Stack...'
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
      signedBy: 'Pierre Moreau',
      content: 'Convention de formation professionnelle entre l\'organisme et Pierre Moreau...'
    }
  ];

  // Templates de documents
  const templateDocuments: TemplateDocument[] = [
    {
      id: 'tpl-1',
      type: 'attestation',
      title: 'Modèle d\'attestation de fin de formation',
      description: 'Template standard pour les attestations de fin de formation',
      content: 'Nous certifions que {APPRENANT} a suivi avec assiduité la formation "{FORMATION}" du {DATE_DEBUT} au {DATE_FIN}...',
      isActive: true,
      lastModified: '2024-01-10',
      modifiedBy: 'Admin'
    },
    {
      id: 'tpl-2',
      type: 'certificat',
      title: 'Modèle de certificat de réalisation',
      description: 'Template pour les certificats de réalisation',
      content: 'Il est certifié que {APPRENANT} a terminé avec succès la formation "{FORMATION}"...',
      isActive: true,
      lastModified: '2024-01-08',
      modifiedBy: 'Admin'
    },
    {
      id: 'tpl-3',
      type: 'convention',
      title: 'Modèle de convention de formation',
      description: 'Template standard pour les conventions',
      content: 'Convention de formation professionnelle entre l\'organisme et {APPRENANT}...',
      isActive: true,
      lastModified: '2024-01-05',
      modifiedBy: 'Admin'
    }
  ];

  // Suivi des envois
  const trackingRecords: TrackingRecord[] = [
    {
      id: 'tr-1',
      documentId: '1',
      documentTitle: 'Attestation de fin de formation - Marie Dupont',
      recipient: 'marie.dupont@email.com',
      sentAt: '2024-01-15 14:30',
      method: 'email',
      status: 'signed',
      openedAt: '2024-01-15 14:35',
      downloadedAt: '2024-01-15 14:40',
      signedAt: '2024-01-15 15:20'
    },
    {
      id: 'tr-2',
      documentId: '2',
      documentTitle: 'Certificat de réalisation - Jean Martin',
      recipient: 'jean.martin@email.com',
      sentAt: '2024-01-12 10:15',
      method: 'platform',
      status: 'downloaded',
      openedAt: '2024-01-12 10:20',
      downloadedAt: '2024-01-12 10:25'
    }
  ];

  // Règles d'automatisation
  const automationRules: AutomationRule[] = [
    {
      id: 'auto-1',
      name: 'Envoi automatique attestation fin de formation',
      trigger: 'formation_complete',
      documentType: 'attestation',
      isActive: true
    },
    {
      id: 'auto-2',
      name: 'Envoi convention à l\'inscription',
      trigger: 'enrollment',
      documentType: 'convention',
      isActive: true
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

  const handleViewDocument = (document: GeneratedDocument) => {
    setSelectedDocument(document);
    setShowViewDialog(true);
  };

  const handleEditTemplate = (template: TemplateDocument) => {
    setSelectedTemplate(template);
    setShowEditDialog(true);
  };

  const handleSendDocument = (document: GeneratedDocument) => {
    setSelectedDocument(document);
    setShowSendDialog(true);
  };

  const totalDocuments = generatedDocuments.length;
  const signedDocuments = generatedDocuments.filter(d => d.status === 'signed').length;
  const libraryDocuments = templateDocuments.length;
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
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="p-1"
                                onClick={() => handleViewDocument(doc)}
                              >
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

        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bibliothèque OF - Templates</CardTitle>
              <CardDescription>
                Templates et modèles de documents pour l'organisme de formation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templateDocuments.map((template) => {
                  const typeInfo = getTypeInfo(template.type);
                  return (
                    <Card key={template.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge className={typeInfo.color}>
                              {typeInfo.label.slice(0, -1)}
                            </Badge>
                            <div>
                              <h3 className="font-medium">{template.title}</h3>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={template.isActive ? "default" : "secondary"}>
                              {template.isActive ? "Actif" : "Inactif"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditTemplate(template)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Modifier
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Modifié le {template.lastModified} par {template.modifiedBy}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suivi des envois</CardTitle>
              <CardDescription>
                Tracking et historique des documents envoyés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Destinataire</TableHead>
                      <TableHead>Envoyé le</TableHead>
                      <TableHead>Méthode</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trackingRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="font-medium">{record.documentTitle}</div>
                        </TableCell>
                        <TableCell>{record.recipient}</TableCell>
                        <TableCell>{record.sentAt}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {record.method === 'email' && <Mail className="h-3 w-3 mr-1" />}
                            {record.method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {record.status}
                            </Badge>
                            {record.openedAt && (
                              <div className="text-xs text-gray-500">Ouvert: {record.openedAt}</div>
                            )}
                            {record.downloadedAt && (
                              <div className="text-xs text-gray-500">Téléchargé: {record.downloadedAt}</div>
                            )}
                            {record.signedAt && (
                              <div className="text-xs text-gray-500">Signé: {record.signedAt}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automatisation</CardTitle>
              <CardDescription>
                Paramètres d'automatisation de génération et d'envoi de documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {automationRules.map((rule) => (
                  <Card key={rule.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{rule.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">
                              Déclencheur: {rule.trigger}
                            </Badge>
                            <Badge variant="outline">
                              Document: {rule.documentType}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? "Actif" : "Inactif"}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Configurer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une nouvelle règle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de visualisation */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualisation du document</DialogTitle>
            <DialogDescription>
              {selectedDocument?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Type</Label>
                    <div className="font-medium">{selectedDocument.type}</div>
                  </div>
                  <div>
                    <Label>Formation</Label>
                    <div className="font-medium">{selectedDocument.formation}</div>
                  </div>
                  <div>
                    <Label>Apprenant</Label>
                    <div className="font-medium">{selectedDocument.apprenant}</div>
                  </div>
                  <div>
                    <Label>Code unique</Label>
                    <div className="font-mono text-sm bg-white px-2 py-1 rounded border">
                      {selectedDocument.uniqueCode}
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <Label>Contenu du document</Label>
                  <div className="bg-white p-4 rounded border mt-2 min-h-[200px] whitespace-pre-wrap">
                    {selectedDocument.content || 'Contenu du document à afficher ici...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition des templates */}
      {selectedTemplate && (
        <OFDocumentEditor
          document={selectedTemplate}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
        />
      )}

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
