import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, Plus, Send, Search, Eye, Edit, Download, 
  UserPlus, BookOpen, Award, Clock, CheckCircle, 
  AlertCircle, Mail, FileSignature, Sparkles
} from 'lucide-react';
import { DocumentTemplateEditor } from './DocumentTemplateEditor';
import { PhaseDocumentSender } from './PhaseDocumentSender';
import { ProgrammeLibrary, UploadedProgramme } from './ProgrammeLibrary';
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
  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    // Phase Inscription - CGV et Programme
    { id: '1', type: 'cgv', phase: 'inscription', title: 'Conditions Générales de Vente', description: 'CGV à signer par l\'apprenant', htmlContent: DEFAULT_TEMPLATES.cgv || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', type: 'programme', phase: 'inscription', title: 'Programme de formation', description: 'Programme détaillé de la formation', htmlContent: DEFAULT_TEMPLATES.programme || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // Phase Formation
    { id: '3', type: 'convention', phase: 'formation', title: 'Convention de formation', description: 'Convention tripartite', htmlContent: DEFAULT_TEMPLATES.convention || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '4', type: 'convocation', phase: 'formation', title: 'Convocation session', description: 'Convocation à la session de formation', htmlContent: DEFAULT_TEMPLATES.convocation || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    // Phase Post-formation
    { id: '5', type: 'attestation', phase: 'post-formation', title: 'Attestation de formation', description: 'Attestation de fin de formation', htmlContent: DEFAULT_TEMPLATES.attestation || '', requiresSignature: true, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '6', type: 'certificat', phase: 'post-formation', title: 'Certificat de réalisation', description: 'Certificat de réalisation de la formation', htmlContent: DEFAULT_TEMPLATES.certificat || '', requiresSignature: false, isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ]);
  const [sentDocuments, setSentDocuments] = useState<any[]>([]);
  const [uploadedProgrammes, setUploadedProgrammes] = useState<UploadedProgramme[]>([]);
  const { toast } = useToast();

  const handleProgrammeUpload = (programme: UploadedProgramme) => {
    setUploadedProgrammes(prev => [...prev, programme]);
  };

  const handleProgrammeDelete = (programmeId: string) => {
    setUploadedProgrammes(prev => prev.filter(p => p.id !== programmeId));
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
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
      setTemplates(prev => [...prev, { ...template, id: `t-${Date.now()}`, createdAt: new Date().toISOString() }]);
    }
    setShowEditor(false);
  };

  const handleSendPhaseDocuments = () => {
    setShowPhaseSender(true);
  };

  const handleDocumentsSent = (docs: any[]) => {
    setSentDocuments(prev => [...prev, ...docs]);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Documents</h1>
          <p className="text-muted-foreground">Personnalisation et envoi de documents par phase de formation</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau modèle
        </Button>
      </div>

      {/* Programme Library */}
      <ProgrammeLibrary
        formations={mockFormations}
        uploadedProgrammes={uploadedProgrammes}
        onUpload={handleProgrammeUpload}
        onDelete={handleProgrammeDelete}
      />

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
            {/* Search + Send Button */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Rechercher un modèle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
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

            {/* Sent Documents */}
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
        uploadedProgrammes={uploadedProgrammes}
      />
    </div>
  );
};

export default OFDocumentsAdvanced;
