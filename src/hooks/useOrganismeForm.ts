
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
    agrement: [],
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
        // Extraire le subdomain du website
        const subdomain = formData.website.replace(/\.learneezy\.com$/, '').trim();
        return !!(formData.name && formData.description && formData.legalRepresentative && subdomain);
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

  const validateAllRequiredFields = (): boolean => {
    return !!(
      formData.name &&
      formData.description &&
      formData.legalRepresentative &&
      formData.address &&
      formData.phone &&
      formData.email &&
      formData.siret &&
      formData.numeroDeclaration &&
      formData.website
    );
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
    
    // Préparer les agréments - ne pas envoyer une liste vide
    const agrements = formData.agrement && formData.agrement.length > 0 
      ? formData.agrement 
      : undefined;
    
    const backendData: any = {
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
      tokens_total: formData.tokensTotal
    };
    
    // Ajouter agrement seulement s'il y a des valeurs
    if (agrements && agrements.length > 0) {
      backendData.agrement = agrements;
    }
    
    return backendData as OrganizationCreate;
  };

  const submitForm = async (): Promise<boolean> => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!validateAllRequiredFields()) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires avant de soumettre.",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);
    
    try {
      // Mapper les données du formulaire vers le format backend
      const backendData = mapFormDataToBackend(formData);
      
      console.log('Données envoyées au backend:', JSON.stringify(backendData, null, 2));
      
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
