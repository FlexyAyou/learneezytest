import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Coins, 
  CreditCard, 
  Euro, 
  Loader2, 
  Shield, 
  Zap,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { TokenPackage } from './TokenPackageCard';
import { cn } from '@/lib/utils';

interface MockStripeCheckoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage: TokenPackage | null;
  onPaymentSuccess: () => void;
  isLoading: boolean;
}

type PaymentStep = 'form' | 'processing' | 'success' | 'error';

// Mock card validation
const validateCardNumber = (value: string): boolean => {
  const cleaned = value.replace(/\s/g, '');
  return cleaned.length === 16 && /^\d+$/.test(cleaned);
};

const validateExpiry = (value: string): boolean => {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;
  const now = new Date();
  const expiry = new Date(year, month - 1);
  return month >= 1 && month <= 12 && expiry > now;
};

const validateCVC = (value: string): boolean => {
  return /^\d{3,4}$/.test(value);
};

const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 16);
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

const formatExpiry = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  return cleaned;
};

export const MockStripeCheckout = ({
  open,
  onOpenChange,
  selectedPackage,
  onPaymentSuccess,
  isLoading
}: MockStripeCheckoutProps) => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!selectedPackage) return null;

  const totalTokens = selectedPackage.tokens + selectedPackage.bonus;

  const resetForm = () => {
    setStep('form');
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setCardholderName('');
    setErrors({});
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Nom requis';
    }
    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Numéro de carte invalide';
    }
    if (!validateExpiry(expiry)) {
      newErrors.expiry = 'Date invalide';
    }
    if (!validateCVC(cvc)) {
      newErrors.cvc = 'CVC invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setStep('processing');

    // Simulate Stripe payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock: 90% success rate, 10% random failure for demo
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      setStep('success');
      // Wait a bit then trigger the actual purchase
      setTimeout(() => {
        onPaymentSuccess();
        handleClose(false);
      }, 1500);
    } else {
      setStep('error');
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Order Summary */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Pack tokens</span>
          <div className="flex items-center gap-1 font-medium">
            <Coins className="h-4 w-4 text-token" />
            {selectedPackage.tokens} tokens
          </div>
        </div>
        {selectedPackage.bonus > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bonus (+{selectedPackage.bonusPercent}%)</span>
            <div className="flex items-center gap-1 font-medium text-bonus">
              <Zap className="h-4 w-4" />
              +{selectedPackage.bonus}
            </div>
          </div>
        )}
        <div className="border-t border-border pt-2 flex items-center justify-between">
          <span className="font-semibold">Total à payer</span>
          <span className="text-xl font-bold">{selectedPackage.amount}€</span>
        </div>
      </div>

      {/* Card Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardholderName">Nom sur la carte</Label>
          <Input
            id="cardholderName"
            placeholder="JEAN DUPONT"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
            className={cn(errors.cardholderName && 'border-destructive')}
          />
          {errors.cardholderName && (
            <p className="text-xs text-destructive">{errors.cardholderName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Numéro de carte</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className={cn('pr-12', errors.cardNumber && 'border-destructive')}
              maxLength={19}
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {errors.cardNumber && (
            <p className="text-xs text-destructive">{errors.cardNumber}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Utilisez 4242 4242 4242 4242 pour tester
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiration</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              className={cn(errors.expiry && 'border-destructive')}
              maxLength={5}
            />
            {errors.expiry && (
              <p className="text-xs text-destructive">{errors.expiry}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className={cn(errors.cvc && 'border-destructive')}
              maxLength={4}
              type="password"
            />
            {errors.cvc && (
              <p className="text-xs text-destructive">{errors.cvc}</p>
            )}
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
        <Lock className="h-4 w-4 text-success" />
        <span>Paiement sécurisé par Stripe. Vos données sont protégées.</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button 
          type="button"
          variant="outline" 
          onClick={() => handleClose(false)}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-token hover:bg-token/90 text-token-foreground"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Payer {selectedPackage.amount}€
        </Button>
      </div>
    </form>
  );

  const renderProcessing = () => (
    <div className="py-12 text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">Traitement en cours...</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Veuillez ne pas fermer cette fenêtre
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Connexion sécurisée avec Stripe</span>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="py-12 text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle2 className="h-8 w-8 text-success" />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-success">Paiement réussi !</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {totalTokens} tokens ont été ajoutés à votre compte
        </p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="py-8 text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-destructive">Échec du paiement</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Votre carte a été refusée. Veuillez réessayer.
        </p>
      </div>
      <Button 
        onClick={() => setStep('form')}
        variant="outline"
        className="mt-4"
      >
        Réessayer
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 bg-[#635bff]/10 rounded">
              <svg viewBox="0 0 60 25" className="h-5 w-auto" fill="#635bff">
                <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02 1.04-.06 1.48zm-8.14-2.66h4.38c0-1.65-.82-2.82-2.19-2.82-1.27 0-2.1 1.12-2.19 2.82zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-5.13L32.37 0v3.6l-4.13.88V.44zm-4.32 9.35v10.22H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.45-3.32.43zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.49-2.8.49-2.27 0-4.42-1.08-4.42-4.75V.44l4.1-.88v5.84h3.09v3.41h-3.1v5.7zm-8.2-3.32c0-4.19-3.2-7.09-7.02-7.09S-.02 8.11-.02 12.5C-.02 17.81 3.97 20 8.2 20c2.11 0 4.34-.64 5.86-2.02l-1.68-2.52c-1.21.81-2.73 1.29-4.06 1.29-1.65 0-3.1-.72-3.49-2.47h9.77c.02-.21.04-.9.04-1.53zm-9.83-1.44c.27-1.52 1.23-2.47 2.68-2.47 1.41 0 2.35.94 2.55 2.47H-2.66z" />
              </svg>
            </div>
            Paiement sécurisé
          </DialogTitle>
          {step === 'form' && (
            <DialogDescription>
              Entrez vos informations de paiement pour finaliser l'achat
            </DialogDescription>
          )}
        </DialogHeader>

        {step === 'form' && renderForm()}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && renderSuccess()}
        {step === 'error' && renderError()}
      </DialogContent>
    </Dialog>
  );
};
