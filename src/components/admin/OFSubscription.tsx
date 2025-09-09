import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Users, 
  Coins, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Package,
  ArrowUp
} from 'lucide-react';

export const OFSubscription = () => {
  // Données mockées pour l'abonnement
  const subscriptionData = {
    plan: {
      name: "Premium Pro",
      type: "monthly",
      status: "active",
      price: 299,
      currency: "EUR",
      startDate: "2024-01-01",
      nextBilling: "2024-02-01",
      autoRenew: true
    },
    usage: {
      tokensTotal: 10000,
      tokensUsed: 3450,
      tokensRemaining: 6550,
      studentsMax: 500,
      studentsActive: 234,
      studentsRemaining: 266,
      formationsMax: 50,
      formationsActive: 12,
      formationsRemaining: 38
    },
    features: [
      { name: "Formations illimitées", included: true },
      { name: "Support prioritaire", included: true },
      { name: "Intégrations avancées", included: true },
      { name: "Rapports personnalisés", included: true },
      { name: "API complète", included: true },
      { name: "Stockage illimité", included: true }
    ],
    history: [
      { date: "2024-01-01", amount: 299, status: "paid", description: "Premium Pro - Janvier 2024" },
      { date: "2023-12-01", amount: 299, status: "paid", description: "Premium Pro - Décembre 2023" },
      { date: "2023-11-01", amount: 299, status: "paid", description: "Premium Pro - Novembre 2023" },
      { date: "2023-10-01", amount: 299, status: "paid", description: "Premium Pro - Octobre 2023" }
    ]
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-green-500";
  };

  const tokensUsedPercentage = (subscriptionData.usage.tokensUsed / subscriptionData.usage.tokensTotal) * 100;
  const studentsUsedPercentage = (subscriptionData.usage.studentsActive / subscriptionData.usage.studentsMax) * 100;
  const formationsUsedPercentage = (subscriptionData.usage.formationsActive / subscriptionData.usage.formationsMax) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Abonnement</h1>
        <p className="text-gray-600">Gérez votre abonnement et suivez votre utilisation</p>
      </div>

      {/* Plan actuel */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{subscriptionData.plan.name}</CardTitle>
                <p className="text-gray-600">Plan {subscriptionData.plan.type === 'monthly' ? 'mensuel' : 'annuel'}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{subscriptionData.plan.price}€</div>
              <p className="text-gray-600">par mois</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Statut: </span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Actif
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Prochaine facturation: </span>
              <span className="font-medium">{subscriptionData.plan.nextBilling}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-600">Renouvellement automatique: </span>
              <Badge variant={subscriptionData.plan.autoRenew ? "default" : "secondary"}>
                {subscriptionData.plan.autoRenew ? "Activé" : "Désactivé"}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Gérer le paiement
            </Button>
            <Button variant="outline">
              <ArrowUp className="h-4 w-4 mr-2" />
              Mettre à niveau
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Utilisation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tokens */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-600" />
              Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-yellow-600">
                  {subscriptionData.usage.tokensRemaining.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">restants</span>
              </div>
              <Progress 
                value={tokensUsedPercentage} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>{subscriptionData.usage.tokensUsed.toLocaleString()} utilisés</span>
                <span>{subscriptionData.usage.tokensTotal.toLocaleString()} total</span>
              </div>
              <div className={`text-xs ${getUsageColor(tokensUsedPercentage)}`}>
                {tokensUsedPercentage.toFixed(1)}% utilisés
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apprenants */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Apprenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {subscriptionData.usage.studentsRemaining}
                </span>
                <span className="text-sm text-gray-600">restants</span>
              </div>
              <Progress 
                value={studentsUsedPercentage} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>{subscriptionData.usage.studentsActive} actifs</span>
                <span>{subscriptionData.usage.studentsMax} max</span>
              </div>
              <div className={`text-xs ${getUsageColor(studentsUsedPercentage)}`}>
                {studentsUsedPercentage.toFixed(1)}% utilisés
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Formations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  {subscriptionData.usage.formationsRemaining}
                </span>
                <span className="text-sm text-gray-600">restantes</span>
              </div>
              <Progress 
                value={formationsUsedPercentage} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>{subscriptionData.usage.formationsActive} actives</span>
                <span>{subscriptionData.usage.formationsMax} max</span>
              </div>
              <div className={`text-xs ${getUsageColor(formationsUsedPercentage)}`}>
                {formationsUsedPercentage.toFixed(1)}% utilisées
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fonctionnalités incluses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Fonctionnalités incluses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subscriptionData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{feature.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historique des paiements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Historique des paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subscriptionData.history.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-gray-600">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount}€</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Payé
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes */}
      {(tokensUsedPercentage > 80 || studentsUsedPercentage > 80) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Alertes d'utilisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tokensUsedPercentage > 80 && (
                <p className="text-orange-700 text-sm">
                  ⚠️ Vous avez utilisé {tokensUsedPercentage.toFixed(1)}% de vos tokens. Pensez à renouveler votre plan.
                </p>
              )}
              {studentsUsedPercentage > 80 && (
                <p className="text-orange-700 text-sm">
                  ⚠️ Vous avez atteint {studentsUsedPercentage.toFixed(1)}% de votre limite d'apprenants.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};