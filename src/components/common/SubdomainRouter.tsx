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
  '/connexion-of',
  '/mot-de-passe-oublie',
  '/mot-de-passe-oublié',
  '/reinitialiser-mot-de-passe',
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
  const { isAuthenticated, user, isLoading: authLoading } = useFastAPIAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [wasAuthenticated, setWasAuthenticated] = React.useState(false);
  const [hasRedirected, setHasRedirected] = React.useState(false);

  // Stabiliser les valeurs avec useMemo pour éviter les re-renders inutiles
  const userRole = useMemo(() => user?.role, [user?.role]);
  const userOfId = useMemo(() => user?.of_id, [user?.of_id]);
  const orgId = useMemo(() => organization?.organizationId, [organization?.organizationId]);
  const orgExists = useMemo(() => organization?.exists, [organization?.exists]);

  // Vérifier si la route actuelle est une route publique OF
  const isPublicOFRoute = useMemo(() => {
    return OF_PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));
  }, [location.pathname]);

  // Vérifier si la route actuelle est une route de dashboard
  const isDashboardRoute = useMemo(() => {
    return DASHBOARD_ROUTES.some(route => location.pathname.startsWith(route));
  }, [location.pathname]);

  // Effet pour rediriger vers /connexion-of si sur un sous-domaine OF et non authentifié
  useEffect(() => {
    // Attendre que le chargement soit terminé
    if (orgLoading || authLoading) return;
    
    // Éviter les redirections multiples
    if (hasRedirected) return;

    // Si on est sur un sous-domaine OF
    if (isOFContext && orgExists) {
      // Si pas authentifié et pas sur une route publique OF
      if (!isAuthenticated && !isPublicOFRoute) {
        console.log('[SubdomainRouter] 🔄 Redirecting to /connexion-of (not authenticated on OF subdomain)');
        setHasRedirected(true);
        navigate('/connexion-of', { replace: true });
        return;
      }
    }
  }, [isOFContext, orgExists, isAuthenticated, isPublicOFRoute, orgLoading, authLoading, navigate, hasRedirected]);

  // Reset hasRedirected quand on change de route manuellement
  useEffect(() => {
    setHasRedirected(false);
  }, [location.pathname]);

  // Effet pour détecter le changement d'authentification (connexion réussie)
  useEffect(() => {
    // Ne pas logger si on est sur le dashboard superadmin (pas un contexte OF)
    if (!location.pathname.startsWith('/dashboard/superadmin')) {
      console.log('[SubdomainRouter - Login Detection]', {
        wasAuthenticated,
        isAuthenticated,
        hasUser: !!user,
        userRole,
        userOfId,
        orgLoading,
        authLoading,
        isOFContext,
        orgExists,
        orgId,
        currentPath: location.pathname
      });
    }

    if (!wasAuthenticated && isAuthenticated && user && !orgLoading && !authLoading) {
      // L'utilisateur vient de se connecter
      const userBelongsToOF = userRole === 'superadmin' || 
        (userOfId !== null && userOfId !== undefined && 
         orgId !== null && orgId !== undefined &&
         Number(userOfId) === Number(orgId));

      if (!location.pathname.startsWith('/dashboard/superadmin')) {
        console.log('[SubdomainRouter - Belongs Check]', {
          userBelongsToOF,
          userRole,
          isSuperadmin: userRole === 'superadmin',
          userOfId,
          orgId
        });
      }

      if (isOFContext && orgExists && userBelongsToOF) {
        const roleRedirects: Record<string, string> = {
          of_admin: '/dashboard/organisme-formation',
          gestionnaire: '/dashboard/gestionnaire',
          formateur_interne: '/dashboard/formateur-interne',
          apprenant: '/dashboard/apprenant',
          student: '/dashboard/apprenant',
        };
        const dashboardPath = roleRedirects[userRole || ''] || '/dashboard/apprenant';
        
        console.log('[SubdomainRouter] 🚀 REDIRECTING TO:', dashboardPath);
        navigate(dashboardPath, { replace: true });
      } else if (!location.pathname.startsWith('/dashboard/superadmin')) {
        console.log('[SubdomainRouter] ❌ Redirection blocked', {
          isOFContext,
          orgExists,
          userBelongsToOF
        });
      }
    }
    
    setWasAuthenticated(isAuthenticated);
  }, [isAuthenticated, userRole, userOfId, orgId, orgExists, isOFContext, orgLoading, authLoading, navigate, wasAuthenticated, location.pathname, user]);

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
