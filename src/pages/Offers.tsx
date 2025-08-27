
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Users, Zap, Star, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subscriptionPlans, SubscriptionPlan } from '@/data/mockSubscriptionPlans';

const Offers = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('price');
  const [filterBy, setFilterBy] = useState<string>('all');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    // Rediriger vers le processus de paiement
    navigate(`/payment?plan=${planId}`);
  };

  const filteredAndSortedPlans = subscriptionPlans
    .filter(plan => {
      if (filterBy === 'all') return true;
      if (filterBy === 'popular') return plan.popular;
      if (filterBy === 'basic') return plan.price < 150;
      if (filterBy === 'premium') return plan.price >= 150;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'users') return a.maxUsers - b.maxUsers;
      if (sortBy === 'tokens') return a.tokensIncluded - b.tokensIncluded;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choisissez votre plan d'abonnement
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sélectionnez l'offre qui correspond le mieux à vos besoins et commencez à transformer votre formation dès aujourd'hui.
            </p>
          </div>
        </div>
      </div>

      {/* Filtres et tri */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrer par :</span>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les plans</SelectItem>
                <SelectItem value="popular">Les plus populaires</SelectItem>
                <SelectItem value="basic">Plans basiques</SelectItem>
                <SelectItem value="premium">Plans premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Trier par :</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Prix</SelectItem>
                <SelectItem value="users">Utilisateurs</SelectItem>
                <SelectItem value="tokens">Tokens IA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Plans d'abonnement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Le plus populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}€
                    </span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4 mb-6">
                  {/* Statistiques clés */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">
                          {plan.maxUsers === -1 ? '∞' : plan.maxUsers}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Utilisateurs</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                        <Zap className="w-4 h-4" />
                        <span className="font-semibold">{plan.tokensIncluded}</span>
                      </div>
                      <p className="text-xs text-gray-600">Tokens IA</p>
                    </div>
                  </div>

                  {/* Fonctionnalités */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && <Star className="w-4 h-4 mr-2" />}
                  Choisir ce plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section d'aide */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Besoin d'aide pour choisir ?
              </h3>
              <p className="text-gray-600 mb-4">
                Notre équipe est là pour vous accompagner dans le choix de votre plan d'abonnement.
              </p>
              <Button variant="outline" onClick={() => navigate('/contact')}>
                Contactez-nous
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Offers;
