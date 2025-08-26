
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  tokensIncluded: number;
  maxUsers: number;
  features: string[];
  popular?: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Parfait pour les petits organismes de formation',
    price: 99,
    currency: 'EUR',
    tokensIncluded: 500,
    maxUsers: 50,
    features: [
      'Jusqu\'à 50 utilisateurs',
      '500 tokens IA inclus',
      'Support email',
      'Rapports de base',
      'Interface standard'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Pour les organismes en croissance',
    price: 199,
    currency: 'EUR',
    tokensIncluded: 1500,
    maxUsers: 200,
    popular: true,
    features: [
      'Jusqu\'à 200 utilisateurs',
      '1500 tokens IA inclus',
      'Support prioritaire',
      'Rapports avancés',
      'Personnalisation de la marque',
      'API access',
      'Intégrations avancées'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solution complète pour grandes organisations',
    price: 399,
    currency: 'EUR',
    tokensIncluded: 5000,
    maxUsers: -1, // illimité
    features: [
      'Utilisateurs illimités',
      '5000 tokens IA inclus',
      'Support dédié 24/7',
      'Rapports personnalisés',
      'Marque blanche complète',
      'API illimitée',
      'Domaines personnalisés',
      'Intégrations sur mesure',
      'Formation dédiée'
    ]
  }
];
