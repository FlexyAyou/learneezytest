
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShoppingBag, Coins, CreditCard, PayPal, Smartphone, History, Star, Gift, Users } from 'lucide-react';
import { toast } from 'sonner';

export const TutorShop = () => {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');

  // Packages spéciaux pour tuteurs avec plus de tokens
  const tokenPackages = [
    {
      id: 'tutor-basic',
      name: 'Pack Tuteur Basic',
      tokens: 200,
      price: 90,
      originalPrice: 110,
      discount: 18,
      popular: false,
      description: 'Pour démarrer avec vos élèves',
      features: ['200 tokens', 'Gestion de 5 élèves', 'Outils pédagogiques', 'Support email']
    },
    {
      id: 'tutor-premium',
      name: 'Pack Tuteur Premium',
      tokens: 500,
      price: 200,
      originalPrice: 250,
      discount: 20,
      popular: true,
      description: 'Le plus choisi par les tuteurs',
      features: ['500 tokens', 'Gestion illimitée d\'élèves', 'Outils avancés', 'Support prioritaire', 'Bonus 100 tokens']
    },
    {
      id: 'tutor-pro',
      name: 'Pack Tuteur Pro',
      tokens: 1000,
      price: 350,
      originalPrice: 450,
      discount: 22,
      popular: false,
      description: 'Pour les professionnels',
      features: ['1000 tokens', 'Fonctionnalités premium', 'Analytics avancés', 'Support VIP', 'Bonus 200 tokens', 'Formation gratuite']
    },
    {
      id: 'tutor-enterprise',
      name: 'Pack Institution',
      tokens: 2500,
      price: 800,
      originalPrice: 1000,
      discount: 20,
      popular: false,
      description: 'Pour les institutions',
      features: ['2500 tokens', 'Multi-tuteurs', 'Dashboard institution', 'Support dédié', 'Bonus 500 tokens', 'Formations personnalisées']
    }
  ];

  const purchaseHistory = [
    {
      id: 1,
      date: '2024-08-01',
      package: 'Pack Tuteur Premium',
      tokens: 500,
      amount: 200,
      status: 'completed',
      paymentMethod: 'Carte bancaire'
    }
  ];

  const userTokens = 320; // Solde actuel du tuteur

  const handlePurchase = () => {
    if (!selectedPackage || !paymentMethod) {
      toast.error('Veuillez sélectionner un package et un mode de paiement');
      return;
    }

    toast.success('Achat effectué avec succès ! Vos tokens ont été crédités.');
    setSelectedPackage('');
    setPaymentMethod('');
    setCouponCode('');
  };

  const applyCoupon = () => {
    if (!couponCode) {
      toast.error('Veuillez saisir un code promo');
      return;
    }
    
    if (couponCode === 'TUTOR25') {
      toast.success('Code promo tuteur appliqué : -25% sur votre commande !');
    } else {
      toast.error('Code promo invalide');
    }
    setCouponCode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Boutique Tuteur</h1>
          <p className="text-gray-600">Packages spéciaux pour l'accompagnement de vos élèves</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Mon solde actuel</p>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">{userTokens}</span>
            <span className="text-gray-600">tokens</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Packages Tuteur</TabsTrigger>
          <TabsTrigger value="history">Historique d'achats</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          {/* Avantages tuteur */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Avantages Tuteur</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Tarifs préférentiels jusqu'à -25%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Tokens bonus sur chaque achat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Outils pédagogiques inclus</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Packages de tokens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tokenPackages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.popular ? 'ring-2 ring-pink-500' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-pink-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Populaire
                    </Badge>
                  </div>
                )}
                
                {pkg.discount > 0 && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="destructive">-{pkg.discount}%</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Coins className="h-5 w-5 text-yellow-600" />
                    <span className="text-2xl font-bold text-yellow-600">{pkg.tokens}</span>
                    <span className="text-gray-600">tokens</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold">{pkg.price}€</span>
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-sm text-gray-500 line-through">{pkg.originalPrice}€</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        variant={pkg.popular ? 'default' : 'outline'}
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        Acheter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Finaliser l'achat - {pkg.name}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span>{pkg.tokens} tokens</span>
                            <span className="font-bold">{pkg.price}€</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Mode de paiement</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
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
                                  <PayPal className="h-4 w-4" />
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

                        <div className="space-y-2">
                          <Label>Code promo tuteur (optionnel)</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Ex: TUTOR25"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <Button onClick={applyCoupon} variant="outline">
                              <Gift className="h-4 w-4 mr-2" />
                              Appliquer
                            </Button>
                          </div>
                        </div>

                        <Button onClick={handlePurchase} className="w-full">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Confirmer l'achat
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{purchase.package}</p>
                      <p className="text-sm text-gray-600">
                        {purchase.tokens} tokens • {purchase.date}
                      </p>
                      <p className="text-xs text-gray-500">{purchase.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{purchase.amount}€</p>
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
