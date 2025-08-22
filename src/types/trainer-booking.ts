
export interface TrainerBooking {
  id: string;
  studentId: string;
  trainerId: string;
  trainerName: string;
  trainerPhoto: string;
  trainerSpecialty: string;
  sessionDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionDuration: number;
  sessionType: 'online' | 'presential';
  subject: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meetingUrl?: string;
  meetingId?: string;
  notes?: string;
  price: number;
  createdAt: string;
}

export interface TrainerReview {
  id: string;
  bookingId: string;
  studentId: string;
  trainerId: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  pedagogyRating?: number;
  communicationRating?: number;
  punctualityRating?: number;
  expertiseRating?: number;
  wouldRecommend?: boolean;
  createdAt: string;
}

export interface StudentTrainerNote {
  id: string;
  studentId: string;
  trainerId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  hourlyRate: number;
  bio: string;
  averageRating: number;
  totalReviews: number;
  totalSessions: number;
  nextAvailableDate?: string;
}
