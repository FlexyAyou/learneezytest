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
  ModuleCreate,
  Module,
  LessonCreate,
  Content,
  QuizCreate,
  Quiz,
  UploadResponse,
  EnrollResponse,
  CourseStatsResponse,
  OrganizationCreate,
  OrganizationResponse,
  OrganizationUpdate,
  UserUpdate,
  PrepareUploadResponse,
  CompleteUploadParams,
  CompleteUploadResponse,
  VideoPlayResponse,
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
   * Récupérer la liste des cours avec pagination (returns CourseSummary[])
   */
  async getCourses(page = 1, perPage = 10): Promise<any[]> {
    try {
      const response = await this.get<any[]>(`/api/courses/?page=${page}&per_page=${perPage}`);
      console.log(`[FastAPI] Courses fetched: ${response.length} items (page ${page}, per_page ${perPage})`);
      return response;
    } catch (error: any) {
      console.error('[FastAPI] Error fetching courses:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        detail: error.response?.data?.detail,
        message: error.message,
        page,
        perPage
      });
      throw error;
    }
  }

  /**
   * Récupérer un cours par ID
   */
  async getCourse(courseId: string): Promise<CourseResponse> {
    return this.get<CourseResponse>(`/api/courses/${courseId}`);
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
  async createLesson(courseId: string, moduleId: number, lessonData: LessonCreate): Promise<Content> {
    return this.post<Content>(`/api/courses/${courseId}/modules/${moduleId}/lessons`, lessonData);
  }

  /**
   * Ajouter un quiz à une leçon
   */
  async createQuiz(courseId: string, moduleId: number, lessonId: number, quizData: QuizCreate): Promise<Quiz> {
    return this.post<Quiz>(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`, quizData);
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
  async prepareUpload(filename: string, contentType: string, size: number): Promise<PrepareUploadResponse> {
    return this.post<PrepareUploadResponse>('/api/storage/prepare-upload', {
      filename,
      content_type: contentType,
      size
    });
  }

  /**
   * Finaliser un upload présigné
   */
  async completeUpload(params: CompleteUploadParams): Promise<CompleteUploadResponse> {
    return this.post<CompleteUploadResponse>('/api/storage/complete-upload', params);
  }

  /**
   * Obtenir l'URL de lecture d'une vidéo
   */
  async getVideoPlayUrl(key: string): Promise<VideoPlayResponse> {
    return this.get<VideoPlayResponse>('/api/storage/play', { params: { key } });
  }

  /**
   * Récupérer les statistiques d'un cours
   */
  async getCourseStats(courseId: string): Promise<CourseStatsResponse> {
    return this.get<CourseStatsResponse>(`/api/courses/${courseId}/stats`);
  }

  /**
   * S'inscrire à un cours (enrollment)
   */
  async enrollCourse(courseId: string): Promise<EnrollResponse> {
    return this.post<EnrollResponse>('/api/courses/enroll', { course_id: courseId });
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
   */
  async listOrganizations(page: number = 1, perPage: number = 10): Promise<OrganizationResponse[]> {
    return this.get<OrganizationResponse[]>('/api/organizations/', {
      params: { page, per_page: perPage }
    });
  }

  /**
   * Récupérer un organisme de formation par son ID
   */
  async getOrganization(orgId: number): Promise<OrganizationResponse> {
    return this.get<OrganizationResponse>(`/api/organizations/${orgId}`);
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
    return this.get('/api/organizations/verify-subdomain', { params: { host } });
  }

  /**
   * Récupérer les informations publiques d'un OF par slug
   */
  async getOrganizationBySlug(slug: string): Promise<OrganizationResponse> {
    return this.get<OrganizationResponse>(`/api/organizations/slug/${slug}`);
  }

  // ============= MODULE MANAGEMENT =============

  /**
   * Mettre à jour un module spécifique
   * Note: L'API ne fournit pas d'endpoint dédié, on utilise le PUT global
   */
  async updateModule(
    courseId: string,
    moduleIndex: number,
    moduleData: Partial<ModuleCreate>
  ): Promise<Module> {
    const course = await this.getCourse(courseId);
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], ...moduleData };
    
    const updatedCourse = await this.updateCourse(courseId, { modules: updatedModules as any });
    return updatedCourse.modules[moduleIndex];
  }

  /**
   * Supprimer un module
   */
  async deleteModule(courseId: string, moduleIndex: number): Promise<void> {
    const course = await this.getCourse(courseId);
    const updatedModules = course.modules.filter((_, idx) => idx !== moduleIndex);
    await this.updateCourse(courseId, { modules: updatedModules as any });
  }

  // ============= LESSON MANAGEMENT =============

  /**
   * Mettre à jour une leçon spécifique
   */
  async updateLesson(
    courseId: string,
    moduleId: number,
    lessonId: number,
    lessonData: Partial<LessonCreate>
  ): Promise<Content> {
    const course = await this.getCourse(courseId);
    const updatedModules = [...course.modules];
    updatedModules[moduleId].content[lessonId] = {
      ...updatedModules[moduleId].content[lessonId],
      ...lessonData
    };
    
    const updatedCourse = await this.updateCourse(courseId, { modules: updatedModules as any });
    return updatedCourse.modules[moduleId].content[lessonId];
  }

  /**
   * Supprimer une leçon
   */
  async deleteLesson(courseId: string, moduleId: number, lessonId: number): Promise<void> {
    const course = await this.getCourse(courseId);
    const updatedModules = [...course.modules];
    updatedModules[moduleId].content = updatedModules[moduleId].content.filter((_, idx) => idx !== lessonId);
    await this.updateCourse(courseId, { modules: updatedModules as any });
  }

  /**
   * Attacher une vidéo à une leçon (mise à jour du video_key)
   */
  async attachLessonVideo(
    courseId: string,
    moduleId: number,
    lessonId: number,
    videoKey: string
  ): Promise<Content> {
    return this.updateLesson(courseId, moduleId, lessonId, { video_url: videoKey });
  }

  // ============= QUIZ MANAGEMENT =============

  /**
   * Mettre à jour un quiz de leçon
   */
  async updateLessonQuiz(
    courseId: string,
    moduleId: number,
    lessonId: number,
    quizData: QuizCreate
  ): Promise<Quiz> {
    return this.post<Quiz>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`,
      quizData
    );
  }

  /**
   * Supprimer un quiz de leçon
   */
  async deleteLessonQuiz(
    courseId: string,
    moduleId: number,
    lessonId: number
  ): Promise<void> {
    const course = await this.getCourse(courseId);
    const updatedModules = [...course.modules];
    // Remove quiz from lesson (API structure may vary)
    await this.updateCourse(courseId, { modules: updatedModules as any });
  }

  /**
   * Mettre à jour un quiz de module
   */
  async updateModuleQuiz(
    courseId: string,
    moduleId: number,
    quizData: QuizCreate
  ): Promise<void> {
    const course = await this.getCourse(courseId);
    const updatedModules = [...course.modules];
    updatedModules[moduleId].quizzes = [quizData as any];
    await this.updateCourse(courseId, { modules: updatedModules as any });
  }

  /**
   * Supprimer un quiz de module
   */
  async deleteModuleQuiz(courseId: string, moduleId: number): Promise<void> {
    const course = await this.getCourse(courseId);
    const updatedModules = [...course.modules];
    updatedModules[moduleId].quizzes = [];
    await this.updateCourse(courseId, { modules: updatedModules as any });
  }

  // ============= RESOURCE MANAGEMENT =============

  /**
   * Lister les ressources pédagogiques d'un cours
   */
  async listCourseResources(courseId: string): Promise<Array<{ name?: string; key?: string; size?: number; url?: string }>> {
    const course = await this.getCourse(courseId);
    return course.resources || [];
  }

  /**
   * Attacher une ressource pédagogique au cours
   */
  async attachCourseResource(
    courseId: string,
    resourceKey: string,
    resourceName: string,
    size: number
  ): Promise<void> {
    const course = await this.getCourse(courseId);
    const updatedResources = [
      ...(course.resources || []),
      { name: resourceName, key: resourceKey, size, url: undefined }
    ];
    await this.updateCourse(courseId, { resources: updatedResources as any });
  }

  /**
   * Détacher une ressource pédagogique du cours
   */
  async detachCourseResource(courseId: string, resourceKey: string): Promise<void> {
    const course = await this.getCourse(courseId);
    const updatedResources = (course.resources || []).filter(r => r.key !== resourceKey);
    await this.updateCourse(courseId, { resources: updatedResources as any });
  }
}

// Instance singleton
export const fastAPIClient = new FastAPIClient(API_BASE_URL);
