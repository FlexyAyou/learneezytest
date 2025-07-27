import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Mail, 
  Key, 
  Zap,
  Download,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Camera,
  QrCode,
  CheckCircle,
  XCircle,
  Clock,
  Video,
  FileSignature,
  MessageSquare
} from 'lucide-react';

export const OFDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données mockées pour le dashboard OF
  const documentsOF = [
    { id: '1', type: 'Convention', title: 'Convention de formation React', status: 'completed', date: '2024-01-15', size: '2.3 MB' },
    { id: '2', type: 'Programme', title: 'Programme JavaScript Avancé', status: 'pending', date: '2024-01-14', size: '1.8 MB' },
    { id: '3', type: 'Attestation', title: 'Attestation de fin de formation', status: 'completed', date: '2024-01-13', size: '0.9 MB' },
    { id: '4', type: 'Émargement', title: 'Feuille d\'émargement Janvier', status: 'processing', date: '2024-01-12', size: '3.2 MB' },
  ];

  const apprenants = [
    { id: '1', nom: 'Dupont', prenom: 'Marie', email: 'marie.dupont@email.com', status: 'active', formation: 'React Avancé', progression: 78 },
    { id: '2', nom: 'Martin', prenom: 'Jean', email: 'jean.martin@email.com', status: 'completed', formation: 'JavaScript', progression: 100 },
    { id: '3', nom: 'Bernard', prenom: 'Sophie', email: 'sophie.bernard@email.com', status: 'pending', formation: 'Angular', progression: 45 },
    { id: '4', nom: 'Durand', prenom: 'Pierre', email: 'pierre.durand@email.com', status: 'active', formation: 'Vue.js', progression: 62 },
  ];

  const formations = [
    { id: '1', titre: 'Formation React Avancé', formateur: 'Sophie Bernard', debut: '2024-02-15', fin: '2024-03-15', participants: 12, status: 'active' },
    { id: '2', titre: 'Gestion de Projet Agile', formateur: 'Jean Martin', debut: '2024-02-20', fin: '2024-03-20', participants: 8, status: 'planning' },
    { id: '3', titre: 'Marketing Digital', formateur: 'Marie Dupont', debut: '2024-03-01', fin: '2024-04-01', participants: 15, status: 'completed' },
  ];

  const evaluations = [
    { id: '1', apprenant: 'Marie Dupont', formation: 'React Avancé', type: 'Quiz final', score: 85, maxScore: 100, date: '2024-01-14' },
    { id: '2', apprenant: 'Jean Martin', formation: 'JavaScript', type: 'TP pratique', score: 92, maxScore: 100, date: '2024-01-13' },
    { id: '3', apprenant: 'Sophie Bernard', formation: 'Angular', type: 'Evaluation continue', score: 76, maxScore: 100, date: '2024-01-12' },
  ];

  const logs = [
    { id: '1', type: 'connexion', utilisateur: 'Marie Dupont', ip: '192.168.1.10', timestamp: '2024-01-15 09:30:15', status: 'success' },
    { id: '2', type: 'camera', utilisateur: 'Jean Martin', ip: '192.168.1.11', timestamp: '2024-01-15 09:25:42', status: 'captured' },
    { id: '3', type: 'qr_verification', utilisateur: 'Sophie Bernard', ip: '192.168.1.12', timestamp: '2024-01-15 09:20:18', status: 'verified' },
    { id: '4', type: 'connexion', utilisateur: 'Pierre Durand', ip: '192.168.1.13', timestamp: '2024-01-15 09:15:33', status: 'failed' },
  ];

  const envois = [
    { id: '1', type: 'convocation', destinataire: 'marie.dupont@email.com', sujet: 'Convocation formation React', status: 'delivered', date: '2024-01-15 08:30:00' },
    { id: '2', type: 'relance', destinataire: 'jean.martin@email.com', sujet: 'Rappel émargement', status: 'pending', date: '2024-01-15 08:25:00' },
    { id: '3', type: 'attestation', destinataire: 'sophie.bernard@email.com', sujet: 'Attestation de formation', status: 'read', date: '2024-01-15 08:20:00' },
  ];

  const licences = [
    { id: '1', type: 'Zoom Pro', nombre: 50, utilises: 35, expires: '2024-06-30', status: 'active' },
    { id: '2', type: 'Microsoft Teams', nombre: 100, utilises: 78, expires: '2024-12-31', status: 'active' },
    { id: '3', type: 'Adobe Sign', nombre: 25, utilises: 25, expires: '2024-03-15', status: 'expired' },
    { id: '4', type: 'Moodle LMS', nombre: 200, utilises: 156, expires: '2024-09-30', status: 'active' },
  ];

  const integrations = [
    { id: '1', nom: 'Zoom API', type: 'Visioconférence', status: 'connected', lastSync: '2024-01-15 09:00:00' },
    { id: '2', nom: 'DocuSign', type: 'Signature électronique', status: 'connected', lastSync: '2024-01-15 08:45:00' },
    { id: '3', nom: 'Microsoft Teams', type: 'Communication', status: 'error', lastSync: '2024-01-14 16:30:00' },
    { id: '4', nom: 'Adobe Sign', type: 'Signature', status: 'disconnected', lastSync: '2024-01-10 12:00:00' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      completed: { variant: 'secondary' as const, label: 'Terminé' },
      pending: { variant: 'outline' as const, label: 'En attente' },
      processing: { variant: 'outline' as const, label: 'En cours' },
      planning: { variant: 'outline' as const, label: 'Planifié' },
      success: { variant: 'default' as const, label: 'Succès' },
      failed: { variant: 'destructive' as const, label: 'Échec' },
      delivered: { variant: 'default' as const, label: 'Livré' },
      read: { variant: 'secondary' as const, label: 'Lu' },
      expired: { variant: 'destructive' as const, label: 'Expiré' },
      connected: { variant: 'default' as const, label: 'Connecté' },
      error: { variant: 'destructive' as const, label: 'Erreur' },
      disconnected: { variant: 'outline' as const, label: 'Déconnecté' },
      captured: { variant: 'default' as const, label: 'Capturé' },
      verified: { variant: 'default' as const, label: 'Vérifié' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Organisme de Formation</h1>
          <p className="text-gray-600">Gestion complète de l'organisme de formation</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle action
        </Button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Documents générés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+23 cette semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Apprenants actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">+12 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Formations actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Taux de réussite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2% ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="apprenants">Apprenants</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
          <TabsTrigger value="evaluations">Suivi péda.</TabsTrigger>
          <TabsTrigger value="logs">Logs & Sécurité</TabsTrigger>
          <TabsTrigger value="envois">Envois</TabsTrigger>
          <TabsTrigger value="licences">Licences</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
        </TabsList>

        {/* Onglet Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Documents administratifs
                </span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Générer document
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un document..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="completed">Terminés</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En cours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentsOF.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Apprenants */}
        <TabsContent value="apprenants">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gestion des apprenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Formation</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apprenants.map((apprenant) => (
                    <TableRow key={apprenant.id}>
                      <TableCell className="font-medium">{apprenant.prenom} {apprenant.nom}</TableCell>
                      <TableCell>{apprenant.email}</TableCell>
                      <TableCell>{apprenant.formation}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${apprenant.progression}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{apprenant.progression}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(apprenant.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Formations */}
        <TabsContent value="formations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Gestion des formations
                </span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle formation
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Formateur</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formations.map((formation) => (
                    <TableRow key={formation.id}>
                      <TableCell className="font-medium">{formation.titre}</TableCell>
                      <TableCell>{formation.formateur}</TableCell>
                      <TableCell>{formation.debut} - {formation.fin}</TableCell>
                      <TableCell>{formation.participants}</TableCell>
                      <TableCell>{getStatusBadge(formation.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Suivi pédagogique */}
        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Suivi pédagogique et évaluations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apprenant</TableHead>
                    <TableHead>Formation</TableHead>
                    <TableHead>Type d'évaluation</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.apprenant}</TableCell>
                      <TableCell>{evaluation.formation}</TableCell>
                      <TableCell>{evaluation.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{evaluation.score}/{evaluation.maxScore}</span>
                          <Badge variant={evaluation.score >= 80 ? 'default' : evaluation.score >= 60 ? 'secondary' : 'destructive'}>
                            {Math.round((evaluation.score / evaluation.maxScore) * 100)}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{evaluation.date}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Logs & Sécurité */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Logs de sécurité et vérifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Adresse IP</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {log.type === 'connexion' && <Shield className="h-4 w-4" />}
                          {log.type === 'camera' && <Camera className="h-4 w-4" />}
                          {log.type === 'qr_verification' && <QrCode className="h-4 w-4" />}
                          <span className="capitalize">{log.type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{log.utilisateur}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Envois & Relances */}
        <TabsContent value="envois">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Historique des envois et relances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Destinataire</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date d'envoi</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {envois.map((envoi) => (
                    <TableRow key={envoi.id}>
                      <TableCell className="capitalize">{envoi.type}</TableCell>
                      <TableCell>{envoi.destinataire}</TableCell>
                      <TableCell className="font-medium">{envoi.sujet}</TableCell>
                      <TableCell>{getStatusBadge(envoi.status)}</TableCell>
                      <TableCell>{envoi.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Licences */}
        <TabsContent value="licences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Suivi des licences
                </span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle licence
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type de licence</TableHead>
                    <TableHead>Nombre total</TableHead>
                    <TableHead>Utilisées</TableHead>
                    <TableHead>Disponibles</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licences.map((licence) => (
                    <TableRow key={licence.id}>
                      <TableCell className="font-medium">{licence.type}</TableCell>
                      <TableCell>{licence.nombre}</TableCell>
                      <TableCell>{licence.utilises}</TableCell>
                      <TableCell>{licence.nombre - licence.utilises}</TableCell>
                      <TableCell>{licence.expires}</TableCell>
                      <TableCell>{getStatusBadge(licence.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Intégrations */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Intégrations tierces
                </span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle intégration
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière sync</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell className="font-medium">{integration.nom}</TableCell>
                      <TableCell>{integration.type}</TableCell>
                      <TableCell>{getStatusBadge(integration.status)}</TableCell>
                      <TableCell>{integration.lastSync}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {integration.status === 'connected' ? (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};