export interface TrainerBooking {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerPhoto?: string;
  subject: string;
  specialty: string;
  sessionDate: string;
  sessionTime: string;
  duration: number; // in minutes
  status: 'upcoming' | 'completed' | 'cancelled';
  sessionType: 'presential' | 'online';
  location?: string;
  meetingLink?: string;
  price: number;
  notes?: string;
  rating?: number;
  review?: string;
  isAnonymousReview?: boolean;
  reviewDate?: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  photo?: string;
  subjects: string[];
  specialties: string[];
  experience: number; // in years
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  languages: string[];
  description?: string;
  availability: string[];
}

export interface TeacherReview {
  id: string;
  trainerId: string;
  studentId?: string; // undefined for anonymous reviews
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
  sessionDate?: string;
}