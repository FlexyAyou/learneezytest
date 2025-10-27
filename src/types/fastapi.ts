/**
 * Types TypeScript générés depuis le schéma OpenAPI FastAPI
 */

// ============= RÔLES =============
export type UserRole =
  | 'superadmin'
  | 'administrator'
  | 'of_admin'
  | 'gestionnaire'
  | 'formateur_interne'
  | 'createur_contenu'
  | 'student'
  | 'apprenant'
  | 'tutor'
  | 'trainer'
  | 'independent_trainer'
  | 'facilitator'
  | 'manager';

// ============= AUTHENTIFICATION =============
export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserCreate {
  email: string;
  password: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  is_major?: boolean;
  accept_terms: boolean;
  of_id?: number | null;
  accessible_catalogues?: string[];
}

// Création d'utilisateur par le superadmin (sans mot de passe, généré côté serveur)
export interface SuperAdminUserCreate {
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  is_major?: boolean;
  accept_terms: boolean;
  of_id?: number | null;
  accessible_catalogues?: string[];
}

export interface UserResponse {
  id?: number;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  is_major?: boolean;
  of_id?: number | null;
  accessible_catalogues?: string[];
  phone?: string;
  address?: string;
  bio?: string;
  image?: string;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  image?: string;
  address?: string;
  phone?: string;
  bio?: string;
  accessible_catalogues?: string[];
}

// Réponse complète de la liste des utilisateurs (endpoint superadmin)
export interface ListAllUsersResponse {
  id: number;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  of_id?: number | null;
  status?: string;
  is_verified?: boolean;
  is_major?: boolean | null;
  accessible_catalogues?: string[];
  of_name?: string | null;
  phone?: string;
  address?: string;
  bio?: string;
  image?: string;
  alert_message?: {
    type: string | null;
    message: string | null;
    date: string | null;
  };
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface UserResetPassword {
  email: string;
}

export interface ResetPasswordRequest {
  new_password: string;
}

// ============= USER STATUS =============
export type UserStatus = 'active' | 'inactive';

export interface StatusUpdate {
  status: UserStatus;
}

// ============= TOKENS (BOUTIQUE) =============
export interface TokenBalanceResponse {
  balance: number;
  purchase_history: Array<Record<string, any>>;
}

export interface TokenBuyRequest {
  amount: number;
}

export interface TokenBuyResponse {
  new_balance: number;
  tokens_added: number;
  transaction_id: string;
}

// ============= ORGANISATIONS =============
export type SubscriptionType = 'starter' | 'gold' | 'premium';

export interface OrganizationCreate {
  name: string;
  subdomain: string;
  subscription_type: SubscriptionType;
  contact_email: string;
  description: string;
  website: string;
  legal_representative: string;
  address: string;
  phone: string;
  email: string;
  siret: string;
  numero_declaration: string;
  agrement: string[];
  tokens_total: number;
}

export interface OrganizationResponse {
  id: number;
  name: string;
  subdomain: string;
  subscription_type: SubscriptionType;
  contact_email: string;
  created_at: string;
  created_by: number;
  // Champs additionnels
  description?: string;
  website?: string;
  legal_representative?: string;
  address?: string;
  phone?: string;
  email?: string;
  siret?: string;
  numero_declaration?: string;
  agrement?: string[];
  tokens_total?: number;
  tokens_remaining?: number;
  is_active?: boolean;
}

export interface OrganizationUpdate {
  subscription_type?: SubscriptionType;
}

// ============= CATALOGUES =============
export interface CatalogueResponse {
  id: number;
  name: string;
  courses: string[];
  type_: string;
  of_id?: number;
}

export interface AssignCatalogueRequest {
  catalogue_ids: string[];
}

export interface SubscriptionCreate {
  type_: SubscriptionType;
}

export interface SubscriptionResponse {
  id: number;
  of_id: number;
  type_: SubscriptionType;
  start_date: string;
  end_date?: string;
  status: string;
}

// ============= JWT PAYLOAD =============
export interface JWTPayload {
  user_id: number;
  role: UserRole;
  email: string;
  of_id?: number | null;
  exp: number;
  sub: string;
}

// ============= ERREURS =============
export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

// ============= SOUS-DOMAINES & ORGANISATIONS =============

export interface SubdomainVerification {
  exists: boolean;
  slug?: string;
  organizationId?: number;
  organizationName?: string;
  logoUrl?: string;
  login_url?: string;
  detail?: string;
}

export interface OrganizationContextData {
  organization: SubdomainVerification | null;
  isOFContext: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============= COURSES =============

export type CourseStatus = 'draft' | 'published';
export type CourseOwnerType = 'learneezy' | 'of';

// Import types from quiz.ts for better type safety
import type { QuizConfig, AssignmentConfig } from './quiz';

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface Content {
  title: string;
  duration: string;
  description: string;
  video_url?: string;
  transcription?: string;
  quiz?: QuizConfig; // Quiz optionnel par leçon
}

export interface Module {
  title: string;
  description?: string;
  duration: string;
  content: Content[];
  quizzes?: Quiz[]; // Legacy support
  assignment?: AssignmentConfig; // Devoir à la fin du module
}

export interface Resource {
  name: string;
  url: string;
}

export interface Course {
  id?: string;
  title: string;
  description: string;
  price?: number;
  category?: string;
  duration?: string;
  level: string;
  image_url?: string;
  resources?: Resource[];
  modules: Module[];
  certification?: import('./quiz').CertificationConfig; // Certification finale du cours
}

export interface CourseResponse extends Course {
  owner_type: CourseOwnerType;
  owner_id: number;
}

export interface CourseUpdate {
  title?: string;
  description?: string;
  price?: number;
  status?: CourseStatus;
}

export interface ModuleCreate {
  title: string;
  description?: string;
  duration: string;
  content: Content[];
  quizzes?: Quiz[];
}

export interface LessonCreate {
  title: string;
  duration: string;
  description: string;
  video_url?: string;
  transcription?: string;
}

export interface QuizCreate {
  title: string;
  questions: QuizQuestion[];
}

export interface UploadRequest {
  file_type: 'image' | 'video';
  file_name: string;
}

export interface UploadResponse {
  url: string;
}

export interface EnrollRequest {
  course_id: string;
}

export interface EnrollResponse {
  message: string;
  progress: Record<string, number>;
}

export interface CourseStatsResponse {
  enrolled_count: number;
  revenue_tokens: number;
  average_score: number;
}
