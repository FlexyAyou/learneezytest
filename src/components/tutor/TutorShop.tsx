import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ShoppingBag, 
  Coins, 
  Euro, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  History, 
  Zap,
  TrendingUp,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { TokenConverter } from '@/components/common/TokenConverter';
import { useTokenBalance } from '@/hooks/useApi';
import { useTokenConfig, getApplicableBonusPercent, calculateBonusTokens, DEFAULT_TOKEN_CONFIG } from '@/hooks/useTokenConfig';

export const TutorShop = () => {
  const [purchaseMode, setPurchaseMode] = useState<'amount' | 'tokens'>('amount');
  const [amount, setAmount] = useState(20);
  const [tokens, setTokens] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // API hooks
  const { data: balanceData, isLoading: isLoadingBalance } = useTokenBalance();
  const { data: tokenConfig, isLoading: isLoadingConfig } = useTokenConfig();
  
  // Configuration dynamique depuis le backend (avec fallback)
  const config = tokenConfig ?? DEFAULT_TOKEN_CONFIG;
  const conversionRate = config.tutor_conversion_rate;
  const maxAmount = config.max_purchase_euros;
  const maxTokens = Math.floor(maxAmount * conversionRate);
  const bonusTiers = config.tutor_bonus_tiers;
  
  // Solde actuel depuis l'API
  const userTokens = balanceData?.balance ?? 0;
  
  // Calcul des bonus renforcés pour tuteurs
  const calculateBonus = (amt: number) => {
    return calculateBonusTokens(amt, conversionRate, bonusTiers);
  };
  
  const bonus = calculateBonus(amount);

  // Montants adaptés aux tuteurs
  const quickAmounts = [10, 25, 50, 100, 200];
  const quickTokens = quickAmounts.map(a => Math.floor(a * conversionRate));

  useEffect(() => {
    if (purchaseMode === 'amount') {
      setTokens(Math.floor(amount * conversionRate));
    } else {
      setAmount(Math.ceil(tokens / conversionRate));
    }
  }, [amount, tokens, purchaseMode, conversionRate]);

  const handleAmountChange = (newAmount: number) => {
    setAmount(Math.max(1, Math.min(maxAmount, newAmount)));
  };

  const handleTokensChange = (newTokens: number) => {
    setTokens(Math.max(1, Math.min(maxTokens, newTokens)));
  };

  const handlePurchase = () => {
    if (!paymentMethod) {
      toast.error('Veuillez sélectionner un mode de paiement');
      return;
    }
    
    toast.success(`Achat de ${tokens + bonus} tokens pour ${amount}€ initié !`);
  };

  // Historique depuis l'API
  const purchaseHistory = balanceData?.purchase_history?.map((item: any, index: number) => ({
    id: item.id || index + 1,
    date: item.date || item.created_at || new Date().toISOString(),
    amount: item.amount || 0,
    tokens: item.tokens || item.tokens_added || 0,
    bonus: item.bonus || 0,
    total: (item.tokens || item.tokens_added || 0) + (item.bonus || 0),
  })) ?? [];

  // Loading state
  if (isLoadingConfig) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Boutique Tuteur</h1>
            <p className="text-muted-foreground">Chargement de la configuration...</p>
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Boutique Tuteur</h1>
          <p className="text-muted-foreground">Tarifs préférentiels pour l'accompagnement de vos étudiants</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Mon solde</p>
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-token" />
            {isLoadingBalance ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-3xl font-bold text-token">{userTokens}</span>
            )}
          </div>
        </div>
      </div>

      {/* Avantages tuteur - dynamique */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Avantages Tuteur Premium</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Taux bonifié: 1€ = {conversionRate} tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Bonus jusqu'à {bonusTiers.length > 0 ? Math.max(...bonusTiers.map(t => t.bonus_percent)) : 30}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Support prioritaire</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="purchase" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchase">Acheter des tokens</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase" className="space-y-6">
          {/* Mode de sélection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Sélectionnez votre mode d'achat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Button
                  variant={purchaseMode === 'amount' ? 'default' : 'outline'}
                  onClick={() => setPurchaseMode('amount')}
                  className="flex-1"
                >
                  <Euro className="h-4 w-4 mr-2" />
                  Par montant
                </Button>
                <Button
                  variant={purchaseMode === 'tokens' ? 'default' : 'outline'}
                  onClick={() => setPurchaseMode('tokens')}
                  className="flex-1"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Par tokens
                </Button>
              </div>

              {purchaseMode === 'amount' ? (
                <div className="space-y-4">
                  <Label>Montant à dépenser</Label>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {quickAmounts.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        variant={amount === quickAmount ? 'default' : 'outline'}
                        onClick={() => handleAmountChange(quickAmount)}
                        className="text-sm"
                      >
                        {quickAmount}€
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => handleAmountChange(Number(e.target.value))}
                      min={1}
                      max={maxAmount}
                      className="text-lg font-bold"
                    />
                    <Slider
                      value={[amount]}
                      onValueChange={(value) => handleAmountChange(value[0])}
                      max={maxAmount}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Nombre de tokens souhaités</Label>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {quickTokens.map((quickToken, index) => (
                      <Button
                        key={quickToken}
                        variant={tokens === quickToken ? 'default' : 'outline'}
                        onClick={() => handleTokensChange(quickToken)}
                        className="text-sm"
                      >
                        {quickToken}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={tokens}
                      onChange={(e) => handleTokensChange(Number(e.target.value))}
                      min={1}
                      max={maxTokens}
                      className="text-lg font-bold"
                    />
                    <Slider
                      value={[tokens]}
                      onValueChange={(value) => handleTokensChange(value[0])}
                      max={maxTokens}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              {/* Convertisseur en temps réel */}
              <div className="mt-6">
                <TokenConverter
                  amount={amount}
                  tokens={tokens}
                  conversionRate={conversionRate}
                  bonus={bonus}
                  onAmountChange={handleAmountChange}
                  onTokensChange={handleTokensChange}
                />
              </div>

              {/* Informations bonus */}
              {bonus > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <span className="font-bold text-purple-700 dark:text-purple-300">Bonus tuteur actif!</span>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Vous recevez {bonus} tokens bonus pour cet achat
                  </p>
                </div>
              )}

              {/* Paliers de bonus tuteur - dynamique */}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Paliers de bonus tuteur
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {bonusTiers.map((tier) => (
                    <div key={tier.min_amount_euros} className="flex justify-between">
                      <span>{tier.min_amount_euros}€+</span>
                      <Badge variant="outline">+{tier.bonus_percent}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paiement */}
          <Card>
            <CardHeader>
              <CardTitle>Finaliser l'achat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Mode de paiement</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choisir un mode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Carte bancaire
                      </div>
                    </SelectItem>
                    <SelectItem value="paypal">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        PayPal
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Paiement mobile
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handlePurchase} className="w-full" size="lg">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Acheter {tokens + bonus} tokens pour {amount}€
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des achats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBalance ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : purchaseHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Coins className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun achat pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchaseHistory.map((purchase: any) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{new Date(purchase.date).toLocaleDateString('fr-FR')}</p>
                        <p className="text-sm text-muted-foreground">
                          {purchase.amount}€ → {purchase.tokens} tokens
                          {purchase.bonus > 0 && (
                            <span className="text-purple-600 dark:text-purple-400 ml-1">
                              + {purchase.bonus} bonus
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-token" />
                          <span className="font-bold text-token">{purchase.total}</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 dark:text-green-400">
                          Complété
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
