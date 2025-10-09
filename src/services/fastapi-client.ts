import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '@/config/env';

export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface RegisterApprenantRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  telephone: string;
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
  niveau_etude?: string;
  situation_professionnelle?: string;
  objectifs_formation?: string;
  is_majeur: boolean;
  tuteur_id?: number;
}

export interface RegisterTuteurRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
  lien_parente?: string;
}

export interface RegisterFormateurRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
  specialites: string[];
  experience_annees: number;
  diplomes?: string[];
  cv_url?: string;
  linkedin_url?: string;
  type_formateur: 'interne' | 'independant';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  email: string;
  role: 'apprenant' | 'tuteur' | 'formateur_independant' | 'formateur_interne' | 'admin';
  nom?: string;
  prenom?: string;
  [key: string]: any;
}

class FastAPIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_profile');
          
          // Don't redirect if we're already on login page
          if (!window.location.pathname.includes('/connexion') && 
              !window.location.pathname.includes('/inscription')) {
            window.location.href = '/connexion';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await this.client.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  async registerApprenant(data: RegisterApprenantRequest): Promise<any> {
    const response = await this.client.post('/auth/register/apprenant', data);
    return response.data;
  }

  async registerTuteur(data: RegisterTuteurRequest): Promise<any> {
    const response = await this.client.post('/auth/register/tuteur', data);
    return response.data;
  }

  async registerFormateur(data: RegisterFormateurRequest): Promise<any> {
    const response = await this.client.post('/auth/register/formateur', data);
    return response.data;
  }

  async getCurrentUser(): Promise<UserProfile> {
    const response = await this.client.get<UserProfile>('/auth/me');
    return response.data;
  }

  // Store auth data
  setAuthData(token: string, user: UserProfile) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_profile', JSON.stringify(user));
  }

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
  }

  // Get stored user
  getStoredUser(): UserProfile | null {
    const userStr = localStorage.getItem('user_profile');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export const fastapiClient = new FastAPIClient();
