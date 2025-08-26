
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrganismeFormData } from '@/types/organisme';
import { subscriptionPlans } from '@/data/mockSubscriptionPlans';
import { Check, Star, Zap, Users, Calendar } from 'lucide-react';

interface OrganismeFormStep5Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
}

export const OrganismeFormStep5: React.FC<OrganismeFormStep5Props> = ({
  formData,
  updateFormData
}) => {
  const selectedPlan = subscriptionPlans.find(plan => plan.id === formData.subscriptionType);

  const handlePlanSelect = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (plan) {
      updateFormData({
        subscriptionType: planId as 'basic' | 'premium' | 'enterprise',
        tokensTotal: plan.tokensIncluded,
        maxUsers: plan.maxUsers === -1 ? 1000 : plan.maxUsers // -1 = illimité, on met 1000 comme limite pratique
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Choisir un plan d'abonnement</h3>
        <p className="text-gray-600">
          Sélectionnez le plan qui correspond le mieux aux besoins de l'organisme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`cursor-pointer transition-all ${
              formData.subscriptionType === plan.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            } ${plan.popular ? 'relative' : ''}`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Populaire
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-blue-600">
                {plan.price}€
                <span className="text-sm text-gray-500 font-normal">/mois</span>
              </div>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    Utilisateurs
                  </span>
                  <span className="font-medium">
                    {plan.maxUsers === -1 ? 'Illimité' : `Jusqu'à ${plan.maxUsers}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-gray-400" />
                    Tokens IA
                  </span>
                  <span className="font-medium">{plan.tokensIncluded.toLocaleString()}</span>
                </div>
                
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-sm">
                      <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="subscriptionDuration" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Durée de l'abonnement (mois)
          </Label>
          <Input
            id="subscriptionDuration"
            type="number"
            value={formData.subscriptionDuration}
            onChange={(e) => updateFormData({ subscriptionDuration: parseInt(e.target.value) || 12 })}
            min="1"
            max="24"
          />
        </div>

        <div className="space-y-2">
          <Label>Tokens IA inclus</Label>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="font-medium text-lg">
              {formData.tokensTotal.toLocaleString()} tokens
            </span>
          </div>
        </div>
      </div>

      {selectedPlan && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-medium text-blue-900 mb-2">Récapitulatif de l'abonnement</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Plan sélectionné :</span>
                <span className="font-medium">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Prix mensuel :</span>
                <span className="font-medium">{selectedPlan.price}€</span>
              </div>
              <div className="flex justify-between">
                <span>Durée :</span>
                <span className="font-medium">{formData.subscriptionDuration} mois</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2 font-medium">
                <span>Total :</span>
                <span>{selectedPlan.price * formData.subscriptionDuration}€</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
