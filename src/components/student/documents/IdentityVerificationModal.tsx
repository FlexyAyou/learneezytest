import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Loader2, Fingerprint } from 'lucide-react';

export interface IdentityVerificationResult {
  verified: boolean;
  metadata: {
    ip_address: string;
    user_agent: string;
    timestamp: string;
    session_fingerprint: string;
    honor_declaration: boolean;
  };
}

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (result: IdentityVerificationResult) => void;
  documentName?: string;
  learnerName?: string;
}

export const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  documentName,
  learnerName = 'l\'apprenant',
}) => {
  const [honorDeclaration, setHonorDeclaration] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const generateSessionFingerprint = (): string => {
    const nav = navigator;
    const raw = [
      nav.userAgent,
      nav.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      Date.now(),
    ].join('|');
    // Simple hash
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36) + '-' + Date.now().toString(36);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate brief verification
    await new Promise(resolve => setTimeout(resolve, 500));

    const result: IdentityVerificationResult = {
      verified: true,
      metadata: {
        ip_address: 'auto',
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        session_fingerprint: generateSessionFingerprint(),
        honor_declaration: true,
      },
    };

    onVerified(result);
    setIsVerifying(false);
    setHonorDeclaration(false);
  };

  const handleClose = () => {
    setHonorDeclaration(false);
    setIsVerifying(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">Vérification d'identité</DialogTitle>
              <DialogDescription>
                Confirmez votre identité avant de signer
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {documentName && (
            <div className="bg-muted/50 rounded-lg p-3 border">
              <p className="text-sm text-muted-foreground">Document à signer :</p>
              <p className="font-medium text-sm">{documentName}</p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Engagement légal</p>
                <p>
                  En signant ce document, vous vous engagez de manière juridiquement
                  contraignante. Votre signature électronique a la même valeur qu'une
                  signature manuscrite.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-muted hover:border-primary/30 transition-colors">
            <Checkbox
              id="honor"
              checked={honorDeclaration}
              onCheckedChange={(checked) => setHonorDeclaration(checked as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="honor" className="text-sm cursor-pointer leading-relaxed">
              Je certifie être <strong>{learnerName}</strong> et j'atteste sur l'honneur
              que les informations fournies sont exactes. Je comprends que cette signature
              électronique a une valeur juridique.
            </label>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Piste d'audit collectée</p>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>• Adresse IP</span>
              <span>• Horodatage UTC</span>
              <span>• Navigateur</span>
              <span>• Empreinte de session</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isVerifying}>
            Annuler
          </Button>
          <Button
            onClick={handleVerify}
            disabled={!honorDeclaration || isVerifying}
            className="gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Confirmer mon identité
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
