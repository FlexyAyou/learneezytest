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
      
      // Décoder le JWT pour obtenir le rôle et l'of_id
      const token = localStorage.getItem('access_token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const role = decoded.role as UserRole;
        const ofId = decoded.of_id || null;
        
        toast({
          title: "Connexion réussie",
          description: "Redirection vers votre espace...",
        });
        
        // Utiliser redirectByRole avec of_id pour gérer les sous-domaines
        redirectByRole(role, ofId);
      }
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
