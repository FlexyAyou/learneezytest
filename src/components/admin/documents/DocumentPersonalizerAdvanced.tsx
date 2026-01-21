import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  FileSignature, 
  Send, 
  Eye, 
  User, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  CalendarIcon,
  Edit3,
  FileText
} from 'lucide-react';
import { LearnerSelector } from './LearnerSelector';
import { 
  DocumentTemplate, 
  Learner, 
  Formation, 
  OF,
  DOCUMENT_TYPE_LABELS,
  PHASES_CONFIG,
  EDITABLE_FIELDS
} from './types';
import { useToast } from '@/hooks/use-toast';

interface DocumentPersonalizerAdvancedProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate | null;
  learners: Learner[];
  formations: Formation[];
  ofInfo: OF;
  onSend: (personalizedDocuments: any[]) => void;
}

interface LearnerOverrides {
  [learnerId: string]: {
    [fieldKey: string]: string;
  };
}

export const DocumentPersonalizerAdvanced: React.FC<DocumentPersonalizerAdvancedProps> = ({
  isOpen,
  onClose,
  template,
  learners,
  formations,
  ofInfo,
  onSend
}) => {
  const [selectedLearners, setSelectedLearners] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'customize' | 'preview' | 'confirm'>('select');
  const [previewLearnerId, setPreviewLearnerId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [learnerOverrides, setLearnerOverrides] = useState<LearnerOverrides>({});
  const { toast } = useToast();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedLearners([]);
      setCurrentStep('select');
      setPreviewLearnerId(null);
      setLearnerOverrides({});
    }
  }, [isOpen]);

  // Initialize overrides when learners are selected
  useEffect(() => {
    const newOverrides: LearnerOverrides = {};
    selectedLearners.forEach(learnerId => {
      const learner = learners.find(l => l.id === learnerId);
      const formation = formations.find(f => f.id === learner?.formationId);
      
      if (!learnerOverrides[learnerId]) {
        newOverrides[learnerId] = {
          'dates.debut': formation?.startDate || '',
          'dates.fin': formation?.endDate || '',
          'formation.duree': formation?.duration || '',
          'formation.lieu': formation?.location || '',
          'formation.prix': formation?.price ? `${formation.price.toLocaleString('fr-FR')} €` : '',
        };
      } else {
        newOverrides[learnerId] = learnerOverrides[learnerId];
      }
    });
    setLearnerOverrides(prev => ({ ...prev, ...newOverrides }));
  }, [selectedLearners, learners, formations]);

  // Personalize document content with learner data and overrides
  const personalizeContent = (htmlContent: string, learner: Learner, overrides: Record<string, string> = {}): string => {
    const formation = formations.find(f => f.id === learner.formationId);
    
    const formatDate = (dateStr: string | undefined) => {
      if (!dateStr) return '';
      try {
        return new Date(dateStr).toLocaleDateString('fr-FR');
      } catch {
        return dateStr;
      }
    };

    const replacements: Record<string, string> = {
      // Apprenant
      '{{apprenant.prenom}}': learner.firstName,
      '{{apprenant.nom}}': learner.lastName,
      '{{apprenant.nom_complet}}': `${learner.firstName} ${learner.lastName}`,
      '{{apprenant.email}}': learner.email,
      '{{apprenant.telephone}}': learner.phone || '',
      '{{apprenant.date_naissance}}': learner.birthDate || '',
      '{{apprenant.adresse}}': learner.address || '',
      '{{apprenant.ville}}': learner.city || '',
      '{{apprenant.code_postal}}': learner.postalCode || '',
      '{{apprenant.entreprise}}': learner.company || '',
      '{{apprenant.poste}}': learner.position || '',
      
      // Formation (with overrides)
      '{{formation.nom}}': formation?.name || '',
      '{{formation.description}}': formation?.description || '',
      '{{formation.duree}}': overrides['formation.duree'] || formation?.duration || '',
      '{{formation.lieu}}': overrides['formation.lieu'] || formation?.location || '',
      '{{formation.formateur}}': formation?.trainer || '',
      '{{formation.prix}}': overrides['formation.prix'] || (formation?.price ? `${formation.price.toLocaleString('fr-FR')} €` : ''),
      '{{formation.certification}}': formation?.certification || '',
      
      // Dates (with overrides)
      '{{dates.inscription}}': formatDate(learner.enrollmentDate),
      '{{dates.debut}}': overrides['dates.debut'] ? formatDate(overrides['dates.debut']) : formatDate(formation?.startDate),
      '{{dates.fin}}': overrides['dates.fin'] ? formatDate(overrides['dates.fin']) : formatDate(formation?.endDate),
      '{{dates.aujourdhui}}': new Date().toLocaleDateString('fr-FR'),
      '{{dates.signature}}': new Date().toLocaleDateString('fr-FR'),
      
      // OF
      '{{of.nom}}': ofInfo.name,
      '{{of.siret}}': ofInfo.siret,
      '{{of.nda}}': ofInfo.nda,
      '{{of.adresse}}': ofInfo.address,
      '{{of.ville}}': ofInfo.city,
      '{{of.code_postal}}': ofInfo.postalCode,
      '{{of.telephone}}': ofInfo.phone,
      '{{of.email}}': ofInfo.email,
      '{{of.responsable}}': ofInfo.responsable,
    };

    let personalizedContent = htmlContent;
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      personalizedContent = personalizedContent.replace(regex, value || '—');
    });

    return personalizedContent;
  };

  const selectedLearnersDetails = useMemo(() => {
    return learners.filter(l => selectedLearners.includes(l.id));
  }, [learners, selectedLearners]);

  const previewLearner = useMemo(() => {
    return learners.find(l => l.id === previewLearnerId);
  }, [learners, previewLearnerId]);

  const previewContent = useMemo(() => {
    if (!template || !previewLearner) return '';
    return personalizeContent(
      template.htmlContent, 
      previewLearner, 
      learnerOverrides[previewLearner.id] || {}
    );
  }, [template, previewLearner, learnerOverrides]);

  const updateLearnerOverride = (learnerId: string, fieldKey: string, value: string) => {
    setLearnerOverrides(prev => ({
      ...prev,
      [learnerId]: {
        ...(prev[learnerId] || {}),
        [fieldKey]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep === 'select') {
      if (selectedLearners.length === 0) {
        toast({
          title: "Aucun apprenant sélectionné",
          description: "Veuillez sélectionner au moins un apprenant",
          variant: "destructive"
        });
        return;
      }
      setPreviewLearnerId(selectedLearners[0]);
      setCurrentStep('customize');
    } else if (currentStep === 'customize') {
      setCurrentStep('preview');
    } else if (currentStep === 'preview') {
      setCurrentStep('confirm');
    }
  };

  const handleBack = () => {
    if (currentStep === 'customize') {
      setCurrentStep('select');
    } else if (currentStep === 'preview') {
      setCurrentStep('customize');
    } else if (currentStep === 'confirm') {
      setCurrentStep('preview');
    }
  };

  const handleSend = async () => {
    if (!template) return;
    
    setIsSending(true);
    
    try {
      const personalizedDocs = selectedLearnersDetails.map(learner => ({
        templateId: template.id,
        type: template.type,
        phase: template.phase,
        title: `${template.title} - ${learner.firstName} ${learner.lastName}`,
        htmlContent: personalizeContent(template.htmlContent, learner, learnerOverrides[learner.id] || {}),
        learnerId: learner.id,
        learnerName: `${learner.firstName} ${learner.lastName}`,
        learnerEmail: learner.email,
        formationId: learner.formationId,
        formationName: learner.formationName,
        status: 'sent',
        requiresSignature: template.requiresSignature,
        sentAt: new Date().toISOString(),
        uniqueCode: `DOC-${Date.now()}-${learner.id.slice(-4)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      await onSend(personalizedDocs);

      toast({
        title: "Documents envoyés !",
        description: `${personalizedDocs.length} document(s) personnalisé(s) envoyé(s) avec succès`,
      });

      setSelectedLearners([]);
      setCurrentStep('select');
      setLearnerOverrides({});
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi des documents",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!template) return null;

  const steps = [
    { id: 'select', label: 'Sélection', icon: Users },
    { id: 'customize', label: 'Personnalisation', icon: Edit3 },
    { id: 'preview', label: 'Aperçu', icon: Eye },
    { id: 'confirm', label: 'Envoi', icon: Send }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Personnaliser et envoyer
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant="outline">{DOCUMENT_TYPE_LABELS[template.type]}</Badge>
            <Badge variant="secondary">{PHASES_CONFIG[template.phase].label}</Badge>
            {template.requiresSignature && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <FileSignature className="h-3 w-3 mr-1" />
                Signature requise
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 py-4">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isPast = index < currentStepIndex;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isPast ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 
                    isPast ? 'bg-green-100 text-green-600' : 
                    'bg-muted'
                  }`}>
                    {isPast ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="font-medium text-sm hidden sm:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${index < currentStepIndex ? 'bg-green-500' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <Separator />

        {/* Content */}
        <div className="flex-1 overflow-auto py-4">
          {/* Step 1: Selection */}
          {currentStep === 'select' && (
            <LearnerSelector
              learners={learners}
              formations={formations}
              selectedLearners={selectedLearners}
              onSelectionChange={setSelectedLearners}
              mode="multiple"
            />
          )}

          {/* Step 2: Customize */}
          {currentStep === 'customize' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-accent text-accent-foreground rounded-lg">
                <Edit3 className="h-5 w-5" />
                <p className="text-sm">
                  Personnalisez les informations pour chaque apprenant. Les champs modifiables sont pré-remplis automatiquement.
                </p>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-4 pr-4">
                  {selectedLearnersDetails.map((learner) => {
                    const formation = formations.find(f => f.id === learner.formationId);
                    const overrides = learnerOverrides[learner.id] || {};

                    return (
                      <Card key={learner.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <User className="h-4 w-4" />
                            {learner.firstName} {learner.lastName}
                            <Badge variant="outline" className="ml-auto text-xs">
                              {learner.formationName}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Date de début */}
                            <div className="space-y-2">
                              <Label className="text-sm">Date de début</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !overrides['dates.debut'] && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {overrides['dates.debut'] 
                                      ? format(new Date(overrides['dates.debut']), 'PPP', { locale: fr })
                                      : 'Sélectionner une date'
                                    }
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={overrides['dates.debut'] ? new Date(overrides['dates.debut']) : undefined}
                                    onSelect={(date) => updateLearnerOverride(learner.id, 'dates.debut', date?.toISOString() || '')}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Date de fin */}
                            <div className="space-y-2">
                              <Label className="text-sm">Date de fin</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !overrides['dates.fin'] && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {overrides['dates.fin'] 
                                      ? format(new Date(overrides['dates.fin']), 'PPP', { locale: fr })
                                      : 'Sélectionner une date'
                                    }
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={overrides['dates.fin'] ? new Date(overrides['dates.fin']) : undefined}
                                    onSelect={(date) => updateLearnerOverride(learner.id, 'dates.fin', date?.toISOString() || '')}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Durée */}
                            <div className="space-y-2">
                              <Label className="text-sm">Durée de formation</Label>
                              <Input
                                value={overrides['formation.duree'] || ''}
                                onChange={(e) => updateLearnerOverride(learner.id, 'formation.duree', e.target.value)}
                                placeholder="Ex: 35 heures"
                              />
                            </div>

                            {/* Lieu */}
                            <div className="space-y-2">
                              <Label className="text-sm">Lieu de formation</Label>
                              <Input
                                value={overrides['formation.lieu'] || ''}
                                onChange={(e) => updateLearnerOverride(learner.id, 'formation.lieu', e.target.value)}
                                placeholder="Ex: Paris - Centre"
                              />
                            </div>

                            {/* Prix */}
                            <div className="space-y-2">
                              <Label className="text-sm">Prix de la formation</Label>
                              <Input
                                value={overrides['formation.prix'] || ''}
                                onChange={(e) => updateLearnerOverride(learner.id, 'formation.prix', e.target.value)}
                                placeholder="Ex: 2 500 €"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 'preview' && (
            <div className="flex gap-4 h-full">
              {/* Learner tabs */}
              <div className="w-64 shrink-0">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Apprenants ({selectedLearners.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <ScrollArea className="h-[400px]">
                      {selectedLearnersDetails.map(learner => (
                        <button
                          key={learner.id}
                          onClick={() => setPreviewLearnerId(learner.id)}
                          className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                            previewLearnerId === learner.id 
                              ? 'bg-primary/10 border border-primary/20' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {learner.firstName} {learner.lastName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {learner.email}
                          </p>
                        </button>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Preview */}
              <div className="flex-1">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2 shrink-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Aperçu pour {previewLearner?.firstName} {previewLearner?.lastName}
                      </CardTitle>
                      {template.requiresSignature && (
                        <Badge variant="outline" className="text-xs">
                          <FileSignature className="h-3 w-3 mr-1" />
                          Signature requise
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-[400px]">
                      <div className="p-4">
                        <div 
                          className="prose prose-sm max-w-none bg-white rounded-lg shadow-sm border p-6"
                          dangerouslySetInnerHTML={{ __html: previewContent }}
                        />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {currentStep === 'confirm' && (
            <div className="space-y-4">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Send className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Prêt à envoyer</h3>
                      <p className="text-muted-foreground mt-1">
                        Vous allez envoyer <strong>{selectedLearners.length}</strong> document(s) personnalisé(s)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Document</p>
                      <p className="font-medium">{template.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Badge variant="outline">{DOCUMENT_TYPE_LABELS[template.type]}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phase</p>
                      <Badge variant="secondary">{PHASES_CONFIG[template.phase].label}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Signature</p>
                      <p className="font-medium">
                        {template.requiresSignature ? 'Requise' : 'Non requise'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Destinataires ({selectedLearners.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLearnersDetails.map(learner => (
                        <Badge key={learner.id} variant="secondary">
                          {learner.firstName} {learner.lastName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {template.requiresSignature && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800">
                      Les apprenants recevront une notification pour signer électroniquement ce document.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={currentStep === 'select' ? onClose : handleBack}>
            {currentStep === 'select' ? 'Annuler' : 'Retour'}
          </Button>

          <div className="flex items-center gap-4">
            {selectedLearners.length > 0 && currentStep !== 'confirm' && (
              <span className="text-sm text-muted-foreground">
                {selectedLearners.length} apprenant(s) sélectionné(s)
              </span>
            )}
            
            {currentStep === 'confirm' ? (
              <Button onClick={handleSend} disabled={isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer {selectedLearners.length} document(s)
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Continuer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
