
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CreditCard, Settings, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TutorSubscription = () => {
  const { toast } = useToast();
  const [subscription] = useState({
    plan: 'Premium',
    status: 'active',
    creditsTotal: 500,
    creditsRemaining: 342,
    renewalDate: '2024-02-15',
    price: '100€',
    period: 'mensuel'
  });

  const handleModifySubscription = () => {
    toast({
      title: "Modification d'abonnement",
      description: "Redirection vers la page de gestion d'abonnement...",
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Résiliation d'abonnement",
      description: "Un email de confirmation vous sera envoyé.",
      variant: "destructive"
    });
  };

  const creditsUsagePercentage = ((subscription.creditsTotal - subscription.creditsRemaining) / subscription.creditsTotal) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Abonnements</h1>
        <p className="text-gray-600">Gérez votre abonnement et consultez vos crédits</p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Abonnement actuel
              </CardTitle>
              <CardDescription>Plan {subscription.plan}</CardDescription>
            </div>
            <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
              {subscription.status === 'active' ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Actif
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactif
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{subscription.price}</div>
              <p className="text-sm text-gray-600">par mois</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{subscription.creditsRemaining}</div>
              <p className="text-sm text-gray-600">crédits restants</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{subscription.renewalDate}</div>
              <p className="text-sm text-gray-600">renouvellement</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Utilisation des crédits</span>
              <span className="text-sm text-gray-600">
                {subscription.creditsTotal - subscription.creditsRemaining}/{subscription.creditsTotal}
              </span>
            </div>
            <Progress value={creditsUsagePercentage} className="h-2" />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleModifySubscription} className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Modifier l'abonnement
            </Button>
            <Button onClick={handleCancelSubscription} variant="outline" className="flex-1">
              <AlertCircle className="h-4 w-4 mr-2" />
              Résilier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Historique d'utilisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2024-01-20', student: 'Marie Dupont', activity: 'Cours de mathématiques', credits: -5 },
              { date: '2024-01-18', student: 'Lucas Martin', activity: 'Session de révisions', credits: -3 },
              { date: '2024-01-15', student: 'Sophie Bernard', activity: 'Évaluation', credits: -2 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.activity}</p>
                  <p className="text-sm text-gray-600">{item.student} • {item.date}</p>
                </div>
                <div className="text-right">
                  <span className="font-medium text-red-600">{item.credits} crédits</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
