import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { UserCreate, UserRole } from '@/types/fastapi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';

export const useAuthForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const { redirectByRole } = useFastAPIAuth();

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const tokenData = await login.mutateAsync({ email, password });
      
      // Vérifier le flag must_change_password dans le JWT
      const token = localStorage.getItem('access_token');
      if (token) {
        const { fastAPIClient } = await import('@/services/fastapi-client');
        const decoded = fastAPIClient.decodeToken(token);
        
        if (decoded?.must_change_password) {
          localStorage.setItem('must_change_password', 'true');
          toast({
            title: "Changement de mot de passe requis",
            description: "Veuillez définir un nouveau mot de passe pour sécuriser votre compte.",
          });
          navigate('/changer-mot-de-passe');
          return;
        }
      }

      toast({
        title: "Connexion réussie",
        description: "Redirection vers votre espace...",
      });
      
      // Forcer un petit délai pour laisser les tokens se synchroniser
      setTimeout(async () => {
        try {
          // Récupérer les données de l'utilisateur avec le nouveau token
          const userData = await import('@/services/fastapi-client').then(m => m.fastAPIClient.getCurrentUser());
          
          // Redirection basée sur le rôle
          redirectByRole(userData.role as UserRole, userData.of_id);
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          // Fallback: essayer de rediriger quand même avec le token
          const token = localStorage.getItem('access_token');
          if (token) {
            const { fastAPIClient } = await import('@/services/fastapi-client');
            const decoded = fastAPIClient.decodeToken(token);
            if (decoded?.role) {
              redirectByRole(decoded.role as UserRole);
            }
          }
        }
      }, 300);
      
    } catch (error: any) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (userData: UserCreate) => {
    setIsSubmitting(true);
    try {
      await register.mutateAsync(userData);
      toast({
        title: "Confirmation requise",
        description: "Un email vous est envoyé pour confirmer votre inscription",
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail?.[0]?.msg || 
                          error?.response?.data?.detail || 
                          "Une erreur s'est produite lors de la création du compte";
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleLogin,
    handleRegister,
    isSubmitting,
    showPassword,
    setShowPassword,
    isLoading: isSubmitting,
  };
};
