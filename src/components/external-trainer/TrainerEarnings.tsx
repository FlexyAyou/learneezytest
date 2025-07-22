import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, AlertCircle } from 'lucide-react';

const TrainerEarnings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  const earnings = {
    thisMonth: {
      gross: 2450,
      commission: 735,
      net: 1715,
      pending: 480,
      paid: 1235,
    },
    lastMonth: {
      gross: 1980,
      commission: 594,
      net: 1386,
      pending: 0,
      paid: 1386,
    },
    thisYear: {
      gross: 18650,
      commission: 5595,
      net: 13055,
      pending: 480,
      paid: 12575,
    }
  };

  const transactions = [
    {
      id: 1,
      date: '2024-01-15',
      student: 'Alice Martin',
      subject: 'React Development',
      duration: 2,
      grossAmount: 90,
      commission: 27,
      netAmount: 63,
      status: 'paid',
      paymentDate: '2024-01-16'
    },
    {
      id: 2,
      date: '2024-01-14',
      student: 'Thomas Petit',
      subject: 'JavaScript',
      duration: 3,
      grossAmount: 135,
      commission: 40.5,
      netAmount: 94.5,
      status: 'paid',
      paymentDate: '2024-01-15'
    },
    {
      id: 3,
      date: '2024-01-12',
      student: 'Emma Dubois',
      subject: 'UI/UX Design',
      duration: 4,
      grossAmount: 200,
      commission: 60,
      netAmount: 140,
      status: 'pending',
      paymentDate: null
    },
    {
      id: 4,
      date: '2024-01-10',
      student: 'Marie Bernard',
      subject: 'Node.js',
      duration: 2,
      grossAmount: 96,
      commission: 28.8,
      netAmount: 67.2,
      status: 'processing',
      paymentDate: null
    },
  ];

  const monthlyStats = [
    { month: 'Jan 2024', earnings: 1715, sessions: 12 },
    { month: 'Déc 2023', earnings: 1386, sessions: 8 },
    { month: 'Nov 2023', earnings: 2140, sessions: 15 },
    { month: 'Oct 2023', earnings: 1650, sessions: 11 },
    { month: 'Sep 2023', earnings: 1980, sessions: 14 },
    { month: 'Août 2023', earnings: 890, sessions: 6 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const currentEarnings = earnings[selectedPeriod === 'current_month' ? 'thisMonth' : 
                                 selectedPeriod === 'last_month' ? 'lastMonth' : 'thisYear'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes Revenus</h1>
          <p className="text-muted-foreground">Suivi de vos gains et commissions</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sélectionner la période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Ce mois</SelectItem>
              <SelectItem value="last_month">Mois dernier</SelectItem>
              <SelectItem value="this_year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{currentEarnings.gross}€</p>
                <p className="text-muted-foreground text-sm">Revenus bruts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{currentEarnings.commission}€</p>
                <p className="text-muted-foreground text-sm">Commission (30%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{currentEarnings.net}€</p>
                <p className="text-muted-foreground text-sm">Revenus nets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{currentEarnings.paid}€</p>
                <p className="text-muted-foreground text-sm">Déjà versés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information importante sur les paiements */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Informations sur les paiements</h3>
              <p className="text-sm text-blue-800 mt-1">
                Les paiements sont effectués automatiquement 24h après la fin de chaque session. 
                La commission de 30% est prélevée automatiquement. Vous recevez 70% du montant payé par l'étudiant.
              </p>
              <p className="text-sm text-blue-800 mt-2">
                <strong>En attente:</strong> {currentEarnings.pending}€ • 
                <strong> Prochains virements:</strong> sous 1-2 jours ouvrés
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="monthly">Évolution mensuelle</TabsTrigger>
          <TabsTrigger value="analytics">Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des transactions</CardTitle>
              <CardDescription>Détail de toutes vos formations payées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{transaction.subject}</h3>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.student} • {transaction.date} • {transaction.duration}h
                      </p>
                      {transaction.paymentDate && (
                        <p className="text-xs text-green-600">
                          Payé le {transaction.paymentDate}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className="font-semibold text-lg">{transaction.netAmount}€</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.grossAmount}€ - {transaction.commission}€
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution mensuelle</CardTitle>
              <CardDescription>Vos revenus des 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{stat.month}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stat.sessions} sessions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{stat.earnings}€</p>
                      <p className="text-sm text-muted-foreground">
                        ~{Math.round(stat.earnings / stat.sessions)}€/session
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des revenus</CardTitle>
                <CardDescription>Statistiques détaillées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Revenus moyens/session</span>
                  <span className="font-medium">78€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sessions ce mois</span>
                  <span className="font-medium">22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taux horaire moyen</span>
                  <span className="font-medium">45€/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Croissance vs mois dernier</span>
                  <span className="font-medium text-green-600">+23.7%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par spécialité</CardTitle>
                <CardDescription>Revenus par domaine d'expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">React Development</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="font-medium text-sm">850€</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">JavaScript</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="font-medium text-sm">520€</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">UI/UX Design</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/4 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="font-medium text-sm">345€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainerEarnings;