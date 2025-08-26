
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowLeft, ArrowRight, Check, Zap } from 'lucide-react';
import { OrganismeFormData } from '@/types/organisme';
import { subscriptionPlans } from '@/data/mockSubscriptionPlans';

interface OrganismeFormStep3Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const OrganismeFormStep3: React.FC<OrganismeFormStep3Props> = ({
  formData,
  updateFormData,
  onNext,
  onPrev
}) => {
  const handleSubscriptionChange = (subscriptionType: 'basic' | 'premium' | 'enterprise') => {
    const selectedPlan = subscriptionPlans.find(plan => plan.type === subscriptionType);
    if (selectedPlan) {
      updateFormData({
        subscriptionType,
        tokensTotal: selectedPlan.tokensIncluded,
        maxUsers: selectedPlan.maxUsers
      });
    }
  };

  const handleInputChange = (field: keyof OrganismeFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'tokensTotal' ? parseInt(e.target.value) || 0 : e.target.value;
    updateFormData({ [field]: value });
  };

  const handleAutoRenewalChange = (checked: boolean) => {
    updateFormData({ autoRenewal: checked });
  };

  const selectedPlan = subscriptionPlans.find(plan => plan.type === formData.subscriptionType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Configuration d'abonnement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plans d'abonnement */}
        <div>
          <Label className="text-base font-medium">Plan d'abonnement *</Label>
          <RadioGroup
            value={formData.subscriptionType}
            onValueChange={handleSubscriptionChange}
            className="mt-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} className="relative">
                  <RadioGroupItem
                    value={plan.type}
                    id={plan.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={plan.id}
                    className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.subscriptionType === plan.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      {formData.subscriptionType === plan.type && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                        {plan.tokensIncluded} tokens inclus
                      </div>
                      <div className="text-sm text-gray-600">
                        Jusqu'à {plan.maxUsers} utilisateurs
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {plan.price}€<span className="text-sm font-normal text-gray-500">/mois</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="h-3 w-3 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Configuration personnalisée */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tokens personnalisés */}
          <div>
            <Label htmlFor="tokensTotal">Nombre de tokens</Label>
            <Input
              id="tokensTotal"
              type="number"
              value={formData.tokensTotal}
              onChange={handleInputChange('tokensTotal')}
              min="0"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Modifiez si nécessaire selon les besoins spécifiques
            </p>
          </div>

          {/* Date de début */}
          <div>
            <Label htmlFor="startDate">Date de début *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange('startDate')}
              className="mt-1"
            />
          </div>

          {/* Date de fin */}
          <div>
            <Label htmlFor="endDate">Date de fin *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange('endDate')}
              min={formData.startDate}
              className="mt-1"
            />
          </div>

          {/* Renouvellement automatique */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoRenewal"
              checked={formData.autoRenewal}
              onCheckedChange={handleAutoRenewalChange}
            />
            <Label htmlFor="autoRenewal">Renouvellement automatique</Label>
          </div>
        </div>

        {/* Résumé du plan sélectionné */}
        {selectedPlan && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Résumé de l'abonnement</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Plan sélectionné:</span>
                <div className="font-medium">{selectedPlan.name}</div>
              </div>
              <div>
                <span className="text-gray-600">Tokens alloués:</span>
                <div className="font-medium">{formData.tokensTotal}</div>
              </div>
              <div>
                <span className="text-gray-600">Période:</span>
                <div className="font-medium">
                  {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Renouvellement:</span>
                <div className="font-medium">
                  {formData.autoRenewal ? 'Automatique' : 'Manuel'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Étape précédente
          </Button>
          <Button onClick={onNext}>
            Étape suivante
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
