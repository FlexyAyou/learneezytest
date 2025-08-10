
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingBag, 
  Coins, 
  Euro, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  History, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { TokenConverter } from '@/components/common/TokenConverter';

export const StudentShop = () => {
  const [purchaseMode, setPurchaseMode] = useState<'amount' | 'tokens'>('amount');
  const [amount, setAmount] = useState(10);
  const [tokens, setTokens] = useState(20);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Configuration boutique (normalement vient de l'admin)
  const conversionRate = 2; // 1€ = 2 tokens
  const maxAmount = 500;
  const maxTokens = 1000;
  
  // Calcul des bonus selon le montant
  const calculateBonus = (amount: number) => {
    if (amount >= 100) return Math.floor(amount * 0.2); // 20% bonus
    if (amount >= 50) return Math.floor(amount * 0.15);  // 15% bonus
    if (amount >= 25) return Math.floor(amount * 0.1);   // 10% bonus
    return 0;
  };
  
  const bonus = calculateBonus(amount);
  const userTokens = 85; // Solde actuel

  // Montants rapides populaires
  const quickAmounts = [5, 10, 25, 50, 100];
  const quickTokens = [10, 25, 50, 100, 200];

  // Synchronisation amount <-> tokens
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

  const purchaseHistory = [
    { id: 1, date: '2024-08-05', amount: 25, tokens: 50, bonus: 5, total: 55 },
    { id: 2, date: '2024-07-20', amount: 10, tokens: 20, bonus: 0, total: 20 },
    { id: 3, date: '2024-07-15', amount: 50, tokens: 100, bonus: 15, total: 115 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Boutique de Tokens</h1>
          <p className="text-gray-600">Achetez des tokens pour débloquer les formations premium</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Mon solde</p>
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-yellow-600" />
            <span className="text-3xl font-bold text-yellow-600">{userTokens}</span>
          </div>
        </div>
      </div>

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
                    {quickTokens.map((quickToken) => (
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
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <span className="font-bold text-orange-700">Bonus actif!</span>
                  </div>
                  <p className="text-sm text-orange-600">
                    Vous recevez {bonus} tokens bonus pour cet achat
                  </p>
                </div>
              )}

              {/* Paliers de bonus */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Paliers de bonus
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>25€+</span>
                    <Badge variant="outline">+10%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>50€+</span>
                    <Badge variant="outline">+15%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>100€+</span>
                    <Badge variant="outline">+20%</Badge>
                  </div>
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
              <div className="space-y-4">
                {purchaseHistory.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{purchase.date}</p>
                      <p className="text-sm text-gray-600">
                        {purchase.amount}€ → {purchase.tokens} tokens
                        {purchase.bonus > 0 && (
                          <span className="text-orange-600 ml-1">
                            + {purchase.bonus} bonus
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="font-bold text-yellow-600">{purchase.total}</span>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        Complété
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
