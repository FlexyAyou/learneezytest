
import { useState } from 'react';
import { OrganismeFormData } from '@/types/organisme';
import { useToast } from '@/hooks/use-toast';
import { OrganizationCreate, SubscriptionType } from '@/types/fastapi';
import { fastAPIClient } from '@/services/fastapi-client';

export const useOrganismeForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<OrganismeFormData>({
    name: '',
    description: '',
    website: '',
    legalRepresentative: '',
    address: '',
    phone: '',
    email: '',
    siret: '',
    numeroDeclaration: '',
    agrement: '',
    logoUrl: '',
    maxUsers: 50,
    customBranding: false,
    apiAccess: false,
    advancedReporting: false,
    subscriptionType: 'basic',
    tokensTotal: 500,
    subscriptionDuration: 12
  });

  const updateFormData = (updates: Partial<OrganismeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.description && formData.legalRepresentative);
      case 2:
        return !!(formData.address && formData.phone && formData.email);
      case 3:
        return !!(formData.siret && formData.numeroDeclaration);
      case 4:
        return true; // Configuration optionnelle
      case 5:
        return true; // Abonnement sélectionné par défaut
      default:
        return false;
    }
  };

  const mapFormDataToBackend = (formData: OrganismeFormData): OrganizationCreate => {
    // Extraire le subdomain du website (enlever .learneezy.com si présent)
    const subdomain = formData.website.replace(/\.learneezy\.com$/, '').trim();
    
    // Mapper le type d'abonnement frontend vers backend
    const subscriptionTypeMap: Record<string, SubscriptionType> = {
      'basic': 'starter',
      'premium': 'gold',
      'enterprise': 'premium'
    };
    
    return {
      name: formData.name,
      subdomain: subdomain || formData.name.toLowerCase().replace(/\s+/g, '-'),
      subscription_type: subscriptionTypeMap[formData.subscriptionType] || 'starter',
      contact_email: formData.email
    };
  };

  const submitForm = async (): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Mapper les données du formulaire vers le format backend
      const backendData = mapFormDataToBackend(formData);
      
      // Appel réel à l'API
      const response = await fastAPIClient.createOrganization(backendData);
      
      console.log('Organisme créé:', response);
      
      toast({
        title: "Organisme créé avec succès",
        description: `${formData.name} a été créé avec succès.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Erreur création organisme:', error);
      
      toast({
        title: "Erreur lors de la création",
        description: error.response?.data?.detail || "Une erreur s'est produite lors de la création de l'organisme.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    currentStep,
    isSubmitting,
    updateFormData,
    nextStep,
    prevStep,
    validateStep,
    submitForm,
    setCurrentStep
  };
};
