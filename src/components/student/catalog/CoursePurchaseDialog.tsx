import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { CourseResponse } from '@/types/fastapi';

interface CoursePurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: CourseResponse | null;
  userTokenBalance: number;
  onConfirm: (password: string) => void;
  isLoading: boolean;
  passwordError?: string;
}

export const CoursePurchaseDialog = ({
  open,
  onOpenChange,
  course,
  userTokenBalance,
  onConfirm,
  isLoading,
  passwordError,
}: CoursePurchaseDialogProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleConfirm = () => {
    if (password.trim()) {
      onConfirm(password);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword('');
      setShowPassword(false);
    }
    onOpenChange(newOpen);
  };

  const isFormValid = password.trim().length >= 1 && canAfford;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-pink-100 rounded-xl">
              <ShoppingCart className="h-5 w-5 text-pink-600" />
            </div>
            Confirmer l'achat
          </DialogTitle>
          <DialogDescription>
            Vérifiez les détails et confirmez avec votre mot de passe
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
                    <div className="w-full h-full flex items-center justify-center bg-pink-50">
                      <BookOpen className="h-8 w-8 text-pink-300" />
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
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-medium text-foreground flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-green-600" />
              Ce que vous obtenez
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Accès illimité au contenu du cours
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                {getTotalLessons()} leçons interactives
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                Certificat de complétion
              </li>
            </ul>
          </div>

          {/* Transaction Summary */}
          <Card className="border-2 border-pink-200 bg-pink-50/50">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Coins className="h-4 w-4 text-pink-600" />
                Récapitulatif
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Prix du cours</span>
                  <span className="font-semibold text-pink-600">{tokenPrice} tokens</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Votre solde actuel</span>
                  <span className="font-medium">{userTokenBalance} tokens</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Solde après achat</span>
                  <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-destructive'}`}>
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
                          handleOpenChange(false);
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

          {/* Password Confirmation */}
          {canAfford && (
            <div className="space-y-3">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Confirmez avec votre mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pr-10 ${passwordError ? 'border-destructive' : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isFormValid && !isLoading) {
                      handleConfirm();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {passwordError}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Pour votre sécurité, confirmez cet achat avec votre mot de passe de connexion.
              </p>
            </div>
          )}

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <Shield className="h-3.5 w-3.5" />
            <span>Transaction sécurisée • Accès immédiat après achat</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid || isLoading}
            className="gap-2 bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Vérification...
              </>
            ) : isFormValid ? (
              <>
                Confirmer l'achat
                <ArrowRight className="h-4 w-4" />
              </>
            ) : !canAfford ? (
              'Solde insuffisant'
            ) : (
              'Entrez votre mot de passe'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
