import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fastAPIClient } from '@/services/fastapi-client';
import { 
  UserLogin, 
  UserCreate, 
  UserResponse, 
  UserRole, 
  SuperAdminUserCreate, 
  ListAllUsersResponse,
  Course,
  CourseResponse,
  CourseUpdate,
  CourseStatus,
  ModuleCreate,
  LessonCreate,
  QuizCreate,
} from '@/types/fastapi';
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

// ============= COURSES HOOKS =============

export const useCourses = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['courses', page, perPage],
    queryFn: () => fastAPIClient.getCourses(page, perPage),
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fastAPIClient.getCourse(courseId),
    enabled: !!courseId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseData: Course) => fastAPIClient.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Cours créé",
        description: "Le cours a été créé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de créer le cours",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, updates }: { courseId: string; updates: CourseUpdate }) =>
      fastAPIClient.updateCourse(courseId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Cours mis à jour",
        description: "Les modifications ont été enregistrées",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de mettre à jour le cours",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => fastAPIClient.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé définitivement",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de supprimer le cours",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCourseStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, status }: { courseId: string; status: CourseStatus }) =>
      fastAPIClient.updateCourseStatus(courseId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Statut mis à jour",
        description: `Le cours est maintenant ${variables.status === 'published' ? 'publié' : 'en brouillon'}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de changer le statut",
        variant: "destructive",
      });
    },
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, moduleData }: { courseId: string; moduleData: ModuleCreate }) =>
      fastAPIClient.createModule(courseId, moduleData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Module créé",
        description: "Le module a été ajouté au cours",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de créer le module",
        variant: "destructive",
      });
    },
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, moduleId, lessonData }: { courseId: string; moduleId: number; lessonData: LessonCreate }) =>
      fastAPIClient.createLesson(courseId, moduleId, lessonData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Leçon créée",
        description: "La leçon a été ajoutée au module",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de créer la leçon",
        variant: "destructive",
      });
    },
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, moduleId, lessonId, quizData }: { courseId: string; moduleId: number; lessonId: number; quizData: QuizCreate }) =>
      fastAPIClient.createQuiz(courseId, moduleId, lessonId, quizData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Quiz créé",
        description: "Le quiz a été ajouté à la leçon",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de créer le quiz",
        variant: "destructive",
      });
    },
  });
};

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: ({ courseId, fileType, fileName }: { courseId: string; fileType: 'image' | 'video'; fileName: string }) =>
      fastAPIClient.uploadMedia(courseId, fileType, fileName),
    onError: (error: any) => {
      toast({
        title: "Erreur d'upload",
        description: error.response?.data?.detail || "Impossible d'uploader le fichier",
        variant: "destructive",
      });
    },
  });
};

export const useCourseStats = (courseId: string) => {
  return useQuery({
    queryKey: ['courseStats', courseId],
    queryFn: () => fastAPIClient.getCourseStats(courseId),
    enabled: !!courseId,
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => fastAPIClient.enrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userEnrollments'] });
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à ce cours",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de s'inscrire au cours",
        variant: "destructive",
      });
    },
  });
};

// Hook stub pour enrollments (à implémenter plus tard)
export const useUserEnrollments = (userId: string | number) => {
  return useQuery({
    queryKey: ['userEnrollments', userId],
    queryFn: () => Promise.resolve([]),
    enabled: false,
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
    enabled: false,
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
