
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor' | 'admin';
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
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  instructorId: string;
  instructor?: User;
  lessons: Lesson[];
  enrollments: number;
  rating: number;
  reviews: Review[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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
