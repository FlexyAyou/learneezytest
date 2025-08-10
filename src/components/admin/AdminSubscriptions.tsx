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
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionMetrics } from './subscriptions/SubscriptionMetrics';
import { SubscriptionFiltersComponent } from './subscriptions/SubscriptionFilters';
import { SubscriptionTable } from './subscriptions/SubscriptionTable';
import { SubscriptionPlansManager } from './subscriptions/SubscriptionPlansManager';
import { Subscription, SubscriptionPlan, SubscriptionFilters, SubscriptionAnalytics } from '@/types/subscription';

// Métriques mises à jour avec les nouvelles données
const mockMetrics = {
  totalRevenue: 187500, // Mis à jour pour refléter les vraies offres
  activeSubscriptions: 364, // Total des abonnés sur tous les plans
  newSubscriptions: 28,
  churnRate: 3.2,
  averageRevenuePerUser: 195.5, // ARPU plus élevé avec les offres OF
  trialConversions: 68.5,
  expiringThisMonth: 15,
  growthRate: 12.5
};

// Abonnements mockés basés sur les vraies offres
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: 'user1',
    planId: 'particulier-growth',
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-02-15T00:00:00Z',
    autoRenewal: true,
    paymentMethod: { type: 'card', last4: '4242', expiryDate: '12/25' },
    totalAmountPaid: 79,
    discountApplied: 0,
    nextPaymentDate: '2024-02-15T00:00:00Z',
    user: {
      id: 'user1',
      email: 'marie.dupont@email.com',
      firstName: 'Marie',
      lastName: 'Dupont'
    },
    plan: {
      id: 'particulier-growth',
      name: 'Pack Growth',
      description: 'Le choix idéal pour progresser rapidement',
      price: 79,
      currency: 'EUR',
      interval: 'monthly',
      credits: 300,
      creditPrice: 0.26,
      features: ['300 crédits d\'apprentissage', 'Accès à tous les cours', 'Support prioritaire'],
      isActive: true,
      isPopular: true,
      trialDays: 14,
      setupFee: 0,
      discountPercentage: 0,
      targetAudience: 'individual',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      subscribers: 128
    }
  },
  {
    id: '2',
    userId: 'user2',
    planId: 'of-business',
    status: 'active',
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2024-02-10T00:00:00Z',
    autoRenewal: true,
    paymentMethod: { type: 'card', last4: '1234', expiryDate: '11/26' },
    totalAmountPaid: 449,
    discountApplied: 0,
    nextPaymentDate: '2024-02-10T00:00:00Z',
    user: {
      id: 'user2',
      email: 'formation.center@email.com',
      firstName: 'Jean',
      lastName: 'Formation'
    },
    plan: {
      id: 'of-business',
      name: 'OF Business',
      description: 'Pour les organismes en croissance',
      price: 449,
      currency: 'EUR',
      interval: 'monthly',
      maxUsers: 50,
      features: ['Gestion de 50 apprenants', 'Plateforme LMS avancée', 'Reporting détaillé'],
      isActive: true,
      isPopular: true,
      trialDays: 14,
      setupFee: 0,
      discountPercentage: 0,
      targetAudience: 'organisme',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      subscribers: 67
    }
  }
];

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [filters, setFilters] = useState<SubscriptionFilters>({});
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [isLoading, setIsLoading] = useState(false);
  
  // Nouveaux états pour les filtres de plans
  const [planFilters, setPlanFilters] = useState({
    showParticulier: true,
    showOrganisme: true,
    showMensuel: true,
    showAnnuel: true
  });
  
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

  const handlePlanUpdate = (plan: SubscriptionPlan) => {
    toast({
      title: "Plan mis à jour",
      description: `Le plan ${plan.name} a été modifié avec succès`,
    });
  };

  const handlePlanFilterChange = (filterType: string, value: boolean) => {
    setPlanFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des abonnements</h1>
          <p className="text-gray-600 mt-2">
            Interface complète de gestion des abonnements basée sur vos vraies offres (Particuliers & Organismes de Formation)
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

      {/* Résumé des offres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-blue-500" />
              Offres Particuliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pack Starter (100 crédits)</span>
                <span className="font-medium">29€/mois</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pack Growth (300 crédits)</span>
                <span className="font-medium">79€/mois</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pack Premium (500 crédits)</span>
                <span className="font-medium">120€/mois</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Offres Organismes de Formation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>OF Starter (10 apprenants)</span>
                <span className="font-medium">199€/mois</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>OF Business (50 apprenants)</span>
                <span className="font-medium">449€/mois</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>OF Enterprise (illimité)</span>
                <span className="font-medium">899€/mois</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

        {/* Onglet Plans avec filtres */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres d'affichage des plans
              </CardTitle>
              <CardDescription>
                Sélectionnez les types de plans à afficher pour une gestion optimale
              </CardDescription>
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
                      <Label htmlFor="organisme" className="text-sm">Organisme de Formation</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-700">Fréquence de facturation</h4>
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

                <div className="md:col-span-2 flex items-end">
                  <div className="bg-blue-50 p-4 rounded-lg w-full">
                    <h5 className="font-medium text-blue-800 mb-2">Filtres actifs</h5>
                    <div className="flex flex-wrap gap-2">
                      {planFilters.showParticulier && (
                        <Badge variant="secondary" className="text-xs">Particulier</Badge>
                      )}
                      {planFilters.showOrganisme && (
                        <Badge variant="secondary" className="text-xs">Organisme</Badge>
                      )}
                      {planFilters.showMensuel && (
                        <Badge variant="outline" className="text-xs">Mensuel</Badge>
                      )}
                      {planFilters.showAnnuel && (
                        <Badge variant="outline" className="text-xs">Annuel</Badge>
                      )}
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

        {/* Nouvel onglet Tarification */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Configuration des prix unitaires
              </CardTitle>
              <CardDescription>
                Définissez le prix unitaire de chaque token/crédit pour vos différentes offres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Tarification Particuliers</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pack Starter</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Prix/crédit:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">0.290€</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pack Growth</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Prix/crédit:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">0.263€</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pack Premium</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Prix/crédit:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">0.240€</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Coût des activités</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Formations (cours de base)</span>
                        <span className="font-medium">5-10 crédits</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Formations avancées</span>
                        <span className="font-medium">15-20 crédits</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Ateliers en groupe</span>
                        <span className="font-medium">15-35 crédits</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Coaching individuel</span>
                        <span className="font-medium">30-50 crédits</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Réservation créneau formateur</span>
                        <span className="font-medium">25-40 crédits</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Évaluations/certifications</span>
                        <span className="font-medium">5-15 crédits</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Recommandations tarifaires</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Plus le pack est important, plus le prix unitaire du crédit diminue</li>
                    <li>• Les activités premium (coaching individuel) consomment plus de crédits</li>
                    <li>• Les organismes de formation ont des tarifs fixes par nombre d'apprenants</li>
                  </ul>
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
                <CardTitle>Taux de conversion par offre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Essai → Pack Starter</span>
                    <Badge variant="default">45.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Starter → Growth</span>
                    <Badge variant="secondary">32.1%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth → Premium</span>
                    <Badge variant="secondary">18.7%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>OF Trial → OF Business</span>
                    <Badge variant="default">68.5%</Badge>
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
                    <Coins className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Crédits faibles</h4>
                      <p className="text-sm text-gray-600">Moins de 20 crédits restants</p>
                    </div>
                  </div>
                  <Badge variant="default">Actif</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Euro className="h-5 w-5 text-red-500" />
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
                  <Coins className="h-5 w-5" />
                  <span>Consommation crédits</span>
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
                    {selectedSubscription.plan?.credits && (
                      <p><span className="font-medium">Crédits:</span> {selectedSubscription.plan.credits}</p>
                    )}
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
