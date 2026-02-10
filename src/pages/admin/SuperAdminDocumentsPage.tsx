import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FileText, Plus, Send, Search, Edit, Download, Upload,
  UserPlus, BookOpen, Award, Clock, CheckCircle, ChevronRight,
  Mail, FileSignature, Building, BarChart3, ShieldCheck,
  AlertTriangle, TrendingUp, Filter, Eye, Sparkles, Trash2, File,
  Users, ArrowLeft
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DocumentTemplateEditor } from '@/components/admin/documents/DocumentTemplateEditor';
import { PhaseDocumentSender } from '@/components/admin/documents/PhaseDocumentSender';
import { DEFAULT_TEMPLATES } from '@/components/admin/documents/defaultTemplates';
import {
  DocumentTemplate, DocumentPhase, DocumentType, Learner, Formation, OF,
  PHASES_CONFIG, DOCUMENT_TYPE_LABELS
} from '@/components/admin/documents/types';
import { useToast } from '@/hooks/use-toast';

// --- Mock data ---

const mockOrganismes = [
  { id: 'learneezy', name: 'Learneezy', siret: '900 111 222 00001', nda: '11 75 00001 00', city: 'Paris', isLearneezy: true },
  { id: 'of-1', name: 'FormaPro', siret: '123 456 789 00010', nda: '11 75 12345 67', city: 'Paris', isLearneezy: false },
  { id: 'of-2', name: 'SkillUp Academy', siret: '987 654 321 00020', nda: '11 69 98765 43', city: 'Lyon', isLearneezy: false },
  { id: 'of-3', name: 'DigiForm', siret: '456 789 123 00030', nda: '11 13 45678 90', city: 'Marseille', isLearneezy: false },
];

