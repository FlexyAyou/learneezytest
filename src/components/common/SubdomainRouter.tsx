import React, { useEffect, useMemo } from 'react';
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
  const [wasAuthenticated, setWasAuthenticated] = React.useState(false);

  // Stabiliser les valeurs avec useMemo pour éviter les re-renders inutiles
  const userRole = useMemo(() => user?.role, [user?.role]);
  const userOfId = useMemo(() => user?.of_id, [user?.of_id]);
  const orgId = useMemo(() => organization?.organizationId, [organization?.organizationId]);
  const orgExists = useMemo(() => organization?.exists, [organization?.exists]);

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
