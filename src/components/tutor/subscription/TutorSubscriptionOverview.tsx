
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TutorSubscriptionOverviewProps {
  subscription: {
    plan: string;
    status: string;
    creditsTotal: number;
    creditsRemaining: number;
    renewalDate: string;
    price: string;
    period: string;
  };
}

export const TutorSubscriptionOverview: React.FC<TutorSubscriptionOverviewProps> = ({ subscription }) => {
  const { toast } = useToast();
  const creditsUsagePercentage = ((subscription.creditsTotal - subscription.creditsRemaining) / subscription.creditsTotal) * 100;

  const handleUpgrade = () => {
    toast({
      title: "Mise à niveau",
      description: "Redirection vers les options de mise à niveau...",
    });
  };

  const handleManageSubscription = () => {
    toast({
      title: "Gestion d'abonnement",
      description: "Ouverture du portail de gestion...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Plan {subscription.plan}
              </CardTitle>
              <CardDescription>Votre abonnement actuel</CardDescription>
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
          {/* Plan Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{subscription.price}</div>
              <p className="text-sm text-blue-700">par {subscription.period}</p>
              <div className="mt-2">
                <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                  Facturation automatique
                </Badge>
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">{subscription.creditsRemaining}</div>
              <p className="text-sm text-green-700">crédits disponibles</p>
              <div className="mt-2">
                <Progress value={100 - creditsUsagePercentage} className="h-2" />
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{subscription.renewalDate}</div>
              <p className="text-sm text-purple-700">prochaine facturation</p>
              <div className="mt-2 flex items-center justify-center text-purple-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-xs">Renouvellement auto</span>
              </div>
            </div>
          </div>

          {/* Usage Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center">
                <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                Utilisation des crédits ce mois
              </span>
              <span className="text-sm text-gray-600">
                {subscription.creditsTotal - subscription.creditsRemaining}/{subscription.creditsTotal} crédits
              </span>
            </div>
            <Progress value={creditsUsagePercentage} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 crédits</span>
              <span>{subscription.creditsTotal} crédits</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleUpgrade} className="flex-1">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Mettre à niveau
            </Button>
            <Button onClick={handleManageSubscription} variant="outline" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Gérer l'abonnement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tendance d'utilisation</CardTitle>
            <CardDescription>Votre consommation des 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Moyenne quotidienne</span>
                <span className="font-semibold">5.2 crédits</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Jour le plus actif</span>
                <span className="font-semibold">Mardi (8.1 crédits)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Prévision fin de mois</span>
                <span className="font-semibold text-green-600">142 crédits restants</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommandations</CardTitle>
            <CardDescription>Optimisez votre utilisation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Astuce :</strong> Vous utilisez en moyenne 158 crédits par mois. 
                  Votre plan actuel vous convient parfaitement !
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Économie :</strong> Passez à la facturation annuelle et économisez 20%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
