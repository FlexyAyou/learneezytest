import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { fastAPIClient } from '@/services/fastapi-client';
import { UserRole } from '@/types/fastapi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';

const ForceChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { redirectByRole } = useFastAPIAuth();

  const isValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword &&
    newPassword !== currentPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await fastAPIClient.post('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      // Supprimer le flag local
      localStorage.removeItem('must_change_password');

      toast({
        title: 'Mot de passe mis à jour',
        description: 'Vous pouvez maintenant accéder à votre espace.',
      });

      // Récupérer le rôle et rediriger
      const userData = await fastAPIClient.getCurrentUser();
      redirectByRole(userData.role as UserRole, userData.of_id);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Impossible de changer le mot de passe',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-pink-100 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-pink-600" />
          </div>
          <CardTitle className="text-2xl">Changement de mot de passe requis</CardTitle>
          <CardDescription>
            Pour sécuriser votre compte, veuillez définir un nouveau mot de passe avant de continuer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe temporaire</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="currentPassword"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Mot de passe reçu par email"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="8 caractères minimum"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p className="text-xs text-red-500">Le mot de passe doit contenir au moins 8 caractères</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Confirmez le mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                <p className="text-xs text-red-500">Les mots de passe ne correspondent pas</p>
              )}
              {newPassword.length > 0 && newPassword === currentPassword && (
                <p className="text-xs text-red-500">Le nouveau mot de passe doit être différent de l'ancien</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Mise à jour...' : 'Définir mon nouveau mot de passe'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForceChangePassword;
