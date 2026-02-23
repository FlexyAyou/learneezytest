import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Token,
  UserLogin,
  UserCreate,
  UserResponse,
  RefreshRequest,
  UserResetPassword,
  ResetPasswordRequest,
  JWTPayload,
  Course,
  CourseResponse,
  CourseUpdate,
  CourseStatus,
  CourseFilters,
  ModuleCreate,
  ModuleFullUpdate,
  Module,
  LessonCreate,
  LessonResponse,
  LessonUpdate,
  LessonReorderRequest,
  AttachMediaRequest,
  Content,
  QuizCreate,
  Quiz,
  QuizResponse,
  QuizUpdate,
  AssignmentCreate,
  AssignmentResponse,
  AssignmentUpdate,
  UploadResponse,
  EnrollResponse,
  EnrollmentResponse,
  CourseStatsResponse,
  CourseSummaryPage,
  OrganizationCreate,
  OrganizationResponse,
  OrganizationUpdate,
  UserUpdate,
  PrepareUploadResponse,
  CompleteUploadParams,
  CompleteUploadResponse,
  VideoPlayResponse,
  ProgramUrlResponse,
  CategoryItem,
  CategoryCreate,
  CategoryUpdateActive,
  ProLevelItem,
  ProLevelCreate,
  ProLevelUpdateActive,
  ValidateTrainerRequest,
  TokenBalanceResponse,
  TokenBuyRequest,
  TokenBuyResponse,
  TokenConfigResponse,
  TokenConfigUpdate,
  SubscriptionPlanCreate,
  SubscriptionPlanUpdate,
  SubscriptionPlanResponse,
  SubscriptionCreate,
  SubscriptionResponse,
} from '@/types/fastapi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.plateforme-test-infinitiax.com';

/**
 * Client API FastAPI avec gestion automatique des JWT
 */
class FastAPIClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configure les intercepteurs Axios pour:
   * - Injection automatique du token
   * - Refresh automatique si expiré
   * - Conversion snake_case ↔ camelCase
   */
  private setupInterceptors() {
    // REQUEST INTERCEPTOR
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const accessToken = localStorage.getItem('access_token');

        // Vérifier si le token est expiré
        if (accessToken && this.isTokenExpired(accessToken)) {
          // Token expiré, tenter un refresh
          const refreshToken = localStorage.getItem('refresh_token');

          if (refreshToken && !this.isTokenExpired(refreshToken)) {
            try {
              const newAccessToken = await this.handleTokenRefresh();
              config.headers.Authorization = `Bearer ${newAccessToken}`;
            } catch (error) {
              // Refresh échoué, déconnexion
              this.clearLocalAuth();
              throw new Error('Session expirée, veuillez vous reconnecter');
            }
          } else {
            // Refresh token expiré
            this.clearLocalAuth();
            throw new Error('Session expirée, veuillez vous reconnecter');
          }
        } else if (accessToken) {
          // Token valide
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Ne pas rediriger si c'est une erreur de login (identifiants incorrects)
        const isLoginError = error.config?.url?.includes('/api/auth/login');

        if (error.response?.status === 401 && !isLoginError) {
          this.clearLocalAuth();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Vérifie si un JWT est expiré
   */
  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      // Ajouter une marge de 60 secondes pour anticiper l'expiration
      return decoded.exp < currentTime + 60;
    } catch {
      return true;
    }
  }

  /**
   * Gère le rafraîchissement du token (évite les requêtes multiples)
   */
  private async handleTokenRefresh(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post<Token>(
          `${API_BASE_URL}/api/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: newRefreshToken } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);

        return access_token;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Déconnexion locale (sans appel API)
   */
  private clearLocalAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/connexion';
  }

  /**
   * Déconnexion complète avec appel API backend
   */
  async logoutUser(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');

      // Appeler l'endpoint de logout avec le refresh_token
      await this.post('/api/auth/logout', null, {
        params: { refresh_token: refreshToken }
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours nettoyer les tokens locaux
      this.clearLocalAuth();
    }
  }

  // ============= MÉTHODES PUBLIQUES =============

  /**
   * Requête GET générique
   */
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint, config);
    return response.data;
  }

  /**
   * Requête POST générique
   */
  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data, config);
    return response.data;
  }

  /**
   * Requête PUT générique
   */
  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data, config);
    return response.data;
  }

  /**
   * Requête DELETE générique
   */
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint, config);
    return response.data;
  }

  // ============= AUTH ENDPOINTS =============

  /**
   * Connexion utilisateur
   */
  async login(credentials: UserLogin): Promise<Token> {
    const response = await this.post<Token>('/api/auth/login', credentials);

    // Stocker les tokens
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);

    return response;
  }

  /**
   * Inscription utilisateur
   */
  async register(userData: UserCreate): Promise<UserResponse> {
    return this.post<UserResponse>('/api/auth/register', userData);
  }

  /**
   * Récupère tous les utilisateurs avec le rôle "trainer" ou "independent_trainer"
   */
  async getTrainers(): Promise<UserResponse[]> {
    try {
      const response = await this.get<UserResponse[]>('/api/auth/superadmin/users');
      // Filter to get only trainers
      return response.filter(user =>
        user.role === 'trainer' ||
        user.role === 'independent_trainer' ||
        user.role === 'formateur_interne'
      );
    } catch (error) {
      console.error('Error fetching trainers:', error);
      return [];
    }
  }

  /**
   * Rafraîchir le token
   */
  async refreshToken(refreshRequest: RefreshRequest): Promise<Token> {
    return this.post<Token>('/api/auth/refresh', refreshRequest);
  }

  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser(): Promise<UserResponse> {
    return this.get<UserResponse>('/api/auth/protected');
  }

  /**
   * Mot de passe oublié
   */
  async forgotPassword(email: UserResetPassword): Promise<void> {
    await this.post('/api/auth/reset-password-request', email);
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(token: string, newPassword: ResetPasswordRequest): Promise<void> {
    await this.post(`/api/auth/reset-password?token=${token}`, newPassword);
  }

  /**
   * Vérifier l'email avec le token
   */
  async verifyEmail(token: string): Promise<UserResponse> {
    return this.post<UserResponse>(`/api/auth/verify-email?token=${token}`);
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateUserProfile(userData: UserUpdate): Promise<UserResponse> {
    return this.put<UserResponse>('/api/auth/user', userData);
  }

  /**
   * Décode le JWT pour obtenir le payload
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch {
      return null;
    }
  }

  // ============= PATCH METHOD =============

  /**
   * Requête PATCH générique
   */
  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(endpoint, data, config);
    return response.data;
  }

  // ============= COURSES ENDPOINTS =============

  /**
   * Récupérer la liste des cours avec filtres et pagination (returns CourseSummaryPage)
   */
  async getCourses(filters: CourseFilters = {}): Promise<CourseSummaryPage> {
    const params = new URLSearchParams();

    // Pagination classique
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', Math.min(filters.per_page, 20).toString());

    // Keyset pagination
    if (filters.after) params.append('after', filters.after);

    // Tri
    if (filters.sort) params.append('sort', filters.sort);

    // Recherche
    if (filters.search) params.append('search', filters.search.slice(0, 100));

    // Niveaux
    if (filters.level) params.append('level', filters.level);
    if (filters.levels?.length) {
      filters.levels.forEach(l => params.append('levels[]', l));
    }
    if (filters.learning_cycle) params.append('learning_cycle', filters.learning_cycle);

    // Statut
    if (filters.status) params.append('status', filters.status);

    // Propriétaire
    if (filters.owner_type) params.append('owner_type', filters.owner_type);
    if (filters.owner_id) params.append('owner_id', filters.owner_id.toString());

    // Prix
    if (filters.price_min !== undefined) params.append('price_min', filters.price_min.toString());
    if (filters.price_max !== undefined) params.append('price_max', filters.price_max.toString());

    // Catégories
    if (filters.category_ids?.length) {
      filters.category_ids.forEach(id => params.append('category_ids[]', id.toString()));
    }
    if (filters.category) params.append('category', filters.category);
    if (filters.category_names?.length) {
      filters.category_names.forEach(name => params.append('category_names[]', name));
    }

    // Vidéo intro
    if (filters.has_intro_video !== undefined) {
      params.append('has_intro_video', filters.has_intro_video.toString());
    }

    // Inclusion open-source global
    if (filters.include_global_open_source) {
      params.append('include_global_open_source', 'true');
    }

    // Facettes
    if (filters.facets) params.append('facets', 'true');

    return this.get<CourseSummaryPage>(`/api/courses/?${params.toString()}`);
  }

  /**
   * Récupérer le catalogue global (cours open-source Learneezy)
   */
  async getGlobalCatalogue(page: number = 1, per_page: number = 10): Promise<any[]> {
    return this.get<any[]>(`/api/catalogue/learneezy?page=${page}&per_page=${per_page}`);
  }

  /**
   * Acheter un cours Learneezy via des tokens
   */
  async purchaseLearneezyCourse(courseId: string): Promise<any> {
    return this.post<any>(`/api/catalogue/learneezy/purchase`, { course_id: courseId });
  }

  /**
   * Récupérer un cours par ID
   */
  async getCourse(courseId: string): Promise<CourseResponse> {
    return this.get<CourseResponse>(`/api/courses/${courseId}`);
  }



  /**
   * Fiche publique allégée d'un cours (pas de JWT requis)
   */
  async getCourseSummary(courseId: string): Promise<any> {
    return this.get<any>(`/api/courses/${courseId}/summary`);
  }

  /**
   * Créer un nouveau cours
   */
  async createCourse(courseData: Course): Promise<CourseResponse> {
    return this.post<CourseResponse>('/api/courses/', courseData);
  }

  /**
   * Mettre à jour un cours
   */
  async updateCourse(courseId: string, updates: CourseUpdate): Promise<CourseResponse> {
    return this.put<CourseResponse>(`/api/courses/${courseId}`, updates);
  }

  /**
   * Supprimer un cours
   */
  async deleteCourse(courseId: string): Promise<void> {
    return this.delete<void>(`/api/courses/${courseId}`);
  }

  /**
   * Changer le statut d'un cours (draft/published)
   */
  async updateCourseStatus(courseId: string, status: CourseStatus): Promise<CourseResponse> {
    return this.patch<CourseResponse>(`/api/courses/${courseId}/status?status=${status}`);
  }

  /**
   * Ajouter un module à un cours
   */
  async createModule(courseId: string, moduleData: ModuleCreate): Promise<Module> {
    return this.post<Module>(`/api/courses/${courseId}/modules`, moduleData);
  }

  /**
   * Ajouter une leçon à un module
   */
  async createLesson(courseId: string, moduleId: string, lessonData: LessonCreate): Promise<LessonResponse> {
    return this.post<LessonResponse>(`/api/courses/${courseId}/modules/${moduleId}/lessons`, lessonData);
  }

  /**
   * Mettre à jour une leçon
   */
  async updateLesson(
    courseId: string,
    moduleId: string,
    lessonId: string,
    lessonData: LessonUpdate
  ): Promise<LessonResponse> {
    return this.put<LessonResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
      lessonData
    );
  }

  /**
   * Supprimer une leçon
   * @param forceMediaDelete - Supprimer aussi le média associé (défaut: false)
   */
  async deleteLesson(
    courseId: string,
    moduleId: string,
    lessonId: string,
    forceMediaDelete: boolean = false
  ): Promise<void> {
    const params = forceMediaDelete ? '?force_media_delete=true' : '';
    return this.delete<void>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}${params}`
    );
  }

  /**
   * Réorganiser les leçons d'un module
   */
  async reorderLessons(
    courseId: string,
    moduleId: string,
    reorderData: LessonReorderRequest
  ): Promise<Module> {
    return this.patch<Module>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/reorder`,
      reorderData
    );
  }

  /**
   * Attacher un média (vidéo/PDF/image) à une leçon
   */
  async attachLessonMedia(
    courseId: string,
    moduleId: string,
    lessonId: string,
    mediaData: AttachMediaRequest
  ): Promise<LessonResponse> {
    return this.put<LessonResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/media`,
      mediaData
    );
  }

  // ============= MODULE QUIZ ENDPOINTS =============

  /**
   * Créer un quiz pour un module
   */
  async createModuleQuiz(
    courseId: string,
    moduleId: string,
    quizData: QuizCreate
  ): Promise<QuizResponse> {
    return this.post<QuizResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/quizzes`,
      quizData
    );
  }

  /**
   * Mettre à jour un quiz de module
   */
  async updateModuleQuiz(
    courseId: string,
    moduleId: string,
    quizId: string,
    quizData: QuizUpdate
  ): Promise<QuizResponse> {
    return this.put<QuizResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/quizzes/${quizId}`,
      quizData
    );
  }

  /**
   * Supprimer un quiz de module
   */
  async deleteModuleQuiz(
    courseId: string,
    moduleId: string,
    quizId: string
  ): Promise<void> {
    return this.delete<void>(
      `/api/courses/${courseId}/modules/${moduleId}/quizzes/${quizId}`
    );
  }

  /**
   * Réorganiser le contenu d'un module (leçons + quizzes + assignments)
   */
  async reorderModuleContent(
    courseId: string,
    moduleId: string,
    orderData: { items: Array<{ type: 'lesson' | 'quiz' | 'assignment'; id: string }> }
  ): Promise<Module> {
    return this.patch<Module>(
      `/api/courses/${courseId}/modules/${moduleId}/quizzes/reorder`,
      { order: orderData.items.map(item => item.id) }
    );
  }

  // ============= DEPRECATED LESSON QUIZ ENDPOINTS =============

  /**
   * @deprecated Les quizzes sont maintenant au niveau module, utiliser createModuleQuiz
   */
  async createLessonQuiz(
    courseId: string,
    moduleId: string,
    lessonId: string,
    quizData: QuizCreate
  ): Promise<QuizResponse> {
    console.warn('createLessonQuiz is deprecated, use createModuleQuiz instead');
    return this.post<QuizResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quiz`,
      quizData
    );
  }

  /**
   * @deprecated Les quizzes sont maintenant au niveau module
   */
  async getLessonQuiz(
    courseId: string,
    moduleId: string,
    lessonId: string
  ): Promise<QuizResponse> {
    console.warn('getLessonQuiz is deprecated');
    return this.get<QuizResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quiz`
    );
  }

  /**
   * @deprecated Les quizzes sont maintenant au niveau module, utiliser updateModuleQuiz
   */
  async updateLessonQuiz(
    courseId: string,
    moduleId: string,
    lessonId: string,
    quizData: QuizUpdate
  ): Promise<QuizResponse> {
    console.warn('updateLessonQuiz is deprecated, use updateModuleQuiz instead');
    return this.put<QuizResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quiz`,
      quizData
    );
  }

  /**
   * @deprecated Les quizzes sont maintenant au niveau module, utiliser deleteModuleQuiz
   */
  async deleteLessonQuiz(
    courseId: string,
    moduleId: string,
    lessonId: string
  ): Promise<void> {
    console.warn('deleteLessonQuiz is deprecated, use deleteModuleQuiz instead');
    return this.delete<void>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quiz`
    );
  }

  /**
   * @deprecated Quiz IDs are now managed at module level
   */
  async getQuizById(
    courseId: string,
    moduleId: string,
    lessonId: string,
    quizId: string
  ): Promise<QuizResponse> {
    console.warn('getQuizById is deprecated');
    return this.get<QuizResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quiz/${quizId}`
    );
  }

  /**
   * @deprecated Use updateModuleQuiz instead
   */
  async updateQuizById(
    courseId: string,
    moduleId: string,
    lessonId: string,
    quizId: string,
    quizData: QuizUpdate
  ): Promise<QuizResponse> {
    console.warn('updateQuizById is deprecated, use updateModuleQuiz instead');
    return this.put<QuizResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quiz/${quizId}`,
      quizData
    );
  }

  /**
   * @deprecated Use deleteModuleQuiz instead
   */
  async deleteQuizById(
    courseId: string,
    moduleId: string,
    lessonId: string,
    quizId: string
  ): Promise<void> {
    console.warn('deleteQuizById is deprecated, use deleteModuleQuiz instead');
    return this.delete<void>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quiz/${quizId}`
    );
  }

  // ============= ASSIGNMENT ENDPOINTS (NEW) =============

  /**
   * Créer un assignment pour un module
   */
  async createAssignment(
    courseId: string,
    moduleId: string,
    assignmentData: AssignmentCreate
  ): Promise<AssignmentResponse> {
    // Certains endpoints exigent course_id et module_id dans le body
    const payload: any = { course_id: courseId, module_id: moduleId, ...assignmentData };
    return this.post<AssignmentResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/assignment`,
      payload
    );
  }

  /**
   * Récupérer l'assignment d'un module
   */
  async getAssignment(
    courseId: string,
    moduleId: string
  ): Promise<AssignmentResponse> {
    // Traiter 404 comme un statut attendu (évite erreurs bruyantes en console)
    const resp = await this.axiosInstance.get<AssignmentResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/assignment`,
      { validateStatus: (s) => s === 200 || s === 404 }
    );
    if (resp.status === 404) {
      const err: any = new Error('Assignment not found');
      err.response = { status: 404 };
      throw err;
    }
    return resp.data;
  }

  /**
   * Mettre à jour l'assignment d'un module
   */
  async updateAssignment(
    courseId: string,
    moduleId: string,
    assignmentData: AssignmentUpdate
  ): Promise<AssignmentResponse> {
    const payload: any = { course_id: courseId, module_id: moduleId, ...assignmentData };
    return this.put<AssignmentResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/assignment`,
      payload
    );
  }

  /**
   * Supprimer l'assignment d'un module
   */
  async deleteAssignment(
    courseId: string,
    moduleId: string
  ): Promise<void> {
    return this.delete<void>(
      `/api/courses/${courseId}/modules/${moduleId}/assignment`
    );
  }

  /**
   * Récupérer un assignment par son ID
   */
  async getAssignmentById(
    courseId: string,
    moduleId: string,
    assignmentId: string
  ): Promise<AssignmentResponse> {
    return this.get<AssignmentResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/assignment/${assignmentId}`
    );
  }

  /**
   * Mettre à jour un assignment par son ID
   */
  async updateAssignmentById(
    courseId: string,
    moduleId: string,
    assignmentId: string,
    assignmentData: AssignmentUpdate
  ): Promise<AssignmentResponse> {
    const payload: any = { course_id: courseId, module_id: moduleId, ...assignmentData };
    return this.put<AssignmentResponse>(
      `/api/courses/${courseId}/modules/${moduleId}/assignment/${assignmentId}`,
      payload
    );
  }

  /**
   * Supprimer un assignment par son ID
   */
  async deleteAssignmentById(
    courseId: string,
    moduleId: string,
    assignmentId: string
  ): Promise<void> {
    return this.delete<void>(
      `/api/courses/${courseId}/modules/${moduleId}/assignment/${assignmentId}`
    );
  }

  // ============= DEPRECATED QUIZ METHODS =============

  /**
   * @deprecated Use createModuleQuiz instead
   */
  async createQuiz(courseId: string, moduleId: number, lessonId: number, quizData: QuizCreate): Promise<Quiz> {
    console.warn('createQuiz is deprecated, use createModuleQuiz instead');
    return this.post<Quiz>(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`, quizData);
  }

  /**
   * @deprecated Use updateModuleQuiz instead (renamed to avoid conflict)
   */
  async updateModuleQuizOld(courseId: string, moduleId: number, quizData: QuizCreate): Promise<Quiz> {
    console.warn('updateModuleQuizOld is deprecated, use updateModuleQuiz instead');
    return this.put<Quiz>(`/api/courses/${courseId}/modules/${moduleId}/quiz`, quizData);
  }

  /**
   * @deprecated Use deleteModuleQuiz instead (renamed to avoid conflict)
   */
  async deleteModuleQuizOld(courseId: string, moduleId: number): Promise<void> {
    console.warn('deleteModuleQuizOld is deprecated, use deleteModuleQuiz instead');
    return this.delete<void>(`/api/courses/${courseId}/modules/${moduleId}/quiz`);
  }

  /**
   * Upload de média (image ou vidéo) - DEPRECATED
   * @deprecated Use prepareUpload + completeUpload instead
   */
  async uploadMedia(courseId: string, fileType: 'image' | 'video', fileName: string): Promise<UploadResponse> {
    return this.post<UploadResponse>(`/api/courses/${courseId}/upload`, { file_type: fileType, file_name: fileName });
  }

  // ============= NEW PRESIGNED UPLOAD FLOW =============

  /**
   * Préparer un upload présigné (single ou multipart)
   */
  async prepareUpload(
    filename: string,
    contentType: string,
    size: number,
    // Backend attend: 'image' | 'video' | 'resource' (alias de PDF)
    kind: 'image' | 'video' | 'resource'
  ): Promise<PrepareUploadResponse> {
    return this.post<PrepareUploadResponse>('/api/storage/prepare-upload', {
      filename,
      content_type: contentType,
      size,
      kind,
    });
  }

  /**
   * Finaliser un upload présigné
   */
  async completeUpload(params: CompleteUploadParams): Promise<CompleteUploadResponse> {
    return this.post<CompleteUploadResponse>('/api/storage/complete-upload', params);
  }

  /**
   * Annuler un upload multipart (si l'utilisateur abandonne)
   */
  async abortUpload(uploadId: string, key: string): Promise<void> {
    // Endpoint optionnel côté backend
    try {
      await this.post('/api/storage/abort-upload', { upload_id: uploadId, key });
    } catch (e) {
      // Silencieux si non implémenté
      console.warn('abort-upload failed or not implemented', e);
    }
  }

  /**
   * Obtenir l'URL de lecture d'une vidéo
   */
  async getVideoPlayUrl(key: string): Promise<VideoPlayResponse> {
    const raw: any = await this.get<any>('/api/storage/play', { params: { key } });
    return { url: raw.play_url ?? raw.url, expires_in: raw.expires_in };
  }

  /**
   * Obtenir une URL de lecture pour n'importe quel asset (image, pdf, vidéo)
   * Note: alias générique de getVideoPlayUrl afin de l'utiliser aussi pour les images/PDF
   */
  async getPlayUrl(key: string): Promise<VideoPlayResponse> {
    const raw: any = await this.get<any>('/api/storage/play', { params: { key } });
    return { url: raw.play_url ?? raw.url, expires_in: raw.expires_in, stream_type: raw.stream_type };
  }

  /**
   * URL de redirection directe (302) utilisable comme src d'une balise <video> ou <img>
   */
  getPlayRedirectUrl(key: string): string {
    return `${import.meta.env.VITE_API_URL}/api/storage/play/redirect?key=${encodeURIComponent(key)}`;
  }

  /**
   * Lecture batch de plusieurs clés
   */
  async getMultiPlay(keys: string[]): Promise<Array<{ key: string; url?: string; stream_type?: string; error?: string }>> {
    const raw: any = await this.get<any>('/api/storage/play/multi', { params: { keys } });
    return raw.items || [];
  }

  /**
   * Récupérer les métadonnées d'un asset par sa clé
   */
  async getAssetByKey(key: string): Promise<any> {
    return this.get('/api/storage/assets/by-key', { params: { key } });
  }

  /**
   * Lister des assets (pagination + filtres optionnels)
   */
  async listAssets(page: number = 1, perPage: number = 10, status?: string): Promise<any> {
    return this.get('/api/storage/assets', { params: { page, per_page: perPage, status } });
  }

  /**
   * Obtenir l'URL de téléchargement d'un fichier par sa clé
   */
  async getDownloadUrl(key: string): Promise<{ url: string; download_url: string }> {
    return this.get(`/api/storage/download`, { params: { key } });
  }

  /**
   * Récupérer le programme d'un cours avec download_url
   */
  async getCourseProgramUrl(courseId: string): Promise<{ url: string; download_url: string; expires_in: number }> {
    return this.get(`/api/courses/${courseId}/program`);
  }

  /**
   * URL de lecture inline du programme PDF (spec canonique)
   */
  async getCourseProgram(courseId: string): Promise<ProgramUrlResponse> {
    return this.get<ProgramUrlResponse>(`/api/courses/${courseId}/program`);
  }

  /**
   * Récupérer les statistiques d'un cours
   */
  async getCourseStats(courseId: string): Promise<CourseStatsResponse> {
    return this.get<CourseStatsResponse>(`/api/courses/${courseId}/stats`);
  }

  /**
   * Statistiques agrégées des évaluations d'un cours (endpoint canonique)
   */
  async getCourseEvaluationStats(courseId: string): Promise<any> {
    return this.get<any>(`/api/courses/${courseId}/stats/evaluations`);
  }

  /**
   * S'inscrire à un cours (enrollment) - ou inscrire un apprenant (admin)
   */
  async enrollCourse(courseId: string, userId?: number): Promise<EnrollResponse> {
    const body: any = { course_id: courseId };
    if (userId !== undefined) {
      body.user_id = userId;
    }
    return this.post<EnrollResponse>('/api/courses/enroll', body);
  }

  /**
   * Récupérer mes inscriptions (enrollments)
   */
  async getMyEnrollments(): Promise<EnrollmentResponse[]> {
    return this.get<EnrollmentResponse[]>('/api/courses/enrollments/my');
  }

  // ============= ORGANIZATIONS =============

  /**
   * Créer un organisme de formation (superadmin uniquement)
   */
  async createOrganization(orgData: OrganizationCreate): Promise<OrganizationResponse> {
    return this.post<OrganizationResponse>('/api/organizations/', orgData);
  }

  /**
   * Lister les organismes de formation avec pagination
   * L'API peut retourner soit un tableau directement, soit un objet paginé { items: [...] }
   */
  async listOrganizations(page: number = 1, perPage: number = 10): Promise<OrganizationResponse[]> {
    const response = await this.get<OrganizationResponse[] | { items: OrganizationResponse[] }>('/api/organizations/', {
      params: { page, per_page: perPage }
    });
    // Gérer les deux formats de réponse possibles
    if (Array.isArray(response)) {
      return response;
    }
    if (response && typeof response === 'object' && 'items' in response) {
      return response.items;
    }
    return [];
  }

  /**
   * Vérifier la disponibilité d'un sous-domaine, email ou SIRET
   */
  async checkAvailability(params: { subdomain?: string; email?: string; siret?: string }): Promise<{ subdomain?: boolean; email?: boolean; siret?: boolean }> {
    return this.get('/api/organizations/check-availability', { params });
  }

  /**
   * Récupérer un organisme de formation par son ID
   */
  async getOrganization(orgId: number): Promise<OrganizationResponse> {
    return this.get<OrganizationResponse>(`/api/organizations/${orgId}`);
  }

  async getOrganizationStats(orgId: number | string): Promise<any> {
    return this.get<any>(`/api/organizations/${orgId}/stats`);
  }

  /**
   * Récupérer le suivi pédagogique complet des apprenants d'un organisme
   */
  async getLearnerProgress(orgId: number | string, params?: any): Promise<any> {
    return this.get<any>(`/api/organizations/${orgId}/learner-progress`, { params });
  }

  /**
   * Mettre à jour un organisme de formation
   */
  async updateOrganization(orgId: number, update: Partial<OrganizationCreate>): Promise<OrganizationResponse> {
    return this.put<OrganizationResponse>(`/api/organizations/${orgId}`, update);
  }

  // ============= USER MANAGEMENT =============

  /**
   * Changer le statut d'un utilisateur (superadmin uniquement)
   */
  async updateUserStatus(userId: number, status: 'active' | 'inactive'): Promise<UserResponse> {
    return this.patch<UserResponse>(
      `/api/auth/superadmin/users/${userId}/status`,
      { status }
    );
  }

  // ============= SUBDOMAIN VERIFICATION =============

  /**
   * Vérifier si un sous-domaine existe
   */
  async verifySubdomain(host: string): Promise<{
    exists: boolean;
    slug?: string;
    organizationId?: number;
    organizationName?: string;
    logoUrl?: string;
    login_url?: string;
    detail?: string;
  }> {
    const data = await this.get<any>('/api/organizations/verify-subdomain', { params: { host } });
    return {
      exists: data.exists,
      slug: data.slug,
      organizationId: data.organization_id, // Map snake_case to camelCase
      organizationName: data.organization_name, // Map snake_case to camelCase
      logoUrl: data.logoUrl || data.logo_url,
      login_url: data.login_url,
      detail: data.detail
    };
  }

  /**
   * Récupérer les informations publiques d'un OF par slug
   */
  async getOrganizationBySlug(slug: string): Promise<OrganizationResponse> {
    return this.get<OrganizationResponse>(`/api/organizations/slug/${slug}`);
  }

  // ============= MODULE MANAGEMENT =============
  async updateModule(
    courseId: string,
    moduleId: string,
    moduleData: ModuleFullUpdate
  ): Promise<Module> {
    return this.put(`/api/courses/${courseId}/modules/${moduleId}`, moduleData);
  }

  async deleteModule(
    courseId: string,
    moduleId: string,
    forceMediaDelete: boolean = false
  ): Promise<void> {
    return this.delete(`/api/courses/${courseId}/modules/${moduleId}`, {
      params: { force_media_delete: forceMediaDelete }
    });
  }

  /**
   * Définir l'ordre mixte leçons+quizz d'un module (assignment exclu)
   */
  async updateModuleOrder(
    courseId: string,
    moduleId: string,
    sequence: Array<{ type: 'lesson' | 'quiz'; id: string }>
  ): Promise<Module> {
    return this.patch(`/api/courses/${courseId}/modules/${moduleId}/order`, {
      sequence,
    });
  }

  // ============= RESOURCE MANAGEMENT =============

  /**
   * Lister les ressources pédagogiques d'un cours
   */
  async listCourseResources(courseId: string): Promise<Array<{ name: string; key?: string; size?: number; url?: string }>> {
    return this.get(`/api/courses/${courseId}/resources`);
  }

  /**
   * Attacher une ressource pédagogique au cours
   */
  async attachCourseResource(
    courseId: string,
    resourceKey: string,
    resourceName: string,
    size?: number
  ): Promise<{ status: string; attached?: any; message?: string }> {
    return this.post(`/api/courses/${courseId}/resources`, {
      name: resourceName,
      key: resourceKey,
      size: size || null
    });
  }

  /**
   * Détacher une ressource pédagogique du cours
   */
  async detachCourseResource(
    courseId: string,
    resourceKey: string,
    force: boolean = false
  ): Promise<{ status: string; detached_key: string; deleted_from_storage: boolean }> {
    return this.delete(`/api/courses/${courseId}/resources`, {
      params: { key: resourceKey, force }
    });
  }

  /**
   * Télécharger une ressource par index avec le bon nom de fichier
   */
  async downloadCourseResource(courseId: string, index: number): Promise<void> {
    const response = await this.axiosInstance.get(
      `/api/courses/${courseId}/resources/${index}/download`,
      { responseType: 'blob' }
    );

    // Extraire le nom du fichier depuis Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    let filename = `resource-${index}.pdf`; // Fallback avec extension

    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Récupérer le blob d'une ressource pédagogique (sans lancer le téléchargement)
   * Retourne le blob et le filename extrait des headers si présent
   */
  async fetchCourseResourceBlob(courseId: string, index: number): Promise<{ blob: Blob; filename: string }> {
    const response = await this.axiosInstance.get(
      `/api/courses/${courseId}/resources/${index}/download`,
      { responseType: 'blob' }
    );

    const contentDisposition = response.headers['content-disposition'];
    let filename = `resource-${index}`;
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
    return { blob, filename };
  }

  /**
   * Télécharger le programme PDF du cours
   */
  async downloadCourseProgram(courseId: string): Promise<void> {
    const response = await this.axiosInstance.get(
      `/api/courses/${courseId}/program/download`,
      { responseType: 'blob' }
    );

    // Extraire le nom du fichier depuis Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'programme.pdf';

    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // ============= CATEGORIES =============

  /**
   * Lister toutes les catégories (actives uniquement par défaut)
   */
  async listCategories(): Promise<CategoryItem[]> {
    return this.get('/api/categories/');
  }

  /**
   * Créer une nouvelle catégorie (OF ou trainer)
   */
  async createCategory(data: CategoryCreate): Promise<CategoryItem> {
    return this.post('/api/categories/', data);
  }

  /**
   * Créer une catégorie globale (superadmin uniquement)
   */
  async createGlobalCategory(data: CategoryCreate): Promise<CategoryItem> {
    return this.post('/api/categories/global', data);
  }

  /**
   * Toggle l'état actif d'une catégorie
   */
  async toggleCategoryActive(categoryId: number, active: boolean): Promise<CategoryItem> {
    return this.patch(`/api/categories/${categoryId}/toggle`, null, { params: { active } });
  }

  /**
   * Supprimer une catégorie
   */
  async deleteCategory(categoryId: number): Promise<void> {
    return this.delete(`/api/categories/${categoryId}`);
  }

  // ============= NIVEAUX (LEVELS) =============

  /**
   * Récupérer les niveaux pour un cycle d'apprentissage
   */
  async getLevels(cycle: string): Promise<string[]> {
    return this.get('/api/levels/', { params: { cycle } });
  }

  /**
   * Créer un nouveau niveau pro (formation professionnelle)
   */
  async createProLevel(data: ProLevelCreate): Promise<ProLevelItem> {
    // Adapter l’ancien format { label } vers le nouveau { name }
    const payload: any = { ...data };
    if (!payload.name && payload.label) {
      payload.name = payload.label;
    }
    // Ne pas envoyer le champ label si name est défini pour éviter ambiguïté
    if (payload.name && 'label' in payload) {
      delete payload.label;
    }
    return this.post('/api/levels/', payload);
  }

  /**
   * Toggle l'état actif d'un niveau pro
   */
  async toggleProLevelActive(levelId: number, active: boolean): Promise<ProLevelItem> {
    return this.patch(`/api/levels/${levelId}/toggle`, null, { params: { active } });
  }

  /**
   * Supprimer un niveau pro
   */
  async deleteProLevel(levelId: number): Promise<void> {
    return this.delete(`/api/levels/${levelId}`);
  }

  // ============= TRAINER VALIDATION (Superadmin) =============

  /**
   * Valide ou rejette un formateur indépendant
   * PATCH /api/auth/superadmin/validate-trainer/{user_id}
   */
  async validateTrainer(
    userId: number,
    request: ValidateTrainerRequest
  ): Promise<UserResponse> {
    const response = await this.axiosInstance.patch<UserResponse>(
      `/api/auth/superadmin/validate-trainer/${userId}`,
      request
    );
    return response.data;
  }

  // ============= TOKENS (BOUTIQUE) =============

  /**
   * Récupère le solde de tokens de l'utilisateur connecté
   * GET /api/tokens/balance
   */
  async getTokenBalance(): Promise<TokenBalanceResponse> {
    const response = await this.axiosInstance.get<TokenBalanceResponse>(
      '/api/tokens/balance'
    );
    return response.data;
  }

  /**
   * Achète des tokens avec le montant spécifié
   * POST /api/tokens/buy
   */
  async buyTokens(request: TokenBuyRequest): Promise<TokenBuyResponse> {
    const response = await this.axiosInstance.post<TokenBuyResponse>(
      '/api/tokens/buy',
      request
    );
    return response.data;
  }

  /**
   * Récupère la configuration de tarification des tokens
   * GET /api/tokens/config
   */
  async getTokenConfig(): Promise<TokenConfigResponse> {
    const response = await this.axiosInstance.get<TokenConfigResponse>(
      '/api/tokens/config'
    );
    return response.data;
  }

  /**
   * Met à jour la configuration de tarification (admin)
   * PATCH /api/tokens/config
   */
  async updateTokenConfig(config: TokenConfigUpdate): Promise<TokenConfigResponse> {
    const response = await this.axiosInstance.patch<TokenConfigResponse>(
      '/api/tokens/config',
      config
    );
    return response.data;
  }

  // ============= OF USER MANAGEMENT =============

  /**
   * Créer un utilisateur pour un OF
   * POST /api/organizations/{of_id}/users
   */
  async createOFUser(ofId: number | string, userData: {
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone?: string;
  }): Promise<any> {
    const response = await this.axiosInstance.post(
      `/api/organizations/${ofId}/users`,
      userData
    );
    return response.data;
  }

  /**
   * Lister les utilisateurs d'un OF
   * GET /api/organizations/{of_id}/users
   */
  async listOFUsers(ofId: number | string, params?: {
    role?: string;
    search?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<any[]> {
    const response = await this.axiosInstance.get(
      `/api/organizations/${ofId}/users`,
      { params }
    );
    return response.data;
  }

  /**
   * Assigner un média à un utilisateur
   */
  async assignMediaToUser(assignmentData: {
    user_id: number;
    media_asset_id: number;
    message?: string;
    phase?: string;
  }): Promise<any> {
    return this.post('/api/storage/assign', assignmentData);
  }

  /**
   * Récupérer mes documents assignés
   */
  async getMyDocuments(): Promise<any[]> {
    return this.get('/api/storage/my-documents');
  }

  /**
   * Supprimer un asset média
   */
  async deleteAsset(assetId: number, force: boolean = false): Promise<any> {
    return this.delete(`/api/storage/assets/${assetId}?force=${force}`);
  }

  /**
   * Signer un document électroniquement
   */
  async signDocument(assignmentId: number, signatureData: string): Promise<any> {
    return this.post(`/api/storage/assignments/${assignmentId}/sign`, { signature_data: signatureData });
  }

  /**
   * Lister tous les documents assignés (pour OF/Admin)
   */
  async listAssignments(params: {
    of_id?: number | string;
    user_id?: number | string;
    status?: string | string[];
    kind?: string;
    page?: number;
    per_page?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    return this.get(`/api/storage/assignments?${searchParams.toString()}`);
  }


  // --- DOCUMENTS ---
  async listDocumentTemplates(ofId: number, phase?: string) {
    const query = phase ? `?phase=${phase}` : '';
    const res = await this.get<any[]>(`/api/organizations/${ofId}/document-templates${query}`);
    return res.map(t => ({
      id: t.id,
      type: t.type,
      phase: t.phase,
      title: t.title,
      description: t.description,
      htmlContent: t.html_content || t.htmlContent,
      requiresSignature: t.requires_signature !== undefined ? t.requires_signature : t.requiresSignature,
      isActive: t.is_active !== undefined ? t.is_active : t.isActive,
      createdAt: t.created_at || t.createdAt,
      updatedAt: t.updated_at || t.updatedAt,
    }));
  }

  async createDocumentTemplate(ofId: number, data: any) {
    const payload = {
      ...data,
      html_content: data.htmlContent,
      requires_signature: data.requiresSignature,
      is_active: data.isActive
    };
    return this.post<any>(`/api/organizations/${ofId}/document-templates`, payload);
  }

  async updateDocumentTemplate(ofId: number, templateId: string, data: any) {
    const payload = {
      ...data,
      html_content: data.htmlContent,
      requires_signature: data.requiresSignature,
      is_active: data.isActive
    };
    return this.put<any>(`/api/organizations/${ofId}/document-templates/${templateId}`, payload);
  }

  async deleteDocumentTemplate(ofId: number, templateId: string) {
    return this.delete<any>(`/api/organizations/${ofId}/document-templates/${templateId}`);
  }

  async getOFSignature(ofId: number) {
    return this.get<any>(`/api/organizations/${ofId}/signature`);
  }

  async updateOFSignature(ofId: number, data: { signature_data: string }) {
    return this.put<any>(`/api/organizations/${ofId}/signature`, data);
  }

  async sendDocuments(ofId: number, data: any) {
    return this.post<any>(`/api/organizations/${ofId}/documents/send`, data);
  }

  /**
   * Lister l'historique des communications d'un OF
   */
  async listCommunications(ofId: number | string, params?: {
    type?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<any> {
    return this.get(`/api/organizations/${ofId}/communications/history`, { params });
  }

  /**
   * Envoyer une communication (email/relance)
   */
  async sendCommunication(ofId: number | string, data: {
    type: string;
    learner_ids: number[];
    template_id?: string;
    subject?: string;
    content?: string;
  }): Promise<any> {
    return this.post(`/api/organizations/${ofId}/communications/send`, data);
  }

  async getEmargements(ofId: number, params?: { phase?: string; learner_id?: number }) {
    let query = '';
    if (params) {
      const sp = new URLSearchParams();
      if (params.phase) sp.append('phase', params.phase);
      if (params.learner_id) sp.append('learner_id', params.learner_id.toString());
      query = '?' + sp.toString();
    }
    return this.get<any>(`/api/organizations/${ofId}/emargements${query}`);
  }

  // --- LEARNER DOCUMENTS ---
  async getLearnerDocuments(ofId: number, learnerId: number) {
    return this.get<any[]>(`/api/organizations/${ofId}/learners/${learnerId}/documents`);
  }

  async signLearnerDocument(ofId: number, learnerId: number, docId: string, signatureData: string, htmlContent?: string) {
    return this.post<any>(`/api/organizations/${ofId}/learners/${learnerId}/documents/${docId}/sign`, {
      signature_data: signatureData,
      html_content: htmlContent
    });
  }

  async saveLearnerDocument(ofId: number, learnerId: number, docId: string, htmlContent: string) {
    return this.post<any>(`/api/organizations/${ofId}/learners/${learnerId}/documents/${docId}/save`, {
      html_content: htmlContent
    });
  }

  // --- MESSAGING ---
  async getConversations(): Promise<any[]> {
    return this.get('/api/messaging/conversations');
  }

  async getContacts(): Promise<any[]> {
    return this.get('/api/messaging/contacts');
  }

  async getMessages(otherUserId: number): Promise<any[]> {
    return this.get(`/api/messaging/messages/${otherUserId}`);
  }

  async sendMessage(data: { receiver_id: number, content: string }): Promise<any> {
    return this.post('/api/messaging/', data);
  }

  // --- ADMIN/LEARNER CLEANUP ---
  async cleanupDocuments(ofId: number, learnerId?: number) {
    let url = `/api/organizations/${ofId}/documents/cleanup`;
    if (learnerId) url += `?learner_id=${learnerId}`;
    return this.delete<any>(url);
  }

  // --- SUBSCRIPTIONS & PLANS ---
  async getSubscriptionPlans(): Promise<SubscriptionPlanResponse[]> {
    return this.get<SubscriptionPlanResponse[]>('/api/subscriptions-and-catalogues/plans');
  }

  async createSubscriptionPlan(plan: SubscriptionPlanCreate): Promise<SubscriptionPlanResponse> {
    return this.post<SubscriptionPlanResponse>('/api/subscriptions-and-catalogues/plans', plan);
  }

  async updateSubscriptionPlan(planId: number, updates: SubscriptionPlanUpdate): Promise<SubscriptionPlanResponse> {
    return this.put<SubscriptionPlanResponse>(`/api/subscriptions-and-catalogues/plans/${planId}`, updates);
  }

  async deleteSubscriptionPlan(planId: number): Promise<void> {
    return this.delete<void>(`/api/subscriptions-and-catalogues/plans/${planId}`);
  }

  async subscribeToPlan(planId: number): Promise<SubscriptionResponse> {
    return this.post<SubscriptionResponse>('/api/subscriptions-and-catalogues/subscriptions', { plan_id: planId });
  }

  async getCurrentSubscription(): Promise<SubscriptionResponse> {
    return this.get<SubscriptionResponse>('/api/subscriptions-and-catalogues/subscriptions/current');
  }

  async getOrganizationMetrics(): Promise<any> {
    return this.get<any>('/api/subscriptions-and-catalogues/organizations/metrics');
  }

  // ============= PAYMENTS (Superadmin) =============

  /**
   * Lister les paiements avec pagination et filtres
   */
  async listPayments(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
  }): Promise<any> {
    return this.get('/api/payments', { params });
  }

  /**
   * Récupérer les statistiques de paiement global
   */
  async getPaymentStats(): Promise<any> {
    return this.get('/api/payments/stats');
  }

  /**
   * Télécharger la facture d'un paiement
   */
  async downloadPaymentInvoice(paymentId: number | string): Promise<void> {
    const response = await this.axiosInstance.get(
      `/api/payments/${paymentId}/invoice`,
      { responseType: 'blob' }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `facture-${paymentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

// Instance singleton
export const fastAPIClient = new FastAPIClient(API_BASE_URL);
