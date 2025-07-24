
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, Course, Enrollment, AdminStats, ApiResponse, PaginatedResponse } from '@/types';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

// Mock API client for compatibility with existing code
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // For now, this is a mock implementation
    // In a real app, you'd implement the actual API calls
    throw new Error('API not implemented yet. Use Supabase hooks instead.');
  }

  // Auth methods - now using Supabase
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    throw new Error('Use useSupabaseAuth hook instead');
  }

  async register(userData: Partial<User> & { password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    throw new Error('Use useSupabaseAuth hook instead');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    throw new Error('Use useSupabaseAuth hook instead');
  }

  // User methods
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    throw new Error('Not implemented yet');
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    throw new Error('Not implemented yet');
  }

  // Course methods
  async getCourses(page = 1, limit = 10, filters?: Record<string, any>): Promise<PaginatedResponse<Course>> {
    throw new Error('Not implemented yet');
  }

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    throw new Error('Not implemented yet');
  }

  async createCourse(courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    throw new Error('Not implemented yet');
  }

  async updateCourse(id: string, courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    throw new Error('Not implemented yet');
  }

  // Enrollment methods
  async enrollInCourse(courseId: string): Promise<ApiResponse<Enrollment>> {
    throw new Error('Not implemented yet');
  }

  async getUserEnrollments(userId: string): Promise<ApiResponse<Enrollment[]>> {
    throw new Error('Not implemented yet');
  }

  // Admin methods
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    throw new Error('Not implemented yet');
  }
}

export const apiClient = new ApiClient('');

// Updated useAuth hook to use Supabase
export const useAuth = () => {
  const { user, profile, signIn, signUp, signOut, isAuthenticated, loading } = useSupabaseAuth();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
  });

  const registerMutation = useMutation({
    mutationFn: (userData: Partial<User> & { password: string }) =>
      signUp({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        password: userData.password,
        role: userData.role || 'student',
        isAdult: userData.isAdult || true
      }),
  });

  const logout = async () => {
    await signOut();
  };

  return {
    login: loginMutation,
    register: registerMutation,
    user: profile,
    isLoading: loading,
    isAuthenticated,
    logout,
  };
};

// Placeholder hooks for existing functionality
export const useCourses = (page = 1, limit = 10, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['courses', page, limit, filters],
    queryFn: () => {
      throw new Error('Not implemented yet');
    },
    enabled: false,
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => {
      throw new Error('Not implemented yet');
    },
    enabled: false,
  });
};

export const useUserEnrollments = (userId: string) => {
  return useQuery({
    queryKey: ['userEnrollments', userId],
    queryFn: () => {
      throw new Error('Not implemented yet');
    },
    enabled: false,
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => {
      throw new Error('Not implemented yet');
    },
    enabled: false,
  });
};
