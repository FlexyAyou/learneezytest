import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import {
  useDocumentTemplates,
  useCreateDocumentTemplate,
  useUpdateDocumentTemplate,
  useDeleteDocumentTemplate,
  useSendDocumentsBulk,
  useUploadedDocuments,
  useUploadDocument,
  useDeleteUploadedDocument,
  useSendUploadedDocument,
} from '@/hooks/useDocuments';
import { useOFUsers } from '@/hooks/useApi';
import { useOrganization as useOrganizationContext } from '@/contexts/OrganizationContext';

const phaseIcons = {
  inscription: UserPlus,
  formation: BookOpen,
  'post-formation': Award,
  suivi: Clock
};

export const OFDocumentsAdvanced: React.FC = () => {
  const { user } = useFastAPIAuth();
  const ofId = user?.of_id;

  // ============= API HOOKS =============
  const { data: apiTemplates, isLoading: templatesLoading } = useDocumentTemplates(ofId);
  const createTemplateMutation = useCreateDocumentTemplate(ofId);
  const updateTemplateMutation = useUpdateDocumentTemplate(ofId);
  const deleteTemplateMutation = useDeleteDocumentTemplate(ofId);
  const { data: apiUploadedDocs } = useUploadedDocuments(ofId);
  const uploadDocMutation = useUploadDocument(ofId);
  const deleteUploadedDocMutation = useDeleteUploadedDocument(ofId);
  const sendUploadedDocMutation = useSendUploadedDocument(ofId);
  const sendBulkMutation = useSendDocumentsBulk(ofId);
  const { data: apiOFUsers } = useOFUsers(ofId);
  const { organization: orgCtx } = useOrganizationContext();

  // Map API users to Learner format
  const learners: Learner[] = useMemo(() => {
    if (!apiOFUsers || apiOFUsers.length === 0) return [];
    return apiOFUsers
      .filter((u: any) => ['student', 'apprenant', 'learner'].includes(u.role))
      .map((u: any) => ({
        id: String(u.id),
        firstName: u.first_name || '',
        lastName: u.last_name || '',
        email: u.email,
        phone: u.phone,
        formationId: '',
        formationName: '',
        enrollmentDate: u.created_at || '',
        company: '',
        city: '',
        postalCode: '',
        address: u.address || '',
      }));
  }, [apiOFUsers]);

  // Map API org to OF format
  const ofInfo: OF = useMemo(() => ({
    name: orgCtx?.organizationName || '',
    siret: '',
    nda: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    responsable: '',
    website: undefined,
  }), [orgCtx]);

  // Formations vides — à connecter à l'API formations quand disponible
  const formations: Formation[] = useMemo(() => [], []);

  const [activePhase, setActivePhase] = useState<DocumentPhase>('inscription');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showPhaseSender, setShowPhaseSender] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadPhase, setUploadPhase] = useState<DocumentPhase>('inscription');
  const [showUploadSendDialog, setShowUploadSendDialog] = useState(false);
  const [uploadDocToSend, setUploadDocToSend] = useState<string | null>(null);
  const [selectedLearnersForUpload, setSelectedLearnersForUpload] = useState<string[]>([]);
  const { toast } = useToast();

  // ============= TEMPLATES (API with fallback) =============
  const templates: DocumentTemplate[] = useMemo(() => {
    if (apiTemplates && apiTemplates.length > 0) {
      return apiTemplates.map((t: any) => ({
        id: String(t.id),
        type: t.type as DocumentType,
        phase: t.phase as DocumentPhase,
        title: t.title,
        description: t.description || '',
        htmlContent: t.html_content || '',
        requiresSignature: t.requires_signature || false,
        isActive: t.is_active !== false,
        createdAt: t.created_at || '',
        updatedAt: t.updated_at || '',
      }));
    }
    // Fallback: default templates
    return [
      { id: '1', type: 'analyse_besoin' as DocumentType, phase: 'inscription' as DocumentPhase, title: 'Analyse du besoin', description: 'Formulaire d\'évaluation préalable du besoin de formation', htmlContent: DEFAULT_TEMPLATES.analyse_besoin || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', type: 'test_positionnement' as DocumentType, phase: 'inscription' as DocumentPhase, title: 'Test de positionnement', description: 'Évaluation du niveau initial de l\'apprenant', htmlContent: DEFAULT_TEMPLATES.test_positionnement || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', type: 'convention' as DocumentType, phase: 'inscription' as DocumentPhase, title: 'Convention de formation', description: 'Convention tripartite de formation professionnelle', htmlContent: DEFAULT_TEMPLATES.convention || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '4', type: 'convocation' as DocumentType, phase: 'formation' as DocumentPhase, title: 'Convocation', description: 'Convocation à la session de formation', htmlContent: DEFAULT_TEMPLATES.convocation || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '5', type: 'programme' as DocumentType, phase: 'formation' as DocumentPhase, title: 'Programme de formation', description: 'Programme détaillé de la formation', htmlContent: DEFAULT_TEMPLATES.programme || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '6', type: 'cgv' as DocumentType, phase: 'formation' as DocumentPhase, title: 'Conditions Générales de Vente', description: 'CGV à signer par l\'apprenant', htmlContent: DEFAULT_TEMPLATES.cgv || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '7', type: 'reglement_interieur' as DocumentType, phase: 'formation' as DocumentPhase, title: 'Règlement intérieur', description: 'Règlement intérieur applicable aux stagiaires', htmlContent: DEFAULT_TEMPLATES.reglement_interieur || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '8', type: 'attestation_honneur' as DocumentType, phase: 'formation' as DocumentPhase, title: 'Attestation sur l\'honneur (CPF)', description: 'Attestation sur l\'honneur pour les formations financées par le CPF', htmlContent: DEFAULT_TEMPLATES.attestation_honneur || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '9', type: 'test_sortie' as DocumentType, phase: 'post-formation' as DocumentPhase, title: 'Test de sortie', description: 'Évaluation des acquis en fin de formation', htmlContent: DEFAULT_TEMPLATES.test_sortie || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '10', type: 'satisfaction_chaud' as DocumentType, phase: 'post-formation' as DocumentPhase, title: 'Questionnaire de satisfaction à chaud', description: 'Évaluation de la satisfaction immédiate', htmlContent: DEFAULT_TEMPLATES.satisfaction_chaud || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '11', type: 'certificat' as DocumentType, phase: 'post-formation' as DocumentPhase, title: 'Certificat de réalisation', description: 'Certificat attestant la réalisation de la formation', htmlContent: DEFAULT_TEMPLATES.certificat || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '12', type: 'emargement' as DocumentType, phase: 'post-formation' as DocumentPhase, title: 'Attestation de réalisation (émargements)', description: 'Feuille d\'émargement attestant la présence', htmlContent: DEFAULT_TEMPLATES.emargement || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '13', type: 'satisfaction_froid' as DocumentType, phase: 'suivi' as DocumentPhase, title: 'Questionnaire à froid', description: 'Évaluation de l\'impact à +3 mois', htmlContent: DEFAULT_TEMPLATES.satisfaction_froid || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];
  }, [apiTemplates]);

  // Uploaded documents from API or local state fallback
  const [localUploadedDocs, setLocalUploadedDocs] = useState<Array<{ id: string; title: string; phase: DocumentPhase; fileName: string; uploadedAt: string; fileSize: string }>>([]);
  const uploadedDocuments = useMemo(() => {
    if (apiUploadedDocs && apiUploadedDocs.length > 0) {
      return apiUploadedDocs.map((d: any) => ({
        id: String(d.id),
        title: d.title || d.file_name,
        phase: (d.phase || 'inscription') as DocumentPhase,
        fileName: d.file_name,
        uploadedAt: d.created_at,
        fileSize: d.file_size ? `${(d.file_size / 1024).toFixed(0)} Ko` : '—',
      }));
    }
    return localUploadedDocs;
  }, [apiUploadedDocs, localUploadedDocs]);

  const handleCreateTemplate = () => {
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
    if (ofId) {
      // Use API
      if (template.id && !template.id.startsWith('t-')) {
        updateTemplateMutation.mutate({
          templateId: template.id,
          data: {
            title: template.title,
            description: template.description,
            html_content: template.htmlContent,
            requires_signature: template.requiresSignature,
            is_active: template.isActive,
            type: template.type,
            phase: template.phase,
          },
        });
      } else {
        createTemplateMutation.mutate({
          type: template.type,
          phase: template.phase,
          title: template.title,
          description: template.description || template.title,
          html_content: template.htmlContent,
          requires_signature: template.requiresSignature || false,
          is_active: true,
        });
      }
    }
    setShowEditor(false);
  };

  const handleSendPhaseDocuments = () => {
    setShowPhaseSender(true);
  };

  const handleDocumentsSent = (docs: any[]) => {
    if (ofId && docs.length > 0) {
      // Build bulk send request from the personalized documents
      const firstDoc = docs[0];
      const learnerId = Number(firstDoc.learnerId);
      const templateIds = docs
        .map((d: any) => Number(d.templateId))
        .filter((id: number) => !isNaN(id) && id > 0);
      
      // Build html_contents map: template_id → personalized HTML
      const htmlContents: Record<number, string> = {};
      docs.forEach((d: any) => {
        const tid = Number(d.templateId);
        if (!isNaN(tid) && tid > 0 && d.htmlContent) {
          htmlContents[tid] = d.htmlContent;
        }
      });

      if (templateIds.length > 0 && !isNaN(learnerId) && learnerId > 0) {
        // Determine phase from the first document or fallback to active phase
        const phase = firstDoc.phase || activePhase;
        sendBulkMutation.mutate({
          learner_id: learnerId,
          template_ids: templateIds,
          phase: phase,
          html_contents: htmlContents,
        });
        return;
      }
    }
    // Fallback toast if no API
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

    if (ofId) {
      // Use real API upload
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle.trim());
      formData.append('phase', uploadPhase);
      uploadDocMutation.mutate(formData);
    } else {
      // Fallback: local state
      const sizeStr = uploadFile.size > 1024 * 1024
        ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} Mo`
        : `${(uploadFile.size / 1024).toFixed(0)} Ko`;
      setLocalUploadedDocs(prev => [...prev, {
        id: `up-${Date.now()}`,
        title: uploadTitle.trim(),
        phase: uploadPhase,
        fileName: uploadFile.name,
        uploadedAt: new Date().toISOString(),
        fileSize: sizeStr,
      }]);
      toast({ title: 'Document uploadé', description: `"${uploadTitle}" ajouté à la phase ${PHASES_CONFIG[uploadPhase].label}` });
    }

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

    if (ofId) {
      sendUploadedDocMutation.mutate({
        documentId: uploadDocToSend!,
        data: {
          learner_ids: selectedLearnersForUpload.map(id => Number(id)),
        },
      });
    } else {
      toast({ title: 'Document envoyé', description: `"${doc.title}" envoyé à ${selectedLearnersForUpload.length} apprenant(s).` });
    }

    setShowUploadSendDialog(false);
    setUploadDocToSend(null);
    setSelectedLearnersForUpload([]);
  };

  const handleDeleteUploadedDoc = (docId: string) => {
    if (ofId) {
      deleteUploadedDocMutation.mutate(docId);
    } else {
      setLocalUploadedDocs(prev => prev.filter(d => d.id !== docId));
      toast({ title: 'Document supprimé' });
    }
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
                                onClick={() => handleDeleteUploadedDoc(doc.id)}>
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
        learners={learners}
        formations={formations}
        ofInfo={ofInfo}
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
            <DialogDescription>
              Ajoutez un document externe à une phase afin de pouvoir l'envoyer ensuite aux apprenants.
            </DialogDescription>
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
            <DialogDescription>
              Sélectionnez les apprenants destinataires pour l'envoi de ce document uploadé.
            </DialogDescription>
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
                {learners.map(learner => (
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
                    {learner.formationName && (
                      <Badge variant="outline" className="text-xs">{learner.formationName}</Badge>
                    )}
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
