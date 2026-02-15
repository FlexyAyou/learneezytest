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
  AlertCircle, Mail, FileSignature, Sparkles, Users, File as FileIcon, Trash2, Loader2
} from 'lucide-react';
import { DialogDescription } from '@/components/ui/dialog';
import { DocumentTemplateEditor } from './DocumentTemplateEditor';
import { PhaseDocumentSender } from './PhaseDocumentSender';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [showUploadSender, setShowUploadSender] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>('');
  const [uploadPhase, setUploadPhase] = useState<DocumentPhase>('inscription');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  // Upload State (keep minimal needed if reused, else clean)
  // const [showUploadDialog, setShowUploadDialog] = useState(false); // Removed
  const [isUploading, setIsUploading] = useState(false); // Used in PhaseSender

  // Send state removed (managed in Emargements or specific senders)
  const [ofInfo, setOfInfo] = useState<OF | null>(null);

  const { organization } = useOrganization();
  const { user: authUser } = useAuth();
  // Support both camelCase and snake_case from API response
  const ofId = organization?.organizationId || (organization as any)?.organization_id || authUser?.of_id;

  // Hooks
  const { refetch: refetchAssets } = useMediaAssets({ status: 'ready' });
  const { data: learnersRaw, isLoading: learnersLoading } = useOFUsers(ofId);
  const prepare = usePrepareUpload();
  const complete = useCompleteUpload();
  // const deleteMedia = useDeleteMedia(); // Removed
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
      formationName: 'Apprenant', // Simplifié
      formationId: '',
      enrollmentDate: ''
    }));

  const mockFormations: Formation[] = [
    { id: '1', name: 'Formation Standard', description: 'Formation', duration: '35h', startDate: '', endDate: '', location: '', trainer: '', price: 0 }
  ];

  // Fetch templates from API
  const { data: templates = [], refetch: refetchTemplates } = useQuery({
    queryKey: ['documentTemplates', ofId],
    queryFn: async () => {
      if (!ofId) return [];
      try {
        const res = await fastAPIClient.listDocumentTemplates(Number(ofId));
        return res;
      } catch (e) {
        console.error("Failed to fetch templates", e);
        return [];
      }
    },
    enabled: !!ofId
  });

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

  const handleSaveTemplate = async (template: any) => {
    try {
      if (template.id && template.id.length > 5 && !template.id.startsWith('t-')) {
        await fastAPIClient.updateDocumentTemplate(Number(ofId), template.id, template);
      } else {
        const { id, ...rest } = template; // Remove temp ID
        await fastAPIClient.createDocumentTemplate(Number(ofId), rest);
      }
      refetchTemplates();
      setShowEditor(false);
      toast({ title: "Modèle enregistré avec succès" });
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur", description: "Impossible d'enregistrer le modèle", variant: "destructive" });
    }
  };





  const handleSendPhaseDocuments = async (docs: any[], customFields?: any) => {
    console.log('handleSendPhaseDocuments: Call Backend API', { count: docs.length });
    setIsUploading(true);
    try {
      // Extract learnerId from first doc
      const learnerId = docs[0]?.learnerId;
      if (!learnerId) throw new Error("Aucun apprenant identifié");

      const templateIds = docs.map(d => d.templateId).filter(Boolean);

      // Call Send API
      await fastAPIClient.sendDocuments(Number(ofId), {
        learner_id: Number(learnerId),
        phase: activePhase,
        template_ids: templateIds,
        custom_fields: customFields,
        include_of_signature: true
      });

      toast({
        title: "Documents envoyés",
        description: `${docs.length} document(s) ont été traités par le serveur.`
      });
      setShowPhaseSender(false);
      refetchAssets();
    } catch (error: any) {
      console.error('Error sending phase documents:', error);
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Une erreur est survenue lors de l'envoi vers le serveur.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendUploadedDocument = async () => {
    if (!uploadFile || !selectedLearnerId || !uploadTitle) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }

    try {
      setIsUploading(true);
      // 1. Prepare
      const prepareRes = await prepare.mutateAsync({
        filename: uploadFile.name,
        content_type: uploadFile.type,
        size: uploadFile.size,
        kind: 'resource'
      });

      // 2. Upload
      await axios.put(prepareRes.url!, uploadFile, {
        headers: { 'Content-Type': uploadFile.type }
      });

      // 3. Complete
      const completeRes = await complete.mutateAsync({
        strategy: 'single',
        key: prepareRes.key,
        content_type: uploadFile.type,
        size: uploadFile.size
      });

      // 4. Assign
      await assign.mutateAsync({
        user_id: parseInt(selectedLearnerId),
        media_asset_id: completeRes.id!,
        message: `Document envoyé par l'OF : ${uploadTitle}`,
        phase: uploadPhase
      });

      toast({ title: "Document envoyé", description: "Le document a été envoyé à l'apprenant avec succès." });
      setShowUploadSender(false);
      setUploadFile(null);
      setUploadTitle('');
      setSelectedLearnerId('');
      // Refetch assets/assignments if needed (but currently we are on advanced doc page, assignments are on another page)
    } catch (error: any) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible d'envoyer le document.", variant: "destructive" });
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
          <Button variant="default" onClick={() => setShowUploadSender(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Envoyer un document
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


          </TabsContent>
        ))}
      </Tabs>

      {/* Upload Dialog */}


      {/* Send Dialog */}


      {/* Analyse de Besoin Dialog */}
      {/* Upload & Send Dialog */}
      <Dialog open={showUploadSender} onOpenChange={setShowUploadSender}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Envoyer un document</DialogTitle>
            <DialogDescription>
              Sélectionnez un fichier, un apprenant et la phase associée pour l'ajouter au dossier de l'apprenant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document (PDF, Image...)</label>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadFile(file);
                    if (!uploadTitle) setUploadTitle(file.name.split('.')[0]);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Titre du document</label>
              <Input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Ex: Attestation de présence"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phase</label>
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
              <label className="text-sm font-medium">Apprenant</label>
              <Select value={selectedLearnerId} onValueChange={setSelectedLearnerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un apprenant" />
                </SelectTrigger>
                <SelectContent>
                  {learners.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.firstName} {l.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadSender(false)}>Annuler</Button>
            <Button onClick={handleSendUploadedDocument} disabled={isUploading || !uploadFile || !selectedLearnerId}>
              {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi...</> : <><Send className="mr-2 h-4 w-4" /> Envoyer</>}
            </Button>
          </DialogFooter>
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