const mockLearners: Learner[] = [
  { id: '1', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@email.com', phone: '06 12 34 56 78', formationId: '1', formationName: 'React Avancé', enrollmentDate: '2024-01-01', company: 'TechCorp', city: 'Paris', postalCode: '75001', address: '12 rue de la Formation' },
  { id: '2', firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@email.com', phone: '06 98 76 54 32', formationId: '1', formationName: 'React Avancé', enrollmentDate: '2024-01-02', company: 'StartupXYZ', city: 'Lyon', postalCode: '69001', address: '5 place Bellecour' },
  { id: '3', firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@email.com', phone: '06 55 44 33 22', formationId: '2', formationName: 'Vue.js Débutant', enrollmentDate: '2024-01-03', company: 'DigitalAgency', city: 'Marseille', postalCode: '13001', address: '8 cours Julien' },
];

const mockFormations: Formation[] = [
  { id: '1', name: 'React Avancé', description: 'Formation approfondie React', duration: '35 heures', startDate: '2024-02-01', endDate: '2024-02-05', location: 'Paris', trainer: 'Jean Martin', price: 2500 },
  { id: '2', name: 'Vue.js Débutant', description: 'Initiation à Vue.js', duration: '21 heures', startDate: '2024-02-10', endDate: '2024-02-12', location: 'Lyon', trainer: 'Sophie Durand', price: 1800 },
];

const learneezyOF: OF = {
  name: 'Learneezy', siret: '900 111 222 00001', nda: '11 75 00001 00',
  address: '25 rue de l\'Innovation', city: 'Paris', postalCode: '75009',
  phone: '01 00 00 00 00', email: 'contact@learneezy.com', website: 'https://learneezy.com', responsable: 'Administrateur Learneezy'
};

const ofInfoMap: Record<string, OF> = {
  'learneezy': learneezyOF,
  'of-1': { name: 'FormaPro', siret: '123 456 789 00010', nda: '11 75 12345 67', address: '1 avenue de la Formation', city: 'Paris', postalCode: '75008', phone: '01 23 45 67 89', email: 'contact@formapro.fr', responsable: 'Pierre Durant' },
  'of-2': { name: 'SkillUp Academy', siret: '987 654 321 00020', nda: '11 69 98765 43', address: '10 rue de la République', city: 'Lyon', postalCode: '69001', phone: '04 56 78 90 12', email: 'contact@skillup.fr', responsable: 'Claire Moreau' },
  'of-3': { name: 'DigiForm', siret: '456 789 123 00030', nda: '11 13 45678 90', address: '3 boulevard du Prado', city: 'Marseille', postalCode: '13008', phone: '04 91 00 00 00', email: 'contact@digiform.fr', responsable: 'Marc Lefèvre' },
};

const getOFForSelection = (selectedOF: string): OF => {
  if (selectedOF === 'all') return learneezyOF;
  return ofInfoMap[selectedOF] || learneezyOF;
};

const mockGlobalDocuments = [
  // Learneezy documents
  { id: 'gd-l1', title: 'Analyse besoin Learneezy', type: 'analyse_besoin' as DocumentType, ofName: 'Learneezy', learnerName: 'Marie Dupont', sentAt: '2024-01-10', status: 'signed', signedAt: '2024-01-11', phase: 'inscription' as DocumentPhase },
  { id: 'gd-l2', title: 'Convention Learneezy', type: 'convention' as DocumentType, ofName: 'Learneezy', learnerName: 'Marie Dupont', sentAt: '2024-01-10', status: 'read', phase: 'inscription' as DocumentPhase },
  { id: 'gd-l3', title: 'CGV Learneezy', type: 'cgv' as DocumentType, ofName: 'Learneezy', learnerName: 'Jean Martin', sentAt: '2024-01-12', status: 'signed', signedAt: '2024-01-13', phase: 'formation' as DocumentPhase },
  { id: 'gd-l4', title: 'Certificat Learneezy', type: 'certificat' as DocumentType, ofName: 'Learneezy', learnerName: 'Sophie Bernard', sentAt: '2024-02-18', status: 'signed', signedAt: '2024-02-19', phase: 'post-formation' as DocumentPhase },
  // FormaPro documents
  { id: 'gd-1', title: 'Test positionnement FormaPro', type: 'test_positionnement' as DocumentType, ofName: 'FormaPro', learnerName: 'Marie Dupont', sentAt: '2024-01-15', status: 'signed', signedAt: '2024-01-16', phase: 'inscription' as DocumentPhase },
  { id: 'gd-2', title: 'Programme React', type: 'programme' as DocumentType, ofName: 'FormaPro', learnerName: 'Marie Dupont', sentAt: '2024-01-15', status: 'read', phase: 'formation' as DocumentPhase },
  { id: 'gd-3', title: 'Convention React', type: 'convention' as DocumentType, ofName: 'FormaPro', learnerName: 'Jean Martin', sentAt: '2024-01-20', status: 'signed', signedAt: '2024-01-21', phase: 'inscription' as DocumentPhase },
  // SkillUp documents
  { id: 'gd-4', title: 'Convocation SkillUp', type: 'convocation' as DocumentType, ofName: 'SkillUp Academy', learnerName: 'Sophie Bernard', sentAt: '2024-01-18', status: 'sent', phase: 'formation' as DocumentPhase },
  { id: 'gd-5', title: 'Test de sortie Vue.js', type: 'test_sortie' as DocumentType, ofName: 'SkillUp Academy', learnerName: 'Sophie Bernard', sentAt: '2024-02-15', status: 'pending', phase: 'post-formation' as DocumentPhase },
  // DigiForm documents
  { id: 'gd-6', title: 'Règlement intérieur', type: 'reglement_interieur' as DocumentType, ofName: 'DigiForm', learnerName: 'Jean Martin', sentAt: '2024-02-01', status: 'read', phase: 'formation' as DocumentPhase },
  { id: 'gd-7', title: 'Certificat Réalisation', type: 'certificat' as DocumentType, ofName: 'FormaPro', learnerName: 'Marie Dupont', sentAt: '2024-02-20', status: 'signed', signedAt: '2024-02-21', phase: 'post-formation' as DocumentPhase },
  { id: 'gd-8', title: 'Questionnaire à froid', type: 'satisfaction_froid' as DocumentType, ofName: 'FormaPro', learnerName: 'Marie Dupont', sentAt: '2024-05-20', status: 'pending', phase: 'suivi' as DocumentPhase },
];

// --- Sub-components ---

const phaseIcons = {
  inscription: UserPlus,
  formation: BookOpen,
  'post-formation': Award,
  suivi: Clock
};

// Stats Cards
const StatsCards: React.FC<{ documents: typeof mockGlobalDocuments }> = ({ documents }) => {
  const total = documents.length;
  const signed = documents.filter(d => d.status === 'signed').length;
  const pending = documents.filter(d => d.status === 'pending' || d.status === 'sent').length;
  const rate = total > 0 ? Math.round((signed / total) * 100) : 0;

  const stats = [
    { label: 'Documents envoyés', value: total, icon: Send, color: 'text-blue-600 bg-blue-50' },
    { label: 'Signés', value: signed, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'En attente', value: pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Taux de signature', value: `${rate}%`, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Phase Management Tab (reuses OF logic)
const PhaseManagementTab: React.FC<{ ofInfo: OF }> = ({ ofInfo }) => {
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
    { id: '1', type: 'analyse_besoin', phase: 'inscription', title: 'Analyse du besoin', description: 'Formulaire d\'évaluation préalable', htmlContent: DEFAULT_TEMPLATES.analyse_besoin || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', type: 'test_positionnement', phase: 'inscription', title: 'Test de positionnement', description: 'Évaluation du niveau initial', htmlContent: DEFAULT_TEMPLATES.test_positionnement || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '3', type: 'convention', phase: 'inscription', title: 'Convention de formation', description: 'Convention tripartite de formation', htmlContent: DEFAULT_TEMPLATES.convention || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // Phase Formation
    { id: '4', type: 'convocation', phase: 'formation', title: 'Convocation', description: 'Convocation à la session de formation', htmlContent: DEFAULT_TEMPLATES.convocation || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '5', type: 'programme', phase: 'formation', title: 'Programme de formation', description: 'Programme détaillé de la formation', htmlContent: DEFAULT_TEMPLATES.programme || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '6', type: 'cgv', phase: 'formation', title: 'Conditions Générales de Vente', description: 'CGV à signer par l\'apprenant', htmlContent: DEFAULT_TEMPLATES.cgv || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '7', type: 'reglement_interieur', phase: 'formation', title: 'Règlement intérieur', description: 'Règlement intérieur applicable aux stagiaires', htmlContent: DEFAULT_TEMPLATES.reglement_interieur || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '8', type: 'attestation_honneur', phase: 'formation', title: 'Attestation sur l\'honneur (CPF)', description: 'Attestation pour formations CPF', htmlContent: DEFAULT_TEMPLATES.attestation_honneur || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // Phase Post-formation
    { id: '9', type: 'test_sortie', phase: 'post-formation', title: 'Test de sortie', description: 'Évaluation des acquis en fin de formation', htmlContent: DEFAULT_TEMPLATES.test_sortie || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '10', type: 'satisfaction_chaud', phase: 'post-formation', title: 'Questionnaire de satisfaction à chaud', description: 'Évaluation immédiate', htmlContent: DEFAULT_TEMPLATES.satisfaction_chaud || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '11', type: 'certificat', phase: 'post-formation', title: 'Certificat de réalisation', description: 'Certificat attestant la réalisation', htmlContent: DEFAULT_TEMPLATES.certificat || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '12', type: 'emargement', phase: 'post-formation', title: 'Attestation de réalisation (émargements)', description: 'Feuille d\'émargement', htmlContent: DEFAULT_TEMPLATES.emargement || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // Phase +3 mois
    { id: '13', type: 'satisfaction_froid', phase: 'suivi', title: 'Questionnaire à froid', description: 'Évaluation de l\'impact à +3 mois', htmlContent: DEFAULT_TEMPLATES.satisfaction_froid || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ]);
  const [sentDocuments, setSentDocuments] = useState<any[]>([]);
  const { toast } = useToast();

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
    toast({ title: 'Modèle sauvegardé' });
  };

  const handleDocumentsSent = (docs: any[]) => {
    setSentDocuments(prev => [...prev, ...docs]);
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

  const openUploadDialog = () => {
    setUploadPhase(activePhase);
    setUploadTitle('');
    setUploadFile(null);
    setShowUploadDialog(true);
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

  const isLearneezy = ofInfo.name === 'Learneezy';

  return (
    <>
      {/* Bandeau contextuel OF émetteur */}
      <div className={`flex items-center gap-3 p-3 rounded-lg mb-4 border ${isLearneezy ? 'bg-blue-50 border-blue-200' : 'bg-muted/50 border-border'}`}>
        <div className={`p-2 rounded-lg ${isLearneezy ? 'bg-blue-100' : 'bg-muted'}`}>
          {isLearneezy ? <Sparkles className="h-4 w-4 text-blue-600" /> : <Building className="h-4 w-4" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            Envoi en tant que : <span className={isLearneezy ? 'text-blue-700 font-semibold' : 'font-semibold'}>{ofInfo.name}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {ofInfo.email} • SIRET: {ofInfo.siret} • NDA: {ofInfo.nda}
          </p>
        </div>
        {isLearneezy && (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">Plateforme Learneezy</Badge>
        )}
      </div>

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
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Rechercher un modèle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline" onClick={openUploadDialog}>
                <Upload className="h-4 w-4 mr-2" />
                Uploader un document
              </Button>
              <Button variant="outline" onClick={() => {
                setSelectedTemplate({
                  id: '',
                  type: (PHASES_CONFIG[activePhase].documents[0] as DocumentType) || 'convention',
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
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau modèle
              </Button>
              <Button onClick={() => setShowPhaseSender(true)}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer les documents
              </Button>
            </div>

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
                            <Button size="sm" variant="outline" onClick={() => { setSelectedTemplate(template); setShowEditor(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => setShowPhaseSender(true)}>
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

            {/* Uploaded documents for this phase */}
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
                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setUploadedDocuments(prev => prev.filter(d => d.id !== doc.id));
                                toast({ title: 'Document supprimé' });
                              }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {sentDocuments.filter(d => d.phase === phase).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Documents envoyés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Apprenant</TableHead>
                        <TableHead>Envoyé le</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sentDocuments.filter(d => d.phase === phase).map((doc) => (
                        <TableRow key={doc.id || doc.uniqueCode}>
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell>{doc.learnerName}</TableCell>
                          <TableCell>{new Date(doc.sentAt).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{getStatusBadge(doc.status)}</TableCell>
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

      {showEditor && (
        <div className="fixed inset-0 z-50 bg-background" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div className="p-6" style={{ minHeight: '100vh' }}>
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-background py-2 z-10">
              <h2 className="text-xl font-semibold">Éditeur de modèle</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowEditor(false)}>Fermer</Button>
            </div>
            <DocumentTemplateEditor
              template={selectedTemplate || undefined}
              onSave={handleSaveTemplate}
              onCancel={() => setShowEditor(false)}
            />
          </div>
        </div>
      )}

      <PhaseDocumentSender
        isOpen={showPhaseSender}
        onClose={() => setShowPhaseSender(false)}
        phase={activePhase}
        templates={phaseTemplates}
        learners={mockLearners}
        formations={mockFormations}
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
                onClick={() => document.getElementById('upload-doc-input')?.click()}
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
                id="upload-doc-input"
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
    </>
  );
};

// Global Templates Tab
const GlobalTemplatesTab: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const { toast } = useToast();

  const [globalTemplates, setGlobalTemplates] = useState([
    { id: 'gt-1', title: 'CGV Plateforme Learneezy', type: 'cgv' as DocumentType, description: 'Template CGV standard pour tous les OF', htmlContent: DEFAULT_TEMPLATES.cgv || '', isLearneezy: true, createdAt: '2024-01-01' },
    { id: 'gt-2', title: 'Convention Standard Learneezy', type: 'convention' as DocumentType, description: 'Convention type conforme Qualiopi', htmlContent: DEFAULT_TEMPLATES.convention || '', isLearneezy: true, createdAt: '2024-01-01' },
    { id: 'gt-3', title: 'Attestation Standard Learneezy', type: 'attestation' as DocumentType, description: 'Attestation de formation officielle', htmlContent: DEFAULT_TEMPLATES.attestation || '', isLearneezy: true, createdAt: '2024-01-01' },
  ]);

  const handleSave = (template: any) => {
    if (template.id) {
      setGlobalTemplates(prev => prev.map(t => t.id === template.id ? { ...t, ...template } : t));
    } else {
      setGlobalTemplates(prev => [...prev, {
        ...template,
        id: `gt-${Date.now()}`,
        description: template.description || template.title,
        isLearneezy: true,
        createdAt: new Date().toISOString()
      }]);
    }
    setShowEditor(false);
    toast({ title: 'Template global sauvegardé', description: 'Ce template est maintenant disponible pour tous les OF.' });
  };

  const handleDelete = (id: string) => {
    setGlobalTemplates(prev => prev.filter(t => t.id !== id));
    toast({ title: 'Template supprimé' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Templates Learneezy</h3>
          <p className="text-sm text-muted-foreground">Templates globaux disponibles pour tous les organismes de formation</p>
        </div>
        <Button onClick={() => {
          setSelectedTemplate({
            id: '',
            type: 'convention' as DocumentType,
            phase: 'inscription' as DocumentPhase,
            title: '',
            description: '',
            htmlContent: '',
            requiresSignature: false,
            isActive: true,
            createdAt: '',
            updatedAt: '',
          });
          setShowEditor(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un template global
        </Button>
      </div>

      <div className="grid gap-4">
        {globalTemplates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{template.title}</h4>
                    <Badge variant="secondary" className="text-xs">Learneezy</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Type : {DOCUMENT_TYPE_LABELS[template.type]} • Créé le {new Date(template.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setSelectedTemplate(template); setShowEditor(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDelete(template.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showEditor && (
        <div className="fixed inset-0 z-50 bg-background" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div className="p-6" style={{ minHeight: '100vh' }}>
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-background py-2 z-10">
              <h2 className="text-xl font-semibold">Éditeur de template global</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowEditor(false)}>Fermer</Button>
            </div>
            <DocumentTemplateEditor
              template={selectedTemplate || undefined}
              onSave={handleSave}
              onCancel={() => setShowEditor(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Global Tracking Tab - Learner-centric view like emargement page
const GlobalTrackingTab: React.FC<{ documents: typeof mockGlobalDocuments; selectedOF: string }> = ({ documents, selectedOF }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLearnerName, setSelectedLearnerName] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<typeof mockGlobalDocuments[0] | null>(null);

  // Filter documents by selected OF
  const filtered = documents.filter(d => {
    if (selectedOF !== 'all' && d.ofName !== mockOrganismes.find(o => o.id === selectedOF)?.name) return false;
    return true;
  });

  // Group documents by learner
  const learnerMap = useMemo(() => {
    const map = new Map<string, { name: string; docs: typeof mockGlobalDocuments; ofs: Set<string> }>();
    filtered.forEach(d => {
      if (!map.has(d.learnerName)) {
        map.set(d.learnerName, { name: d.learnerName, docs: [], ofs: new Set() });
      }
      const entry = map.get(d.learnerName)!;
      entry.docs.push(d);
      entry.ofs.add(d.ofName);
    });
    return map;
  }, [filtered]);

  const learners = useMemo(() => {
    return Array.from(learnerMap.values()).filter(l =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [learnerMap, searchTerm]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; label: string }> = {
      signed: { variant: 'default', label: 'Signé' },
      sent: { variant: 'secondary', label: 'Envoyé' },
      read: { variant: 'secondary', label: 'Lu' },
      pending: { variant: 'outline', label: 'En attente' },
    };
    const c = map[status] || map.pending;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const handleExportCSV = () => {
    const headers = ['Document', 'Type', 'Organisme', 'Apprenant', 'Phase', 'Envoyé le', 'Statut', 'Signé le'];
    const rows = filtered.map(d => [
      d.title, DOCUMENT_TYPE_LABELS[d.type], d.ofName, d.learnerName,
      PHASES_CONFIG[d.phase].label,
      new Date(d.sentAt).toLocaleDateString('fr-FR'),
      d.status,
      d.signedAt ? new Date(d.signedAt).toLocaleDateString('fr-FR') : ''
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `documents_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Detail view for a selected learner
  if (selectedLearnerName) {
    const learnerData = learnerMap.get(selectedLearnerName);
    if (!learnerData) return null;

    const docsByPhase = learnerData.docs.reduce((acc, doc) => {
      if (!acc[doc.phase]) acc[doc.phase] = [];
      acc[doc.phase].push(doc);
      return acc;
    }, {} as Record<string, typeof mockGlobalDocuments>);

    const signed = learnerData.docs.filter(d => d.status === 'signed').length;
    const pending = learnerData.docs.filter(d => d.status === 'pending' || d.status === 'sent').length;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedLearnerName(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Documents de {selectedLearnerName}</h3>
            <p className="text-sm text-muted-foreground">
              {learnerData.docs.length} document(s) • {signed} signé(s) • {pending} en attente
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{learnerData.docs.length}</div>
              <div className="text-sm text-muted-foreground">Total documents</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{signed}</div>
              <div className="text-sm text-green-700">Signés</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{pending}</div>
              <div className="text-sm text-amber-700">En attente</div>
            </CardContent>
          </Card>
        </div>

        {/* Documents grouped by phase */}
        {(Object.entries(PHASES_CONFIG) as [DocumentPhase, typeof PHASES_CONFIG.inscription][]).map(([phase, config]) => {
          const phaseDocs = docsByPhase[phase];
          if (!phaseDocs || phaseDocs.length === 0) return null;
          const PhaseIcon = phaseIcons[phase];
          return (
            <Card key={phase}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PhaseIcon className="h-4 w-4" />
                  {config.label}
                  <Badge variant="secondary" className="ml-auto">{phaseDocs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Organisme</TableHead>
                      <TableHead>Envoyé le</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Signé le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {phaseDocs.map(doc => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-xs text-muted-foreground">{DOCUMENT_TYPE_LABELS[doc.type]}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {doc.ofName === 'Learneezy' ? (
                              <>
                                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                                <span className="font-medium text-blue-700">{doc.ofName}</span>
                              </>
                            ) : (
                              <>
                                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                {doc.ofName}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(doc.sentAt).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell>{doc.signedAt ? new Date(doc.signedAt).toLocaleDateString('fr-FR') : '—'}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => setPreviewDoc(doc)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Prévisualiser
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}

        {/* Document Preview Dialog */}
        <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {previewDoc?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto border rounded-lg bg-white p-6">
              {previewDoc && DEFAULT_TEMPLATES[previewDoc.type as keyof typeof DEFAULT_TEMPLATES] ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DEFAULT_TEMPLATES[previewDoc.type as keyof typeof DEFAULT_TEMPLATES] || ''
                  }}
                  className="prose max-w-none"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-3" />
                  <p className="text-sm">Aucun aperçu HTML disponible pour ce document</p>
                  <p className="text-xs mt-1">Type : {previewDoc ? DOCUMENT_TYPE_LABELS[previewDoc.type] : ''}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Learner list view
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Rechercher un apprenant..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Apprenants
          </CardTitle>
          <CardDescription>Cliquez sur un apprenant pour voir l'ensemble de ses documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Apprenant</TableHead>
                <TableHead>Organisme(s)</TableHead>
                <TableHead className="text-center">Documents</TableHead>
                <TableHead className="text-center">Signés</TableHead>
                <TableHead className="text-center">En attente</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {learners.map((learner) => {
                const signed = learner.docs.filter(d => d.status === 'signed').length;
                const pending = learner.docs.filter(d => d.status === 'pending' || d.status === 'sent').length;
                const ofNames = Array.from(learner.ofs);
                return (
                  <TableRow
                    key={learner.name}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedLearnerName(learner.name)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {learner.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-primary hover:underline">{learner.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {ofNames.map(name => (
                          <Badge key={name} variant="outline" className="text-xs">
                            {name === 'Learneezy' ? <Sparkles className="h-3 w-3 mr-1 text-blue-600" /> : <Building className="h-3 w-3 mr-1" />}
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{learner.docs.length}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="bg-green-600">{signed}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {pending > 0 ? (
                        <Badge variant="outline" className="border-amber-400 text-amber-600">{pending}</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-400 text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {learners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun apprenant trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-right">{learners.length} apprenant(s) • {filtered.length} document(s)</p>
    </div>
  );
};

// Audit & Compliance Tab
const AuditComplianceTab: React.FC<{ documents: typeof mockGlobalDocuments }> = ({ documents }) => {
  const ofStats = mockOrganismes.map(of => {
    const ofDocs = documents.filter(d => d.ofName === of.name);
    const total = ofDocs.length;
    const signed = ofDocs.filter(d => d.status === 'signed').length;
    const pending = ofDocs.filter(d => d.status === 'pending' || d.status === 'sent').length;
    const rate = total > 0 ? Math.round((signed / total) * 100) : 0;
    const hasMissingDocs = total < 3; // simplified check
    return { ...of, total, signed, pending, rate, hasMissingDocs };
  });

  const handleExportAudit = () => {
    const headers = ['Organisme', 'Ville', 'Total docs', 'Signés', 'En attente', 'Taux signature', 'Alerte'];
    const rows = ofStats.map(o => [
      o.name, o.city, o.total, o.signed, o.pending, `${o.rate}%`, o.hasMissingDocs ? 'Oui' : 'Non'
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_conformite_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Conformité par organisme
          </h3>
          <p className="text-sm text-muted-foreground">Vue consolidée de la conformité documentaire de chaque OF</p>
        </div>
        <Button variant="outline" onClick={handleExportAudit}>
          <Download className="h-4 w-4 mr-2" />
          Export rapport
        </Button>
      </div>

      <div className="grid gap-4">
        {ofStats.map((of) => (
          <Card key={of.id} className={of.hasMissingDocs ? 'border-amber-300' : ''}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${of.isLearneezy ? 'bg-blue-100' : 'bg-muted'}`}>
                    {of.isLearneezy ? <Sparkles className="h-5 w-5 text-blue-600" /> : <Building className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{of.name}</h4>
                      {of.isLearneezy && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">Plateforme</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{of.city} • SIRET: {of.siret}</p>
                  </div>
                </div>
                {of.hasMissingDocs && (
                  <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Documents manquants
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xl font-bold">{of.total}</p>
                  <p className="text-xs text-muted-foreground">Total envoyés</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-700">{of.signed}</p>
                  <p className="text-xs text-muted-foreground">Signés</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-xl font-bold text-amber-700">{of.pending}</p>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xl font-bold text-purple-700">{of.rate}%</p>
                  <p className="text-xs text-muted-foreground">Taux signature</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Main Page Component ---

const SuperAdminDocumentsPage: React.FC = () => {
  const [selectedOF, setSelectedOF] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('phases');

  const filteredDocuments = selectedOF === 'all'
    ? mockGlobalDocuments
    : mockGlobalDocuments.filter(d => d.ofName === mockOrganismes.find(o => o.id === selectedOF)?.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Documents - Super Administration</h1>
          <p className="text-muted-foreground">Gestion centralisée des documents de tous les organismes de formation</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedOF} onValueChange={setSelectedOF}>
            <SelectTrigger className="w-[250px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par organisme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les organismes</SelectItem>
              {mockOrganismes.map((of) => (
                <SelectItem key={of.id} value={of.id}>
                  <span className="flex items-center gap-2">
                    {of.isLearneezy ? <Sparkles className="h-3.5 w-3.5 text-blue-600" /> : <Building className="h-3.5 w-3.5" />}
                    {of.name} ({of.city})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <StatsCards documents={filteredDocuments} />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="phases" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Gestion phases</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Templates globaux</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Suivi global</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Audit</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="mt-6">
          <PhaseManagementTab ofInfo={getOFForSelection(selectedOF)} />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <GlobalTemplatesTab />
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <GlobalTrackingTab documents={filteredDocuments} selectedOF={selectedOF} />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <AuditComplianceTab documents={filteredDocuments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDocumentsPage;
