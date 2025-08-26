
export interface OrganismeFormData {
  // Étape 1: Informations générales
  name: string;
  description: string;
  logo?: File | null;
  address: string;
  phone: string;
  email: string;
  website: string;
  legalRepresentative: string;
  
  // Étape 2: Informations légales
  siret: string;
  numeroDeclaration: string;
  hasQualiopi: boolean;
  qualiopiNumber?: string;
  documents: OrganismeDocument[];
  
  // Étape 3: Configuration d'abonnement
  subscriptionType: 'basic' | 'premium' | 'enterprise';
  tokensTotal: number;
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
  
  // Étape 4: Paramètres avancés
  maxUsers: number;
  customBranding: boolean;
  apiAccess: boolean;
  advancedReporting: boolean;
  customDomains: string[];
  
  // Métadonnées
  createdBy?: string;
  notes?: string;
}

export interface OrganismeDocument {
  id: string;
  type: 'kbis' | 'declaration_activite' | 'assurance' | 'qualiopi' | 'fiscal' | 'other';
  name: string;
  file: File | null;
  url?: string;
  required: boolean;
  uploaded: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  tokensIncluded: number;
  maxUsers: number;
  features: string[];
  price: number;
  duration: number; // en mois
}
