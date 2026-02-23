import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Settings,
  BarChart3,
  Bell,
  CreditCard,
  Users,
  Calendar,
  Brain,
  FileText,
  Zap,
  TrendingUp,
  Euro,
  Coins,
  Filter,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionMetrics } from './subscriptions/SubscriptionMetrics';
import { SubscriptionFiltersComponent } from './subscriptions/SubscriptionFilters';
import { SubscriptionTable } from './subscriptions/SubscriptionTable';
import SubscriptionPlansManager from './subscriptions/SubscriptionPlansManager';
import { Subscription, SubscriptionFilters, SubscriptionAnalytics } from '@/types/subscription';
import { SubscriptionPlanResponse } from '@/types/fastapi';
import { fastAPIClient } from '@/services/fastapi-client';

// Métriques (encore mockées car pas d'endpoint dédié, mais on pourrait agréger)
const mockMetrics = {
  totalRevenue: 187500,
  activeSubscriptions: 364,
  newSubscriptions: 28,
  churnRate: 3.2,
  averageRevenuePerUser: 195.5,
  trialConversions: 68.5,
  expiringThisMonth: 15,
  growthRate: 12.5
};

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [filters, setFilters] = useState<SubscriptionFilters>({});
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [isLoading, setIsLoading] = useState(false);

  const [planFilters, setPlanFilters] = useState({
    showParticulier: true,
    showOrganisme: true,
    showMensuel: true,
    showAnnuel: true
  });

  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      // Pour l'instant on réutilise getOrganisations pour voir les abos ? 
      // Ou on attend d'avoir un vrai endpoint de listing global abos
      // En attendant on laisse vide ou on mocke la table
      setSubscriptions([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleViewDetails = (subscription: any) => {
    setSelectedSubscription(subscription);
    setIsDetailsModalOpen(true);
  };

  const handleEditSubscription = (subscription: any) => {
    toast({
      title: "Modifier l'abonnement",
      description: `Ouverture de l'éditeur pour ${subscription.user?.firstName || 'Utilisateur'}`,
    });
  };

  const handleCancelSubscription = (subscription: any) => {
    toast({
      title: "Annulation d'abonnement",
      description: `L'abonnement a été annulé`,
      variant: "destructive"
    });
  };

  const handlePlanUpdate = (plan: SubscriptionPlanResponse) => {
    // Refresh plans via SubscriptionPlansManager (il a son propre fetch)
  };

  const handlePlanFilterChange = (filterType: string, value: boolean) => {
    setPlanFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des abonnements</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos offres commerciales et suivez les abonnements de vos clients
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      <SubscriptionMetrics metrics={mockMetrics} isLoading={isLoading} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Abonnements
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Tarification
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Rapports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtres et recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onExport={() => { }}
                totalResults={subscriptions.length}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liste des abonnements</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
              ) : (
                <SubscriptionTable
                  subscriptions={subscriptions}
                  onViewDetails={handleViewDetails}
                  onEditSubscription={handleEditSubscription}
                  onCancelSubscription={handleCancelSubscription}
                  onSendReminder={() => { }}
                  onSuspendSubscription={() => { }}
                  isLoading={isLoading}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres d'affichage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-700">Type d'audience</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="particulier"
                        checked={planFilters.showParticulier}
                        onCheckedChange={(checked) => handlePlanFilterChange('showParticulier', checked)}
                      />
                      <Label htmlFor="particulier" className="text-sm">Particulier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="organisme"
                        checked={planFilters.showOrganisme}
                        onCheckedChange={(checked) => handlePlanFilterChange('showOrganisme', checked)}
                      />
                      <Label htmlFor="organisme" className="text-sm">Organisme</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-700">Fréquence</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="mensuel"
                        checked={planFilters.showMensuel}
                        onCheckedChange={(checked) => handlePlanFilterChange('showMensuel', checked)}
                      />
                      <Label htmlFor="mensuel" className="text-sm">Mensuel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="annuel"
                        checked={planFilters.showAnnuel}
                        onCheckedChange={(checked) => handlePlanFilterChange('showAnnuel', checked)}
                      />
                      <Label htmlFor="annuel" className="text-sm">Annuel</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <SubscriptionPlansManager
            onPlanUpdate={handlePlanUpdate}
            filters={planFilters}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'abonnement</DialogTitle>
          </DialogHeader>
          {selectedSubscription && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Utilisateur</h4>
                <p>{selectedSubscription.user?.firstName} {selectedSubscription.user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{selectedSubscription.user?.email}</p>
              </div>
              <div>
                <h4 className="font-medium">Plan</h4>
                <p>{selectedSubscription.plan?.name}</p>
                <Badge>{selectedSubscription.status}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubscriptions;
