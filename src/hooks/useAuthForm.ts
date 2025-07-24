
import { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

export const useAuthForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useSupabaseAuth();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const result = await signIn(email, password);
      if (result.error) {
        // Error is already handled in signIn with toast
        return;
      }
      // Success is handled in signIn with toast and redirect
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue s'est produite",
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
    role: 'student' | 'instructor' | 'tutor' | 'parent';
    isAdult: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const result = await signUp(userData);
      if (result.error) {
        // Error is already handled in signUp with toast
        return;
      }
      // Success is handled in signUp with toast and redirect
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur inattendue s'est produite",
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
  };
};
