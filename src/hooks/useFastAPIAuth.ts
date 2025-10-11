import { useState, useEffect } from 'react';
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
  const redirectByRole = (role: UserRole) => {
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
    window.location.href = redirectPath;
  };

  /**
   * Déconnexion
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/connexion';
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

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    redirectByRole,
    getUserRole,
  };
};
