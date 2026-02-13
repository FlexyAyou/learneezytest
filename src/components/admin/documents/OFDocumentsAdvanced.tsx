import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
  AlertCircle, Mail, FileSignature, Sparkles, Users, File, Trash2, Loader2
} from 'lucide-react';
import { DocumentTemplateEditor } from './DocumentTemplateEditor';
import { PhaseDocumentSender } from './PhaseDocumentSender';
import { AnalyseBesoinSender } from './AnalyseBesoinSender';
import { DEFAULT_TEMPLATES } from './defaultTemplates';
import { fastAPIClient } from '@/services/fastapi-client';
import {
  DocumentTemplate, DocumentPhase, DocumentType, Learner, Formation, OF,
  PHASES_CONFIG, DOCUMENT_TYPE_LABELS
} from './types';
import { useToast } from '@/hooks/use-toast';
import {
  useMediaAssets,
  usePrepareUpload,
  useCompleteUpload,
  useDeleteMedia,
  useOFUsers,
  useAssignMedia
} from '@/hooks/useApi';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/hooks/useApi';

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
  const [showAnalyseBesoin, setShowAnalyseBesoin] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  // Upload State
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadPhase, setUploadPhase] = useState<DocumentPhase>('inscription');
  const [isUploading, setIsUploading] = useState(false);

  // Send state
  const [showUploadSendDialog, setShowUploadSendDialog] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [selectedLearnersForUpload, setSelectedLearnersForUpload] = useState<number[]>([]);
  const [sendMessage, setSendMessage] = useState("");
  const [sendPhase, setSendPhase] = useState<DocumentPhase>('inscription');
  const [ofInfo, setOfInfo] = useState<OF | null>(null);

  const { organization } = useOrganization();
  const { user: authUser } = useAuth();
  // Support both camelCase and snake_case from API response
  const ofId = organization?.organizationId || (organization as any)?.organization_id || authUser?.of_id;

  // Hooks
  const { data: assets, isLoading: assetsLoading, refetch: refetchAssets } = useMediaAssets({ status: 'ready' });
  const { data: learnersRaw, isLoading: learnersLoading } = useOFUsers(ofId);
  const prepare = usePrepareUpload();
  const complete = useCompleteUpload();
  const deleteMedia = useDeleteMedia();
  const assign = useAssignMedia();
  const { toast } = useToast();

  // Fetch full organization info for document personalization
  useEffect(() => {
    const fetchOFInfo = async () => {
      if (!ofId) return;
      try {
        const org = await fastAPIClient.getOrganization(ofId);
        setOfInfo({
          name: org.name,
          siret: org.siret || '',
          nda: org.numero_declaration || '',
          address: org.address || '',
          city: org.city || '',
          postalCode: org.postal_code || '',
          phone: org.phone || '',
          email: org.contact_email || org.email || '',
          website: org.website || '',
          responsable: org.legal_representative || '',
          signatureUrl: (org as any).signature_url || ''
        });
      } catch (error) {
        console.error('Error fetching organization info:', error);
      }
    };
    fetchOFInfo();
  }, [ofId]);

  const handleDeleteAsset = async (assetId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      await deleteMedia.mutateAsync({ asset_id: assetId, force: true });
    }
  };

  // Convert API users to Learner type
  const learners: Learner[] = (learnersRaw || [])
    .filter(u => {
      const role = u.role?.toLowerCase();
      // Inclure différents labels possibles pour les apprenants
      return role === 'student' || role === 'apprenant' || role === 'stagiaire' || role === 'eleve';
    })
    .map(u => ({
      id: u.id?.toString() || '',
      firstName: u.first_name || '',
      lastName: u.last_name || '',
      email: u.email,
      phone: u.phone || '',
      formationName: 'Apprenant' // Simplifié
    }));

  const mockFormations: Formation[] = [
    { id: '1', name: 'Formation Standard', description: 'Formation', duration: '35h', startDate: '', endDate: '', location: '', trainer: '', price: 0 }
  ];

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

  const handleUploadDocument = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      toast({ title: 'Champs requis', description: 'Veuillez saisir un titre et sélectionner un fichier.', variant: 'destructive' });
      return;
    }

    try {
      setIsUploading(true);

      // 1. Prepare upload
      const prep = await prepare.mutateAsync({
        filename: uploadFile.name,
        content_type: uploadFile.type || 'application/octet-stream',
        size: uploadFile.size,
        kind: 'resource' // On considère tout comme resource PDF/Doc
      });

      // 2. Direct upload to S3 (presigned URL)
      await axios.put(prep.url!, uploadFile, {
        headers: { 'Content-Type': uploadFile.type || 'application/octet-stream' }
      });

      // 3. Complete upload
      await complete.mutateAsync({
        strategy: prep.strategy,
        key: prep.key,
        content_type: uploadFile.type || 'application/octet-stream',
        size: uploadFile.size
      });

      toast({ title: 'Document uploadé', description: `"${uploadTitle}" a été uploadé avec succès.` });
      refetchAssets();
      setShowUploadDialog(false);
      setUploadFile(null);
      setUploadTitle('');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast({ title: 'Erreur d\'upload', description: err.message || 'Une erreur est survenue.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenUploadSend = (assetId: number) => {
    setSelectedAssetId(assetId);
    setSelectedLearnersForUpload([]);
    setSendMessage("");
    setSendPhase(activePhase); // Par défaut la phase de l'onglet actuel
    setShowUploadSendDialog(true);
  };

  const handleSendUploadedDocument = async () => {
    if (!selectedAssetId || selectedLearnersForUpload.length === 0) return;

    try {
      // Pour chaque apprenant sélectionné
      const promises = selectedLearnersForUpload.map(userId =>
        assign.mutateAsync({
          user_id: userId,
          media_asset_id: selectedAssetId,
          message: sendMessage,
          phase: sendPhase
        })
      );

      await Promise.all(promises);

      toast({ title: 'Documents envoyés', description: `Le document a été envoyé à ${selectedLearnersForUpload.length} apprenant(s).` });
      setShowUploadSendDialog(false);
      setSelectedAssetId(null);
      setSelectedLearnersForUpload([]);
    } catch (err: any) {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer le document.', variant: 'destructive' });
    }
  };

  const toggleLearnerForUpload = (learnerId: number) => {
    setSelectedLearnersForUpload(prev =>
      prev.includes(learnerId) ? prev.filter(id => id !== learnerId) : [...prev, learnerId]
    );
  };

  const handleSendPhaseDocuments = async (docs: any[]) => {
    console.log('handleSendPhaseDocuments: Start', { docCount: docs.length });
    setIsUploading(true);
    try {
      for (const doc of docs) {
        // 1. Create file from HTML
        const blob = new Blob([doc.htmlContent], { type: 'text/html' });
        const fileName = `${doc.type}_${doc.learnerName.replace(/\s+/g, '_')}.html`;
        const file = new File([blob], fileName, { type: 'text/html' });

        // 2. Prepare upload
        const prepareResponse = await prepare.mutateAsync({
          filename: file.name,
          content_type: file.type,
          size: file.size,
          kind: 'resource',
        });

        // 3. Upload to S3
        await axios.put(prepareResponse.url!, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        // 4. Complete upload
        const completeResponse = await complete.mutateAsync({
          strategy: 'single',
          key: prepareResponse.key,
          content_type: file.type,
          size: file.size,
        });

        // 5. Assign to learner
        await assign.mutateAsync({
          user_id: Number(doc.learnerId),
          media_asset_id: completeResponse.id!,
          message: `Nouveau document : ${doc.title}`,
          phase: doc.phase,
        });
      }

      toast({
        title: "Documents envoyés",
        description: `${docs.length} document(s) ont été envoyés avec succès.`
      });
      setShowPhaseSender(false);
      refetchAssets();
    } catch (error: any) {
      console.error('Error sending phase documents:', error);
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Une erreur est survenue lors de l'envoi des documents.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const phaseTemplates = templates.filter(t => t.phase === activePhase);
  const filteredTemplates = phaseTemplates.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
          <Button variant="default" onClick={() => setShowAnalyseBesoin(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Analyse de Besoin
          </Button>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau modèle
          </Button>
        </div>
      </div>

      <Tabs value={activePhase} onValueChange={(v) => setActivePhase(v as DocumentPhase)}>
        <TabsList className="grid grid-cols-4 w-full">
          {(Object.entries(PHASES_CONFIG) as [DocumentPhase, typeof PHASES_CONFIG.inscription][]).map(([phase, config]) => {
            const Icon = phaseIcons[phase];
            return (
              <TabsTrigger key={phase} value={phase} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(Object.keys(PHASES_CONFIG) as DocumentPhase[]).map((phase) => (
          <TabsContent key={phase} value={phase} className="space-y-4 mt-4">
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Rechercher un modèle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Uploader un document
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <div className="font-medium">{template.title}</div>
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
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setShowPhaseSender(true)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Personnaliser & Envoyer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Real Library of Assets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Bibliothèque de documents (Storage)
                </CardTitle>
                <CardDescription>Tous vos documents importés disponibles pour envoi</CardDescription>
              </CardHeader>
              <CardContent>
                {assetsLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fichier</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(assets?.items || []).filter((a: any) => a.kind === 'resource' || a.kind === 'image').map((asset: any) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.filename}</TableCell>
                          <TableCell><Badge variant="outline">{asset.kind}</Badge></TableCell>
                          <TableCell>{new Date(asset.created_at).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-right flex justify-end gap-2 text-right">
                            <Button size="sm" onClick={() => handleOpenUploadSend(asset.id)}>
                              <Send className="h-4 w-4 mr-2" />
                              Envoyer
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteAsset(asset.id)}
                              disabled={deleteMedia.isPending}
                            >
                              {deleteMedia.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(assets?.items || []).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Aucun document dans le storage</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Uploader un document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre du document</label>
              <Input placeholder="Titre interne..." value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fichier</label>
              <Input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Annuler</Button>
            <Button onClick={handleUploadDocument} disabled={!uploadFile || isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Uploader
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Dialog */}
      <Dialog open={showUploadSendDialog} onOpenChange={setShowUploadSendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Envoyer le document</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phase cible</label>
                <Select value={sendPhase} onValueChange={(val: DocumentPhase) => setSendPhase(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une phase" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PHASES_CONFIG).map(([id, config]) => (
                      <SelectItem key={id} value={id}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message (optionnel)</label>
                <Input placeholder="Votre message..." value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Apprenants</label>
              <div className="border rounded-lg max-h-60 overflow-auto divide-y">
                {learnersLoading ? <div className="p-4 text-center text-sm text-muted-foreground">Chargement...</div> :
                  learners.length === 0 ? (
                    <div className="p-8 text-center bg-muted/20 rounded-lg">
                      <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">Aucun apprenant trouvé pour cet organisme.</p>
                      <p className="text-xs text-muted-foreground mt-1">Vérifiez que vos utilisateurs ont bien le rôle 'apprenant'.</p>
                    </div>
                  ) :
                    learners.map(l => (
                      <label key={l.id} className="flex items-center p-3 gap-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-primary" checked={selectedLearnersForUpload.includes(Number(l.id))} onChange={() => toggleLearnerForUpload(Number(l.id))} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{l.firstName} {l.lastName}</div>
                          <div className="text-xs text-muted-foreground">{l.email}</div>
                        </div>
                      </label>
                    ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSendUploadedDocument} disabled={selectedLearnersForUpload.length === 0 || assign.isPending}>
              {assign.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Envoyer à {selectedLearnersForUpload.length} apprenants
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analyse de Besoin Dialog */}
      <Dialog open={showAnalyseBesoin} onOpenChange={setShowAnalyseBesoin}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Analyse du Besoin de Formation</DialogTitle>
          </DialogHeader>
          <AnalyseBesoinSender
            ofId={ofId}
            ofInfo={ofInfo}
            isOpen={showAnalyseBesoin}
            onClose={() => setShowAnalyseBesoin(false)}
            template={selectedTemplate}
          />
        </DialogContent>
      </Dialog>

      {/* Phase Document Sender Modal */}
      {ofInfo && (
        <PhaseDocumentSender
          isOpen={showPhaseSender}
          onClose={() => setShowPhaseSender(false)}
          phase={activePhase}
          templates={templates.filter(t => t.phase === activePhase)}
          learners={learners}
          formations={mockFormations}
          ofInfo={ofInfo}
          onSend={handleSendPhaseDocuments}
        />
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-background overflow-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Éditeur</h2>
            <Button variant="ghost" onClick={() => setShowEditor(false)}>Fermer</Button>
          </div>
          <DocumentTemplateEditor template={selectedTemplate || undefined} onSave={handleSaveTemplate} onCancel={() => setShowEditor(false)} />
        </div>
      )}
    </div>
  );
};

export default OFDocumentsAdvanced;
