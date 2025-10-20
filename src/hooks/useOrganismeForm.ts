
import { useState } from 'react';
import { OrganismeFormData } from '@/types/organisme';
import { useToast } from '@/hooks/use-toast';
import { OrganizationCreate, SubscriptionType } from '@/types/fastapi';
import { fastAPIClient } from '@/services/fastapi-client';
import { validateSiret } from '@/utils/fiscalValidation';

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
        if (!formData.name || !formData.description || !formData.legalRepresentative) {
          toast({
            title: "Champs obligatoires manquants",
            description: "Veuillez remplir tous les champs obligatoires de l'étape 1.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.address || !formData.phone || !formData.email) {
          toast({
            title: "Champs obligatoires manquants",
            description: "Veuillez remplir tous les champs obligatoires de l'étape 2.",
            variant: "destructive",
          });
          return false;
        }
        // Validation format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast({
            title: "Email invalide",
            description: "Veuillez saisir une adresse email valide.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        if (!formData.siret || !formData.numeroDeclaration) {
          toast({
            title: "Champs obligatoires manquants",
            description: "Veuillez remplir tous les champs obligatoires de l'étape 3.",
            variant: "destructive",
          });
          return false;
        }
        // Validation SIRET stricte
        if (!validateSiret(formData.siret)) {
          toast({
            title: "SIRET invalide",
            description: "Le numéro SIRET doit contenir exactement 14 chiffres.",
            variant: "destructive",
          });
          return false;
        }
        return true;
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
      contact_email: formData.email,
      description: formData.description,
      website: formData.website,
      legal_representative: formData.legalRepresentative,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      siret: formData.siret,
      numero_declaration: formData.numeroDeclaration,
      agrement: formData.agrement,
      tokens_total: formData.tokensTotal
    };
  };

  const submitForm = async (): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Mapper les données du formulaire vers le format backend
      const backendData = mapFormDataToBackend(formData);
      
      console.log('Données envoyées au backend:', backendData);
      
      // Appel réel à l'API
      const response = await fastAPIClient.createOrganization(backendData);
      
      console.log('Organisme créé:', response);
      
      toast({
        title: "Organisme créé avec succès",
        description: `${formData.name} a été créé avec succès.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Erreur complète:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      // Formater le message d'erreur de validation
      let errorMessage = "Une erreur s'est produite lors de la création de l'organisme.";
      
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          // Erreurs de validation FastAPI
          const validationErrors = error.response.data.detail
            .map((err: any) => `${err.loc.join('.')}: ${err.msg}`)
            .join(', ');
          errorMessage = `Erreur de validation: ${validationErrors}`;
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        }
      }
      
      toast({
        title: "Erreur lors de la création",
        description: errorMessage,
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
