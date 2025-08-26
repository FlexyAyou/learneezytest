
export interface OrganismeFormData {
  // Informations générales
  name: string;
  description: string;
  website: string;
  legalRepresentative: string;
  
  // Contact
  address: string;
  phone: string;
  email: string;
  
  // Informations légales
  siret: string;
  numeroDeclaration: string;
  agrement?: string;
  
  // Configuration
  logoUrl?: string;
  maxUsers: number;
  customBranding: boolean;
  apiAccess: boolean;
  advancedReporting: boolean;
  
  // Abonnement
  subscriptionType: 'basic' | 'premium' | 'enterprise';
  tokensTotal: number;
  subscriptionDuration: number; // en mois
}

export interface OrganismeDocument {
  id: string;
  type: 'kbis' | 'declaration_activite' | 'assurance' | 'qualiopi' | 'fiscal' | 'other';
  name: string;
  url: string;
  status: 'pending' | 'validated' | 'rejected';
  uploadDate: string;
  rejectionReason?: string;
}

export interface OrganismeSubscription {
  type: 'basic' | 'premium' | 'enterprise';
  tokensTotal: number;
  tokensRemaining: number;
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
}

export interface Organisme {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  siret: string;
  numeroDeclaration: string;
  agrement?: string;
  website: string;
  legalRepresentative: string;
  logoUrl?: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  usersCount: number;
  userBreakdown: {
    apprenants: number;
    gestionnaires: number;
    comptesPro: number;
  };
  createdAt: string;
  isActive: boolean;
  subscription: OrganismeSubscription;
  documents: OrganismeDocument[];
  settings: {
    maxUsers: number;
    customBranding: boolean;
    apiAccess: boolean;
    advancedReporting: boolean;
    customDomains: string[];
    integrationSettings: Record<string, any>;
    notificationSettings: Record<string, any>;
  };
}
