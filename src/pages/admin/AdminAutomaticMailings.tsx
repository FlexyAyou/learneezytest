import React, { useState } from 'react';
import { Mail, FileText, Clock, CheckCircle, XCircle, Eye, Download, Send, Play, Pause, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const AdminAutomaticMailings = () => {
  const [selectedMailing, setSelectedMailing] = useState<any>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [newMailing, setNewMailing] = useState({
    type: '',
    subject: '',
    content: '',
    trigger: '',
    delay: ''
  });
  const { toast } = useToast();

  const automaticMailings = [
    {
      id: '1',
      inscriptionId: 'ins-001',
      studentName: 'Alice Martin',
      studentEmail: 'alice.martin@email.com',
      courseName: 'Mathématiques CE2',
      type: 'programme',
      status: 'sent',
      sentAt: '2024-01-20T10:30:00Z',
      content: 'Programme de formation Mathématiques CE2',
      subject: 'Votre programme de formation',
      trigger: 'inscription_validated',
      delay: '0'
    },
    {
      id: '2',
      inscriptionId: 'ins-001',
      studentName: 'Alice Martin',
      studentEmail: 'alice.martin@email.com',
      courseName: 'Mathématiques CE2',
      type: 'reglement',
      status: 'sent',
      sentAt: '2024-01-20T10:35:00Z',
      content: 'Règlement intérieur de l\'organisme de formation',
      subject: 'Règlement intérieur',
      trigger: 'inscription_validated',
      delay: '2'
    },
    {
      id: '3',
      inscriptionId: 'ins-002',
      studentName: 'Bob Dupont',
      studentEmail: 'bob.dupont@email.com',
      courseName: 'Français CM1',
      type: 'convocation',
      status: 'pending',
      sentAt: null,
      content: 'Convocation avec lien visio et planning',
      subject: 'Convocation à votre formation',
      trigger: 'formation_start',
      delay: '48'
    },
    {
      id: '4',
      inscriptionId: 'ins-001',
      studentName: 'Alice Martin',
      studentEmail: 'alice.martin@email.com',
      courseName: 'Mathématiques CE2',
      type: 'satisfaction',
      status: 'failed',
      sentAt: null,
      content: 'Formulaire de satisfaction',
      subject: 'Évaluez votre formation',
      errorMessage: 'Adresse email invalide',
      trigger: 'formation_end',
      delay: '0'
    },
  ];

  const handleRetryMailing = (mailingId: string) => {
    console.log('Retry mailing:', mailingId);
    toast({
      title: "Renvoi en cours",
      description: "L'email est en cours de renvoi...",
    });
  };

  const handlePreviewEmail = (mailing: any) => {
    setSelectedMailing(mailing);
    setShowPreviewDialog(true);
  };

  const handleTestAutomation = () => {
    toast({
      title: "Test d'automatisation lancé",
      description: "Simulation des envois automatiques en cours...",
    });
    console.log('Test automation started');
  };

  const handleToggleAutomation = () => {
    setAutomationEnabled(!automationEnabled);
    toast({
      title: automationEnabled ? "Automatisation désactivée" : "Automatisation activée",
      description: automationEnabled ? "Les envois automatiques sont maintenant désactivés." : "Les envois automatiques sont maintenant activés.",
    });
  };

  const handleCreateMailing = () => {
    if (!newMailing.type || !newMailing.subject || !newMailing.content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    console.log('Création nouvel envoi automatique:', newMailing);
    toast({
      title: "Envoi automatique créé",
      description: "La nouvelle règle d'envoi a été configurée avec succès.",
    });
    
    setShowCreateDialog(false);
    setNewMailing({
      type: '',
      subject: '',
      content: '',
      trigger: '',
      delay: ''
    });
  };

  const handleEditMailing = (mailing: any) => {
    setSelectedMailing(mailing);
    setNewMailing({
      type: mailing.type,
      subject: mailing.subject,
      content: mailing.content,
      trigger: mailing.trigger,
      delay: mailing.delay
    });
    setShowConfigDialog(true);
  };

  const handleDeleteMailing = (mailingId: string) => {
    console.log('Suppression envoi:', mailingId);
    toast({
      title: "Envoi supprimé",
      description: "L'envoi automatique a été supprimé avec succès.",
    });
  };

  const handleSaveConfiguration = () => {
    console.log('Sauvegarde configuration:', newMailing);
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres d'envoi ont été mis à jour.",
    });
    setShowConfigDialog(false);
  };

  const handleDownloadReport = () => {
    console.log('Téléchargement rapport');
    toast({
      title: "Rapport en cours de génération",
      description: "Le rapport des envois automatiques est en cours de téléchargement.",
    });
  };

  const handleBulkAction = (action: string) => {
    console.log('Action groupée:', action);
    toast({
      title: "Action exécutée",
      description: `L'action "${action}" a été exécutée sur les éléments sélectionnés.`,
    });
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'programme': 'Programme',
      'reglement': 'Règlement',
      'cgv': 'CGV',
      'convocation': 'Convocation',
      'satisfaction': 'Satisfaction',
      'relance': 'Relance'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'programme': 'bg-blue-500',
      'reglement': 'bg-gray-500',
      'cgv': 'bg-purple-500',
      'convocation': 'bg-orange-500',
      'satisfaction': 'bg-teal-500',
      'relance': 'bg-yellow-500'
    };
    return (
      <Badge variant="default" className={colors[type as keyof typeof colors] || 'bg-gray-500'}>
        {getTypeLabel(type)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Envoyé</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Échec</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const stats = {
    total: automaticMailings.length,
    sent: automaticMailings.filter(m => m.status === 'sent').length,
    pending: automaticMailings.filter(m => m.status === 'pending').length,
    failed: automaticMailings.filter(m => m.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Envois Automatiques</h1>
          <p className="text-gray-600">Suivi des emails automatiques (programme, règlement, convocations...)</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Rapport
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel envoi
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total envois</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-sm text-gray-600">Envoyés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.failed}</p>
                <p className="text-sm text-gray-600">Échecs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuration de l'automatisation</CardTitle>
              <CardDescription>
                Activez/désactivez les envois automatiques et configurez les règles
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="automation-toggle">Automatisation</Label>
                <Switch 
                  id="automation-toggle"
                  checked={automationEnabled}
                  onCheckedChange={handleToggleAutomation}
                />
              </div>
              <Button variant="outline" onClick={handleTestAutomation}>
                <Play className="w-4 h-4 mr-2" />
                Tester
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Processus automatique :</h4>
            <div className="text-sm space-y-1">
              <p>1. ✅ Inscription validée → Envoi immédiat du programme de formation</p>
              <p>2. ✅ 2 minutes après → Envoi du règlement intérieur</p>
              <p>3. ✅ 5 minutes après → Envoi des CGV</p>
              <p>4. ⏳ 48h avant le début → Envoi de la convocation avec lien visio</p>
              <p>5. ⏳ Dernier jour de formation → Envoi du formulaire de satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des envois</CardTitle>
              <CardDescription>Suivi de tous les emails automatiques</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('retry')}>
                <Send className="w-4 h-4 mr-1" />
                Renvoyer la sélection
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer la sélection
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destinataire</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'envoi</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automaticMailings.map((mailing) => (
                <TableRow key={mailing.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{mailing.studentName}</p>
                      <p className="text-sm text-gray-600">{mailing.studentEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{mailing.courseName}</TableCell>
                  <TableCell>{getTypeBadge(mailing.type)}</TableCell>
                  <TableCell>{getStatusBadge(mailing.status)}</TableCell>
                  <TableCell>
                    {mailing.sentAt ? (
                      new Date(mailing.sentAt).toLocaleString('fr-FR')
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePreviewEmail(mailing)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditMailing(mailing)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      {mailing.status === 'failed' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleRetryMailing(mailing.id)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteMailing(mailing.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      {mailing.errorMessage && (
                        <div className="text-xs text-red-600">
                          {mailing.errorMessage}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aperçu de l'email</DialogTitle>
            <DialogDescription>
              {selectedMailing && `${getTypeLabel(selectedMailing.type)} - ${selectedMailing.studentName}`}
            </DialogDescription>
          </DialogHeader>
          {selectedMailing && (
            <div className="space-y-4">
              <div className="border rounded p-4 bg-gray-50">
                <div className="mb-4 text-sm">
                  <p><strong>À:</strong> {selectedMailing.studentEmail}</p>
                  <p><strong>Objet:</strong> {selectedMailing.subject}</p>
                </div>
                <div className="prose prose-sm">
                  <p>Bonjour {selectedMailing.studentName},</p>
                  <p>Suite à votre inscription à la formation "{selectedMailing.courseName}", vous trouverez en pièce jointe le document suivant : {selectedMailing.content}.</p>
                  
                  {selectedMailing.type === 'convocation' && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 my-4">
                      <p><strong>Informations de connexion :</strong></p>
                      <p>Lien visio : https://meet.example.com/formation-123</p>
                      <p>Date : 25/01/2024 à 09:00</p>
                      <p>Durée : 3 heures</p>
                    </div>
                  )}
                  
                  <p>Cordialement,<br/>L'équipe pédagogique</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => console.log('Download PDF')}>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le PDF
                </Button>
                {selectedMailing.status === 'failed' && (
                  <Button onClick={() => handleRetryMailing(selectedMailing.id)}>
                    <Send className="w-4 h-4 mr-2" />
                    Renvoyer
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouvel envoi automatique</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Type d'envoi *</Label>
              <Select value={newMailing.type} onValueChange={(value) => setNewMailing({...newMailing, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programme">Programme</SelectItem>
                  <SelectItem value="reglement">Règlement</SelectItem>
                  <SelectItem value="cgv">CGV</SelectItem>
                  <SelectItem value="convocation">Convocation</SelectItem>
                  <SelectItem value="satisfaction">Satisfaction</SelectItem>
                  <SelectItem value="relance">Relance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="subject">Objet de l'email *</Label>
              <Input
                id="subject"
                value={newMailing.subject}
                onChange={(e) => setNewMailing({...newMailing, subject: e.target.value})}
                placeholder="Ex: Votre programme de formation"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={newMailing.content}
                onChange={(e) => setNewMailing({...newMailing, content: e.target.value})}
                placeholder="Contenu de l'email..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="trigger">Déclencheur</Label>
              <Select value={newMailing.trigger} onValueChange={(value) => setNewMailing({...newMailing, trigger: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un déclencheur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inscription_validated">Inscription validée</SelectItem>
                  <SelectItem value="formation_start">Début de formation</SelectItem>
                  <SelectItem value="formation_end">Fin de formation</SelectItem>
                  <SelectItem value="manual">Manuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="delay">Délai (en heures)</Label>
              <Input
                id="delay"
                type="number"
                value={newMailing.delay}
                onChange={(e) => setNewMailing({...newMailing, delay: e.target.value})}
                placeholder="0"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateMailing}>
                Créer l'envoi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurer l'envoi automatique</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="configSubject">Objet de l'email</Label>
              <Input
                id="configSubject"
                value={newMailing.subject}
                onChange={(e) => setNewMailing({...newMailing, subject: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="configContent">Contenu</Label>
              <Textarea
                id="configContent"
                value={newMailing.content}
                onChange={(e) => setNewMailing({...newMailing, content: e.target.value})}
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="configTrigger">Déclencheur</Label>
              <Select value={newMailing.trigger} onValueChange={(value) => setNewMailing({...newMailing, trigger: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inscription_validated">Inscription validée</SelectItem>
                  <SelectItem value="formation_start">Début de formation</SelectItem>
                  <SelectItem value="formation_end">Fin de formation</SelectItem>
                  <SelectItem value="manual">Manuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="configDelay">Délai (en heures)</Label>
              <Input
                id="configDelay"
                type="number"
                value={newMailing.delay}
                onChange={(e) => setNewMailing({...newMailing, delay: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveConfiguration}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAutomaticMailings;
