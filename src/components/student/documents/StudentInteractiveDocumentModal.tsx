import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Eye,
  FileSignature,
  CheckCircle,
  Loader2,
  Printer,
  Download,
  Info,
} from 'lucide-react';
import { ElectronicSignature } from '@/components/common/ElectronicSignature';
import { IdentityVerificationModal, type IdentityVerificationResult } from './IdentityVerificationModal';
import { useToast } from '@/hooks/use-toast';

interface StudentInteractiveDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    type: string;
    typeLabel: string;
    formationName: string;
    date: string;
    size: string;
  } | null;
  htmlContent?: string;
  learnerSignature?: string;
  signedAt?: string;
  onSignatureComplete: (
    documentId: string,
    signatureData: string,
    metadata: IdentityVerificationResult['metadata']
  ) => Promise<void>;
}

export const StudentInteractiveDocumentModal: React.FC<StudentInteractiveDocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  htmlContent,
  learnerSignature,
  signedAt,
  onSignatureComplete,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'preview' | 'verify' | 'sign' | 'success'>('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<IdentityVerificationResult | null>(null);

  const isSigned = !!learnerSignature || !!signedAt;

  const handleProceedToSign = () => {
    setStep('verify');
  };

  const handleVerified = (result: IdentityVerificationResult) => {
    setVerificationResult(result);
    setStep('sign');
  };

  const handleSignatureComplete = async (signatureData: string) => {
    if (!document || !verificationResult) return;
    setIsLoading(true);
    try {
      await onSignatureComplete(document.id, signatureData, verificationResult.metadata);
      setStep('success');
      toast({
        title: '✅ Document signé !',
        description: `${document.name} a été signé avec succès.`,
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de signer le document.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!htmlContent) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html><html><head><title>${document?.name || ''}</title>
        <style>body{font-family:'Times New Roman',serif;padding:20px;line-height:1.6}
        table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}
        @media print{body{padding:0}}</style></head><body>${htmlContent}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleClose = () => {
    setStep('preview');
    setVerificationResult(null);
    onClose();
  };

  if (!document) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="p-5 pb-3 border-b bg-muted/30">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg">{document.name}</DialogTitle>
                  <DialogDescription className="mt-0.5">
                    {document.typeLabel} • {document.formationName}
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSigned && (
                  <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                    <CheckCircle className="h-3 w-3" /> Signé
                  </Badge>
                )}
                <Badge variant="secondary">
                  {step === 'preview' ? 'Lecture' : step === 'sign' ? 'Signature' : step === 'success' ? 'Terminé' : 'Vérification'}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {step === 'preview' && (
            <>
              {/* Document toolbar */}
              <div className="flex items-center justify-between px-5 py-2 border-b bg-background">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
                    <Printer className="h-3.5 w-3.5" /> Imprimer
                  </Button>
                </div>
                {!isSigned && (
                  <Button size="sm" onClick={handleProceedToSign} className="gap-1.5">
                    <FileSignature className="h-3.5 w-3.5" /> Signer ce document
                  </Button>
                )}
              </div>

              {/* HTML document */}
              <ScrollArea className="max-h-[calc(95vh-160px)]">
                <div className="p-8 bg-white min-h-[600px]">
                  {htmlContent ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-96 text-muted-foreground">
                      <p>Aucun contenu disponible pour ce document.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}

          {step === 'sign' && (
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Identité vérifiée</p>
                    <p className="mt-1">Vous pouvez maintenant apposer votre signature électronique.</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-foreground">Signez ci-dessous</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Utilisez votre souris ou votre doigt pour dessiner votre signature
                </p>
              </div>

              <ElectronicSignature
                onSignatureComplete={handleSignatureComplete}
                disabled={isLoading}
              />

              {isLoading && (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Enregistrement de la signature...</span>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12 px-6 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Document signé avec succès !</h3>
                <p className="text-muted-foreground mt-2">
                  Votre signature a été enregistrée. Un email de confirmation vous sera envoyé.
                </p>
              </div>
              <Button onClick={handleClose} className="mt-4">Terminer</Button>
            </div>
          )}

          {/* Footer for sign step */}
          {step === 'sign' && (
            <div className="p-4 border-t bg-muted/30 flex justify-between">
              <Button variant="ghost" onClick={() => setStep('preview')} disabled={isLoading}>
                Retour au document
              </Button>
              <span className="text-sm text-muted-foreground self-center">
                Dessinez puis cliquez sur "Valider la signature"
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Identity verification modal */}
      <IdentityVerificationModal
        isOpen={step === 'verify'}
        onClose={() => setStep('preview')}
        onVerified={handleVerified}
        documentName={document.name}
      />
    </>
  );
};
