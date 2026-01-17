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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Coins,
  Clock,
  BookOpen,
  CheckCircle,
  ShoppingCart,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { CourseResponse } from '@/types/fastapi';

interface CoursePurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: CourseResponse | null;
  userTokenBalance: number;
  onConfirm: () => void;
  isLoading: boolean;
}

export const CoursePurchaseDialog = ({
  open,
  onOpenChange,
  course,
  userTokenBalance,
  onConfirm,
  isLoading,
}: CoursePurchaseDialogProps) => {
  if (!course) return null;

  const tokenPrice = course.price || 0;
  const canAfford = userTokenBalance >= tokenPrice;
  const remainingBalance = userTokenBalance - tokenPrice;

  const getTotalLessons = () => {
    return course.modules?.reduce((total, module) => total + (module.content?.length || 0), 0) || 0;
  };

  const getTotalModules = () => {
    return course.modules?.length || 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-token-muted rounded-xl">
              <ShoppingCart className="h-5 w-5 text-token" />
            </div>
            Confirmer l'achat
          </DialogTitle>
          <DialogDescription>
            Vérifiez les détails avant de confirmer votre inscription
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Course Preview */}
          <Card className="overflow-hidden border-border/50">
            <CardContent className="p-0">
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  {course.image_url || (course.thumbnails && course.thumbnails.length > 0) ? (
                    <img
                      src={course.image_url || course.thumbnails![0]}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-token/20">
                      <BookOpen className="h-8 w-8 text-primary/50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.duration || 'Flexible'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{getTotalModules()} modules</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What you get */}
          <div className="bg-success/5 border border-success/20 rounded-xl p-4">
            <h4 className="font-medium text-foreground flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-success" />
              Ce que vous obtenez
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                Accès illimité au contenu du cours
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                {getTotalLessons()} leçons interactives
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                Certificat de complétion
              </li>
            </ul>
          </div>

          {/* Transaction Summary */}
          <Card className="border-2 border-token/30 bg-token/5">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Coins className="h-4 w-4 text-token" />
                Récapitulatif
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Prix du cours</span>
                  <span className="font-semibold text-token">{tokenPrice} tokens</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Votre solde actuel</span>
                  <span className="font-medium">{userTokenBalance} tokens</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Solde après achat</span>
                  <span className={`font-bold ${canAfford ? 'text-success' : 'text-destructive'}`}>
                    {canAfford ? remainingBalance : userTokenBalance} tokens
                  </span>
                </div>
              </div>

              {!canAfford && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg mt-3">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      Solde insuffisant
                    </p>
                    <p className="text-xs text-destructive/80">
                      Il vous manque {tokenPrice - userTokenBalance} tokens.{' '}
                      <button 
                        className="underline font-medium hover:text-destructive"
                        onClick={() => {
                          onOpenChange(false);
                          window.location.href = '/dashboard/apprenant/boutique';
                        }}
                      >
                        Recharger votre solde
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <Shield className="h-3.5 w-3.5" />
            <span>Transaction sécurisée • Accès immédiat après achat</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!canAfford || isLoading}
            className={`gap-2 ${
              canAfford 
                ? 'bg-gradient-to-r from-token to-primary hover:from-token/90 hover:to-primary/90' 
                : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Traitement...
              </>
            ) : canAfford ? (
              <>
                Confirmer l'achat
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              'Solde insuffisant'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
