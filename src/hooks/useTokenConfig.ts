import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fastAPIClient } from '@/services/fastapi-client';
import { TokenConfigResponse, TokenConfigUpdate, BonusTier } from '@/types/fastapi';
import { toast } from 'sonner';

// Valeurs par défaut (fallback si l'API n'est pas disponible)
export const DEFAULT_TOKEN_CONFIG: TokenConfigResponse = {
  base_token_value_euros: 0.10,
  base_conversion_rate: 10,
  tutor_conversion_rate: 12.5,
  min_purchase_euros: 5,
  max_purchase_euros: 1000,
  bonus_tiers: [
    { min_amount_euros: 10, bonus_percent: 5 },
    { min_amount_euros: 25, bonus_percent: 10 },
    { min_amount_euros: 50, bonus_percent: 15 },
    { min_amount_euros: 100, bonus_percent: 20 },
  ],
  tutor_bonus_tiers: [
    { min_amount_euros: 25, bonus_percent: 15 },
    { min_amount_euros: 50, bonus_percent: 20 },
    { min_amount_euros: 100, bonus_percent: 25 },
    { min_amount_euros: 200, bonus_percent: 30 },
  ],
  updated_at: new Date().toISOString(),
};

/**
 * Hook pour récupérer la configuration de tarification des tokens
 */
export const useTokenConfig = () => {
  return useQuery({
    queryKey: ['token-config'],
    queryFn: () => fastAPIClient.getTokenConfig(),
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
    retry: 1,
    // Fallback vers les valeurs par défaut si l'API échoue
    placeholderData: DEFAULT_TOKEN_CONFIG,
  });
};

/**
 * Hook mutation pour mettre à jour la configuration (admin)
 */
export const useUpdateTokenConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: TokenConfigUpdate) => fastAPIClient.updateTokenConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['token-config'] });
      toast.success('Configuration de tarification mise à jour');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la configuration');
    },
  });
};

/**
 * Utilitaires pour calculer les bonus basés sur la configuration
 */
export const getApplicableBonusPercent = (
  amount: number, 
  bonusTiers: BonusTier[]
): number => {
  // Trier les paliers par montant décroissant pour trouver le plus haut applicable
  const sortedTiers = [...bonusTiers].sort((a, b) => b.min_amount_euros - a.min_amount_euros);
  
  for (const tier of sortedTiers) {
    if (amount >= tier.min_amount_euros) {
      return tier.bonus_percent;
    }
  }
  
  return 0;
};

export const calculateBonusTokens = (
  amount: number,
  conversionRate: number,
  bonusTiers: BonusTier[]
): number => {
  const bonusPercent = getApplicableBonusPercent(amount, bonusTiers);
  const baseTokens = Math.floor(amount * conversionRate);
  return Math.floor(baseTokens * (bonusPercent / 100));
};
