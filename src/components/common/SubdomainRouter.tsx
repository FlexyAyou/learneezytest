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
  const [wasAuthenticated, setWasAuthenticated] = React.useState(false);

  // Effet pour détecter le changement d'authentification (connexion réussie)
  useEffect(() => {
    console.log('[SubdomainRouter - Login Detection]', {
      wasAuthenticated,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role,
      userOfId: user?.of_id,
      orgLoading,
      authLoading,
      isOFContext,
      orgExists: organization?.exists,
      orgId: organization?.organizationId,
      currentPath: location.pathname
    });

    if (!wasAuthenticated && isAuthenticated && user && !orgLoading && !authLoading) {
      // L'utilisateur vient de se connecter
      const userBelongsToOF = user.role === 'superadmin' || 
        (user.of_id !== null && user.of_id !== undefined && 
         organization?.organizationId !== null && organization?.organizationId !== undefined &&
         Number(user.of_id) === Number(organization.organizationId));

      console.log('[SubdomainRouter - Belongs Check]', {
        userBelongsToOF,
        userRole: user.role,
        isSuperadmin: user.role === 'superadmin',
        userOfId: user.of_id,
        orgId: organization?.organizationId
      });

      if (isOFContext && organization?.exists && userBelongsToOF) {
        const roleRedirects: Record<string, string> = {
          of_admin: '/dashboard/organisme-formation',
          gestionnaire: '/dashboard/gestionnaire',
          formateur_interne: '/dashboard/formateur-interne',
          apprenant: '/dashboard/apprenant',
          student: '/dashboard/apprenant',
        };
        const dashboardPath = roleRedirects[user.role] || '/dashboard/apprenant';
        
        console.log('[SubdomainRouter] 🚀 REDIRECTING TO:', dashboardPath);
        navigate(dashboardPath, { replace: true });
      } else {
        console.log('[SubdomainRouter] ❌ Redirection blocked', {
          isOFContext,
          orgExists: organization?.exists,
          userBelongsToOF
        });
      }
    }
    
    setWasAuthenticated(isAuthenticated);
  }, [isAuthenticated, user?.role, user?.of_id, organization?.organizationId, organization?.exists, isOFContext, orgLoading, authLoading, navigate, wasAuthenticated, location.pathname]);

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
