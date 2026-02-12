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
  CourseUpdate,
  CourseStatus,
  CourseFilters,
  ModuleCreate,
  LessonCreate,
  LessonUpdate,
  AttachMediaRequest,
  QuizCreate,
  QuizUpdate,
  AssignmentCreate,
  AssignmentUpdate,
  OrganizationCreate,
  OrganizationResponse,
  UserUpdate,
  CategoryItem,
  CategoryCreate,
  ProLevelItem,
  ProLevelCreate,
  ValidateTrainerRequest,
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

export const useCourses = (filters: CourseFilters = {}) => {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => fastAPIClient.getCourses(filters),
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
    mutationFn: ({ courseId, moduleId, lessonData }: { courseId: string; moduleId: string; lessonData: LessonCreate }) =>
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

/**
 * Hook pour mettre à jour une leçon
 */
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, lessonId, lessonData }: {
      courseId: string;
      moduleId: string;
      lessonId: string;
      lessonData: LessonUpdate;
    }) => fastAPIClient.updateLesson(courseId, moduleId, lessonId, lessonData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Leçon mise à jour",
        description: "Les modifications ont été enregistrées",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de mettre à jour la leçon",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook pour supprimer une leçon
 */
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, lessonId, forceMediaDelete = false }: {
      courseId: string;
      moduleId: string;
      lessonId: string;
      forceMediaDelete?: boolean;
    }) => fastAPIClient.deleteLesson(courseId, moduleId, lessonId, forceMediaDelete),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Leçon supprimée",
        description: "La leçon a été supprimée définitivement",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de supprimer la leçon",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook pour réorganiser les leçons d'un module
 */
export const useReorderLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, lessonIds }: {
      courseId: string;
      moduleId: string;
      lessonIds: string[];
    }) => fastAPIClient.reorderLessons(courseId, moduleId, { lesson_ids: lessonIds }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Ordre mis à jour",
        description: "L'ordre des leçons a été enregistré",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de réorganiser les leçons",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook pour attacher un média à une leçon
 */
export const useAttachLessonMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, lessonId, mediaData }: {
      courseId: string;
      moduleId: string;
      lessonId: string;
      mediaData: AttachMediaRequest;
    }) => fastAPIClient.attachLessonMedia(courseId, moduleId, lessonId, mediaData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Média attaché",
        description: "Le média a été associé à la leçon",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible d'attacher le média",
        variant: "destructive",
      });
    },
  });
};

// ============= MODULE QUIZ HOOKS =============

export const useCreateModuleQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, quizData }: {
      courseId: string;
      moduleId: string;
      quizData: QuizCreate
    }) => fastAPIClient.createModuleQuiz(courseId, moduleId, quizData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Quiz créé",
        description: "Le quiz a été ajouté au module",
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

export const useUpdateModuleQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, quizId, quizData }: {
      courseId: string;
      moduleId: string;
      quizId: string;
      quizData: QuizUpdate
    }) => fastAPIClient.updateModuleQuiz(courseId, moduleId, quizId, quizData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Quiz mis à jour",
        description: "Les modifications ont été enregistrées",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de mettre à jour le quiz",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteModuleQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, quizId }: {
      courseId: string;
      moduleId: string;
      quizId: string
    }) => fastAPIClient.deleteModuleQuiz(courseId, moduleId, quizId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Quiz supprimé",
        description: "Le quiz a été supprimé du module",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de supprimer le quiz",
        variant: "destructive",
      });
    },
  });
};

export const useReorderModuleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, items }: {
      courseId: string;
      moduleId: string;
      items: Array<{ type: 'lesson' | 'quiz' | 'assignment'; id: string }>;
    }) => fastAPIClient.reorderModuleContent(courseId, moduleId, { items }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Ordre mis à jour",
        description: "L'ordre du contenu a été enregistré",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de réorganiser le contenu",
        variant: "destructive",
      });
    },
  });
};

// ============= DEPRECATED LESSON QUIZ HOOKS =============

/**
 * @deprecated Les quizzes sont maintenant au niveau module, utiliser useCreateModuleQuiz
 */
export const useCreateLessonQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, lessonId, quizData }: {
      courseId: string;
      moduleId: string;
      lessonId: string;
      quizData: QuizCreate
    }) => fastAPIClient.createLessonQuiz(courseId, moduleId, lessonId, quizData),
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

