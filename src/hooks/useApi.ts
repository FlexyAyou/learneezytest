import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fastAPIClient } from '@/services/fastapi-client';
import { UserLogin, UserCreate, UserResponse, UserRole } from '@/types/fastapi';

// Re-export pour compatibilité
export { fastAPIClient as apiClient };

// Custom hooks pour FastAPI
export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: UserLogin) =>
      fastAPIClient.login({ email, password }),
    onSuccess: (data) => {
      // Les tokens sont déjà stockés par fastAPIClient.login()
      // Récupérer l'utilisateur après connexion
      fastAPIClient.getCurrentUser().then((user) => {
        queryClient.setQueryData(['currentUser'], user);
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: UserCreate) =>
      fastAPIClient.register(userData),
    onSuccess: async (user) => {
      queryClient.setQueryData(['currentUser'], user);
    },
  });

  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fastAPIClient.getCurrentUser(),
    enabled: !!localStorage.getItem('access_token'),
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    queryClient.clear();
    window.location.href = '/connexion';
  };

  return {
    login: loginMutation,
    register: registerMutation,
    user: currentUserQuery.data,
    isLoading: currentUserQuery.isLoading,
    isAuthenticated: !!currentUserQuery.data,
    logout,
  };
};

// Hooks pour les cours (à implémenter avec FastAPI plus tard)
export const useCourses = (page = 1, limit = 10, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['courses', page, limit, filters],
    queryFn: () => fastAPIClient.get(`/api/courses/?page=${page}&per_page=${limit}`),
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => fastAPIClient.get(`/api/courses/${id}`),
    enabled: !!id,
  });
};

// Hook stub pour enrollments (à implémenter plus tard)
export const useUserEnrollments = (userId: string) => {
  return useQuery({
    queryKey: ['userEnrollments', userId],
    queryFn: () => Promise.resolve([]),
    enabled: false, // Désactivé pour l'instant
  });
};

// Hook stub pour admin stats (à implémenter plus tard)
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => Promise.resolve({}),
    enabled: false, // Désactivé pour l'instant
  });
};
