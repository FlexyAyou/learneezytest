import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ShoppingBag, 
  Coins, 
  Zap,
  TrendingUp,
  Gift,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTokenBalance, useBuyTokens } from '@/hooks/useApi';
import { useTokenConfig, getApplicableBonusPercent, calculateBonusTokens, DEFAULT_TOKEN_CONFIG } from '@/hooks/useTokenConfig';
import { TokenPackageCard, TokenPackage } from './shop/TokenPackageCard';
import { TokenBalanceCard } from './shop/TokenBalanceCard';
import { MockStripeCheckout } from './shop/MockStripeCheckout';
import { PurchaseHistoryList } from './shop/PurchaseHistoryList';
import { CustomAmountInput } from './shop/CustomAmountInput';

export const StudentShop = () => {
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customAmount, setCustomAmount] = useState(15);
  
  // API hooks
  const { data: balanceData, isLoading: isLoadingBalance } = useTokenBalance();
  const { data: tokenConfig, isLoading: isLoadingConfig } = useTokenConfig();
  const buyTokensMutation = useBuyTokens();
  
  // Configuration dynamique depuis le backend (avec fallback)
  const config = tokenConfig ?? DEFAULT_TOKEN_CONFIG;
  const conversionRate = config.base_conversion_rate;
  const maxAmount = config.max_purchase_euros;
  const bonusTiers = config.bonus_tiers;
  
  // Calcul des bonus selon les paliers configurés
  const calculateBonus = (amount: number): number => {
    return calculateBonusTokens(amount, conversionRate, bonusTiers);
  };

  const getBonusPercent = (amount: number): number => {
    return getApplicableBonusPercent(amount, bonusTiers);
  };

  // Packages prédéfinis (générés dynamiquement selon la config)
  const packages: TokenPackage[] = useMemo(() => {
    const amounts = [5, 10, 25, 50, 100];
    return amounts.map((amount, index) => ({
      id: String(index + 1),
      amount,
      tokens: Math.floor(amount * conversionRate),
      bonusPercent: getBonusPercent(amount),
      bonus: calculateBonus(amount),
      isPopular: amount === 10,
      isBestValue: amount === 100,
    }));
  }, [conversionRate, bonusTiers]);

  // Custom package from slider
  const customPackage: TokenPackage = useMemo(() => ({
    id: 'custom',
    amount: customAmount,
    tokens: Math.floor(customAmount * conversionRate),
    bonusPercent: getBonusPercent(customAmount),
    bonus: calculateBonus(customAmount),
  }), [customAmount, conversionRate, bonusTiers]);

  // Purchase history from API
  const purchaseHistory = useMemo(() => {
    if (!balanceData?.purchase_history) return [];
    return balanceData.purchase_history.map((item: any, index: number) => ({
      id: item.id || `history-${index}`,
      date: item.date || item.created_at || new Date().toISOString(),
      amount: item.amount || 0,
      tokens: item.tokens || item.tokens_added || 0,
      bonus: item.bonus || 0,
      total: (item.tokens || item.tokens_added || 0) + (item.bonus || 0),
      status: item.status || 'completed',
      transaction_id: item.transaction_id,
    }));
  }, [balanceData?.purchase_history]);

  const handleSelectPackage = (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
  };

  const handlePurchase = () => {
    if (selectedPackage) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;
    
    try {
      await buyTokensMutation.mutateAsync(selectedPackage.amount);
      setShowConfirmDialog(false);
      setSelectedPackage(null);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCustomAmountSelect = () => {
    setSelectedPackage(customPackage);
  };

  // Loading state pour la configuration
  if (isLoadingConfig) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-token-muted rounded-xl">
                <ShoppingBag className="h-7 w-7 text-token" />
              </div>
              Boutique de Tokens
            </h1>
            <p className="text-muted-foreground mt-1">
              Chargement de la configuration...
            </p>
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-token-muted rounded-xl">
              <ShoppingBag className="h-7 w-7 text-token" />
            </div>
            Boutique de Tokens
          </h1>
          <p className="text-muted-foreground mt-1">
            Achetez des tokens pour débloquer les formations premium
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <TokenBalanceCard 
        balance={balanceData?.balance ?? 0} 
        isLoading={isLoadingBalance} 
      />

      <Tabs defaultValue="purchase" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="purchase" className="text-base gap-2">
            <Coins className="h-4 w-4" />
            Acheter des tokens
          </TabsTrigger>
          <TabsTrigger value="history" className="text-base gap-2">
            <TrendingUp className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchase" className="space-y-6">
          {/* Bonus tiers info - dynamique */}
          <Card className="bg-gradient-to-r from-token-muted via-background to-bonus/10 border-token/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-bonus/20 rounded-lg">
                  <Gift className="h-5 w-5 text-bonus" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Bonus sur vos achats</h3>
                  <p className="text-sm text-muted-foreground">Plus vous achetez, plus vous gagnez !</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {bonusTiers.map((tier, index) => {
                  const isLastTier = index === bonusTiers.length - 1;
                  return (
                    <Badge 
                      key={tier.min_amount_euros}
                      variant="outline" 
                      className={isLastTier 
                        ? "text-xs border-bonus/30 bg-bonus/10 text-bonus" 
                        : "text-xs border-token/30 bg-token/5"
                      }
                    >
                      {isLastTier 
                        ? <Sparkles className="h-3 w-3 mr-1" />
                        : <Zap className="h-3 w-3 mr-1 text-token" />
                      }
                      {tier.min_amount_euros}€+ → +{tier.bonus_percent}%
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Packages Grid */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5 text-token" />
              Choisissez votre pack
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {packages.map((pkg) => (
                <TokenPackageCard
                  key={pkg.id}
                  package={pkg}
                  isSelected={selectedPackage?.id === pkg.id}
                  onSelect={handleSelectPackage}
                  isLoading={buyTokensMutation.isPending}
                />
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Ou choisissez un montant personnalisé
            </h3>
            <div onClick={handleCustomAmountSelect}>
              <CustomAmountInput
                amount={customAmount}
                onAmountChange={setCustomAmount}
                conversionRate={conversionRate}
                calculateBonus={calculateBonus}
                maxAmount={maxAmount}
              />
            </div>
            {selectedPackage?.id === 'custom' && (
              <div className="mt-3 flex justify-center">
                <Badge className="bg-token text-token-foreground">
                  Montant personnalisé sélectionné
                </Badge>
              </div>
            )}
          </div>

          {/* Purchase CTA */}
          {selectedPackage && (
            <Card className="bg-gradient-to-r from-primary/5 via-background to-token/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-token-muted rounded-xl">
                      <Coins className="h-8 w-8 text-token" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Votre sélection</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          {selectedPackage.tokens + selectedPackage.bonus} tokens
                        </span>
                        <span className="text-lg text-muted-foreground">
                          pour {selectedPackage.amount}€
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handlePurchase}
                    disabled={buyTokensMutation.isPending}
                    className="bg-token hover:bg-token/90 text-token-foreground gap-2 min-w-[160px]"
                  >
                    Acheter maintenant
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <PurchaseHistoryList 
            purchases={purchaseHistory} 
            isLoading={isLoadingBalance} 
          />
        </TabsContent>
      </Tabs>

      {/* Stripe Checkout Modal */}
      <MockStripeCheckout
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        selectedPackage={selectedPackage}
        onPaymentSuccess={handleConfirmPurchase}
        isLoading={buyTokensMutation.isPending}
      />
    </div>
  );
};
