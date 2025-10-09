
import { useState } from 'react';
import { useAuth } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export const useAuthForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      await login.mutateAsync({ email, password });
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      // Redirection sera gérée par le composant parent
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'student' | 'independant_trainer' | 'tutor';
  }) => {
    setIsSubmitting(true);
    try {
      await register.mutateAsync({
        ...userData,
        role: userData.role || 'student',
      });
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur s'est produite lors de la création du compte",
        variant: "destructive",
      });
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
    isLoading: isSubmitting, // Alias pour la compatibilité
  };
};
