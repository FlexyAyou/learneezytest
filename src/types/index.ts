export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'tutor' | | 'independant_trainer' |  'superadmin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  duration: number; // in minutes
  level: 'cp' | 'ce1' | 'ce2' | 'cm1' | 'cm2' | '6eme' | '5eme' | '4eme' | '3eme' | '2nde' | '1ere' | 'terminale';
  category: 'mathematiques' | 'francais' | 'anglais' | 'histoire-geo' | 'sciences' | 'physique-chimie' | 'svt' | 'arts' | 'sport' | 'informatique';
  subject: string;
  cycle: 'élémentaire' | 'secondaire';
  instructorId: string;
  instructor?: User;
  lessons: Lesson[];
  enrollments: number;
  rating: number;
  reviews: Review[];
  isPublished: boolean;
  availableSlots?: TimeSlot[];
  prerequisites?: string[];
  objectives: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  courseId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  date: string;
  maxStudents: number;
  bookedStudents: number;
  price: number;
  isAvailable: boolean;
  location?: string;
  type: 'presential' | 'online';
}

export interface Booking {
  id: string;
  userId: string;
  courseId: string;
  slotId: string;
  user?: User;
  course?: Course;
  slot?: TimeSlot;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalAmount: number;
  bookedAt: string;
  confirmationCode?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_confirmation' | 'booking_reminder' | 'booking_cancelled' | 'payment_success' | 'course_update';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  user?: User;
  course?: Course;
  progress: number; // 0-100
  completedLessons: string[]; // lesson IDs
  enrolledAt: string;
  completedAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  user?: User;
  course?: Course;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  user?: User;
  course?: Course;
  certificateUrl: string;
  issuedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  monthlyGrowth: {
    users: number;
    courses: number;
    revenue: number;
  };
  topCourses: {
    id: string;
    title: string;
    enrollments: number;
    revenue: number;
  }[];
}

// ============ TYPES POUR SYSTÈME OF COMPLET ============

export interface Inscription {
  id: string;
  userId: string;
  courseId: string;
  status: 'pending' | 'validated' | 'rejected' | 'completed';
  signatureData?: string; // Données de la signature électronique
  signatureIp?: string;
  signatureTimestamp?: string;
  conventionSigned: boolean;
  documentsSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentOF {
  id: string;
  type: 'programme' | 'reglement' | 'cgv' | 'convention' | 'convocation' | 'attestation' | 'certificat';
  title: string;
  content?: string; // Contenu du document ou template
  fileUrl?: string; // URL du fichier PDF généré
  isTemplate: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Emargement {
  id: string;
  userId: string;
  courseId: string;
  sessionDate: string; // Date de la séance
  sessionStartTime: string; // Heure de début
  sessionEndTime: string; // Heure de fin
  signatureData?: string; // Signature numérique de présence
  signatureTimestamp?: string;
  ipAddress?: string;
  isPresent: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evaluation {
  id: string;
  userId: string;
  courseId: string;
  type: 'positionnement' | 'final' | 'satisfaction';
  questions?: any; // Questions et réponses en JSONB
  score?: number;
  maxScore?: number;
  percentage?: number;
  completedAt?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutomaticMailing {
  id: string;
  inscriptionId: string;
  type: 'programme' | 'reglement' | 'cgv' | 'convocation' | 'satisfaction' | 'relance';
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  recipientEmail: string;
  content?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface OrganisationFormation {
  id: string;
  name: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  siret?: string;
  numeroDeclaration?: string; // Numéro de déclaration d'activité
  qualiopiCertified: boolean;
  settings?: any; // Paramètres personnalisables en JSONB
  createdAt: string;
  updatedAt: string;
}

// ============ NOUVEAUX TYPES POUR SYSTÈME DE BADGES ============

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'progression' | 'excellence' | 'engagement' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: {
    type: 'courses_completed' | 'average_grade' | 'perfect_scores' | 'study_time' | 'login_streak' | 'categories_completed' | 'help_provided';
    value: number;
    operator: '>=' | '>' | '=' | '<' | '<=';
  };
  earnedAt?: string;
  progress?: {
    current: number;
    required: number;
    percentage: number;
  };
}

export interface FundingBadge {
  id: string;
  type: 'OPCO' | 'FAF' | 'CPF' | 'DPC';
  name: string;
  description: string;
  color: string;
  documentsRequired: string[];
  isActive: boolean;
  addedAt: string;
  addedBy: string;
}

export interface StudentBadges {
  userId: string;
  achievementBadges: AchievementBadge[];
  fundingBadges: FundingBadge[];
  stats: {
    totalBadges: number;
    raretyBreakdown: {
      common: number;
      rare: number;
      epic: number;
      legendary: number;
    };
  };
}

// ============ TYPES EXISTANTS ============

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