/**
 * @deprecated Les quizzes sont maintenant au niveau module, utiliser useUpdateModuleQuiz
 */
export const useUpdateLessonQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, lessonId, quizData }: {
      courseId: string;
      moduleId: string;
      lessonId: string;
      quizData: QuizUpdate
    }) => fastAPIClient.updateLessonQuiz(courseId, moduleId, lessonId, quizData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Quiz mis à jour",
        description: "Les modifications ont été enregistrées",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de mettre à jour le quiz",
        variant: "destructive",
      });
    },
  });
};

/**
 * @deprecated Les quizzes sont maintenant au niveau module, utiliser useDeleteModuleQuiz
 */
export const useDeleteLessonQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, lessonId }: {
      courseId: string;
      moduleId: string;
      lessonId: string
    }) => fastAPIClient.deleteLessonQuiz(courseId, moduleId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Quiz supprimé",
        description: "Le quiz a été supprimé définitivement",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de supprimer le quiz",
        variant: "destructive",
      });
    },
  });
};

// ============= ASSIGNMENT HOOKS (NEW) =============

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, assignmentData }: {
      courseId: string;
      moduleId: string;
      assignmentData: AssignmentCreate
    }) => fastAPIClient.createAssignment(courseId, moduleId, assignmentData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Devoir créé",
        description: "Le devoir a été ajouté au module",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de créer le devoir",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId, assignmentData }: {
      courseId: string;
      moduleId: string;
      assignmentData: AssignmentUpdate
    }) => fastAPIClient.updateAssignment(courseId, moduleId, assignmentData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Devoir mis à jour",
        description: "Les modifications ont été enregistrées",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de mettre à jour le devoir",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, moduleId }: {
      courseId: string;
      moduleId: string
    }) => fastAPIClient.deleteAssignment(courseId, moduleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: "Devoir supprimé",
        description: "Le devoir a été supprimé définitivement",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de supprimer le devoir",
        variant: "destructive",
      });
    },
  });
};

// ============= DEPRECATED QUIZ HOOK =============

