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
   * Récupérer la liste des cours avec pagination
   */
  async getCourses(page = 1, perPage = 10): Promise<CourseResponse[]> {
    return this.get<CourseResponse[]>(`/api/courses/?page=${page}&per_page=${perPage}`);
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
  async createCourse(courseData: Course): Promise<{ message: string }> {
    return this.post<{ message: string }>('/api/courses/', courseData);
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
   * Upload de média (image ou vidéo)
   */
  async uploadMedia(courseId: string, fileType: 'image' | 'video', fileName: string): Promise<UploadResponse> {
    return this.post<UploadResponse>(`/api/courses/${courseId}/upload`, { file_type: fileType, file_name: fileName });
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
}

// Instance singleton
export const fastAPIClient = new FastAPIClient(API_BASE_URL);
