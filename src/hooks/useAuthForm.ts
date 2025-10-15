import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { UserCreate, UserRole } from '@/types/fastapi';

export const useAuthForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();
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
        
        // Rediriger selon le rôle avec React Router
        const roleRedirects: Record<UserRole, string> = {
          apprenant: '/dashboard/apprenant',
          student: '/dashboard/apprenant',
          tutor: '/dashboard/tuteur',
          independent_trainer: '/formateur-independant',
          trainer: '/formateur-independant',
          superadmin: '/dashboard/superadmin',
          administrator: '/dashboard/admin',
          of_admin: '/dashboard/organisme-formation',
          gestionnaire: '/dashboard/gestionnaire',
          formateur_interne: '/dashboard/formateur-interne',
          createur_contenu: '/dashboard/createur-contenu',
          facilitator: '/dashboard/animateur',
          manager: '/dashboard/gestionnaire',
        };
        
        const redirectPath = roleRedirects[role] || '/dashboard/apprenant';
        navigate(redirectPath, { replace: true });
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
