
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'instructor' | 'tutor' | 'parent' | 'admin' | 'manager';
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole,
  redirectTo = '/connexion' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, profile, loading } = useSupabaseAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    // Redirect to user's appropriate dashboard based on their role
    const userDashboard = profile?.role === 'student' ? '/dashboard/etudiant' : 
                         profile?.role === 'instructor' ? '/dashboard/instructeur' :
                         profile?.role === 'tutor' ? '/dashboard/tuteur' :
                         profile?.role === 'parent' ? '/dashboard/parent' :
                         profile?.role === 'admin' ? '/dashboard/admin' :
                         profile?.role === 'manager' ? '/dashboard/manager' :
                         '/dashboard/etudiant';
    
    return <Navigate to={userDashboard} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
