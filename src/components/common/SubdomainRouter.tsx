import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import LoadingSpinner from './LoadingSpinner';

interface SubdomainRouterProps {
  children: React.ReactNode;
}

/**
 * Composant qui gère la redirection automatique pour les sous-domaines OF
 */
const SubdomainRouter: React.FC<SubdomainRouterProps> = ({ children }) => {
  const { organization, isOFContext, isLoading: orgLoading } = useOrganization();
  const { isAuthenticated, user, isLoading: authLoading } = useFastAPIAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Attendre que les deux soient chargés
    if (orgLoading || authLoading) return;

    // Si on est sur un sous-domaine OF
    if (isOFContext && organization?.exists) {
      // Si l'utilisateur est connecté
      if (isAuthenticated && user) {
        // Vérifier qu'il appartient à cet OF (sauf superadmin)
        const userBelongsToOF = user.role === 'superadmin' || 
          (user.of_id !== null && user.of_id !== undefined && 
           organization.organizationId !== null && organization.organizationId !== undefined &&
           Number(user.of_id) === Number(organization.organizationId));

        if (!userBelongsToOF) {
          // L'utilisateur n'appartient pas à cet OF - le déconnecter
          console.warn('User does not belong to this organization');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          if (location.pathname !== '/connexion') {
            navigate('/connexion', { replace: true });
          }
          return;
        }
        
        // Si sur la homepage ou of-home, rediriger vers dashboard
        if (location.pathname === '/' || location.pathname === '/of-home') {
          const roleRedirects: Record<string, string> = {
            of_admin: '/dashboard/organisme-formation',
            gestionnaire: '/dashboard/gestionnaire',
            formateur_interne: '/dashboard/formateur-interne',
            apprenant: '/dashboard/apprenant',
            student: '/dashboard/apprenant',
          };
          const dashboardPath = roleRedirects[user.role] || '/dashboard/apprenant';
          navigate(dashboardPath, { replace: true });
        }
      } else {
        // Utilisateur non connecté sur sous-domaine OF
        // Autoriser les pages publiques : /of-home, /connexion, /mot-de-passe-oublie, /reset-password
        const allowedPaths = ['/of-home', '/connexion', '/mot-de-passe-oublie', '/reset-password'];
        
        if (!allowedPaths.includes(location.pathname) && location.pathname !== '/') {
          navigate('/of-home', { replace: true });
        } else if (location.pathname === '/') {
          navigate('/of-home', { replace: true });
        }
      }
    }
  }, [isOFContext, organization?.exists, organization?.organizationId, isAuthenticated, user?.role, user?.of_id, location.pathname, orgLoading, authLoading, navigate]);

  if (orgLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};

export default SubdomainRouter;
