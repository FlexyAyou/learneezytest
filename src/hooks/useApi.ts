
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Course, Enrollment, AdminStats, ApiResponse, PaginatedResponse } from '@/types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: Partial<User> & { password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/auth/me');
  }

  // User methods
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    return this.request(`/users?page=${page}&limit=${limit}`);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Course methods
  async getCourses(page = 1, limit = 10, filters?: Record<string, any>): Promise<PaginatedResponse<Course>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/courses?${params}`);
  }

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    return this.request(`/courses/${id}`);
  }

  async createCourse(courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: string, courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  // Enrollment methods
  async enrollInCourse(courseId: string): Promise<ApiResponse<Enrollment>> {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  async getUserEnrollments(userId: string): Promise<ApiResponse<Enrollment[]>> {
    return this.request(`/users/${userId}/enrollments`);
  }

  // Admin methods
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return this.request('/admin/stats');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Custom hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.data.token);
      queryClient.setQueryData(['currentUser'], data.data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: Partial<User> & { password: string }) =>
      apiClient.register(userData),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.data.token);
      queryClient.setQueryData(['currentUser'], data.data.user);
    },
  });

  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiClient.getCurrentUser().then(res => res.data),
    enabled: !!localStorage.getItem('auth_token'),
  });

  const logout = () => {
    localStorage.removeItem('auth_token');
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

export const useCourses = (page = 1, limit = 10, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['courses', page, limit, filters],
    queryFn: () => apiClient.getCourses(page, limit, filters),
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => apiClient.getCourse(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useUserEnrollments = (userId: string) => {
  return useQuery({
    queryKey: ['userEnrollments', userId],
    queryFn: () => apiClient.getUserEnrollments(userId).then(res => res.data),
    enabled: !!userId,
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => apiClient.getAdminStats().then(res => res.data),
  });
};
