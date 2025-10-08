
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
  isActive?: boolean;
}

export interface TrainerFiscalInfo {
  userId: string;
  ndaNumber: string | null;
  legalStatus: 'Auto-entrepreneur' | 'EURL' | 'SASU' | 'SAS' | 'SARL' | null;
  siret: string | null;
  tvaNumber: string | null;
  isComplete: boolean;
  completedAt: string | null;
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