/**
 * @deprecated Use useCreateLessonQuiz instead
 */
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
    mutationFn: (courseId: string | number) => fastAPIClient.enrollCourse(String(courseId)),
    onSuccess: (data, courseId) => {
      // Invalider le solde de tokens et les cours
      queryClient.invalidateQueries({ queryKey: ['tokenBalance'] });
      queryClient.invalidateQueries({ queryKey: ['userEnrollments'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      queryClient.invalidateQueries({ queryKey: ['course', String(courseId)] });

      toast({
        title: '🎉 Inscription réussie !',
        description: data.message || 'Vous êtes maintenant inscrit au cours.',
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Impossible de vous inscrire à ce cours';
      toast({
        title: 'Erreur d\'inscription',
        description: errorMessage,
        variant: 'destructive',
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

// Hook pour valider ou rejeter un formateur indépendant (superadmin)
export const useValidateTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, request }: { userId: number; request: ValidateTrainerRequest }) =>
      fastAPIClient.validateTrainer(userId, request),
    onSuccess: (data, variables) => {
      // Invalider les queries pour rafraîchir les listes
      queryClient.invalidateQueries({ queryKey: ['superadmin-users'] });
      queryClient.invalidateQueries({ queryKey: ['userBySlug'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });

      const action = variables.request.status === 'validated' ? 'validé' : 'rejeté';
      toast({
        title: `Formateur ${action}`,
        description: `Le formateur a été ${action} avec succès.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de validation",
        description: error.response?.data?.detail || "Impossible de valider le formateur",
        variant: "destructive",
      });
    },
  });
};

// Hook pour récupérer les utilisateurs (compatible avec manager et superadmin)
export const useUsers = () => {
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fastAPIClient.getCurrentUser(),
    enabled: !!localStorage.getItem('access_token'),
  });

  return useQuery({
    queryKey: ['users', currentUser?.role],
    queryFn: async () => {
      // Pour le moment, on essaie toujours l'endpoint superadmin
      // Le backend devra être mis à jour pour supporter les gestionnaires
      try {
        return await fastAPIClient.get<ListAllUsersResponse[]>('/api/auth/superadmin/users');
      } catch (error: any) {
        if (error.response?.status === 403) {
          // Si 403, c'est que l'utilisateur n'a pas les permissions
          // On retourne un tableau vide et on laisse le composant gérer l'affichage
          throw new Error('PERMISSION_DENIED');
        }
        throw error;
      }
    },
    enabled: !!currentUser,
    retry: false,
  });
};

/**
 * Hook pour récupérer les détails d'un utilisateur spécifique
 */
export const useUserDetail = (userId: string | number) => {
  return useQuery({
    queryKey: ['user-detail', userId],
    queryFn: async () => {
      const response = await fastAPIClient.get<ListAllUsersResponse>(`/api/auth/superadmin/users/${userId}`);
      return response;
    },
    enabled: !!userId,
  });
};

// ============= OF USERS HOOKS =============

/**
 * Hook pour récupérer les utilisateurs d'un organisme de formation (OF)
 * Prêt pour l'API GET /api/organizations/{of_id}/users
 * 
 * NOTE: L'endpoint backend n'existe pas encore. Ce hook est prêt à l'emploi
 * une fois que l'API sera implémentée.
 */
export const useOFUsers = (ofId: number | string | undefined) => {
  return useQuery({
    queryKey: ['of-users', ofId],
    queryFn: async () => {
      if (!ofId) throw new Error('OF ID is required');

      // Appel à l'endpoint GET /api/organizations/{of_id}/users
      // qui sera implémenté côté backend
      const response = await fastAPIClient.get<ListAllUsersResponse[]>(
        `/api/organizations/${ofId}/users`
      );
      return response;
    },
    enabled: !!ofId,
    retry: 1,
  });
};

/**
 * Hook mutation pour créer un utilisateur dans un OF
 * POST /api/organizations/{of_id}/users
 */
export const useCreateOFUser = (ofId: number | string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: {
      email: string;
      password?: string;
      first_name: string;
      last_name: string;
      role: string;
      is_major?: boolean;
      accept_terms?: boolean;
      phone?: string;
      address?: string;
      accessible_catalogues?: string[];
    }) => {
      if (!ofId) throw new Error('OF ID is required');
      return fastAPIClient.createOFUser(ofId, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['of-users', ofId] });
    },
  });
};

// ============= ORGANIZATIONS HOOKS =============

/**
 * Hook pour récupérer la liste des organisations
 */
export const useOrganizations = (page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['organizations', page, perPage],
    queryFn: () => fastAPIClient.listOrganizations(page, perPage),
  });
};

/**
 * Hook pour récupérer une organisation par son ID
 */
export const useOrganization = (orgId: number | string) => {
  return useQuery({
    queryKey: ['organization', orgId],
    queryFn: () => fastAPIClient.getOrganization(Number(orgId)),
    enabled: !!orgId,
  });
};

/**
 * Hook pour mettre à jour une organisation
 */
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, data }: { orgId: number; data: Partial<OrganizationCreate> }) =>
      fastAPIClient.updateOrganization(orgId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organization', data.id] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast({
        title: 'Organisation mise à jour',
        description: 'Les informations ont été mises à jour avec succès.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour l\'organisation.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook pour récupérer un utilisateur par son slug
 * Le slug est généré avec l'ID en préfixe (ex: "21-ndeye-fatou-ndiaye")
 */
export const useUserBySlug = (userSlug?: string) => {
  const { data: apiUsers, isLoading, error } = useSuperadminUsers();

  return useQuery({
    queryKey: ['userBySlug', userSlug],
    queryFn: () => {
      if (!apiUsers || !userSlug) {
        throw new Error('Utilisateur non trouvé');
      }

      // Extraire l'ID du début du slug (format: "21-ndeye-fatou-ndiaye")
      const slugParts = userSlug.split('-');
      const userId = parseInt(slugParts[0], 10);

      if (isNaN(userId)) {
        console.error('ID invalide dans le slug:', userSlug);
        throw new Error(`Le slug "${userSlug}" ne contient pas d'ID valide`);
      }

      console.log('ID recherché:', userId);
      console.log('Slug complet:', userSlug);

      const user = apiUsers.find(u => u.id === userId);

      if (!user) {
        throw new Error(`Le slug "${userSlug}" ne correspond à aucun utilisateur`);
      }

      console.log('Utilisateur trouvé:', user);
      return user;
    },
    enabled: !!apiUsers && !!userSlug,
  });
};

/**
 * Hook pour mettre à jour le profil utilisateur
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserUpdate) => fastAPIClient.updateUserProfile(userData),
    onSuccess: (updatedUser) => {
      // Mettre à jour directement le cache sans refetch
      queryClient.setQueryData(['currentUser'], updatedUser);
    },
  });
};

/**
 * Hook pour changer le statut d'un utilisateur (activation/désactivation)
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: 'active' | 'inactive' }) =>
      fastAPIClient.updateUserStatus(userId, status),
    onSuccess: (data, variables) => {
      // Invalider les queries liées aux utilisateurs
      queryClient.invalidateQueries({ queryKey: ['superadmin-users'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });

      // Invalider aussi les queries par slug
      queryClient.invalidateQueries({ queryKey: ['userBySlug'] });

      const statusLabel = variables.status === 'active' ? 'activé' : 'désactivé';
      toast({
        title: 'Statut mis à jour',
        description: `L'utilisateur a été ${statusLabel} avec succès.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Impossible de modifier le statut de l\'utilisateur.',
        variant: 'destructive',
      });
    },
  });
};

// ============= CATEGORIES =============

/**
 * Hook pour lister toutes les catégories
 */
export const useCategories = () => {
  return useQuery<CategoryItem[]>({
    queryKey: ['categories'],
    queryFn: () => fastAPIClient.listCategories(),
  });
};

/**
 * Hook pour créer une nouvelle catégorie
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryCreate) => fastAPIClient.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Catégorie créée',
        description: 'La catégorie a été ajoutée avec succès.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Impossible de créer la catégorie.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook pour créer une catégorie globale (superadmin uniquement)
 */
export const useCreateGlobalCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryCreate) => fastAPIClient.createGlobalCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Catégorie globale créée',
        description: 'La catégorie globale a été ajoutée avec succès.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Impossible de créer la catégorie globale.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook pour toggle l'état actif d'une catégorie
 */
export const useToggleCategoryActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, active }: { categoryId: number; active: boolean }) =>
      fastAPIClient.toggleCategoryActive(categoryId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

/**
 * Hook pour supprimer une catégorie
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => fastAPIClient.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Catégorie supprimée',
        description: 'La catégorie a été supprimée avec succès.',
      });
    },
  });
};

// ============= NIVEAUX (LEVELS) =============

/**
 * Hook pour récupérer les niveaux d'un cycle
 */
export const useLevels = (cycle: string) => {
  return useQuery<string[]>({
    queryKey: ['levels', cycle],
    queryFn: () => fastAPIClient.getLevels(cycle),
    enabled: !!cycle,
  });
};

/**
 * Hook pour créer un nouveau niveau pro (formation professionnelle)
 */
export const useCreateProLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProLevelCreate) => fastAPIClient.createProLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels', 'formation_pro'] });
      toast({
        title: 'Niveau créé',
        description: 'Le niveau de formation professionnelle a été ajouté avec succès.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Impossible de créer le niveau.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook pour toggle l'état actif d'un niveau pro
 */
export const useToggleProLevelActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ levelId, active }: { levelId: number; active: boolean }) =>
      fastAPIClient.toggleProLevelActive(levelId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels', 'formation_pro'] });
    },
  });
};

/**
 * Hook pour supprimer un niveau pro
 */
export const useDeleteProLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (levelId: number) => fastAPIClient.deleteProLevel(levelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels', 'formation_pro'] });
      toast({
        title: 'Niveau supprimé',
        description: 'Le niveau a été supprimé avec succès.',
      });
    },
  });
};

// ============= TOKENS (BOUTIQUE) =============

/**
 * Hook pour récupérer le solde de tokens
 */
export const useTokenBalance = () => {
  return useQuery({
    queryKey: ['tokenBalance'],
    queryFn: () => fastAPIClient.getTokenBalance(),
  });
};

/**
 * Hook pour acheter des tokens
 */
export const useBuyTokens = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => fastAPIClient.buyTokens({ amount }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalance'] });
      toast({
        title: '🎉 Achat réussi !',
        description: `${data.tokens_added} tokens ajoutés à votre compte.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur de paiement',
        description: error.response?.data?.detail || 'Impossible de traiter votre achat',
        variant: 'destructive',
      });
    },
  });
};

