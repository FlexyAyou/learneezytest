
import { SubscriptionPlan } from '@/types/organisme';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    type: 'basic',
    tokensIncluded: 500,
    maxUsers: 50,
    features: [
      'Gestion des apprenants',
      'Catalogue de formations',
      'Support par email',
      'Rapports de base'
    ],
    price: 99,
    duration: 1
  },
  {
    id: 'premium',
    name: 'Premium',
    type: 'premium',
    tokensIncluded: 1000,
    maxUsers: 150,
    features: [
      'Toutes les fonctionnalités Basic',
      'Branding personnalisé',
      'Support prioritaire',
      'Rapports avancés',
      'API access',
      'Intégrations tierces'
    ],
    price: 199,
    duration: 1
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    type: 'enterprise',
    tokensIncluded: 2500,
    maxUsers: 500,
    features: [
      'Toutes les fonctionnalités Premium',
      'Domaines personnalisés',
      'Support dédié',
      'Formation sur-mesure',
      'Intégration SSO',
      'Audit de sécurité'
    ],
    price: 499,
    duration: 1
  }
];
