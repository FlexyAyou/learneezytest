import { useState } from 'react';
import { useAuth } from '@/hooks/useApi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useToast } from '@/hooks/use-toast';
import { UserCreate, UserRole } from '@/types/fastapi';

export const useAuthForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const { redirectByRole } = useFastAPIAuth();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const tokenData = await login.mutateAsync({ email, password });
      
      // Décoder le JWT pour obtenir le rôle et rediriger
      const token = localStorage.getItem('access_token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const role = decoded.role as UserRole;
        
        toast({
          title: "Connexion réussie",
          description: "Redirection vers votre espace...",
        });
        
        // Rediriger selon le rôle
        redirectByRole(role);
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
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
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
