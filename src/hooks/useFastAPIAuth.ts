import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fastAPIClient } from '@/services/fastapi-client';
import { UserResponse, UserRole } from '@/types/fastapi';

/**
 * Hook d'authentification FastAPI
 * Gère le cycle de vie des tokens JWT et l'état utilisateur de manière réactive
 */
export const useFastAPIAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Utiliser useQuery pour charger et mettre en cache l'utilisateur
  // Cela rend l'état global et réactif à travers tous les composants
  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      try {
        return await fastAPIClient.getCurrentUser();
      } catch (error) {
        // En cas d'erreur (token expiré), on nettoie
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isAuthenticated = !!user;

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
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear();
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
    queryClient.setQueryData(['currentUser'], (old: UserResponse | null) =>
      old ? { ...old, ...updatedData } : null
    );
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    redirectByRole,
    getUserRole,
    updateUser,
    refetch,
  };
};
