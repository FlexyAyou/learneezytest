
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  CreditCard, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Download,
  FileText,
  TrendingUp,
  Bell,
  BarChart3,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TutorSubscriptionOverview } from './subscription/TutorSubscriptionOverview';
import { TutorInvoicesSection } from './subscription/TutorInvoicesSection';
import { TutorUsageHistory } from './subscription/TutorUsageHistory';
import { TutorSubscriptionSettings } from './subscription/TutorSubscriptionSettings';

export const TutorSubscriptionEnhanced = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [subscription] = useState({
    plan: 'Premium',
    status: 'active',
    creditsTotal: 500,
    creditsRemaining: 342,
    renewalDate: '2024-02-15',
    price: '100€',
    period: 'mensuel',
    nextBillingDate: '2024-02-15',
    billingCycle: 'monthly'
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des abonnements</h1>
          <p className="text-gray-600 mt-1">Gérez votre abonnement, consultez vos factures et suivez votre utilisation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alertes
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <p className="text-lg font-semibold text-green-600">Actif</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crédits restants</p>
                <p className="text-lg font-semibold text-blue-600">{subscription.creditsRemaining}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prochain paiement</p>
                <p className="text-lg font-semibold text-purple-600">{subscription.price}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisation</p>
                <p className="text-lg font-semibold text-orange-600">
                  {Math.round(((subscription.creditsTotal - subscription.creditsRemaining) / subscription.creditsTotal) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Factures
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <TutorSubscriptionOverview subscription={subscription} />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <TutorInvoicesSection />
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <TutorUsageHistory />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <TutorSubscriptionSettings subscription={subscription} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
