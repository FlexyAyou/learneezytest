import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, Plus, Send, Search, Eye, Edit, Download, Upload,
  UserPlus, BookOpen, Award, Clock, CheckCircle, 
  AlertCircle, Mail, FileSignature, Sparkles, Users, File, Trash2
} from 'lucide-react';
import { DocumentTemplateEditor } from './DocumentTemplateEditor';
import { PhaseDocumentSender } from './PhaseDocumentSender';
import { DEFAULT_TEMPLATES } from './defaultTemplates';
import { 
  DocumentTemplate, DocumentPhase, DocumentType, Learner, Formation, OF,
  PHASES_CONFIG, DOCUMENT_TYPE_LABELS
} from './types';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockLearners: Learner[] = [
  { id: '1', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@email.com', phone: '06 12 34 56 78', formationId: '1', formationName: 'React Avancé', enrollmentDate: '2024-01-01', company: 'TechCorp', city: 'Paris', postalCode: '75001', address: '12 rue de la Formation' },
  { id: '2', firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@email.com', phone: '06 98 76 54 32', formationId: '1', formationName: 'React Avancé', enrollmentDate: '2024-01-02', company: 'StartupXYZ', city: 'Lyon', postalCode: '69001', address: '5 place Bellecour' },
  { id: '3', firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@email.com', phone: '06 55 44 33 22', formationId: '2', formationName: 'Vue.js Débutant', enrollmentDate: '2024-01-03', company: 'DigitalAgency', city: 'Marseille', postalCode: '13001', address: '8 cours Julien' },
];

const mockFormations: Formation[] = [
  { id: '1', name: 'React Avancé', description: 'Formation approfondie React', duration: '35 heures', startDate: '2024-02-01', endDate: '2024-02-05', location: 'Paris', trainer: 'Jean Martin', price: 2500 },
  { id: '2', name: 'Vue.js Débutant', description: 'Initiation à Vue.js', duration: '21 heures', startDate: '2024-02-10', endDate: '2024-02-12', location: 'Lyon', trainer: 'Sophie Durand', price: 1800 },
];

const mockOF: OF = {
  name: 'FormaPro',
  siret: '123 456 789 00010',
  nda: '11 75 12345 67',
  address: '1 avenue de la Formation',
  city: 'Paris',
  postalCode: '75008',
  phone: '01 23 45 67 89',
  email: 'contact@formapro.fr',
  responsable: 'Pierre Durant'
};

const phaseIcons = {
  inscription: UserPlus,
  formation: BookOpen,
  'post-formation': Award,
  suivi: Clock
};

export const OFDocumentsAdvanced: React.FC = () => {
  const [activePhase, setActivePhase] = useState<DocumentPhase>('inscription');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showPhaseSender, setShowPhaseSender] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadPhase, setUploadPhase] = useState<DocumentPhase>('inscription');
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ id: string; title: string; phase: DocumentPhase; fileName: string; uploadedAt: string; fileSize: string }>>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    // Phase Inscription
    { id: '1', type: 'analyse_besoin', phase: 'inscription', title: 'Analyse du besoin', description: 'Formulaire d\'évaluation préalable du besoin de formation', htmlContent: DEFAULT_TEMPLATES.analyse_besoin || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', type: 'test_positionnement', phase: 'inscription', title: 'Test de positionnement', description: 'Évaluation du niveau initial de l\'apprenant', htmlContent: DEFAULT_TEMPLATES.test_positionnement || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '3', type: 'convention', phase: 'inscription', title: 'Convention de formation', description: 'Convention tripartite de formation professionnelle', htmlContent: DEFAULT_TEMPLATES.convention || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // Phase Formation
    { id: '4', type: 'convocation', phase: 'formation', title: 'Convocation', description: 'Convocation à la session de formation', htmlContent: DEFAULT_TEMPLATES.convocation || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '5', type: 'programme', phase: 'formation', title: 'Programme de formation', description: 'Programme détaillé de la formation', htmlContent: DEFAULT_TEMPLATES.programme || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '6', type: 'cgv', phase: 'formation', title: 'Conditions Générales de Vente', description: 'CGV à signer par l\'apprenant', htmlContent: DEFAULT_TEMPLATES.cgv || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '7', type: 'reglement_interieur', phase: 'formation', title: 'Règlement intérieur', description: 'Règlement intérieur applicable aux stagiaires', htmlContent: DEFAULT_TEMPLATES.reglement_interieur || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '8', type: 'attestation_honneur', phase: 'formation', title: 'Attestation sur l\'honneur (CPF)', description: 'Attestation sur l\'honneur pour les formations financées par le CPF', htmlContent: DEFAULT_TEMPLATES.attestation_honneur || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // Phase Post-formation
    { id: '9', type: 'test_sortie', phase: 'post-formation', title: 'Test de sortie', description: 'Évaluation des acquis en fin de formation', htmlContent: DEFAULT_TEMPLATES.test_sortie || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '10', type: 'satisfaction_chaud', phase: 'post-formation', title: 'Questionnaire de satisfaction à chaud', description: 'Évaluation de la satisfaction immédiate', htmlContent: DEFAULT_TEMPLATES.satisfaction_chaud || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '11', type: 'certificat', phase: 'post-formation', title: 'Certificat de réalisation', description: 'Certificat attestant la réalisation de la formation', htmlContent: DEFAULT_TEMPLATES.certificat || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '12', type: 'emargement', phase: 'post-formation', title: 'Attestation de réalisation (émargements)', description: 'Feuille d\'émargement attestant la présence', htmlContent: DEFAULT_TEMPLATES.emargement || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // Phase +3 mois
    { id: '13', type: 'satisfaction_froid', phase: 'suivi', title: 'Questionnaire à froid', description: 'Évaluation de l\'impact à +3 mois', htmlContent: DEFAULT_TEMPLATES.satisfaction_froid || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ]);
  const [showUploadSendDialog, setShowUploadSendDialog] = useState(false);
  const [uploadDocToSend, setUploadDocToSend] = useState<string | null>(null);
  const [selectedLearnersForUpload, setSelectedLearnersForUpload] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCreateTemplate = () => {
    // Pre-set phase to active phase for new template
    setSelectedTemplate({
      id: '',
      type: PHASES_CONFIG[activePhase].documents[0] as DocumentType || 'convention',
      phase: activePhase,
      title: '',
      description: '',
      htmlContent: '',
      requiresSignature: false,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    } as DocumentTemplate);
    setShowEditor(true);
  };

  const handleEditTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setShowEditor(true);
  };

  const handleSaveTemplate = (template: any) => {
    if (template.id) {
      setTemplates(prev => prev.map(t => t.id === template.id ? { ...t, ...template } : t));
    } else {
      const newTemplate: DocumentTemplate = {
        ...template,
        id: `t-${Date.now()}`,
        description: template.description || template.title,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setShowEditor(false);
  };

  const handleSendPhaseDocuments = () => {
    setShowPhaseSender(true);
  };

  const handleDocumentsSent = (docs: any[]) => {
    toast({ title: 'Documents envoyés', description: `${docs.length} document(s) envoyé(s). Consultez la gestion des émargements.` });
  };

  const openUploadDialog = () => {
    setUploadPhase(activePhase);
    setUploadTitle('');
    setUploadFile(null);
    setShowUploadDialog(true);
  };

  const handleUploadDocument = () => {
    if (!uploadFile || !uploadTitle.trim()) {
      toast({ title: 'Champs requis', description: 'Veuillez saisir un titre et sélectionner un fichier.', variant: 'destructive' });
      return;
    }
    const sizeStr = uploadFile.size > 1024 * 1024
      ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} Mo`
      : `${(uploadFile.size / 1024).toFixed(0)} Ko`;
    setUploadedDocuments(prev => [...prev, {
      id: `up-${Date.now()}`,
      title: uploadTitle.trim(),
      phase: uploadPhase,
      fileName: uploadFile.name,
      uploadedAt: new Date().toISOString(),
      fileSize: sizeStr,
    }]);
    toast({ title: 'Document uploadé', description: `"${uploadTitle}" ajouté à la phase ${PHASES_CONFIG[uploadPhase].label}` });
    setUploadFile(null);
    setUploadTitle('');
    setShowUploadDialog(false);
  };

  const handleOpenUploadSend = (docId: string) => {
    setUploadDocToSend(docId);
    setSelectedLearnersForUpload([]);
    setShowUploadSendDialog(true);
  };

  const handleSendUploadedDocument = () => {
    const doc = uploadedDocuments.find(d => d.id === uploadDocToSend);
    if (!doc || selectedLearnersForUpload.length === 0) return;
    toast({ title: 'Document envoyé', description: `"${doc.title}" envoyé à ${selectedLearnersForUpload.length} apprenant(s). Consultez la gestion des émargements.` });
    setShowUploadSendDialog(false);
    setUploadDocToSend(null);
    setSelectedLearnersForUpload([]);
  };

  const toggleLearnerForUpload = (learnerId: string) => {
    setSelectedLearnersForUpload(prev =>
      prev.includes(learnerId) ? prev.filter(id => id !== learnerId) : [...prev, learnerId]
    );
  };

  const phaseTemplates = templates.filter(t => t.phase === activePhase);
  const filteredTemplates = phaseTemplates.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'outline'; label: string }> = {
      sent: { variant: 'default', label: 'Envoyé' },
      signed: { variant: 'default', label: 'Signé' },
      read: { variant: 'secondary', label: 'Lu' },
      pending: { variant: 'outline', label: 'En attente' }
    };
    const c = config[status] || config.pending;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Documents</h1>
          <p className="text-muted-foreground">Personnalisation et envoi de documents par phase de formation</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" asChild>
            <Link to="/dashboard/organisme-formation/emargements">
              <Users className="h-4 w-4 mr-2" />
              Gestion des Émargements
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/organisme-formation/programmes">
              <BookOpen className="h-4 w-4 mr-2" />
              Bibliothèque des Programmes
            </Link>
          </Button>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau modèle
          </Button>
        </div>
      </div>

      {/* Phase Tabs */}
      <Tabs value={activePhase} onValueChange={(v) => setActivePhase(v as DocumentPhase)}>
        <TabsList className="grid grid-cols-4 w-full">
          {(Object.entries(PHASES_CONFIG) as [DocumentPhase, typeof PHASES_CONFIG.inscription][]).map(([phase, config]) => {
            const Icon = phaseIcons[phase];
            const count = templates.filter(t => t.phase === phase).length;
            return (
              <TabsTrigger key={phase} value={phase} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.label}</span>
                <Badge variant="secondary" className="ml-1">{count}</Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(Object.keys(PHASES_CONFIG) as DocumentPhase[]).map((phase) => (
          <TabsContent key={phase} value={phase} className="space-y-4 mt-4">
            {/* Search + Actions */}
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Rechercher un modèle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline" onClick={openUploadDialog}>
                <Upload className="h-4 w-4 mr-2" />
                Uploader un document
              </Button>
              <Button onClick={handleSendPhaseDocuments}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer les documents
              </Button>
            </div>

            {/* Templates Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Modèles de documents
                </CardTitle>
                <CardDescription>{PHASES_CONFIG[phase].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Signature</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <div className="font-medium">{template.title}</div>
                          <div className="text-sm text-muted-foreground">{template.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{DOCUMENT_TYPE_LABELS[template.type]}</Badge>
                        </TableCell>
                        <TableCell>
                          {template.requiresSignature ? (
                            <Badge variant="secondary"><FileSignature className="h-3 w-3 mr-1" />Requise</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={template.isActive ? 'default' : 'outline'}>
                            {template.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={handleSendPhaseDocuments}>
                              <Send className="h-4 w-4 mr-1" />
                              Envoyer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTemplates.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun modèle pour cette phase
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Uploaded Documents */}
            {uploadedDocuments.filter(d => d.phase === phase).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Documents uploadés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Fichier</TableHead>
                        <TableHead>Taille</TableHead>
                        <TableHead>Uploadé le</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedDocuments.filter(d => d.phase === phase).map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <File className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">{doc.fileName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{doc.fileSize}</TableCell>
                          <TableCell>{new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleOpenUploadSend(doc.id)}>
                                <Send className="h-4 w-4 mr-1" />
                                Envoyer
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  setUploadedDocuments(prev => prev.filter(d => d.id !== doc.id));
                                  toast({ title: 'Document supprimé' });
                                }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

          </TabsContent>
        ))}
      </Tabs>

      {/* Editor Modal */}
      {showEditor && (
        <div 
          className="fixed inset-0 z-50 bg-background"
          style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="p-6" style={{ minHeight: '100vh' }}>
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-background py-2 z-10">
              <h2 className="text-xl font-semibold">Éditeur de modèle</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowEditor(false)}>
                Fermer
              </Button>
            </div>
            <DocumentTemplateEditor
              template={selectedTemplate || undefined}
              onSave={handleSaveTemplate}
              onCancel={() => setShowEditor(false)}
            />
          </div>
        </div>
      )}

      {/* Phase Document Sender */}
      <PhaseDocumentSender
        isOpen={showPhaseSender}
        onClose={() => setShowPhaseSender(false)}
        phase={activePhase}
        templates={phaseTemplates}
        learners={mockLearners}
        formations={mockFormations}
        ofInfo={mockOF}
        onSend={handleDocumentsSent}
      />

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Uploader un document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre du document</label>
              <Input
                placeholder="Ex: Programme React Avancé"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phase associée</label>
              <Select value={uploadPhase} onValueChange={(v) => setUploadPhase(v as DocumentPhase)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PHASES_CONFIG) as [DocumentPhase, typeof PHASES_CONFIG.inscription][]).map(([phase, config]) => (
                    <SelectItem key={phase} value={phase}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fichier (PDF, Word, Image)</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('of-upload-doc-input')?.click()}
              >
                {uploadFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <File className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{uploadFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(uploadFile.size / 1024).toFixed(0)} Ko)
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Cliquez pour sélectionner un fichier</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PNG, JPG — max 20 Mo</p>
                  </>
                )}
              </div>
              <input
                id="of-upload-doc-input"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Annuler</Button>
            <Button onClick={handleUploadDocument} disabled={!uploadFile || !uploadTitle.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Uploader
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Upload Send Dialog */}
      <Dialog open={showUploadSendDialog} onOpenChange={setShowUploadSendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Envoyer le document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {uploadDocToSend && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">
                    {uploadedDocuments.find(d => d.id === uploadDocToSend)?.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadedDocuments.find(d => d.id === uploadDocToSend)?.fileName}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sélectionner les apprenants</label>
              <div className="border rounded-lg divide-y max-h-60 overflow-auto">
                {mockLearners.map(learner => (
                  <label key={learner.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLearnersForUpload.includes(learner.id)}
                      onChange={() => toggleLearnerForUpload(learner.id)}
                      className="rounded border-input"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{learner.firstName} {learner.lastName}</div>
                      <div className="text-xs text-muted-foreground">{learner.email}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">{learner.formationName}</Badge>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadSendDialog(false)}>Annuler</Button>
            <Button onClick={handleSendUploadedDocument} disabled={selectedLearnersForUpload.length === 0}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer à {selectedLearnersForUpload.length} apprenant(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OFDocumentsAdvanced;
