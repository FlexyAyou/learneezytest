
import { useState } from 'react';
import { OrganismeFormData } from '@/types/organisme';
import { useToast } from '@/hooks/use-toast';

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

  const submitForm = async (): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici, on ferait l'appel réel à l'API
      console.log('Données de l\'organisme à créer:', formData);
      
      toast({
        title: "Organisme créé avec succès",
        description: `${formData.name} a été créé et sera activé après validation des documents.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur lors de la création",
        description: "Une erreur s'est produite lors de la création de l'organisme.",
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
