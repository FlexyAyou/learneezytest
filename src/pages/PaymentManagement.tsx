
import React, { useState } from 'react';
import { DollarSign, CreditCard, RefreshCw, Download, AlertCircle, TrendingUp, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const PaymentManagement = () => {
  const { toast } = useToast();

  const recentTransactions = [
    { id: "TRX-001", user: "Marie Dubois", course: "Python pour Data Science", amount: "€199", status: "Confirmé", date: "2024-03-15", method: "Carte" },
    { id: "TRX-002", user: "Pierre Martin", course: "Design Thinking", amount: "€149", status: "En attente", date: "2024-03-15", method: "PayPal" },
    { id: "TRX-003", user: "Sophie Chen", course: "Marketing Digital", amount: "€179", status: "Remboursé", date: "2024-03-14", method: "Carte" },
    { id: "TRX-004", user: "Jean Dupont", course: "JavaScript ES2024", amount: "€159", status: "Confirmé", date: "2024-03-14", method: "Virement" },
    { id: "TRX-005", user: "Lisa Wang", course: "UX/UI Design", amount: "€199", status: "Échec", date: "2024-03-13", method: "Carte" }
  ];

  const subscriptions = [
    { id: "SUB-001", user: "Marie Dubois", plan: "Premium Mensuel", amount: "€29/mois", status: "Actif", nextBilling: "2024-04-15", autoRenew: true },
    { id: "SUB-002", user: "Pierre Martin", plan: "Premium Annuel", amount: "€299/an", status: "Actif", nextBilling: "2024-12-15", autoRenew: true },
    { id: "SUB-003", user: "Sophie Chen", plan: "Premium Mensuel", amount: "€29/mois", status: "Expiré", nextBilling: "-", autoRenew: false }
  ];

  const handleTransactionAction = (transactionId: string, action: string) => {
    toast({
      title: `Action transaction`,
      description: `${action} pour la transaction ${transactionId}`,
    });
  };

  const handleSubscriptionAction = (subscriptionId: string, action: string) => {
    toast({
      title: `Action abonnement`,
      description: `${action} pour l'abonnement ${subscriptionId}`,
    });
  };

  const handleRefund = (transactionId: string) => {
    toast({
      title: "Remboursement initié",
      description: `Remboursement en cours pour ${transactionId}`,
    });
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Remboursé': return 'bg-blue-100 text-blue-800';
      case 'Échec': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Expiré': return 'bg-red-100 text-red-800';
      case 'Suspendu': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des paiements</h1>
            <p className="text-gray-600">Suivez les transactions, abonnements et remboursements</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Statistiques financières */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">€45,678</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Abonnements actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">€36,163/mois récurrent</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taux de remboursement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3%</div>
              <p className="text-xs text-muted-foreground">€1,234 ce mois</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">€2,890</div>
              <p className="text-xs text-muted-foreground">12 transactions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions récentes */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Transactions récentes
                </CardTitle>
                <CardDescription>Historique des paiements et leur statut</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Cours</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.id}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                            <p className="text-xs text-gray-400">{transaction.method}</p>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.user}</TableCell>
                        <TableCell className="max-w-xs truncate">{transaction.course}</TableCell>
                        <TableCell className="font-medium">{transaction.amount}</TableCell>
                        <TableCell>
                          <Badge className={getTransactionStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleTransactionAction(transaction.id, 'Voir détails')}
                            >
                              👁️
                            </Button>
                            {transaction.status === 'Confirmé' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRefund(transaction.id)}
                              >
                                💰
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Gestion des abonnements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Abonnements
                </CardTitle>
                <CardDescription>Gestion des abonnements récurrents</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Abonnement</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Prochaine facturation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{subscription.id}</p>
                            <p className="text-sm text-gray-500">{subscription.amount}</p>
                          </div>
                        </TableCell>
                        <TableCell>{subscription.user}</TableCell>
                        <TableCell>{subscription.plan}</TableCell>
                        <TableCell>
                          <Badge className={getSubscriptionStatusColor(subscription.status)}>
                            {subscription.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{subscription.nextBilling}</p>
                            {subscription.autoRenew && (
                              <p className="text-xs text-green-600">Auto-renouvelé</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSubscriptionAction(subscription.id, 'Modifier')}
                            >
                              ✏️
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSubscriptionAction(subscription.id, 'Suspendre')}
                            >
                              ⏸️
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Panel d'actions rapides */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Traitement des remboursements
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Abonnements expirés
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Paiements échoués
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Rapport mensuel
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export comptable
                </Button>
              </CardContent>
            </Card>

            {/* Alertes de paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800">12 paiements échoués</p>
                  <p className="text-xs text-red-600">Nécessitent une attention</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">8 remboursements en attente</p>
                  <p className="text-xs text-yellow-600">À traiter aujourd'hui</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">45 abonnements à renouveler</p>
                  <p className="text-xs text-blue-600">Dans les 7 prochains jours</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
