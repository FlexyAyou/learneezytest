
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useApi = () => {
  const { user, session } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (endpoint: string, options: RequestInit = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callApi,
    isLoading,
    error,
    user,
    session,
  };
};

// Export useAuth hook that wraps useSupabaseAuth
export const useAuth = () => {
  const { user, profile, loading } = useSupabaseAuth();
  
  return {
    user: user ? {
      id: user.id,
      email: user.email || '',
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      role: profile?.role || 'student',
      avatar: user.user_metadata?.avatar_url || null,
      createdAt: user.created_at || '',
      profile: {
        phone: user.user_metadata?.phone || null,
        city: user.user_metadata?.city || null,
      }
    } : null,
    isLoading: loading,
  };
};

// Export useUserEnrollments hook
export const useUserEnrollments = (userId: string) => {
  return useQuery({
    queryKey: ['user-enrollments', userId],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      if (!userId) return [];
      
      return [
        {
          id: '1',
          progress: 75,
          course: {
            id: '1',
            title: 'Introduction à React',
            duration: 180,
            instructor: {
              firstName: 'Marie',
              lastName: 'Dupont'
            }
          }
        },
        {
          id: '2',
          progress: 45,
          course: {
            id: '2',
            title: 'JavaScript Avancé',
            duration: 240,
            instructor: {
              firstName: 'Jean',
              lastName: 'Martin'
            }
          }
        }
      ];
    },
    enabled: !!userId,
  });
};

// Export useAdminStats hook
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      return {
        totalUsers: 1250,
        totalCourses: 45,
        totalEnrollments: 3200,
        totalRevenue: 125000,
        monthlyGrowth: {
          users: 12,
          courses: 8,
          revenue: 15
        },
        topCourses: [
          {
            id: '1',
            title: 'Introduction à React',
            enrollments: 450,
            revenue: 22500
          },
          {
            id: '2',
            title: 'JavaScript Avancé',
            enrollments: 320,
            revenue: 16000
          },
          {
            id: '3',
            title: 'CSS et Design',
            enrollments: 280,
            revenue: 14000
          }
        ]
      };
    },
  });
};
