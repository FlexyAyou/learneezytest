import React, { useState } from 'react';
import { Mail, FileText, Clock, CheckCircle, XCircle, Eye, Download, Send, Play, Pause, Settings, Plus, Edit, Trash2, BarChart3, Users, Zap, Brain, Calendar, Filter } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailTemplateEditor } from '@/components/admin/EmailTemplateEditor';
import { WorkflowAutomation } from '@/components/admin/WorkflowAutomation';
import { EmailAnalytics } from '@/components/admin/EmailAnalytics';

const AdminAutomaticMailings = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMailing, setSelectedMailing] = useState<any>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [aiOptimizationEnabled, setAiOptimizationEnabled] = useState(true);
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

  // Données mockées pour les nouvelles fonctionnalités
  const emailTemplates = [
    {
      id: '1',
      name: 'Email de bienvenue',
      type: 'welcome',
      subject: 'Bienvenue {{firstName}} !',
      content: 'Bonjour {{firstName}}, bienvenue dans votre formation {{courseName}}...',
      variables: ['firstName', 'courseName'],
      isActive: true
    },
    {
      id: '2',
      name: 'Rappel de session',
      type: 'reminder',
      subject: 'Rappel: Session {{courseName}} demain',
      content: 'N\'oubliez pas votre session {{courseName}} prévue le {{startDate}}...',
      variables: ['courseName', 'startDate'],
      isActive: true
    }
  ];

  const workflows = [
    {
      id: '1',
      name: 'Parcours d\'inscription complète',
      trigger: 'inscription',
      isActive: true,
      steps: [
        { id: '1', templateId: '1', delay: 0 },
        { id: '2', templateId: '2', delay: 24 }
      ],
      stats: { sent: 156, opened: 89, clicked: 34 }
    },
    {
      id: '2',
      name: 'Relance inactivité',
      trigger: 'inactivity',
      isActive: false,
      steps: [
        { id: '3', templateId: '3', delay: 72 }
      ],
      stats: { sent: 45, opened: 12, clicked: 3 }
    }
  ];

  const analyticsData = {
    overview: {
      totalSent: 2345,
      totalOpened: 1456,
      totalClicked: 234,
      totalBounced: 45,
      openRate: 62.1,
      clickRate: 16.1,
      bounceRate: 1.9
    },
    campaigns: [
      {
        id: '1',
        name: 'Bienvenue nouveaux étudiants',
        type: 'welcome',
        sent: 156,
        opened: 89,
        clicked: 34,
        openRate: 57.1,
        clickRate: 21.8
      },
      {
        id: '2',
        name: 'Rappels de sessions',
        type: 'reminder',
        sent: 234,
        opened: 178,
        clicked: 45,
        openRate: 76.1,
        clickRate: 19.2
      }
    ],
    trends: [
      { date: '01/01', sent: 45, opened: 28, clicked: 8 },
      { date: '02/01', sent: 52, opened: 34, clicked: 12 },
      { date: '03/01', sent: 38, opened: 25, clicked: 7 },
      { date: '04/01', sent: 67, opened: 45, clicked: 15 },
      { date: '05/01', sent: 59, opened: 38, clicked: 11 }
    ],
    segmentPerformance: [
      { segment: 'Nouveaux étudiants', sent: 156, openRate: 65, clickRate: 22 },
      { segment: 'Étudiants actifs', sent: 234, openRate: 58, clickRate: 18 },
      { segment: 'Étudiants inactifs', sent: 89, openRate: 34, clickRate: 8 }
    ]
  };

  const segments = [
    { id: '1', name: 'Nouveaux étudiants', count: 156, criteria: 'Inscrit < 7 jours' },
    { id: '2', name: 'Étudiants actifs', count: 234, criteria: 'Connexion < 3 jours' },
    { id: '3', name: 'Étudiants inactifs', count: 89, criteria: 'Pas de connexion > 14 jours' },
    { id: '4', name: 'Certificats expirants', count: 23, criteria: 'Certificat expire < 30 jours' }
  ];

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplateEditor(true);
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleSaveTemplate = (template: any) => {
    console.log('Sauvegarde template:', template);
    toast({
      title: "Template sauvegardé",
      description: "Le template a été enregistré avec succès.",
    });
  };

  const handleToggleWorkflow = (workflowId: string) => {
    console.log('Toggle workflow:', workflowId);
    toast({
      title: "Workflow mis à jour",
      description: "Le statut du workflow a été modifié.",
    });
  };

  const handleEditWorkflow = (workflow: any) => {
    console.log('Edit workflow:', workflow);
    toast({
      title: "Workflow sauvegardé",
      description: "Les modifications ont été enregistrées.",
    });
  };

  const handleCreateWorkflow = () => {
    console.log('Create new workflow');
    toast({
      title: "Nouveau workflow créé",
      description: "Le workflow a été configuré avec succès.",
    });
  };

  const handleBulkSend = () => {
    toast({
      title: "Envoi groupé lancé",
      description: "Les emails sont en cours d'envoi...",
    });
  };

  const handleAIOptimization = () => {
    toast({
      title: "Optimisation IA activée",
      description: "Les contenus seront optimisés automatiquement.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centre d'Email Marketing</h1>
          <p className="text-gray-600">Automatisation intelligente des communications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleBulkSend}>
            <Send className="w-4 h-4 mr-2" />
            Envoi groupé
          </Button>
          <Button onClick={handleCreateTemplate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau template
          </Button>
        </div>
      </div>

      {/* Configuration globale */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuration intelligente</CardTitle>
              <CardDescription>
                Paramètres d'automatisation et d'optimisation IA
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="ai-optimization">Optimisation IA</Label>
                <Switch 
                  id="ai-optimization"
                  checked={aiOptimizationEnabled}
                  onCheckedChange={setAiOptimizationEnabled}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="automation-toggle">Automatisation</Label>
                <Switch 
                  id="automation-toggle"
                  checked={automationEnabled}
                  onCheckedChange={setAutomationEnabled}
                />
              </div>
              <Button variant="outline" onClick={handleAIOptimization}>
                <Brain className="w-4 h-4 mr-2" />
                Optimiser avec IA
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-500" />
              Fonctionnalités intelligentes activées :
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p>✅ Optimisation automatique des objets</p>
                <p>✅ Personnalisation basée sur l'engagement</p>
                <p>✅ Meilleur moment d'envoi prédictif</p>
              </div>
              <div className="space-y-1">
                <p>✅ Segmentation automatique avancée</p>
                <p>✅ Tests A/B automatisés</p>
                <p>✅ Analyse prédictive des abandons</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Segments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistiques globales */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.overview.totalSent.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Emails envoyés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Eye className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.overview.openRate}%</p>
                    <p className="text-sm text-gray-600">Taux d'ouverture</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Send className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{analyticsData.overview.clickRate}%</p>
                    <p className="text-sm text-gray-600">Taux de clic</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{workflows.filter(w => w.isActive).length}</p>
                    <p className="text-sm text-gray-600">Workflows actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col" onClick={handleCreateTemplate}>
                  <Plus className="w-6 h-6 mb-2" />
                  Créer un template
                </Button>
                <Button variant="outline" className="h-20 flex flex-col" onClick={handleCreateWorkflow}>
                  <Zap className="w-6 h-6 mb-2" />
                  Nouveau workflow
                </Button>
                <Button variant="outline" className="h-20 flex flex-col" onClick={handleBulkSend}>
                  <Send className="w-6 h-6 mb-2" />
                  Envoi groupé
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Bibliothèque de templates</h3>
            <Button onClick={handleCreateTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau template
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emailTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {template.type}
                      </Badge>
                    </div>
                    <Switch checked={template.isActive} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.variables.map(variable => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button size="sm" variant="outline" onClick={() => {
                      setSelectedTemplate(template);
                      setShowPreviewDialog(true);
                    }}>
                      <Eye className="w-3 h-3 mr-1" />
                      Aperçu
                    </Button>
                    <Button size="sm" onClick={() => handleEditTemplate(template)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <WorkflowAutomation
            workflows={workflows}
            onToggleWorkflow={handleToggleWorkflow}
            onEditWorkflow={handleEditWorkflow}
            onCreateWorkflow={handleCreateWorkflow}
          />
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Segments d'audience</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau segment
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {segments.map((segment) => (
              <Card key={segment.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium">{segment.name}</CardTitle>
                    <Badge variant="secondary">{segment.count} utilisateurs</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{segment.criteria}</p>
                  <div className="flex justify-between">
                    <Button size="sm" variant="outline">
                      <Filter className="w-3 h-3 mr-1" />
                      Filtrer
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="w-3 h-3 mr-1" />
                      Envoyer email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <EmailAnalytics data={analyticsData} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des envois</CardTitle>
              <CardDescription>Suivi de tous les emails automatiques</CardDescription>
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
                            onClick={() => {
                              setSelectedMailing(mailing);
                              setShowPreviewDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedTemplate({
                                id: mailing.id,
                                name: mailing.subject,
                                type: mailing.type,
                                subject: mailing.subject,
                                content: mailing.content,
                                variables: [],
                                isActive: true
                              });
                              setShowTemplateEditor(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          {mailing.status === 'failed' && (
                            <Button 
                              size="sm" 
                              onClick={() => {
                                toast({
                                  title: "Renvoi en cours",
                                  description: "L'email est en cours de renvoi...",
                                });
                              }}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Envoi supprimé",
                                description: "L'envoi automatique a été supprimé avec succès.",
                              });
                            }}
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
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EmailTemplateEditor
        template={selectedTemplate}
        isOpen={showTemplateEditor}
        onClose={() => setShowTemplateEditor(false)}
        onSave={handleSaveTemplate}
      />

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
                  <Button onClick={() => {
                    toast({
                      title: "Renvoi en cours",
                      description: "L'email est en cours de renvoi...",
                    });
                  }}>
                    <Send className="w-4 h-4 mr-2" />
                    Renvoyer
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAutomaticMailings;
