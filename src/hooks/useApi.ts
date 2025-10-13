import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fastAPIClient } from '@/services/fastapi-client';
import { UserLogin, UserCreate, UserResponse, UserRole, SuperAdminUserCreate, ListAllUsersResponse } from '@/types/fastapi';
import { toast } from '@/hooks/use-toast';

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
export const useUserEnrollments = (userId: string | number) => {
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
    queryFn: () => Promise.resolve({
      totalUsers: 0,
      totalCourses: 0,
      totalEnrollments: 0,
      totalRevenue: 0,
      monthlyGrowth: { users: 0, courses: 0, revenue: 0 },
      topCourses: []
    }),
    enabled: false, // Désactivé pour l'instant
  });
};

// Hook pour la création d'utilisateurs par le superadmin (sans mot de passe)
export const useSuperadminRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: SuperAdminUserCreate) =>
      fastAPIClient.post<UserResponse>('/api/auth/superadmin/register', userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-users'] });
      toast({
        title: "Utilisateur créé avec succès",
        description: `${data.email} a été ajouté à la plateforme`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || "Une erreur est survenue lors de la création";
      toast({
        title: "Erreur de création",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// Hook pour récupérer tous les utilisateurs (superadmin)
export const useSuperadminUsers = () => {
  return useQuery({
    queryKey: ['superadmin-users'],
    queryFn: () => fastAPIClient.get<ListAllUsersResponse[]>('/api/auth/superadmin/users'),
  });
};
