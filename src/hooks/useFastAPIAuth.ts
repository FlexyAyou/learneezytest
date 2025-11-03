import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fastAPIClient } from '@/services/fastapi-client';
import { UserResponse, UserRole } from '@/types/fastapi';

/**
 * Hook d'authentification FastAPI
 * Gère le cycle de vie des tokens JWT et l'état utilisateur
 */
export const useFastAPIAuth = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  /**
   * Charge l'utilisateur au montage si token présent
   */
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await fastAPIClient.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Token invalide, nettoyage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Redirection automatique basée sur le rôle
   */
  const redirectByRole = (role: UserRole, userOfId?: number | null) => {
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
      manager: '/dashboard/technicien',
    };

    const redirectPath = roleRedirects[role] || '/dashboard/apprenant';
    navigate(redirectPath, { replace: true });
  };

  /**
   * Déconnexion avec appel API backend
   */
  const logout = async () => {
    try {
      await fastAPIClient.logoutUser();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Forcer le nettoyage local
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/connexion', { replace: true });
    }
  };

  /**
   * Obtenir le rôle depuis le JWT
   */
  const getUserRole = (): UserRole | null => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    const decoded = fastAPIClient.decodeToken(token);
    return decoded?.role || null;
  };

  /**
   * Mettre à jour l'utilisateur localement (sans appel API)
   */
  const updateUser = (updatedData: Partial<UserResponse>) => {
    setUser(prev => prev ? { ...prev, ...updatedData } : null);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    redirectByRole,
    getUserRole,
    updateUser,
  };
};
