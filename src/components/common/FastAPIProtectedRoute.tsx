import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { UserRole } from '@/types/fastapi';
import LoadingSpinner from './LoadingSpinner';

interface FastAPIProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

const FastAPIProtectedRoute = ({ 
  children, 
  requiredRole,
  redirectTo = '/connexion' 
}: FastAPIProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated, getUserRole } = useFastAPIAuth();
  const location = useLocation();

  // Afficher le spinner pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Vérifier le rôle si requis
  if (requiredRole) {
    const userRole = getUserRole();
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Rediriger vers le dashboard correspondant au rôle de l'utilisateur
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

      const correctDashboard = roleRedirects[userRole] || '/dashboard/apprenant';
      return <Navigate to={correctDashboard} replace />;
    }
  }

  return <>{children}</>;
};

export default FastAPIProtectedRoute;
