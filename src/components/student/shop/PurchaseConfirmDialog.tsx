import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, CreditCard, Euro, Loader2, Shield, Zap } from 'lucide-react';
import { TokenPackage } from './TokenPackageCard';

interface PurchaseConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage: TokenPackage | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export const PurchaseConfirmDialog = ({
  open,
  onOpenChange,
  selectedPackage,
  onConfirm,
  isLoading
}: PurchaseConfirmDialogProps) => {
  if (!selectedPackage) return null;

  const totalTokens = selectedPackage.tokens + selectedPackage.bonus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Confirmer votre achat
          </DialogTitle>
          <DialogDescription>
            Vérifiez les détails de votre commande avant de procéder au paiement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Purchase summary */}
          <div className="bg-token-muted rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Montant</span>
              <div className="flex items-center gap-1 font-semibold">
                <Euro className="h-4 w-4" />
                {selectedPackage.amount}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tokens</span>
              <div className="flex items-center gap-1 font-semibold text-token">
                <Coins className="h-4 w-4" />
                {selectedPackage.tokens}
              </div>
            </div>

            {selectedPackage.bonus > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bonus (+{selectedPackage.bonusPercent}%)</span>
                <div className="flex items-center gap-1 font-semibold text-bonus">
                  <Zap className="h-4 w-4" />
                  +{selectedPackage.bonus}
                </div>
              </div>
            )}

            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="font-medium">Total tokens</span>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-token" />
                <span className="text-xl font-bold text-token">{totalTokens}</span>
              </div>
            </div>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <Shield className="h-4 w-4 text-success" />
            <span>Paiement sécurisé. Vos tokens seront crédités instantanément.</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-token hover:bg-token/90 text-token-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Payer {selectedPackage.amount}€
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
