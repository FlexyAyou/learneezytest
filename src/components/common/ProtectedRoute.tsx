
import React from 'react';
import { useAuth } from '@/hooks/useApi';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'instructor' | 'admin';
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole,
  redirectTo = '/connexion' 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Forcer le changement de mot de passe si requis
  if (localStorage.getItem('must_change_password') === 'true') {
    return <Navigate to="/changer-mot-de-passe" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard/apprenant" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
