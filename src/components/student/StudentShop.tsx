import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { TokenPackageCard, TokenPackage } from './shop/TokenPackageCard';
import { TokenBalanceCard } from './shop/TokenBalanceCard';
import { PurchaseConfirmDialog } from './shop/PurchaseConfirmDialog';
import { PurchaseHistoryList } from './shop/PurchaseHistoryList';
import { CustomAmountInput } from './shop/CustomAmountInput';

export const StudentShop = () => {
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customAmount, setCustomAmount] = useState(15);
  
  // API hooks
  const { data: balanceData, isLoading: isLoadingBalance } = useTokenBalance();
  const buyTokensMutation = useBuyTokens();
  
  // Configuration boutique
  const conversionRate = 10; // 1€ = 10 tokens (selon la spec: 10€ = 100 tokens)
  const maxAmount = 500;
  
  // Calcul des bonus selon le montant
  const calculateBonus = (amount: number): number => {
    if (amount >= 100) return Math.floor(amount * conversionRate * 0.2); // 20% bonus
    if (amount >= 50) return Math.floor(amount * conversionRate * 0.15);  // 15% bonus
    if (amount >= 25) return Math.floor(amount * conversionRate * 0.1);   // 10% bonus
    if (amount >= 10) return Math.floor(amount * conversionRate * 0.05);  // 5% bonus
    return 0;
  };

  const getBonusPercent = (amount: number): number => {
    if (amount >= 100) return 20;
    if (amount >= 50) return 15;
    if (amount >= 25) return 10;
    if (amount >= 10) return 5;
    return 0;
  };

  // Packages prédéfinis
  const packages: TokenPackage[] = useMemo(() => [
    { id: '1', amount: 5, tokens: 50, bonusPercent: 0, bonus: 0 },
    { id: '2', amount: 10, tokens: 100, bonusPercent: 5, bonus: 5, isPopular: true },
    { id: '3', amount: 25, tokens: 250, bonusPercent: 10, bonus: 25 },
    { id: '4', amount: 50, tokens: 500, bonusPercent: 15, bonus: 75 },
    { id: '5', amount: 100, tokens: 1000, bonusPercent: 20, bonus: 200, isBestValue: true },
  ], []);

  // Custom package from slider
  const customPackage: TokenPackage = useMemo(() => ({
    id: 'custom',
    amount: customAmount,
    tokens: Math.floor(customAmount * conversionRate),
    bonusPercent: getBonusPercent(customAmount),
    bonus: calculateBonus(customAmount),
  }), [customAmount]);

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
          {/* Bonus tiers info */}
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
                <Badge variant="outline" className="text-xs border-token/30 bg-token/5">
                  <Zap className="h-3 w-3 mr-1 text-token" />
                  10€+ → +5%
                </Badge>
                <Badge variant="outline" className="text-xs border-token/30 bg-token/5">
                  <Zap className="h-3 w-3 mr-1 text-token" />
                  25€+ → +10%
                </Badge>
                <Badge variant="outline" className="text-xs border-token/30 bg-token/5">
                  <Zap className="h-3 w-3 mr-1 text-token" />
                  50€+ → +15%
                </Badge>
                <Badge variant="outline" className="text-xs border-bonus/30 bg-bonus/10 text-bonus">
                  <Sparkles className="h-3 w-3 mr-1" />
                  100€+ → +20%
                </Badge>
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

      {/* Confirm Dialog */}
      <PurchaseConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        selectedPackage={selectedPackage}
        onConfirm={handleConfirmPurchase}
        isLoading={buyTokensMutation.isPending}
      />
    </div>
  );
};
