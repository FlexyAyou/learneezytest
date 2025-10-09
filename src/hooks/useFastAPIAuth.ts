import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fastapiClient, 
  LoginRequest, 
  RegisterApprenantRequest,
  RegisterTuteurRequest,
  RegisterFormateurRequest,
  UserProfile 
} from '@/services/fastapi-client';
import { useToast } from '@/hooks/use-toast';

export const useFastAPIAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (fastapiClient.isAuthenticated()) {
          const userData = await fastapiClient.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        fastapiClient.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const authResponse = await fastapiClient.login({
        username: email,
        password: password,
      });

      // Get user profile
      fastapiClient.setAuthData(authResponse.access_token, {} as UserProfile);
      const userData = await fastapiClient.getCurrentUser();
      
      fastapiClient.setAuthData(authResponse.access_token, userData);
      setUser(userData);

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${userData.prenom || userData.email}`,
      });

      // Redirect based on role
      redirectByRole(userData.role);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Email ou mot de passe incorrect";
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerApprenant = async (data: RegisterApprenantRequest) => {
    setIsSubmitting(true);
    try {
      await fastapiClient.registerApprenant(data);
      
      toast({
        title: "Inscription réussie",
        description: "Vous pouvez maintenant vous connecter",
      });

      // Auto-login after registration
      await login(data.email, data.password);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erreur lors de l'inscription";
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerTuteur = async (data: RegisterTuteurRequest) => {
    setIsSubmitting(true);
    try {
      await fastapiClient.registerTuteur(data);
      
      toast({
        title: "Inscription réussie",
        description: "Vous pouvez maintenant vous connecter",
      });

      // Auto-login after registration
      await login(data.email, data.password);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erreur lors de l'inscription";
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerFormateur = async (data: RegisterFormateurRequest) => {
    setIsSubmitting(true);
    try {
      await fastapiClient.registerFormateur(data);
      
      toast({
        title: "Inscription réussie",
        description: "Vous pouvez maintenant vous connecter",
      });

      // Auto-login after registration
      await login(data.email, data.password);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erreur lors de l'inscription";
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    fastapiClient.clearAuthData();
    setUser(null);
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    });
    navigate('/connexion');
  };

  const redirectByRole = (role: string) => {
    const roleRedirects: { [key: string]: string } = {
      'apprenant': '/dashboard/apprenant',
      'tuteur': '/dashboard/tuteur',
      'formateur_independant': '/formateur-independant',
      'formateur_interne': '/formateur-interne',
      'admin': '/dashboard/superadmin',
    };

    const redirectPath = roleRedirects[role] || '/dashboard/apprenant';
    navigate(redirectPath);
  };

  return {
    user,
    isLoading,
    isSubmitting,
    isAuthenticated: !!user,
    login,
    registerApprenant,
    registerTuteur,
    registerFormateur,
    logout,
    redirectByRole,
  };
};
