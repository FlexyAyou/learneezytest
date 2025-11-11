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

// ============= CATEGORIES ET NIVEAUX =============
export interface CategoryItem {
  id: number;
  name: string;
  active: boolean;
  owner_type: 'learneezy' | 'of';
  owner_id: number | null;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
}

export interface CategoryUpdateActive {
  active: boolean;
}

export interface ProLevelItem {
  id: number;
  label: string;
  active: boolean;
  owner_type: 'learneezy' | 'of';
  owner_id: number | null;
  created_at: string;
}

export interface ProLevelCreate {
  label: string;
}

export interface ProLevelUpdateActive {
  active: boolean;
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

// ============= COURSE STRUCTURE =============

export type CourseStatus = 'draft' | 'published';
export type CourseOwnerType = 'learneezy' | 'of';

/**
 * Question d'un quiz
 */
export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

/**
 * Quiz associé à un module
 */
export interface Quiz {
  id?: string; // ID attribué par le backend
  title: string;
  questions: QuizQuestion[];
  lesson_id?: string; // ID de la leçon associée
  module_id?: string; // ID du module associé
}

/**
 * Contenu d'une leçon (vidéo, texte, etc.)
 */
export interface Content {
  id?: string; // ID attribué par le backend
  title: string;
  duration: string;
  description: string;
  video_url?: string | null;
  video_key?: string | null; // Storage key for video in MinIO/S3
  key?: string | null; // Alias for video_key
  transcription?: string | null;
  // NOUVEAUX CHAMPS pour les types de contenu alternatifs
  image_key?: string | null; // Storage key for image content
  resource_key?: string | null; // Storage key for PDF/file resources
  pdf_key?: string | null; // Storage key for PDF content
  content_type?: 'video' | 'image' | 'pdf' | 'url'; // Type de contenu principal
}

/**
 * Module d'un cours
 */
export interface Module {
  id?: string; // ID attribué par le backend
  title: string;
  description?: string | null;
  duration: string;
  content: Content[];
  quizzes?: Quiz[];
}

/**
 * Ressource téléchargeable (PDF, etc.)
 */
export interface Resource {
  name: string;
  key?: string | null;
  size?: number | null;
  url?: string;
  resource_key?: string; // Alias for key (backend compatibility)
}

/**
 * Structure complète d'un cours (pour création)
 */
export interface Course {
  title: string;
  description: string;
  objectives?: string[] | null; // Liste des objectifs pédagogiques
  price?: number | null;
  category?: string | null; // Legacy text category (deprecated)
  category_ids?: number[] | null; // List of category IDs
  category_names?: string[] | null; // Category names to resolve/create
  allow_create_categories?: boolean | null; // If true, create missing categories
  duration?: string | null;
  level?: string | null; // Legacy difficulty level
  image_url?: string | null; // Deprecated
  cover_key?: string | null; // Storage key for cover image (MinIO/S3)
  program_pdf_key?: string | null; // Storage key for program PDF (MinIO/S3)
  learning_cycle?: string | null; // primaire|college|lycee|pro
  levels?: string[] | null; // Available levels for the selected learning cycle
  resources?: Resource[];
  modules: Module[]; // minItems 1
  id?: string | null;
}

/**
 * Réponse du backend après création/récupération d'un cours
 */
export interface CourseResponse extends Course {
  id: string;
  owner_type?: CourseOwnerType;
  owner_id?: number | null;
  status?: CourseStatus;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Summary view of a course (for listing)
 */
export interface CourseSummary {
  id: string;
  title: string;
  description?: string;
  price?: number | null;
  category?: string | null;
  category_ids?: number[] | null;
  category_names?: string[] | null;
  duration?: string | null;
  level?: string | null;
  cover_key?: string | null;
  learning_cycle?: string | null;
  levels?: string[] | null;
  owner_type?: CourseOwnerType;
  owner_id?: number | null;
  status?: CourseStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CourseUpdate {
  title?: string;
  description?: string;
  price?: number | null;
  status?: CourseStatus;
  category?: string | null;
  category_ids?: number[] | null;
  category_names?: string[] | null;
  duration?: string | null;
  level?: string | null;
  cover_key?: string | null;
  program_pdf_key?: string | null;
  learning_cycle?: string | null;
  levels?: string[] | null;
  resources?: Resource[];
  modules?: Module[];
}

export interface ModuleCreate {
  title: string;
  description?: string;
  duration: string;
  content: Content[];
  quizzes?: Quiz[];
}

export interface ModuleFullUpdate {
  title?: string;
  description?: string;
  duration?: string;
  content?: Content[];
  quizzes?: Quiz[];
}

export interface LessonCreate {
  title: string;
  duration: string;
  description: string;
  video_url?: string;
  transcription?: string;
}

/**
 * Lesson response from backend
 */
export interface LessonResponse {
  id: string;
  title: string;
  duration: string;
  description: string;
  video_url?: string;
  video_key?: string;
  pdf_key?: string;
  image_key?: string;
  transcription?: string;
  module_id?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Lesson update (partial)
 */
export interface LessonUpdate {
  title?: string;
  duration?: string;
  description?: string;
  video_url?: string;
  transcription?: string;
}

/**
 * Reorder lessons request
 */
export interface LessonReorderRequest {
  lesson_ids: string[];
}

/**
 * Attach media to lesson request
 */
export interface AttachMediaRequest {
  video_key?: string;
  pdf_key?: string;
  image_key?: string;
}

export interface QuizCreate {
  title: string;
  questions: QuizQuestion[];
}

/**
 * Quiz response from backend
 */
export interface QuizResponse {
  id: string;
  title: string;
  questions: QuizQuestion[];
  lesson_id?: string;
  module_id?: string;
  created_at?: string;
}

/**
 * Quiz update (partial)
 */
export interface QuizUpdate {
  title?: string;
  questions?: QuizQuestion[];
}

// ============= ASSIGNMENTS =============

/**
 * Assignment creation data
 */
export interface AssignmentCreate {
  title: string;
  description: string;
  instructions?: string;
  due_date?: string; // ISO 8601
  max_attempts?: number;
  passing_score?: number;
  time_limit?: number; // minutes
  allow_late_submission?: boolean;
  requires_manual_grading?: boolean;
}

/**
 * Assignment response from backend
 */
export interface AssignmentResponse extends AssignmentCreate {
  id: string;
  module_id: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Assignment update (partial)
 */
export interface AssignmentUpdate {
  title?: string;
  description?: string;
  instructions?: string;
  due_date?: string;
  max_attempts?: number;
  passing_score?: number;
  time_limit?: number;
  allow_late_submission?: boolean;
  requires_manual_grading?: boolean;
}

// ============= STORAGE (DEPRECATED) =============
export interface UploadRequest {
  file_type: 'image' | 'video';
  file_name: string;
}

export interface UploadResponse {
  url: string;
}

// ============= NEW PRESIGNED UPLOAD FLOW =============

export type UploadStrategy = 'single' | 'multipart';

export interface PrepareUploadResponse {
  strategy: UploadStrategy;
  key: string;
  url?: string;
  headers?: Record<string, string>;
  expires_in?: number;
  upload_id?: string;
  part_size?: number;
  parts?: Array<{
    partNumber: number;
    url: string;
  }>;
}

export interface MultipartPart {
  ETag: string;
  PartNumber: number;
}

export interface CompleteUploadParams {
  strategy: UploadStrategy;
  key: string;
  content_type: string;
  size: number;
  upload_id?: string;
  parts?: MultipartPart[];
}

export interface CompleteUploadResponse {
  status: string;
  key: string;
  etag?: string;
}

export interface VideoPlayResponse {
  url: string;
  expires_in: number;
  stream_type?: 'hls' | 'mp4';
}

// Nouveau: programme PDF (lecture inline)
export interface ProgramUrlResponse {
  url: string;
  expires_in: number;
}

// Nouveau: ressources cours depuis endpoint dédié
export interface CourseResourcesResponse {
  resources: Resource[];
}

// Nouveau: statistiques évaluations (agrégats)
export interface CourseEvaluationStatsResponse {
  course_id: string;
  total_attempts: number;
  completed_attempts: number;
  average_score: number;
  passing_rate: number;
  average_time_spent: number;
  question_stats: Array<{
    question_id: string;
    avg_score: number;
    attempts: number;
    correct_rate: number;
  }>;
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

/**
 * Course filters for API requests
 */
export interface CourseFilters {
  page?: number;
  per_page?: number;
  after?: string; // cursor for keyset pagination
  sort?: 'newest' | 'price_asc' | 'price_desc';
  search?: string;
  level?: string;
  levels?: string[];
  status?: 'draft' | 'published';
  owner_type?: 'learneezy' | 'of';
  owner_id?: number;
  price_min?: number;
  price_max?: number;
  category_ids?: number[];
  category?: string; // legacy
  category_names?: string[];
  has_intro_video?: boolean;
  facets?: boolean;
}

/**
 * Facets for course filtering (counters by category)
 */
export interface CourseFacets {
  by_level?: Record<string, number>;
  by_status?: Record<string, number>;
  by_category?: Record<string, number>;
  by_cycle?: Record<string, number>;
}

/**
 * Paginated response for course listing
 */
export interface CourseSummaryPage {
  items: CourseResponse[];
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  next_cursor?: string | null;
  applied_filters?: CourseFilters | null;
  facets?: CourseFacets | null;
}
