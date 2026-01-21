import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, Search, FileSignature, CalendarIcon, Check, 
  ChevronRight, ChevronLeft, Eye, Maximize2, User, Upload, FileText, FolderOpen, ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentTemplate, Learner, Formation, OF, DocumentPhase } from './types';
import { UploadedProgramme } from './ProgrammeLibrary';
import { DocumentPreviewFullscreen } from './DocumentPreviewFullscreen';
import { useToast } from '@/hooks/use-toast';

interface PhaseDocumentSenderProps {
  isOpen: boolean;
  onClose: () => void;
  phase: DocumentPhase;
  templates: DocumentTemplate[];
  learners: Learner[];
  formations: Formation[];
  ofInfo: OF;
  onSend: (documents: any[]) => void;
  uploadedProgrammes?: UploadedProgramme[];
}

interface CustomFields {
  dateDebut: Date | undefined;
  dateFin: Date | undefined;
  duree: string;
  prix: string;
}

export const PhaseDocumentSender: React.FC<PhaseDocumentSenderProps> = ({
  isOpen,
  onClose,
  phase,
  templates,
  learners,
  formations,
  ofInfo,
  onSend,
  uploadedProgrammes = []
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePreviewTab, setActivePreviewTab] = useState<string>('');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenContent, setFullscreenContent] = useState({ title: '', content: '' });
  const [uploadedProgramme, setUploadedProgramme] = useState<File | null>(null);
  const [showProgrammeList, setShowProgrammeList] = useState(false);
  const [customFields, setCustomFields] = useState<CustomFields>({
    dateDebut: undefined,
    dateFin: undefined,
    duree: '',
    prix: ''
  });
  const { toast } = useToast();

  // Reset on open
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedLearnerId(null);
      setSelectedTemplateIds(templates.map(t => t.id));
      setSearchTerm('');
      setActivePreviewTab(templates[0]?.id || '');
      setCustomFields({
        dateDebut: undefined,
        dateFin: undefined,
        duree: '',
        prix: ''
      });
    }
  }, [isOpen, templates]);

  // Pre-fill fields when learner is selected
  React.useEffect(() => {
    if (selectedLearnerId) {
      const learner = learners.find(l => l.id === selectedLearnerId);
      if (learner) {
        const formation = formations.find(f => f.id === learner.formationId);
        if (formation) {
          setCustomFields({
            dateDebut: formation.startDate ? new Date(formation.startDate) : undefined,
            dateFin: formation.endDate ? new Date(formation.endDate) : undefined,
            duree: formation.duration || '',
            prix: formation.price ? `${formation.price} €` : ''
          });
        }
      }
    }
  }, [selectedLearnerId, learners, formations]);

  const selectedLearner = useMemo(() => 
    learners.find(l => l.id === selectedLearnerId), 
    [learners, selectedLearnerId]
  );

  const selectedFormation = useMemo(() => {
    if (!selectedLearner) return null;
    return formations.find(f => f.id === selectedLearner.formationId);
  }, [selectedLearner, formations]);

  const filteredLearners = useMemo(() => 
    learners.filter(l => 
      `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.formationName?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [learners, searchTerm]
  );

  const selectedTemplates = useMemo(() => 
    templates.filter(t => selectedTemplateIds.includes(t.id)),
    [templates, selectedTemplateIds]
  );

  const personalizeContent = (htmlContent: string): string => {
    if (!selectedLearner || !selectedFormation) return htmlContent;

    // Build signature HTML if available
    const signatureHtml = ofInfo.signatureUrl 
      ? `<img src="${ofInfo.signatureUrl}" alt="Signature officielle ${ofInfo.name}" style="max-height: 80px; display: inline-block;" />`
      : '<span style="color: #999; font-style: italic;">[Signature OF non configurée]</span>';

    const replacements: Record<string, string> = {
      // OF
      '{{of.nom}}': ofInfo.name,
      '{{of.siret}}': ofInfo.siret,
      '{{of.nda}}': ofInfo.nda,
      '{{of.adresse}}': ofInfo.address,
      '{{of.ville}}': ofInfo.city,
      '{{of.codePostal}}': ofInfo.postalCode,
      '{{of.telephone}}': ofInfo.phone,
      '{{of.email}}': ofInfo.email,
      '{{of.responsable}}': ofInfo.responsable,
      '{{of.signature}}': signatureHtml,
      // Apprenant
      '{{apprenant.prenom}}': selectedLearner.firstName,
      '{{apprenant.nom}}': selectedLearner.lastName,
      '{{apprenant.email}}': selectedLearner.email,
      '{{apprenant.telephone}}': selectedLearner.phone || '',
      '{{apprenant.adresse}}': selectedLearner.address || '',
      '{{apprenant.ville}}': selectedLearner.city || '',
      '{{apprenant.codePostal}}': selectedLearner.postalCode || '',
      '{{apprenant.entreprise}}': selectedLearner.company || '',
      // Formation
      '{{formation.nom}}': selectedFormation.name,
      '{{formation.description}}': selectedFormation.description || '',
      '{{formation.formateur}}': selectedFormation.trainer || '',
      // Custom fields (manual)
      '{{dates.debut}}': customFields.dateDebut ? format(customFields.dateDebut, 'dd/MM/yyyy', { locale: fr }) : '',
      '{{dates.fin}}': customFields.dateFin ? format(customFields.dateFin, 'dd/MM/yyyy', { locale: fr }) : '',
      '{{formation.duree}}': customFields.duree,
      '{{formation.prix}}': customFields.prix,
      // Date du jour
      '{{date.jour}}': format(new Date(), 'dd/MM/yyyy', { locale: fr }),
    };

    let result = htmlContent;
    Object.entries(replacements).forEach(([key, value]) => {
      result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value || '');
    });
    return result;
  };

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplateIds(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleOpenFullscreen = (template: DocumentTemplate) => {
    setFullscreenContent({
      title: template.title,
      content: personalizeContent(template.htmlContent)
    });
    setShowFullscreen(true);
  };

  const handleSend = () => {
    const documents = selectedTemplates.map(template => ({
      id: `doc-${Date.now()}-${template.id}`,
      templateId: template.id,
      title: template.title,
      type: template.type,
      phase: template.phase,
      learnerId: selectedLearnerId,
      learnerName: `${selectedLearner?.firstName} ${selectedLearner?.lastName}`,
      formationId: selectedFormation?.id,
      formationName: selectedFormation?.name,
      htmlContent: personalizeContent(template.htmlContent),
      requiresSignature: template.requiresSignature,
      status: 'sent',
      sentAt: new Date().toISOString(),
      uniqueCode: `${template.type.toUpperCase()}-${Date.now()}`
    }));

    onSend(documents);
    toast({
      title: "Documents envoyés",
      description: `${documents.length} document(s) envoyé(s) à ${selectedLearner?.firstName} ${selectedLearner?.lastName}`
    });
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedLearnerId;
      case 2: return selectedTemplateIds.length > 0;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const steps = [
    { num: 1, label: 'Apprenant' },
    { num: 2, label: 'Documents' },
    { num: 3, label: 'Personnalisation' },
    { num: 4, label: 'Prévisualisation' }
  ];

  const phaseLabels: Record<DocumentPhase, string> = {
    'inscription': 'Inscription',
    'formation': 'Formation',
    'post-formation': 'Post-formation',
    'suivi': 'Suivi +3 mois'
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Envoyer les documents - Phase {phaseLabels[phase]}
            </DialogTitle>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 py-4 border-b">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    currentStep === step.num 
                      ? 'bg-primary text-primary-foreground' 
                      : currentStep > step.num 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.num ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="w-4 text-center">{step.num}</span>
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>

          <ScrollArea className="flex-1 px-1">
            {/* Step 1: Select Learner */}
            {currentStep === 1 && (
              <div className="space-y-4 py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un apprenant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-2">
                  {filteredLearners.map(learner => (
                    <div
                      key={learner.id}
                      onClick={() => setSelectedLearnerId(learner.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedLearnerId === learner.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedLearnerId === learner.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{learner.firstName} {learner.lastName}</div>
                          <div className="text-sm text-muted-foreground">{learner.email}</div>
                        </div>
                        <Badge variant="outline">{learner.formationName}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Documents */}
            {currentStep === 2 && (
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Sélectionnez les documents à envoyer à {selectedLearner?.firstName} {selectedLearner?.lastName}
                </p>
                <div className="space-y-2">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedTemplateIds.includes(template.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedTemplateIds.includes(template.id)}
                          onCheckedChange={() => handleTemplateToggle(template.id)}
                        />
                        <div 
                          className="flex-1 cursor-pointer" 
                          onClick={() => handleTemplateToggle(template.id)}
                        >
                          <div className="font-medium">{template.title}</div>
                          <div className="text-sm text-muted-foreground">{template.description}</div>
                        </div>
                        {template.requiresSignature && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <FileSignature className="h-3 w-3 mr-1" />
                            Signature requise
                          </Badge>
                        )}
                      </div>
                      
                      {/* Upload option for Programme */}
                      {template.type === 'programme' && selectedTemplateIds.includes(template.id) && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex flex-wrap items-center gap-3">
                            {/* Browse programmes button */}
                            {uploadedProgrammes.length > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowProgrammeList(!showProgrammeList)}
                                className="gap-2"
                              >
                                <FolderOpen className="h-4 w-4" />
                                Parcourir les programmes
                                <ChevronDown className={`h-4 w-4 transition-transform ${showProgrammeList ? 'rotate-180' : ''}`} />
                              </Button>
                            )}
                            
                            {/* Upload new PDF */}
                            <label 
                              htmlFor="programme-upload"
                              className="flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-muted-foreground/50 hover:border-primary cursor-pointer transition-colors"
                            >
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Uploader un nouveau PDF
                              </span>
                              <input
                                id="programme-upload"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setUploadedProgramme(file);
                                    setShowProgrammeList(false);
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {/* Expandable programme list */}
                          {showProgrammeList && uploadedProgrammes.length > 0 && (
                            <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                Sélectionnez un programme :
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {uploadedProgrammes.map(prog => {
                                  const isSelected = uploadedProgramme?.name === prog.file.name;
                                  return (
                                    <button
                                      key={prog.id}
                                      type="button"
                                      onClick={() => {
                                        setUploadedProgramme(isSelected ? null : prog.file);
                                        if (!isSelected) setShowProgrammeList(false);
                                      }}
                                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                        isSelected 
                                          ? 'bg-primary text-primary-foreground' 
                                          : 'bg-background hover:bg-accent border border-border'
                                      }`}
                                    >
                                      <FileText className="h-3.5 w-3.5" />
                                      {prog.formationName}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Selected file display */}
                          {uploadedProgramme && (
                            <div className="mt-3 flex items-center gap-2 text-sm p-2 rounded-md bg-primary/10 border border-primary/20">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="font-medium flex-1">{uploadedProgramme.name}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2"
                                onClick={() => setUploadedProgramme(null)}
                              >
                                ✕
                              </Button>
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            {uploadedProgramme 
                              ? 'Le PDF sélectionné sera envoyé à la place du modèle HTML' 
                              : uploadedProgrammes.length > 0 
                                ? 'Parcourez les programmes existants ou uploadez un nouveau PDF'
                                : 'Uploadez un PDF ou utilisez le modèle HTML par défaut'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Customize Fields */}
            {currentStep === 3 && (
              <div className="space-y-4 py-4">
                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Apprenant :</strong> {selectedLearner?.firstName} {selectedLearner?.lastName}<br/>
                    <strong>Formation :</strong> {selectedFormation?.name}<br/>
                    <strong>Documents :</strong> {selectedTemplates.map(t => t.title).join(', ')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date de début</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customFields.dateDebut 
                            ? format(customFields.dateDebut, 'dd/MM/yyyy', { locale: fr })
                            : 'Sélectionner...'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border" align="start">
                        <Calendar
                          mode="single"
                          selected={customFields.dateDebut}
                          onSelect={(date) => setCustomFields(prev => ({ ...prev, dateDebut: date }))}
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date de fin</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customFields.dateFin 
                            ? format(customFields.dateFin, 'dd/MM/yyyy', { locale: fr })
                            : 'Sélectionner...'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border" align="start">
                        <Calendar
                          mode="single"
                          selected={customFields.dateFin}
                          onSelect={(date) => setCustomFields(prev => ({ ...prev, dateFin: date }))}
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Durée</label>
                    <Input
                      value={customFields.duree}
                      onChange={(e) => setCustomFields(prev => ({ ...prev, duree: e.target.value }))}
                      placeholder="Ex: 35 heures"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prix</label>
                    <Input
                      value={customFields.prix}
                      onChange={(e) => setCustomFields(prev => ({ ...prev, prix: e.target.value }))}
                      placeholder="Ex: 2 500 €"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {currentStep === 4 && (
              <div className="space-y-4 py-4">
                <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab}>
                  <TabsList className="w-full justify-start">
                    {selectedTemplates.map(template => (
                      <TabsTrigger key={template.id} value={template.id} className="flex items-center gap-2">
                        {template.title}
                        {template.requiresSignature && (
                          <FileSignature className="h-3 w-3 text-amber-500" />
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {selectedTemplates.map(template => (
                    <TabsContent key={template.id} value={template.id} className="mt-4">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted px-4 py-2 flex items-center justify-between border-b">
                          <span className="text-sm font-medium">{template.title}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenFullscreen(template)}
                          >
                            <Maximize2 className="h-4 w-4 mr-1" />
                            Plein écran
                          </Button>
                        </div>
                        <div 
                          className="p-6 bg-background max-h-[400px] overflow-auto content-html"
                          dangerouslySetInnerHTML={{ 
                            __html: personalizeContent(template.htmlContent) 
                          }}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {currentStep === 1 ? 'Annuler' : 'Retour'}
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSend}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer {selectedTemplates.length} document{selectedTemplates.length > 1 ? 's' : ''}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DocumentPreviewFullscreen
        isOpen={showFullscreen}
        onClose={() => setShowFullscreen(false)}
        title={fullscreenContent.title}
        htmlContent={fullscreenContent.content}
      />
    </>
  );
};
