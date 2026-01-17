import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Zap, 
  Gift, 
  Check, 
  Users, 
  CreditCard, 
  Calendar, 
  History,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Coins,
  BookOpen,
  Library,
  Headphones,
  FileText,
  Shield,
  Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Types
interface Offer {
  id: number;
  name: string;
  students: string;
  monthlyPrice: number;
  annualPrice: number;
  popular: boolean;
  icon: React.ReactNode;
  description: string;
  features: string[];
  gradient: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

interface SubscriptionHistory {
  id: string;
  offerName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  amount: number;
  billingPeriod: 'monthly' | 'annual';
}

export const OFOffres = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  // Données mockées de l'abonnement actuel (à dynamiser)
  const currentSubscription = {
    offerName: "OF Business",
    offerPlan: "business",
    startDate: "15 janvier 2024",
    renewalDate: "15 février 2025",
    billingPeriod: "annual" as const,
    maxStudents: 500,
    currentStudents: 234,
    maxFormations: 50,
    activeFormations: 12,
    tokensTotal: 10000,
    tokensUsed: 3450,
    price: 4490,
  };

  // Fonctionnalités incluses
  const includedFeatures = [
    { icon: Library, label: "Accès catalogue Learneezy", description: "Accès à toutes les formations du catalogue" },
    { icon: Headphones, label: "Support prioritaire", description: "Assistance dédiée par téléphone et email" },
    { icon: FileText, label: "Certificats automatiques", description: "Génération automatique des attestations" },
    { icon: Shield, label: "Conformité Qualiopi", description: "Outils de conformité certification qualité" },
    { icon: Sparkles, label: "Intelligence artificielle", description: "Tuteurs IA et génération de contenu" },
    { icon: Users, label: "Gestion multi-formateurs", description: "Invitez et gérez vos formateurs" },
  ];

  // Historique des abonnements (mock)
  const subscriptionHistory: SubscriptionHistory[] = [
    {
      id: '1',
      offerName: 'OF Business',
      startDate: '15 janvier 2024',
      endDate: '15 janvier 2025',
      status: 'active',
      amount: 4490,
      billingPeriod: 'annual',
    },
    {
      id: '2',
      offerName: 'OF Starter',
      startDate: '15 janvier 2023',
      endDate: '14 janvier 2024',
      status: 'expired',
      amount: 1990,
      billingPeriod: 'annual',
    },
    {
      id: '3',
      offerName: 'OF Starter',
      startDate: '15 décembre 2022',
      endDate: '14 janvier 2023',
      status: 'expired',
      amount: 199,
      billingPeriod: 'monthly',
    },
  ];

  // Offres OF disponibles
  const ofOffers: Offer[] = [
    {
      id: 1,
      name: "OF Starter",
      students: "Jusqu'à 10 apprenants",
      monthlyPrice: 199,
      annualPrice: 1990,
      popular: false,
      icon: <Gift className="h-8 w-8" />,
      description: "Idéal pour les petits organismes",
      features: [
        "Gestion de 10 apprenants",
        "Plateforme LMS intégrée",
        "Suivi pédagogique",
        "Émargements numériques",
        "Support par email",
        "Certificats automatiques"
      ],
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700"
    },
    {
      id: 2,
      name: "OF Business",
      students: "Jusqu'à 50 apprenants",
      monthlyPrice: 449,
      annualPrice: 4490,
      popular: true,
      icon: <Zap className="h-8 w-8" />,
      description: "Pour les organismes en croissance",
      features: [
        "Gestion de 50 apprenants",
        "Plateforme LMS avancée",
        "Outils de création de contenu",
        "Reporting détaillé",
        "Intégrations CPF/OPCO",
        "Support prioritaire",
        "Formation des formateurs"
      ],
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-700"
    },
    {
      id: 3,
      name: "OF Enterprise",
      students: "Illimité",
      monthlyPrice: 899,
      annualPrice: 8990,
      popular: false,
      icon: <Crown className="h-8 w-8" />,
      description: "Solution complète pour grands organismes",
      features: [
        "Apprenants illimités",
        "Plateforme white-label",
        "API complète",
        "Intelligence artificielle",
        "Conformité Qualiopi",
        "Manager dédié",
        "Formation sur-mesure"
      ],
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700"
    }
  ];

