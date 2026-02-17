import React, { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import LoadingSpinner from './LoadingSpinner';

interface SubdomainRouterProps {
  children: React.ReactNode;
}

// Routes publiques autorisées sur un sous-domaine OF
const OF_PUBLIC_ROUTES = [
  '/connexion',
  '/connexion-of',
  '/mot-de-passe-oublie',
  '/mot-de-passe-oublié',
  '/reinitialiser-mot-de-passe',
];

// Routes explicitement bloquées sur un sous-domaine OF
const OF_BLOCKED_ROUTES = [
  '/inscription',
];

// Routes de dashboard (protégées)
const DASHBOARD_ROUTES = [
  '/dashboard/apprenant',
  '/dashboard/organisme-formation',
  '/dashboard/gestionnaire',
  '/dashboard/formateur-interne',
];

/**
 * Composant qui gère la redirection automatique pour les sous-domaines OF
 * - Redirige vers /connexion-of si non authentifié sur un sous-domaine OF
 * - Redirige vers le dashboard approprié après connexion
 */
const SubdomainRouter: React.FC<SubdomainRouterProps> = ({ children }) => {
  const { organization, isOFContext, isLoading: orgLoading } = useOrganization();
  const { isAuthenticated: apiAuthenticated, user, isLoading: authLoading } = useFastAPIAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [wasAuthenticated, setWasAuthenticated] = React.useState(false);
  const [hasRedirected, setHasRedirected] = React.useState(false);

  // Vérification hybride (API + Token local) pour éviter les sauts d'état
  const isAuthenticated = useMemo(() => {
    return apiAuthenticated || !!localStorage.getItem('access_token');
  }, [apiAuthenticated]);

  // Stabiliser les valeurs avec useMemo pour éviter les re-renders inutiles
  const userRole = useMemo(() => user?.role, [user?.role]);
  const userOfId = useMemo(() => user?.of_id, [user?.of_id]);
  const orgId = useMemo(() => organization?.organizationId, [organization?.organizationId]);
  const orgExists = useMemo(() => organization?.exists, [organization?.exists]);

  // Vérifier si la route actuelle est une route publique OF
  const isPublicOFRoute = useMemo(() => {
    return OF_PUBLIC_ROUTES.some(route => location.pathname === route || location.pathname.startsWith(route + '/'));
  }, [location.pathname]);

  // Vérifier si la route actuelle est explicitement bloquée en contexte OF
  const isBlockedOFRoute = useMemo(() => {
    return OF_BLOCKED_ROUTES.some(route => location.pathname === route || location.pathname.startsWith(route + '/'));
  }, [location.pathname]);

  // Vérifier si la route actuelle est une route de dashboard
  const isDashboardRoute = useMemo(() => {
    return DASHBOARD_ROUTES.some(route => location.pathname.startsWith(route));
  }, [location.pathname]);

  // Effet pour rediriger vers /connexion-of ou vers le dashboard selon l'état
  useEffect(() => {
    if (orgLoading || authLoading) return;
    if (hasRedirected && !isAuthenticated) return;

    // Si on est sur un sous-domaine OF
    if (isOFContext && orgExists) {

      // CAS 1 : On est authentifié
      if (isAuthenticated) {
        // Si on est sur une route de connexion ou inscription, on doit aller vers le dashboard
        if (isPublicOFRoute || isBlockedOFRoute || location.pathname === '/') {
          if (user) {
            // On a toutes les infos, on redirige vers le dashboard
            const roleRedirects: Record<string, string> = {
              of_admin: '/dashboard/organisme-formation',
              gestionnaire: '/dashboard/gestionnaire',
              formateur_interne: '/dashboard/formateur-interne',
              apprenant: '/dashboard/apprenant',
              student: '/dashboard/apprenant',
            };
            const userRole = user?.role;
            const dashboardPath = roleRedirects[userRole || ''] || '/dashboard/apprenant';

            console.log('[SubdomainRouter] 🚀 Authentifié sur route publique, redirection dashboard:', dashboardPath);
            navigate(dashboardPath, { replace: true });
          }
          return; // On attend que le user soit chargé si pas encore là
        }
      }
      // CAS 2 : Pas authentifié
      else {
        // Bloquer les routes interdites ou rediriger si pas sur une route publique
        if (isBlockedOFRoute || (!isPublicOFRoute && location.pathname !== '/')) {
          console.log('[SubdomainRouter] 🔄 Non authentifié, redirection vers /connexion');
          setHasRedirected(true);
          navigate('/connexion', { replace: true });
        }
      }
    }
  }, [isOFContext, orgExists, isAuthenticated, user, isPublicOFRoute, isBlockedOFRoute, orgLoading, authLoading, navigate, hasRedirected, location.pathname]);

  // Effet de log pour le debug
  useEffect(() => {
    if (!orgLoading && !authLoading && !location.pathname.startsWith('/dashboard/superadmin')) {
      console.log('[SubdomainRouter Status]', {
        path: location.pathname,
        isAuthenticated,
        hasUser: !!user,
        isOFContext,
        orgId: organization?.organizationId
      });
    }
  }, [location.pathname, isAuthenticated, !!user, orgLoading, authLoading, isOFContext, organization?.organizationId]);

  if (orgLoading || (isAuthenticated && authLoading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};

export default SubdomainRouter;
