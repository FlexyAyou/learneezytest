import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { fastAPIClient } from '@/services/fastapi-client';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useToast } from '@/hooks/use-toast';

export interface IdentityProof {
  ip: string;
  user_agent: string;
  identity_verified_at: string;
  honor_declaration: boolean;
  fingerprint: string;
}

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (proof: IdentityProof) => void;
}

const generateFingerprint = (): string => {
  const nav = window.navigator;
  const screen = window.screen;
  const raw = [
    nav.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    nav.hardwareConcurrency,
    nav.platform,
  ].join('|');
  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

export const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
}) => {
  const { user } = useFastAPIAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [honorChecked, setHonorChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    : '';

  const canSubmit = password.length > 0 && honorChecked && !isVerifying;

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;
    setIsVerifying(true);
    setError(null);

    try {
      // Verify password via login
      await fastAPIClient.login({ email: user.email, password });

      // Collect metadata
      let ip = 'unknown';
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
      } catch {
        // IP collection is best-effort
      }

      const proof: IdentityProof = {
        ip,
        user_agent: navigator.userAgent,
        identity_verified_at: new Date().toISOString(),
        honor_declaration: true,
        fingerprint: generateFingerprint(),
      };

      onVerified(proof);
      handleClose();
    } catch (err: any) {
      setError('Mot de passe incorrect. Veuillez réessayer.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    setHonorChecked(false);
    setError(null);
    setIsVerifying(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Vérification d'identité</DialogTitle>
              <DialogDescription>
                Confirmez votre identité avant de signer ce document
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="verify-password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="verify-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Entrez votre mot de passe"
                onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleSubmit()}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </div>
            )}
          </div>

          {/* Honor declaration */}
          <div className="flex items-start gap-3 p-3 border rounded-lg bg-muted/50">
            <Checkbox
              id="honor-declaration"
              checked={honorChecked}
              onCheckedChange={(checked) => setHonorChecked(checked === true)}
              className="mt-0.5"
            />
            <Label htmlFor="honor-declaration" className="text-sm leading-relaxed cursor-pointer font-normal">
              Je certifie être <span className="font-semibold">{fullName}</span> et j'atteste sur
              l'honneur que cette signature est la mienne.
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isVerifying}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              'Continuer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
