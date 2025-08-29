
import { AchievementBadge, FundingBadge, StudentBadges } from '@/types';

export const achievementBadgeTemplates: Omit<AchievementBadge, 'id' | 'earnedAt' | 'progress'>[] = [
  {
    name: 'Premier Pas',
    description: 'Félicitations ! Vous avez terminé votre première formation.',
    icon: '🎯',
    color: 'bg-green-100 text-green-800 border-green-200',
    category: 'progression',
    rarity: 'common',
    condition: {
      type: 'courses_completed',
      value: 1,
      operator: '>='
    }
  },
  {
    name: 'Apprenant Assidu',
    description: 'Vous avez terminé 5 formations avec succès.',
    icon: '📚',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    category: 'progression',
    rarity: 'rare',
    condition: {
      type: 'courses_completed',
      value: 5,
      operator: '>='
    }
  },
  {
    name: 'Excellence',
    description: 'Votre moyenne générale dépasse 16/20.',
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    category: 'excellence',
    rarity: 'epic',
    condition: {
      type: 'average_grade',
      value: 16,
      operator: '>='
    }
  },
  {
    name: 'Perfectionniste',
    description: 'Vous avez obtenu 3 notes parfaites (20/20).',
    icon: '💎',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    category: 'excellence',
    rarity: 'legendary',
    condition: {
      type: 'perfect_scores',
      value: 3,
      operator: '>='
    }
  },
  {
    name: 'Marathon',
    description: 'Plus de 50 heures de formation accomplies.',
    icon: '🏃‍♂️',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    category: 'engagement',
    rarity: 'epic',
    condition: {
      type: 'study_time',
      value: 50,
      operator: '>='
    }
  },
  {
    name: 'Régulier',
    description: 'Connexion quotidienne pendant 30 jours consécutifs.',
    icon: '🔥',
    color: 'bg-red-100 text-red-800 border-red-200',
    category: 'engagement',
    rarity: 'rare',
    condition: {
      type: 'login_streak',
      value: 30,
      operator: '>='
    }
  },
  {
    name: 'Polyvalent',
    description: 'Formations réussies dans 3 catégories différentes.',
    icon: '🌟',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    category: 'progression',
    rarity: 'rare',
    condition: {
      type: 'categories_completed',
      value: 3,
      operator: '>='
    }
  },
  {
    name: 'Mentor',
    description: 'Vous avez aidé d\'autres apprenants.',
    icon: '🤝',
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    category: 'social',
    rarity: 'epic',
    condition: {
      type: 'help_provided',
      value: 1,
      operator: '>='
    }
  }
];

export const mockFundingBadges: FundingBadge[] = [
  {
    id: 'funding-opco-1',
    type: 'OPCO',
    name: 'OPCO Validé',
    description: 'Financement OPCO confirmé - Documents administratifs complets',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    documentsRequired: ['Convention de formation', 'Attestation OPCO', 'Feuille d\'émargement'],
    isActive: true,
    addedAt: '2024-01-10T09:00:00Z',
    addedBy: 'Marie Gestionnaire'
  },
  {
    id: 'funding-cpf-1',
    type: 'CPF',
    name: 'CPF Éligible',
    description: 'Formation éligible au Compte Personnel de Formation',
    color: 'bg-green-50 text-green-700 border-green-200',
    documentsRequired: ['Attestation CPF', 'Justificatif identité'],
    isActive: true,
    addedAt: '2024-01-12T14:30:00Z',
    addedBy: 'Jean Admin'
  }
];

// Données mockées pour un apprenant spécifique
export const mockStudentBadges: StudentBadges = {
  userId: '1',
  achievementBadges: [
    {
      id: 'achievement-1',
      ...achievementBadgeTemplates[0], // Premier Pas
      earnedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'achievement-2',
      ...achievementBadgeTemplates[1], // Apprenant Assidu
      earnedAt: '2024-02-01T16:45:00Z'
    },
    {
      id: 'achievement-3',
      ...achievementBadgeTemplates[2], // Excellence
      earnedAt: '2024-02-10T11:20:00Z'
    },
    {
      id: 'achievement-in-progress',
      ...achievementBadgeTemplates[3], // Perfectionniste
      progress: {
        current: 2,
        required: 3,
        percentage: 67
      }
    }
  ],
  fundingBadges: mockFundingBadges,
  stats: {
    totalBadges: 5,
    raretyBreakdown: {
      common: 1,
      rare: 1,
      epic: 1,
      legendary: 0
    }
  }
};
