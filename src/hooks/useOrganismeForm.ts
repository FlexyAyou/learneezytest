
import { useState } from 'react';
import { OrganismeFormData } from '@/types/organisme';
import { useToast } from '@/hooks/use-toast';
import { OrganizationCreate, SubscriptionType } from '@/types/fastapi';
import { fastAPIClient } from '@/services/fastapi-client';

export const useOrganismeForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [availability, setAvailability] = useState({
    subdomain: true,
    email: true,
    siret: true
  });

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

    // Si on change un champ critique, on reset sa validité pour forcer le check
    if (updates.website !== undefined) setAvailability(prev => ({ ...prev, subdomain: true }));
    if (updates.email !== undefined) setAvailability(prev => ({ ...prev, email: true }));
    if (updates.siret !== undefined) setAvailability(prev => ({ ...prev, siret: true }));
  };

  const checkFieldAvailability = async (type: 'subdomain' | 'email' | 'siret', value: string) => {
    if (!value) return;

    setIsValidating(true);
    try {
      const p: any = {};
      if (type === 'subdomain') p.subdomain = value.replace(/\.learneezy\.com$/, '').trim();
      if (type === 'email') p.email = value.toLowerCase().trim();
      if (type === 'siret') p.siret = value.trim();

      const res = await fastAPIClient.checkAvailability(p);
      setAvailability(prev => ({ ...prev, ...res }));

      if (res[type] === false) {
        toast({
          title: "Indisponible",
          description: `${type === 'subdomain' ? 'Le sous-domaine' : type === 'email' ? "L'email" : 'Le SIRET'} est déjà utilisé.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < 5) {
      // Check availability before going to next step if on step 1, 2 or 3
      let isAvailable = true;
      setIsValidating(true);

      try {
        if (currentStep === 1) {
          const sub = formData.website.replace(/\.learneezy\.com$/, '').trim();
          const res = await fastAPIClient.checkAvailability({ subdomain: sub });
          setAvailability(prev => ({ ...prev, subdomain: res.subdomain ?? true }));
          isAvailable = res.subdomain ?? true;
        } else if (currentStep === 2) {
          const res = await fastAPIClient.checkAvailability({ email: formData.email });
          setAvailability(prev => ({ ...prev, email: res.email ?? true }));
          isAvailable = res.email ?? true;
        } else if (currentStep === 3) {
          const res = await fastAPIClient.checkAvailability({ siret: formData.siret });
          setAvailability(prev => ({ ...prev, siret: res.siret ?? true }));
          isAvailable = res.siret ?? true;
        }
      } catch (e) {
        console.error("Validation error:", e);
      } finally {
        setIsValidating(false);
      }

      if (isAvailable && validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      } else if (!isAvailable) {
        toast({
          title: "Données invalides",
          description: "Certaines informations ne sont pas disponibles ou déjà utilisées.",
          variant: "destructive"
        });
      }
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
        return !!(formData.name && formData.description && formData.legalRepresentative && subdomain && availability.subdomain);
      case 2:
        return !!(formData.address && formData.phone && formData.email && availability.email);
      case 3:
        const isSiretValid = /^\d{14}$/.test(formData.siret);
        const isNDAValid = /^\d{11}$/.test(formData.numeroDeclaration.replace(/[-\s]/g, ''));
        return isSiretValid && isNDAValid && availability.siret;
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
    isValidating,
    availability,
    updateFormData,
    nextStep,
    prevStep,
    validateStep,
    submitForm,
    setCurrentStep,
    checkFieldAvailability
  };
};
