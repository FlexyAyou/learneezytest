
export interface TrainerApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  experienceYears: number;
  hourlyRate: number;
  specialties: string[];
  languages: string[];
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  avatar?: string;
  isVisible?: boolean;
}

export interface TrainerDocument {
  id: string;
  trainerApplicationId: string;
  documentType: 'diploma' | 'certification' | 'cv' | 'identity' | 'other';
  documentName: string;
  documentUrl: string;
  isVerified: boolean;
  uploadedAt: string;
}