  const calculatePrice = (offer: Offer) => {
    if (isAnnual) {
      return Math.round(offer.annualPrice * 0.83);
    }
    return offer.monthlyPrice;
  };

  const getStatusBadge = (status: SubscriptionHistory['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expiré</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isCurrentPlan = (offerName: string) => {
    return offerName === currentSubscription.offerName;
  };

  const studentsUsagePercentage = (currentSubscription.currentStudents / currentSubscription.maxStudents) * 100;
  const formationsUsagePercentage = (currentSubscription.activeFormations / currentSubscription.maxFormations) * 100;
  const tokensUsagePercentage = (currentSubscription.tokensUsed / currentSubscription.tokensTotal) * 100;

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-500";
    if (percentage >= 60) return "text-amber-500";
    return "text-green-500";
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des offres</h1>
        <p className="text-gray-600">Gérez votre abonnement et consultez les offres disponibles</p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="current">Mon abonnement</TabsTrigger>
          <TabsTrigger value="offers">Offres disponibles</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Onglet Abonnement Actuel */}
        <TabsContent value="current" className="space-y-6">
          {/* Carte principale de l'abonnement */}
          <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <Zap className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{currentSubscription.offerName}</CardTitle>
                    <CardDescription>Votre abonnement actuel</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">Actif</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Prix */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm">Tarif</span>
                  </div>
                  <p className="text-2xl font-bold text-indigo-700">
                    {currentSubscription.price}€
                    <span className="text-sm font-normal text-muted-foreground">
                      /{currentSubscription.billingPeriod === 'annual' ? 'an' : 'mois'}
                    </span>
                  </p>
                </div>

