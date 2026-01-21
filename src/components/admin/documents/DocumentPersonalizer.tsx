import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileSignature, 
  Send, 
  Eye, 
  User, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Download,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { LearnerSelector } from './LearnerSelector';
import { 
  DocumentTemplate, 
  Learner, 
  Formation, 
  OF,
  DYNAMIC_FIELDS,
  DOCUMENT_TYPE_LABELS,
  PHASES_CONFIG
} from './types';
import { useToast } from '@/hooks/use-toast';

interface DocumentPersonalizerProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate | null;
  learners: Learner[];
  formations: Formation[];
  ofInfo: OF;
  onSend: (personalizedDocuments: any[]) => void;
}

export const DocumentPersonalizer: React.FC<DocumentPersonalizerProps> = ({
  isOpen,
  onClose,
  template,
  learners,
  formations,
  ofInfo,
  onSend
}) => {
  const [selectedLearners, setSelectedLearners] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'preview' | 'confirm'>('select');
  const [previewLearnerId, setPreviewLearnerId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Personalize document content with learner data
  const personalizeContent = (htmlContent: string, learner: Learner): string => {
    const formation = formations.find(f => f.id === learner.formationId);
    
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
      
      // Formation
      '{{formation.nom}}': formation?.name || '',
      '{{formation.description}}': formation?.description || '',
      '{{formation.duree}}': formation?.duration || '',
      '{{formation.lieu}}': formation?.location || '',
      '{{formation.formateur}}': formation?.trainer || '',
      '{{formation.prix}}': formation?.price ? `${formation.price.toLocaleString('fr-FR')} €` : '',
      '{{formation.certification}}': formation?.certification || '',
      
      // Dates
      '{{dates.inscription}}': learner.enrollmentDate ? new Date(learner.enrollmentDate).toLocaleDateString('fr-FR') : '',
      '{{dates.debut}}': formation?.startDate ? new Date(formation.startDate).toLocaleDateString('fr-FR') : (learner.startDate ? new Date(learner.startDate).toLocaleDateString('fr-FR') : ''),
      '{{dates.fin}}': formation?.endDate ? new Date(formation.endDate).toLocaleDateString('fr-FR') : (learner.endDate ? new Date(learner.endDate).toLocaleDateString('fr-FR') : ''),
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
    return personalizeContent(template.htmlContent, previewLearner);
  }, [template, previewLearner]);

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
      setCurrentStep('preview');
    } else if (currentStep === 'preview') {
      setCurrentStep('confirm');
    }
  };

  const handleBack = () => {
    if (currentStep === 'preview') {
      setCurrentStep('select');
    } else if (currentStep === 'confirm') {
      setCurrentStep('preview');
    }
  };

  const handleSend = async () => {
    if (!template) return;
    
    setIsSending(true);
    
    try {
      // Generate personalized documents for each learner
      const personalizedDocs = selectedLearnersDetails.map(learner => ({
        templateId: template.id,
        type: template.type,
        phase: template.phase,
        title: `${template.title} - ${learner.firstName} ${learner.lastName}`,
        htmlContent: personalizeContent(template.htmlContent, learner),
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

      // Reset and close
      setSelectedLearners([]);
      setCurrentStep('select');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Personnaliser et envoyer
          </DialogTitle>
          <DialogDescription>
            {DOCUMENT_TYPE_LABELS[template.type]} - {PHASES_CONFIG[template.phase].label}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 py-4">
          {[
            { id: 'select', label: 'Sélection', icon: Users },
            { id: 'preview', label: 'Aperçu', icon: Eye },
            { id: 'confirm', label: 'Confirmation', icon: Send }
          ].map((step, index) => {
            const isActive = currentStep === step.id;
            const isPast = 
              (currentStep === 'preview' && step.id === 'select') ||
              (currentStep === 'confirm' && (step.id === 'select' || step.id === 'preview'));
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isPast ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-primary text-white' : 
                    isPast ? 'bg-green-100 text-green-600' : 
                    'bg-muted'
                  }`}>
                    {isPast ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="font-medium">{step.label}</span>
                </div>
                {index < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
              </React.Fragment>
            );
          })}
        </div>

        <Separator />

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {currentStep === 'select' && (
            <div className="py-4">
              <LearnerSelector
                learners={learners}
                formations={formations}
                selectedLearners={selectedLearners}
                onSelectionChange={setSelectedLearners}
                mode="multiple"
              />
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="flex gap-4 h-full py-4">
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
              <div className="flex-1 overflow-hidden">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2 shrink-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Eye className="h-4 w-4" />
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

          {currentStep === 'confirm' && (
            <div className="py-4 space-y-4">
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Send className="h-6 w-6 text-green-600" />
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
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                    <p className="text-sm">
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

          <div className="flex gap-2">
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
