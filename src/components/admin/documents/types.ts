// Types for OF Document Management System

export type DocumentPhase = 'inscription' | 'formation' | 'post-formation' | 'suivi';

export type DocumentType = 
  | 'analyse_besoin' 
  | 'test_positionnement' 
  | 'convention' 
  | 'programme' 
  | 'reglement_interieur' 
  | 'cgv' 
  | 'convocation' 
  | 'emargement' 
  | 'test_niveau' 
  | 'satisfaction_chaud' 
  | 'attestation' 
  | 'certificat' 
  | 'satisfaction_froid' 
  | 'questionnaire_financeur';

export type DocumentStatus = 
  | 'template' 
  | 'draft' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'signed' 
  | 'completed' 
  | 'expired';

export interface DynamicField {
  key: string;
  label: string;
  description: string;
  category: 'apprenant' | 'formation' | 'of' | 'dates' | 'evaluation';
  example: string;
}

export interface DocumentTemplate {
  id: string;
  type: DocumentType;
  phase: DocumentPhase;
  title: string;
  description: string;
  htmlContent: string;
  requiresSignature: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalizedDocument {
  id: string;
  templateId: string;
  type: DocumentType;
  phase: DocumentPhase;
  title: string;
  htmlContent: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  formationId: string;
  formationName: string;
  status: DocumentStatus;
  requiresSignature: boolean;
  sentAt?: string;
  readAt?: string;
  signedAt?: string;
  signatureData?: string;
  uniqueCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Learner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  company?: string;
  position?: string;
  formationId: string;
  formationName: string;
  enrollmentDate: string;
  startDate?: string;
  endDate?: string;
}

export interface Formation {
  id: string;
  name: string;
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  location: string;
  trainer: string;
  price: number;
  certification?: string;
}

export interface OF {
  name: string;
  siret: string;
  nda: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  responsable: string;
}

// Available dynamic fields for document templates
export const DYNAMIC_FIELDS: DynamicField[] = [
  // Apprenant fields
  { key: '{{apprenant.prenom}}', label: 'Prénom', description: 'Prénom de l\'apprenant', category: 'apprenant', example: 'Marie' },
  { key: '{{apprenant.nom}}', label: 'Nom', description: 'Nom de famille de l\'apprenant', category: 'apprenant', example: 'Dupont' },
  { key: '{{apprenant.nom_complet}}', label: 'Nom complet', description: 'Prénom et nom de l\'apprenant', category: 'apprenant', example: 'Marie Dupont' },
  { key: '{{apprenant.email}}', label: 'Email', description: 'Adresse email de l\'apprenant', category: 'apprenant', example: 'marie.dupont@email.com' },
  { key: '{{apprenant.telephone}}', label: 'Téléphone', description: 'Numéro de téléphone', category: 'apprenant', example: '06 12 34 56 78' },
  { key: '{{apprenant.date_naissance}}', label: 'Date de naissance', description: 'Date de naissance de l\'apprenant', category: 'apprenant', example: '15/03/1990' },
  { key: '{{apprenant.adresse}}', label: 'Adresse', description: 'Adresse postale', category: 'apprenant', example: '12 rue de la Formation' },
  { key: '{{apprenant.ville}}', label: 'Ville', description: 'Ville de résidence', category: 'apprenant', example: 'Paris' },
  { key: '{{apprenant.code_postal}}', label: 'Code postal', description: 'Code postal', category: 'apprenant', example: '75001' },
  { key: '{{apprenant.entreprise}}', label: 'Entreprise', description: 'Nom de l\'entreprise', category: 'apprenant', example: 'TechCorp' },
  { key: '{{apprenant.poste}}', label: 'Poste', description: 'Poste occupé', category: 'apprenant', example: 'Développeur' },
  
  // Formation fields
  { key: '{{formation.nom}}', label: 'Nom de la formation', description: 'Intitulé de la formation', category: 'formation', example: 'React Avancé' },
  { key: '{{formation.description}}', label: 'Description', description: 'Description de la formation', category: 'formation', example: 'Formation approfondie React...' },
  { key: '{{formation.duree}}', label: 'Durée', description: 'Durée totale de la formation', category: 'formation', example: '35 heures' },
  { key: '{{formation.lieu}}', label: 'Lieu', description: 'Lieu de la formation', category: 'formation', example: 'Paris - Centre de formation' },
  { key: '{{formation.formateur}}', label: 'Formateur', description: 'Nom du formateur', category: 'formation', example: 'Jean Martin' },
  { key: '{{formation.prix}}', label: 'Prix', description: 'Prix de la formation', category: 'formation', example: '2 500 €' },
  { key: '{{formation.certification}}', label: 'Certification', description: 'Certification associée', category: 'formation', example: 'RNCP 12345' },
  
  // Dates fields
  { key: '{{dates.inscription}}', label: 'Date d\'inscription', description: 'Date d\'inscription à la formation', category: 'dates', example: '01/01/2024' },
  { key: '{{dates.debut}}', label: 'Date de début', description: 'Date de début de la formation', category: 'dates', example: '15/01/2024' },
  { key: '{{dates.fin}}', label: 'Date de fin', description: 'Date de fin de la formation', category: 'dates', example: '20/01/2024' },
  { key: '{{dates.aujourdhui}}', label: 'Date du jour', description: 'Date actuelle', category: 'dates', example: '10/01/2024' },
  { key: '{{dates.signature}}', label: 'Date de signature', description: 'Date de signature du document', category: 'dates', example: '10/01/2024' },
  
  // OF fields
  { key: '{{of.nom}}', label: 'Nom de l\'OF', description: 'Nom de l\'organisme de formation', category: 'of', example: 'FormaPro' },
  { key: '{{of.siret}}', label: 'SIRET', description: 'Numéro SIRET', category: 'of', example: '123 456 789 00010' },
  { key: '{{of.nda}}', label: 'NDA', description: 'Numéro de déclaration d\'activité', category: 'of', example: '11 75 12345 67' },
  { key: '{{of.adresse}}', label: 'Adresse OF', description: 'Adresse de l\'OF', category: 'of', example: '1 avenue de la Formation' },
  { key: '{{of.ville}}', label: 'Ville OF', description: 'Ville de l\'OF', category: 'of', example: 'Paris' },
  { key: '{{of.code_postal}}', label: 'Code postal OF', description: 'Code postal de l\'OF', category: 'of', example: '75008' },
  { key: '{{of.telephone}}', label: 'Téléphone OF', description: 'Téléphone de l\'OF', category: 'of', example: '01 23 45 67 89' },
  { key: '{{of.email}}', label: 'Email OF', description: 'Email de l\'OF', category: 'of', example: 'contact@formapro.fr' },
  { key: '{{of.responsable}}', label: 'Responsable', description: 'Nom du responsable', category: 'of', example: 'Pierre Durant' },
  
  // Evaluation fields
  { key: '{{evaluation.note_positionnement}}', label: 'Note positionnement', description: 'Note du test de positionnement', category: 'evaluation', example: '12/20' },
  { key: '{{evaluation.note_finale}}', label: 'Note finale', description: 'Note de l\'évaluation finale', category: 'evaluation', example: '16/20' },
  { key: '{{evaluation.progression}}', label: 'Progression', description: 'Pourcentage de progression', category: 'evaluation', example: '+33%' },
  { key: '{{evaluation.niveau_acquis}}', label: 'Niveau acquis', description: 'Niveau de compétence acquis', category: 'evaluation', example: 'Intermédiaire' },
  { key: '{{evaluation.commentaire}}', label: 'Commentaire', description: 'Commentaire d\'évaluation', category: 'evaluation', example: 'Très bonne progression' },
];

// Phase configuration
export const PHASES_CONFIG = {
  inscription: {
    label: 'Phase Inscription',
    description: 'Documents d\'inscription : CGV à signer et Programme de formation',
    color: 'blue',
    icon: 'UserPlus',
    documents: ['cgv', 'programme']
  },
  formation: {
    label: 'Phase Formation',
    description: 'Documents de la période de formation',
    color: 'green',
    icon: 'BookOpen',
    documents: ['convention', 'convocation', 'reglement_interieur', 'emargement']
  },
  'post-formation': {
    label: 'Phase Post-formation',
    description: 'Documents de fin de formation',
    color: 'orange',
    icon: 'Award',
    documents: ['test_niveau', 'satisfaction_chaud', 'attestation', 'certificat']
  },
  suivi: {
    label: 'Phase +3 mois',
    description: 'Suivi post-formation',
    color: 'purple',
    icon: 'Clock',
    documents: ['satisfaction_froid', 'questionnaire_financeur']
  }
};

// Editable fields configuration (fields that can be manually edited before sending)
export interface EditableField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea';
  placeholder?: string;
}

export const EDITABLE_FIELDS: EditableField[] = [
  { key: 'dates.debut', label: 'Date de début', type: 'date' },
  { key: 'dates.fin', label: 'Date de fin', type: 'date' },
  { key: 'formation.duree', label: 'Durée de formation', type: 'text', placeholder: 'Ex: 35 heures' },
  { key: 'formation.lieu', label: 'Lieu de formation', type: 'text', placeholder: 'Ex: Paris - Centre' },
  { key: 'formation.prix', label: 'Prix de la formation', type: 'text', placeholder: 'Ex: 2 500 €' },
];

// Document type labels
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  analyse_besoin: 'Analyse du besoin',
  test_positionnement: 'Test de positionnement',
  convention: 'Convention de formation',
  programme: 'Programme de formation',
  reglement_interieur: 'Règlement intérieur',
  cgv: 'CGV / Conditions générales',
  convocation: 'Convocation',
  emargement: 'Feuille d\'émargement',
  test_niveau: 'Test final',
  satisfaction_chaud: 'Satisfaction à chaud',
  attestation: 'Attestation de formation',
  certificat: 'Certificat de réalisation',
  satisfaction_froid: 'Satisfaction à froid',
  questionnaire_financeur: 'Questionnaire financeur'
};
