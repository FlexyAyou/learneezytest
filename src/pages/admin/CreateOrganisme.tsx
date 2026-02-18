
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrganismeForm } from '@/hooks/useOrganismeForm';
import { OrganismeFormStep1 } from '@/components/admin/organisme/OrganismeFormStep1';
import { OrganismeFormStep2 } from '@/components/admin/organisme/OrganismeFormStep2';
import { OrganismeFormStep3 } from '@/components/admin/organisme/OrganismeFormStep3';
import { OrganismeFormStep4 } from '@/components/admin/organisme/OrganismeFormStep4';
import { OrganismeFormStep5 } from '@/components/admin/organisme/OrganismeFormStep5';

const CreateOrganisme = () => {
  const navigate = useNavigate();
  const {
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
  } = useOrganismeForm();

  const steps = [
    { number: 1, title: 'Informations générales', completed: currentStep > 1 },
    { number: 2, title: 'Contact', completed: currentStep > 2 },
    { number: 3, title: 'Informations légales', completed: currentStep > 3 },
    { number: 4, title: 'Configuration', completed: currentStep > 4 },
    { number: 5, title: 'Abonnement', completed: currentStep > 5 }
  ];

  const handleNext = async () => {
    // nextStep est maintenant asynchrone pour vérifier la disponibilité au clic
    await nextStep();
  };

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      navigate('/dashboard/superadmin/organisations');
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      formData,
      updateFormData,
      isValidating,
      availability,
      checkFieldAvailability
    };

    switch (currentStep) {
      case 1:
        return <OrganismeFormStep1 {...commonProps} />;
      case 2:
        return <OrganismeFormStep2 {...commonProps} />;
      case 3:
        return <OrganismeFormStep3 {...commonProps} />;
      case 4:
        return <OrganismeFormStep4 formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <OrganismeFormStep5 formData={formData} updateFormData={updateFormData} />;
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
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/superadmin/organisations')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building className="h-8 w-8 mr-3 text-blue-600" />
              Créer un organisme de formation
            </h1>
            <p className="text-gray-600 mt-1">
              Configuration complète d'un nouvel organisme partenaire
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-colors ${step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === step.number
                      ? 'border-blue-500 text-blue-500 bg-blue-50'
                      : 'border-gray-300 text-gray-400'
                    }`}
                  onClick={() => setCurrentStep(step.number)}
                >
                  {step.completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep === step.number ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Étape {currentStep} : {steps[currentStep - 1].title}
            <Badge variant="outline">
              {currentStep} / {steps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Précédent
        </Button>

        <div className="space-x-2">
          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep) || isValidating}
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : (
                'Suivant'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Création en cours...' : 'Créer l\'organisme'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrganisme;
