
import { useState } from 'react';
import { OrganismeFormData, OrganismeDocument } from '@/types/organisme';

const initialDocuments: OrganismeDocument[] = [
  {
    id: '1',
    type: 'kbis',
    name: 'Extrait K-bis',
    file: null,
    required: true,
    uploaded: false
  },
  {
    id: '2',
    type: 'declaration_activite',
    name: 'Déclaration d\'activité',
    file: null,
    required: true,
    uploaded: false
  },
  {
    id: '3',
    type: 'assurance',
    name: 'Assurance responsabilité civile',
    file: null,
    required: true,
    uploaded: false
  },
  {
    id: '4',
    type: 'qualiopi',
    name: 'Certificat Qualiopi',
    file: null,
    required: false,
    uploaded: false
  }
];

const initialFormData: OrganismeFormData = {
  // Étape 1
  name: '',
  description: '',
  logo: null,
  address: '',
  phone: '',
  email: '',
  website: '',
  legalRepresentative: '',
  
  // Étape 2
  siret: '',
  numeroDeclaration: '',
  hasQualiopi: false,
  qualiopiNumber: '',
  documents: initialDocuments,
  
  // Étape 3
  subscriptionType: 'basic',
  tokensTotal: 500,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  autoRenewal: false,
  
  // Étape 4
  maxUsers: 50,
  customBranding: false,
  apiAccess: false,
  advancedReporting: false,
  customDomains: [],
  
  // Métadonnées
  notes: ''
};

export const useOrganismeForm = () => {
  const [formData, setFormData] = useState<OrganismeFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<OrganismeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateDocument = (documentId: string, updates: Partial<OrganismeDocument>) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === documentId ? { ...doc, ...updates } : doc
      )
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 5)));
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    
    // Simulation d'une création d'organisme
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Organisme créé:', formData);
      
      // Reset du formulaire
      setFormData(initialFormData);
      setCurrentStep(1);
      
      return { success: true, id: `org_${Date.now()}` };
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      return { success: false, error: 'Erreur lors de la création de l\'organisme' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    currentStep,
    isSubmitting,
    updateFormData,
    updateDocument,
    nextStep,
    prevStep,
    goToStep,
    submitForm
  };
};
