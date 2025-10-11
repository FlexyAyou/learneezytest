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
} from '@/types/fastapi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backendlearneezy.testdevinfinitiax.fr';

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
              this.logout();
              throw new Error('Session expirée, veuillez vous reconnecter');
            }
          } else {
            // Refresh token expiré
            this.logout();
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
        if (error.response?.status === 401) {
          this.logout();
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
   * Déconnexion complète
   */
  private logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/connexion';
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
   * Décode le JWT pour obtenir le payload
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch {
      return null;
    }
  }
}

// Instance singleton
export const fastAPIClient = new FastAPIClient(API_BASE_URL);