                {/* Date de renouvellement */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Prochain renouvellement</span>
                  </div>
                  <p className="text-lg font-semibold">{currentSubscription.renewalDate}</p>
                </div>

                {/* Début abonnement */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <History className="h-4 w-4" />
                    <span className="text-sm">Début de l'abonnement</span>
                  </div>
                  <p className="text-lg font-semibold">{currentSubscription.startDate}</p>
                </div>
              </div>

              {/* Utilisation des apprenants */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">Apprenants utilisés</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {currentSubscription.currentStudents} / {currentSubscription.maxStudents}
                  </span>
                </div>
                <Progress value={studentsUsagePercentage} className="h-3" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{currentSubscription.maxStudents - currentSubscription.currentStudents} places restantes</span>
                  <span>{Math.round(studentsUsagePercentage)}% utilisé</span>
                </div>
                {studentsUsagePercentage >= 80 && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <span className="text-sm text-amber-800">
                      Vous approchez de la limite. Pensez à upgrader votre offre.
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gérer le paiement
                </Button>
                <Button variant="outline">
                  <History className="h-4 w-4 mr-2" />
                  Voir les factures
                </Button>
                <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Changer d'offre
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cartes d'usage - Tokens, Apprenants, Formations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tokens */}
            <Card className="border shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-muted-foreground">Tokens</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-4xl font-bold ${getUsageColor(tokensUsagePercentage)}`}>
                    {(currentSubscription.tokensTotal - currentSubscription.tokensUsed).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">restants</span>
                </div>
                <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${getProgressBgColor(tokensUsagePercentage)} rounded-full transition-all`}
                    style={{ width: `${tokensUsagePercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentSubscription.tokensUsed.toLocaleString()} utilisés</span>
                  <span>{currentSubscription.tokensTotal.toLocaleString()} total</span>
                </div>
                <p className="text-xs text-muted-foreground">{tokensUsagePercentage.toFixed(1)}% utilisés</p>
              </CardContent>
            </Card>

            {/* Apprenants */}
            <Card className="border shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-muted-foreground">Apprenants</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-4xl font-bold ${getUsageColor(studentsUsagePercentage)}`}>
                    {currentSubscription.maxStudents - currentSubscription.currentStudents}
                  </span>
                  <span className="text-muted-foreground">restants</span>
                </div>
                <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${getProgressBgColor(studentsUsagePercentage)} rounded-full transition-all`}
                    style={{ width: `${studentsUsagePercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentSubscription.currentStudents} actifs</span>
                  <span>{currentSubscription.maxStudents} max</span>
                </div>
                <p className="text-xs text-muted-foreground">{studentsUsagePercentage.toFixed(1)}% utilisés</p>
              </CardContent>
            </Card>

            {/* Formations */}
            <Card className="border shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <span className="font-medium text-muted-foreground">Formations</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-4xl font-bold ${getUsageColor(formationsUsagePercentage)}`}>
                    {currentSubscription.maxFormations - currentSubscription.activeFormations}
                  </span>
                  <span className="text-muted-foreground">restantes</span>
                </div>
                <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${getProgressBgColor(formationsUsagePercentage)} rounded-full transition-all`}
                    style={{ width: `${formationsUsagePercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentSubscription.activeFormations} actives</span>
                  <span>{currentSubscription.maxFormations} max</span>
                </div>
                <p className="text-xs text-muted-foreground">{formationsUsagePercentage.toFixed(1)}% utilisées</p>
              </CardContent>
            </Card>
          </div>

          {/* Fonctionnalités incluses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Fonctionnalités incluses
              </CardTitle>
              <CardDescription>Les fonctionnalités disponibles avec votre abonnement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {includedFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Offres Disponibles */}
        <TabsContent value="offers" className="space-y-6">
          {/* Toggle Mensuel/Annuel */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-full inline-flex items-center">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
                  isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annuel
                <Badge className="ml-2 bg-green-500 text-white text-xs">-17%</Badge>
              </button>
            </div>
          </div>

          {/* Grille des offres */}
          <div className="grid md:grid-cols-3 gap-6">
            {ofOffers.map((offer) => (
              <Card 
                key={offer.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  offer.popular ? 'ring-2 ring-indigo-500 shadow-lg' : ''
                } ${isCurrentPlan(offer.name) ? 'ring-2 ring-green-500' : ''}`}
              >
                {offer.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-gradient-to-r from-indigo-500 to-indigo-600">
                      Populaire
                    </Badge>
                  </div>
                )}
                {isCurrentPlan(offer.name) && (
                  <div className="absolute top-0 left-0">
                    <Badge className="rounded-none rounded-br-lg bg-green-500">
                      Votre offre
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`${offer.bgColor} border-b ${offer.borderColor}`}>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${offer.gradient} text-white w-fit`}>
                    {offer.icon}
                  </div>
                  <CardTitle className="text-xl mt-4">{offer.name}</CardTitle>
                  <CardDescription>{offer.description}</CardDescription>
                  <div className="mt-4">
                    <span className={`text-4xl font-bold ${offer.textColor}`}>
                      {calculatePrice(offer)}€
                    </span>
                    <span className="text-gray-600">/{isAnnual ? 'an' : 'mois'}</span>
                  </div>
                  <p className={`text-sm font-medium ${offer.textColor}`}>
                    {offer.students}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className={`h-5 w-5 ${offer.textColor} mr-3 flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 ${
                      isCurrentPlan(offer.name) 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : `bg-gradient-to-r ${offer.gradient} hover:opacity-90`
                    }`}
                    disabled={isCurrentPlan(offer.name)}
                  >
                    {isCurrentPlan(offer.name) ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Offre actuelle
                      </>
                    ) : (
                      <>
                        Choisir cette offre
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des abonnements
              </CardTitle>
              <CardDescription>
                Consultez l'historique de vos abonnements et factures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offre</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Facturation</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionHistory.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.offerName}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{sub.startDate}</p>
                          <p className="text-muted-foreground">→ {sub.endDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sub.billingPeriod === 'annual' ? 'Annuel' : 'Mensuel'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{sub.amount}€</TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          Voir facture
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};