import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SignatureField, SignatureFieldType, FIELD_CONFIG } from '@/types/document-fields';
import { DocumentPhase, PHASES_CONFIG, Learner } from './types';
import { PDFFieldOverlay } from './PDFFieldOverlay';
import { FieldsPalette } from './FieldsPalette';
import { Upload, FileText, ArrowLeft, ArrowRight, Send, X, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentPreparerProps {
  isOpen: boolean;
  onClose: () => void;
  learners: Learner[];
  onSend: (file: File, fields: SignatureField[], phase: DocumentPhase, learnerIds: string[], title: string) => Promise<void>;
}

export const DocumentPreparer: React.FC<DocumentPreparerProps> = ({
  isOpen,
  onClose,
  learners,
  onSend,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'upload' | 'prepare' | 'configure' | 'sending'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<SignatureField[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState<DocumentPhase>('inscription');
  const [selectedLearners, setSelectedLearners] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setTitle(selected.name.replace(/\.pdf$/i, ''));
      setStep('prepare');
    } else {
      toast({ title: 'Erreur', description: 'Veuillez sélectionner un fichier PDF', variant: 'destructive' });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
      setTitle(dropped.name.replace(/\.pdf$/i, ''));
      setStep('prepare');
    }
  };

  const handleAddField = useCallback((type: SignatureFieldType) => {
    const config = FIELD_CONFIG[type];
    const newField: SignatureField = {
      id: crypto.randomUUID(),
      type,
      page: currentPage,
      x: 50 - config.defaultWidth / 2,
      y: 50 - config.defaultHeight / 2,
      width: config.defaultWidth,
      height: config.defaultHeight,
      required: type === 'signature',
    };
    setFields(prev => [...prev, newField]);
  }, [currentPage]);

  const handleFieldUpdate = useCallback((id: string, updates: Partial<SignatureField>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const handleFieldDelete = useCallback((id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  }, []);

  const toggleLearner = (id: string) => {
    setSelectedLearners(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (!file) return;
    setIsSending(true);
    setStep('sending');
    try {
      await onSend(file, fields, phase, selectedLearners, title);
      toast({ title: '✅ Document envoyé', description: `${title} envoyé à ${selectedLearners.length} apprenant(s)` });
      handleClose();
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur', description: "Erreur lors de l'envoi", variant: 'destructive' });
      setStep('configure');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setFields([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTitle('');
    setPhase('inscription');
    setSelectedLearners([]);
    onClose();
  };

  const canProceedToConfigure = fields.length > 0;
  const canSend = selectedLearners.length > 0 && title.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-[90vh] p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-background">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              {step === 'upload' ? 'Envoyer un document' :
               step === 'prepare' ? 'Préparer le document' :
               step === 'configure' ? 'Configuration & envoi' : 'Envoi en cours...'}
            </h2>
            {file && step !== 'upload' && (
              <Badge variant="outline" className="text-xs">{file.name}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step === 'prepare' && (
              <Badge variant="secondary">{fields.length} champ(s) placé(s)</Badge>
            )}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div
                className="w-full max-w-lg border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Déposez votre PDF ici</h3>
                <p className="text-sm text-muted-foreground mb-4">ou cliquez pour sélectionner un fichier</p>
                <Button variant="outline">Parcourir</Button>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
          )}

          {/* Step 2: Prepare */}
          {step === 'prepare' && file && (
            <>
              <PDFFieldOverlay
                pdfFile={file}
                fields={fields}
                onFieldUpdate={handleFieldUpdate}
                onFieldDelete={handleFieldDelete}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={totalPages}
                onTotalPagesChange={setTotalPages}
              />
              <FieldsPalette onAddField={handleAddField} />
            </>
          )}

          {/* Step 3: Configure */}
          {step === 'configure' && (
            <div className="flex-1 p-8 overflow-auto">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre du document</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Convention de formation" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phase de formation</label>
                  <Select value={phase} onValueChange={(v) => setPhase(v as DocumentPhase)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(PHASES_CONFIG) as [DocumentPhase, typeof PHASES_CONFIG.inscription][]).map(([p, config]) => (
                        <SelectItem key={p} value={p}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Apprenants destinataires</label>
                  <div className="border rounded-lg max-h-60 overflow-auto">
                    {learners.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground text-center">Aucun apprenant trouvé</p>
                    ) : learners.map(l => (
                      <label
                        key={l.id}
                        className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLearners.includes(l.id)}
                          onChange={() => toggleLearner(l.id)}
                          className="rounded"
                        />
                        <div>
                          <p className="text-sm font-medium">{l.firstName} {l.lastName}</p>
                          <p className="text-xs text-muted-foreground">{l.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {selectedLearners.length > 0 && (
                    <p className="text-xs text-muted-foreground">{selectedLearners.length} apprenant(s) sélectionné(s)</p>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Récapitulatif</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📄 {file?.name}</p>
                    <p>✍️ {fields.length} zone(s) de champ(s)</p>
                    <p>📋 {PHASES_CONFIG[phase].label}</p>
                    <p>👥 {selectedLearners.length} destinataire(s)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Sending */}
          {step === 'sending' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-lg font-medium">Envoi en cours...</p>
                <p className="text-sm text-muted-foreground">Upload et assignation du document</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t bg-background">
          <div>
            {step === 'prepare' && (
              <Button variant="ghost" onClick={() => { setFile(null); setFields([]); setStep('upload'); }}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Changer de fichier
              </Button>
            )}
            {step === 'configure' && (
              <Button variant="ghost" onClick={() => setStep('prepare')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la préparation
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>Annuler</Button>
            {step === 'prepare' && (
              <Button onClick={() => setStep('configure')} disabled={!canProceedToConfigure}>
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {step === 'configure' && (
              <Button onClick={handleSend} disabled={!canSend || isSending} className="gap-2">
                <Send className="h-4 w-4" />
                Envoyer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
