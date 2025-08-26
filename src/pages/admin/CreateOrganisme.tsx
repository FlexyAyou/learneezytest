
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOrganismeForm } from '@/hooks/useOrganismeForm';
import { OrganismeFormStep1 } from '@/components/admin/organisme/OrganismeFormStep1';
import { OrganismeFormStep2 } from '@/components/admin/organisme/OrganismeFormStep2';
import { OrganismeFormStep3 } from '@/components/admin/organisme/OrganismeFormStep3';
import { OrganismeFormStep4 } from '@/components/admin/organisme/OrganismeFormStep4';
import { OrganismeFormStep5 } from '@/components/admin/organisme/OrganismeFormStep5';

const CreateOrganisme = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    formData,
    currentStep,
    isSubmitting,
    updateFormData,
    updateDocument,
    nextStep,
    prevStep,
    goToStep,
    submitForm
  } = useOrganismeForm();

  const steps = [
    { number: 1, title: 'Informations générales', description: 'Nom, coordonnées, représentant légal' },
    { number: 2, title: 'Informations légales', description: 'SIRET, certifications, documents' },
    { number: 3, title: 'Abonnement', description: 'Plan, tokens, dates de validité' },
    { number: 4, title: 'Paramètres avancés', description: 'Limites, permissions, intégrations' },
    { number: 5, title: 'Récapitulatif', description: 'Vérification et validation' }
  ];

  const handleSubmit = async () => {
    const result = await submitForm();
    
    if (result.success) {
      toast({
        title: "Organisme créé avec succès",
        description: `L'organisme "${formData.name}" a été créé et est en attente de validation.`,
      });
      navigate('/dashboard/superadmin/organisations');
    } else {
      toast({
        title: "Erreur lors de la création",
        description: result.error || "Une erreur est survenue lors de la création de l'organisme.",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OrganismeFormStep1
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <OrganismeFormStep2
            formData={formData}
            updateFormData={updateFormData}
            updateDocument={updateDocument}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <OrganismeFormStep3
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <OrganismeFormStep4
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <OrganismeFormStep5
            formData={formData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/superadmin/organisations')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux organismes
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Créer un organisme de formation</h1>
            <p className="text-gray-600">Processus de création étape par étape</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Étape {currentStep} sur 5</CardTitle>
            <div className="text-sm text-gray-500">
              {Math.round((currentStep / 5) * 100)}% complété
            </div>
          </div>
          <Progress value={(currentStep / 5) * 100} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center space-x-2 cursor-pointer ${
                  step.number <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
                onClick={() => step.number < currentStep && goToStep(step.number)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.number < currentStep
                      ? 'bg-green-100 text-green-800'
                      : step.number === currentStep
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <div className="min-h-[600px]">
        {renderStep()}
      </div>
    </div>
  );
};

export default CreateOrganisme;
