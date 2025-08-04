
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Euro, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  Target,
  Zap
} from 'lucide-react';

interface MetricsData {
  totalRevenue: number;
  activeSubscriptions: number;
  newSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  trialConversions: number;
  expiringThisMonth: number;
  growthRate: number;
}

interface SubscriptionMetricsProps {
  metrics: MetricsData;
  isLoading?: boolean;
}

export const SubscriptionMetrics: React.FC<SubscriptionMetricsProps> = ({ 
  metrics, 
  isLoading = false 
}) => {
  const metricCards = [
    {
      title: "Revenus totaux",
      value: `${metrics.totalRevenue.toLocaleString()}€`,
      change: `+${metrics.growthRate}%`,
      icon: Euro,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Revenus récurrents mensuels"
    },
    {
      title: "Abonnements actifs",
      value: metrics.activeSubscriptions.toString(),
      change: `+${metrics.newSubscriptions} ce mois`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Utilisateurs avec abonnement actif"
    },
    {
      title: "Taux de désabonnement",
      value: `${metrics.churnRate}%`,
      change: metrics.churnRate > 5 ? "⚠️ Élevé" : "✅ Normal",
      icon: TrendingUp,
      color: metrics.churnRate > 5 ? "text-red-600" : "text-green-600",
      bgColor: metrics.churnRate > 5 ? "bg-red-50" : "bg-green-50",
      description: "Pourcentage de désabonnements"
    },
    {
      title: "ARPU",
      value: `${metrics.averageRevenuePerUser}€`,
      change: "Revenu moyen par utilisateur",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Revenu moyen par utilisateur"
    },
    {
      title: "Conversions essai",
      value: `${metrics.trialConversions}%`,
      change: "Taux de conversion des essais",
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Essais convertis en abonnements"
    },
    {
      title: "Expirations",
      value: metrics.expiringThisMonth.toString(),
      change: "Ce mois-ci",
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Abonnements expirant bientôt"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metricCards.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {metric.change}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {metric.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
