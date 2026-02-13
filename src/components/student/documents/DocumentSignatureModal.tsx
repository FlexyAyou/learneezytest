
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ElectronicSignature } from '@/components/common/ElectronicSignature';
import {
  FileText,
  Download,
  CheckCircle,
  Eye,
  Loader2,
  FileSignature,
  AlertCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { StudentDocumentPreviewModal } from './StudentDocumentPreviewModal';

interface DocumentToSign {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  formationName: string;
  date: string;
  size: string;
}

interface DocumentSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentToSign | null;
  onSignatureComplete: (documentId: string, signatureData: string) => void;
  htmlContent?: string;
}

export const DocumentSignatureModal = ({
  isOpen,
  onClose,
  document,
  onSignatureComplete,
  htmlContent
}: DocumentSignatureModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'preview' | 'sign' | 'success'>('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [hasReadDocument, setHasReadDocument] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreviewDocument = () => {
    if (htmlContent) {
      setPreviewOpen(true);
      setHasReadDocument(true);
      return;
    }
    toast({
      title: "Aperçu du document",
      description: `Ouverture de ${document?.name} en cours...`,
    });
    setHasReadDocument(true);
  };

  const handleDownload = () => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${document?.name}...`,
    });
  };

  const handleSignatureComplete = async (signatureData: string) => {
    if (!document) return;

    setIsLoading(true);

    try {
      await onSignatureComplete(document.id, signatureData);
      setStep('success');

      toast({
        title: "✅ Document signé !",
        description: `${document.name} a été signé avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors de la signature:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la signature.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('preview');
    setHasReadDocument(false);
    setAcceptTerms(false);
    setPreviewOpen(false);
    onClose();
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-pink-50 to-rose-50 border-b">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <FileSignature className="h-6 w-6 text-pink-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-gray-900">
                Signature de document
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                {document.typeLabel}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {step === 'preview' ? 'Étape 1/2' : step === 'sign' ? 'Étape 2/2' : 'Terminé'}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6">
            {step === 'preview' && (
              <div className="space-y-6">
                {/* Document info card */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-10 w-10 text-pink-500" />
                      <div>
                        <p className="font-semibold text-gray-900">{document.name}</p>
                        <p className="text-sm text-gray-500">
                          {document.formationName} • {document.size} • {document.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviewDocument}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Visualiser
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Avant de signer
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Veuillez lire attentivement le document avant de procéder à la signature.
                        Une fois signé, le document sera archivé et vous recevrez une confirmation par email.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-pink-200 hover:bg-pink-50/30 transition-colors">
                    <Checkbox
                      id="read"
                      checked={hasReadDocument}
                      onCheckedChange={(checked) => setHasReadDocument(checked as boolean)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor="read"
                      className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                    >
                      J'ai lu et compris l'intégralité du document
                    </label>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-pink-200 hover:bg-pink-50/30 transition-colors">
                    <Checkbox
                      id="accept"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor="accept"
                      className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                    >
                      J'accepte les conditions et je souhaite procéder à la signature électronique
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 'sign' && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Signez ci-dessous
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Utilisez votre souris ou votre doigt pour dessiner votre signature
                  </p>
                </div>

                <ElectronicSignature
                  onSignatureComplete={handleSignatureComplete}
                  disabled={isLoading}
                />

                {isLoading && (
                  <div className="flex items-center justify-center gap-2 text-pink-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Enregistrement de la signature...</span>
                  </div>
                )}
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Document signé avec succès !
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Votre signature a été enregistrée. Un email de confirmation vous sera envoyé.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 inline-block">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-700">{document.name}</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Signé
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          {step === 'preview' && (
            <>
              <Button variant="ghost" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                onClick={() => setStep('sign')}
                disabled={!hasReadDocument || !acceptTerms}
                className="bg-pink-600 hover:bg-pink-700 gap-2"
              >
                <FileSignature className="h-4 w-4" />
                Passer à la signature
              </Button>
            </>
          )}

          {step === 'sign' && (
            <>
              <Button variant="ghost" onClick={() => setStep('preview')} disabled={isLoading}>
                Retour
              </Button>
              <div className="text-sm text-gray-500">
                Dessinez puis cliquez sur "Valider la signature"
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <div />
              <Button
                onClick={handleClose}
                className="bg-green-600 hover:bg-green-700"
              >
                Terminer
              </Button>
            </>
          )}
        </div>
      </DialogContent>

      {/* Document Preview Modal */}
      {htmlContent && (
        <StudentDocumentPreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={document?.typeLabel || document?.name || 'Document'}
          htmlContent={htmlContent}
        />
      )}
    </Dialog>
  );
};
