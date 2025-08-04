
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionMetrics } from './subscriptions/SubscriptionMetrics';
import { SubscriptionFiltersComponent } from './subscriptions/SubscriptionFilters';
import { SubscriptionTable } from './subscriptions/SubscriptionTable';
import { Subscription, SubscriptionPlan, SubscriptionFilters, SubscriptionAnalytics } from '@/types/subscription';

// Données mockées pour la démo
const mockMetrics = {
  totalRevenue: 127500,
  activeSubscriptions: 342,
  newSubscriptions: 28,
  churnRate: 3.2,
  averageRevenuePerUser: 89.5,
  trialConversions: 68.5,
  expiringThisMonth: 15,
  growthRate: 12.5
};

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: 'user1',
    planId: 'plan1',
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-02-15T00:00:00Z',
    autoRenewal: true,
    paymentMethod: { type: 'card', last4: '4242', expiryDate: '12/25' },
    totalAmountPaid: 299.99,
    discountApplied: 0,
    nextPaymentDate: '2024-02-15T00:00:00Z',
    user: {
      id: 'user1',
      email: 'marie.dupont@email.com',
      firstName: 'Marie',
      lastName: 'Dupont'
    },
    plan: {
      id: 'plan1',
      name: 'Pro',
      description: 'Plan professionnel',
      price: 29.99,
      currency: 'EUR',
      interval: 'monthly',
      features: ['Accès illimité', 'Support prioritaire'],
      isActive: true,
      isPopular: true,
      trialDays: 14,
      setupFee: 0,
      discountPercentage: 0,
      targetAudience: 'team',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      subscribers: 89
    }
  },
  // Ajout d'autres exemples...
];

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [filters, setFilters] = useState<SubscriptionFilters>({});
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Filtrage des abonnements
  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (filters.status?.length && !filters.status.includes(subscription.status)) return false;
    if (filters.planType?.length && !filters.planType.includes(subscription.plan?.targetAudience || '')) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const userMatch = `${subscription.user?.firstName} ${subscription.user?.lastName} ${subscription.user?.email}`.toLowerCase().includes(searchTerm);
      const planMatch = subscription.plan?.name.toLowerCase().includes(searchTerm);
      if (!userMatch && !planMatch) return false;
    }
    return true;
  });

  // Fonctions de gestion des actions
  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailsModalOpen(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    toast({
      title: "Modifier l'abonnement",
      description: `Ouverture de l'éditeur pour ${subscription.user?.firstName} ${subscription.user?.lastName}`,
    });
  };

  const handleCancelSubscription = (subscription: Subscription) => {
    toast({
      title: "Annulation d'abonnement",
      description: `L'abonnement de ${subscription.user?.firstName} ${subscription.user?.lastName} a été annulé`,
      variant: "destructive"
    });
  };

  const handleSendReminder = (subscription: Subscription) => {
    toast({
      title: "Rappel envoyé",
      description: `Rappel de renouvellement envoyé à ${subscription.user?.email}`,
    });
  };

  const handleSuspendSubscription = (subscription: Subscription) => {
    toast({
      title: "Abonnement suspendu",
      description: `L'abonnement de ${subscription.user?.firstName} ${subscription.user?.lastName} a été suspendu`,
      variant: "destructive"
    });
  };

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Le fichier CSV sera téléchargé dans quelques instants",
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des abonnements</h1>
          <p className="text-gray-600 mt-2">
            Interface complète de gestion des abonnements et des revenus récurrents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau plan
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <SubscriptionMetrics metrics={mockMetrics} isLoading={isLoading} />

      {/* Tabs pour organiser les fonctionnalités */}
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
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            IA Insights
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Rapports
          </TabsTrigger>
        </TabsList>

        {/* Onglet Abonnements */}
        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtres et recherche</CardTitle>
              <CardDescription>
                Trouvez rapidement les abonnements que vous cherchez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onExport={handleExport}
                totalResults={filteredSubscriptions.length}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liste des abonnements</CardTitle>
              <CardDescription>
                Gérez tous les abonnements de votre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionTable
                subscriptions={filteredSubscriptions}
                onViewDetails={handleViewDetails}
                onEditSubscription={handleEditSubscription}
                onCancelSubscription={handleCancelSubscription}
                onSendReminder={handleSendReminder}
                onSuspendSubscription={handleSuspendSubscription}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Plans */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plans d'abonnement</CardTitle>
              <CardDescription>
                Configurez et gérez vos offres d'abonnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Plans existants - reprise du code existant */}
                <div className="text-center py-8 text-gray-500">
                  Plans d'abonnement - Interface à développer
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Évolution des revenus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Graphique d'évolution des revenus
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux de conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Essai → Abonnement</span>
                    <Badge variant="default">68.5%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Basique → Pro</span>
                    <Badge variant="secondary">24.3%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pro → Entreprise</span>
                    <Badge variant="secondary">12.1%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automatisation des notifications</CardTitle>
              <CardDescription>
                Configurez les emails automatiques pour optimiser la rétention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Rappel de renouvellement</h4>
                      <p className="text-sm text-gray-600">7 jours avant expiration</p>
                    </div>
                  </div>
                  <Badge variant="default">Actif</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Fin d'essai gratuit</h4>
                      <p className="text-sm text-gray-600">1 jour avant fin d'essai</p>
                    </div>
                  </div>
                  <Badge variant="default">Actif</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-red-500" />
                    <div>
                      <h4 className="font-medium">Échec de paiement</h4>
                      <p className="text-sm text-gray-600">Immédiatement après échec</p>
                    </div>
                  </div>
                  <Badge variant="default">Actif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet IA Insights */}
        <TabsContent value="ai-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Recommandations IA
              </CardTitle>
              <CardDescription>
                Insights basés sur l'analyse de vos données d'abonnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Opportunité de croissance</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    23% de vos utilisateurs Pro pourraient être intéressés par un upgrade vers Enterprise basé sur leur utilisation.
                  </p>
                </div>
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-800">Risque de désabonnement</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    12 utilisateurs montrent des signes de désengagement et risquent d'annuler leur abonnement.
                  </p>
                </div>
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Optimisation tarifaire</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Une augmentation de 10% du plan Pro pourrait générer +15% de revenus avec un impact minimal sur la rétention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Rapports */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rapports personnalisés</CardTitle>
              <CardDescription>
                Générez des rapports détaillés pour vos analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>Rapport mensuel</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analyse de rétention</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Prévisions de revenus</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Segmentation clients</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de détails d'abonnement */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'abonnement</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'abonnement sélectionné
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informations utilisateur</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Nom:</span> {selectedSubscription.user?.firstName} {selectedSubscription.user?.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedSubscription.user?.email}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Détails du plan</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Plan:</span> {selectedSubscription.plan?.name}</p>
                    <p><span className="font-medium">Prix:</span> {selectedSubscription.plan?.price}€/{selectedSubscription.plan?.interval}</p>
                    <p><span className="font-medium">Statut:</span> {selectedSubscription.status}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubscriptions;
