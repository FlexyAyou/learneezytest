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
        if (user.role === 'superadmin' || user.of_id === organization.organizationId) {
          // L'utilisateur peut accéder - ne rien faire si déjà sur une route dashboard
          if (location.pathname.startsWith('/dashboard')) {
            return;
          }
          // Si sur la homepage, rediriger vers dashboard
          if (location.pathname === '/') {
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
          // L'utilisateur n'appartient pas à cet OF
          navigate('/', { replace: true });
        }
      } else {
        // Utilisateur non connecté sur sous-domaine OF
        // Rediriger vers la page d'accueil de l'OF sauf si déjà sur /connexion
        if (location.pathname !== '/connexion' && location.pathname !== '/of-home' && location.pathname !== '/') {
          navigate('/of-home', { replace: true });
        } else if (location.pathname === '/') {
          navigate('/of-home', { replace: true });
        }
      }
    }
  }, [isOFContext, organization, isAuthenticated, user, navigate, location, orgLoading, authLoading]);

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
