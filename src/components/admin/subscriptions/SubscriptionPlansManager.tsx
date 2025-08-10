
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Coins,
  Calendar,
  Crown
} from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface PlanFilters {
  showParticulier: boolean;
  showOrganisme: boolean;
  showMensuel: boolean;
  showAnnuel: boolean;
}

interface SubscriptionPlansManagerProps {
  onPlanUpdate: (plan: SubscriptionPlan) => void;
  filters?: PlanFilters;
}

// Plans mockés basés sur les vraies offres
const mockPlans: SubscriptionPlan[] = [
  {
    id: 'particulier-starter',
    name: 'Pack Starter',
    description: 'Idéal pour commencer votre apprentissage',
    price: 29,
    currency: 'EUR',
    interval: 'monthly',
    credits: 100,
    creditPrice: 0.29,
    features: ['100 crédits d\'apprentissage', 'Accès aux cours de base', 'Support standard'],
    isActive: true,
    isPopular: false,
    trialDays: 14,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'individual',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subscribers: 89
  },
  {
    id: 'particulier-growth',
    name: 'Pack Growth',
    description: 'Le choix idéal pour progresser rapidement',
    price: 79,
    currency: 'EUR',
    interval: 'monthly',
    credits: 300,
    creditPrice: 0.26,
    features: ['300 crédits d\'apprentissage', 'Accès à tous les cours', 'Support prioritaire'],
    isActive: true,
    isPopular: true,
    trialDays: 14,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'individual',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subscribers: 128
  },
  {
    id: 'particulier-premium',
    name: 'Pack Premium',
    description: 'Pour une expérience d\'apprentissage complète',
    price: 120,
    currency: 'EUR',
    interval: 'monthly',
    credits: 500,
    creditPrice: 0.24,
    features: ['500 crédits d\'apprentissage', 'Accès illimité', 'Coaching personnel', 'Support premium'],
    isActive: true,
    isPopular: false,
    trialDays: 14,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'individual',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subscribers: 67
  },
  {
    id: 'of-starter',
    name: 'OF Starter',
    description: 'Pour débuter avec votre organisme',
    price: 199,
    currency: 'EUR',
    interval: 'monthly',
    maxUsers: 10,
    features: ['Gestion de 10 apprenants', 'Plateforme LMS de base', 'Support standard'],
    isActive: true,
    isPopular: false,
    trialDays: 14,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'organisme',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subscribers: 23
  },
  {
    id: 'of-business',
    name: 'OF Business',
    description: 'Pour les organismes en croissance',
    price: 449,
    currency: 'EUR',
    interval: 'monthly',
    maxUsers: 50,
    features: ['Gestion de 50 apprenants', 'Plateforme LMS avancée', 'Reporting détaillé'],
    isActive: true,
    isPopular: true,
    trialDays: 14,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'organisme',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subscribers: 67
  },
  {
    id: 'of-enterprise',
    name: 'OF Enterprise',
    description: 'Solution complète pour grandes structures',
    price: 899,
    currency: 'EUR',
    interval: 'monthly',
    maxUsers: 999999,
    features: ['Apprenants illimités', 'Plateforme personnalisée', 'Support dédié', 'API complète'],
    isActive: true,
    isPopular: false,
    trialDays: 14,
    setupFee: 0,
    discountPercentage: 0,
    targetAudience: 'organisme',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subscribers: 12
  }
];

const SubscriptionPlansManager: React.FC<SubscriptionPlansManagerProps> = ({ 
  onPlanUpdate, 
  filters = { showParticulier: true, showOrganisme: true, showMensuel: true, showAnnuel: true }
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);

  // Filtrer les plans selon les filtres sélectionnés
  const filteredPlans = plans.filter(plan => {
    // Filtrage par type d'audience
    if (plan.targetAudience === 'individual' && !filters.showParticulier) return false;
    if (plan.targetAudience === 'organisme' && !filters.showOrganisme) return false;
    
    // Filtrage par intervalle
    if (plan.interval === 'monthly' && !filters.showMensuel) return false;
    if (plan.interval === 'yearly' && !filters.showAnnuel) return false;
    
    return true;
  });

  const handleEditPlan = (plan: SubscriptionPlan) => {
    onPlanUpdate(plan);
  };

  const handleTogglePlan = (planId: string) => {
    setPlans(prevPlans =>
      prevPlans.map(plan =>
        plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestion des plans d'abonnement</h3>
          <p className="text-gray-600">
            {filteredPlans.length} plan(s) affiché(s) selon vos filtres
          </p>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.isPopular ? 'ring-2 ring-pink-500' : ''}`}>
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Populaire
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </div>
                <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                  {plan.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {plan.price}€
                </div>
                <div className="text-sm text-gray-500">
                  /{plan.interval === 'monthly' ? 'mois' : 'an'}
                </div>
              </div>

              <div className="space-y-2">
                {plan.targetAudience === 'individual' && plan.credits && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Coins className="h-4 w-4" />
                      Crédits
                    </span>
                    <span className="font-medium">{plan.credits}</span>
                  </div>
                )}
                
                {plan.targetAudience === 'organisme' && plan.maxUsers && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Apprenants max
                    </span>
                    <span className="font-medium">
                      {plan.maxUsers === 999999 ? 'Illimité' : plan.maxUsers}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Abonnés
                  </span>
                  <span className="font-medium">{plan.subscribers}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Essai gratuit
                  </span>
                  <span className="font-medium">{plan.trialDays} jours</span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-sm">Fonctionnalités :</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-gray-500">+ {plan.features.length - 3} autres...</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditPlan(plan)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant={plan.isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleTogglePlan(plan.id)}
                >
                  {plan.isActive ? (
                    <>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Désactiver
                    </>
                  ) : (
                    <>
                      <Users className="h-3 w-3 mr-1" />
                      Activer
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Aucun plan ne correspond aux filtres sélectionnés
            </p>
            <p className="text-sm text-gray-400">
              Ajustez vos filtres pour voir les plans disponibles
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionPlansManager;
