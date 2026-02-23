import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Coins,
  BookOpen,
  Shield,
  Sparkles,
  Loader2,
  RefreshCw,
  Star,
  Library
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fastAPIClient } from '@/services/fastapi-client';
import { SubscriptionPlanResponse, SubscriptionResponse } from '@/types/fastapi';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Metrics {
  current_students: number;
  active_formations: number;
  tokens_used: number;
  tokens_total: number;
}

export const OFOffres = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [currentSub, setCurrentSub] = useState<SubscriptionResponse | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [allPlans, activeSub, orgMetrics] = await Promise.all([
        fastAPIClient.getSubscriptionPlans(),
        fastAPIClient.getCurrentSubscription().catch(() => null),
        fastAPIClient.getOrganizationMetrics().catch(() => null)
      ]);
      setPlans(allPlans.filter(p => p.is_active && p.name.toLowerCase().includes('of')));
      setCurrentSub(activeSub);
      setMetrics(orgMetrics);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'abonnement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubscribe = async (planId: number) => {
    setIsActionLoading(true);
    try {
      await fastAPIClient.subscribeToPlan(planId);
      toast({
        title: "Succès",
        description: "Votre abonnement a été mis à jour.",
      });
      await fetchData();
    } catch (err) {
      toast({
        title: "Erreur",
        description: "La mise à jour de l'abonnement a échoué.",
        variant: "destructive"
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const calculatePrice = (price: number) => {
    if (isAnnual) {
      return Math.round(price * 12 * 0.83); // 17% discount
    }
    return price;
  };

  const getGradient = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('starter')) return "from-blue-500 to-blue-600";
    if (n.includes('growth') || n.includes('business')) return "from-purple-500 to-purple-600";
    if (n.includes('premium') || n.includes('enterprise')) return "from-amber-500 to-amber-600";
    return "from-slate-500 to-slate-600";
  };

  const getTextColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('starter')) return "text-blue-700";
    if (n.includes('growth') || n.includes('business')) return "text-purple-700";
    if (n.includes('premium') || n.includes('enterprise')) return "text-amber-700";
    return "text-slate-700";
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expiré</Badge>;
      case 'replaced':
        return <Badge variant="outline">Remplacé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Chargement de vos offres...</p>
      </div>
    );
  }

  // Metrics calculation
  const maxStudents = currentSub?.plan?.max_users || 5; // Limite gratuite par défaut
  const currentStudents = metrics?.current_students || 0;
  const studentUsage = (currentStudents / maxStudents) * 100;

  const maxFormations = 50;
  const currentFormations = metrics?.active_formations || 0;
  const formationUsage = (currentFormations / maxFormations) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des offres</h1>
          <p className="text-slate-500 font-medium">Boostez votre organisme avec nos plans d'excellence</p>
        </div>
        <Button onClick={fetchData} variant="outline" className="rounded-xl font-bold">
          <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
        </Button>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl mb-8">
          <TabsTrigger value="current" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold px-6">Mon abonnement</TabsTrigger>
          <TabsTrigger value="offers" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold px-6">Découvrir les offres</TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold px-6">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Carte principale de l'abonnement */}
            <Card className="lg:col-span-2 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-transparent overflow-hidden rounded-[2.5rem] shadow-xl">
              <div className="h-2 w-full bg-primary" />
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="p-4 rounded-3xl bg-primary text-white shadow-lg shadow-primary/30">
                      {currentSub?.plan?.name.toLowerCase().includes('starter') ? <Gift className="h-8 w-8" /> :
                        currentSub?.plan?.name.toLowerCase().includes('enterprise') ? <Crown className="h-8 w-8" /> :
                          currentSub ? <Zap className="h-8 w-8" /> : <Star className="h-8 w-8" />}
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-black text-slate-900">
                        {currentSub?.plan?.name || "Offre Gratuite"}
                      </CardTitle>
                      <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">
                        {currentSub ? "Abonnement Actuel" : "Mode Découverte"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${currentSub ? 'bg-green-500' : 'bg-blue-500'} text-white font-bold px-4 py-1.5 rounded-full shadow-lg shadow-green-500/20`}>
                    {currentSub ? 'ACTIF' : 'GRATUIT'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/50 p-6 rounded-3xl border border-white">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Tarif</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">
                      {currentSub?.plan?.price || 0}€
                      <span className="text-sm font-bold text-slate-400">/mois</span>
                    </p>
                  </div>

                  <div className="bg-white/50 p-6 rounded-3xl border border-white">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Fin de période</span>
                    </div>
                    <p className="text-xl font-black text-slate-900">
                      {currentSub?.end_date ? format(new Date(currentSub.end_date), "d MMMM yyyy", { locale: fr }) : "Illimité"}
                    </p>
                  </div>

                  <div className="bg-white/50 p-6 rounded-3xl border border-white">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <History className="h-4 w-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Depuis le</span>
                    </div>
                    <p className="text-xl font-black text-slate-900">
                      {currentSub ? format(new Date(currentSub.start_date), "d MMMM yyyy", { locale: fr }) : "Création du compte"}
                    </p>
                  </div>
                </div>

                {!currentSub && (
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-black text-amber-900">Limite approchant ?</p>
                      <p className="text-sm text-amber-700 font-medium">
                        L'offre gratuite est limitée à 5 apprenants. Pour inscrire plus d'élèves, passez à une offre supérieure dès aujourd'hui.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button variant="outline" className="rounded-2xl font-bold h-12 px-6 border-slate-200" disabled={!currentSub}>
                    <CreditCard className="h-4 w-4 mr-2" /> Gérer le paiement
                  </Button>
                  <Button variant="outline" className="rounded-2xl font-bold h-12 px-6 border-slate-200" disabled={!currentSub}>
                    <History className="h-4 w-4 mr-2" /> Historique facturation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage Column */}
            <div className="space-y-6">
              <Card className="p-6 rounded-[2rem] border-none bg-indigo-50/50 shadow-sm border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-indigo-500" />
                    <span className="font-black text-slate-900 text-sm tracking-tight">Apprenants</span>
                  </div>
                  <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-600 font-bold">
                    {Math.round(studentUsage)}%
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>{currentStudents} Actifs</span>
                    <span>quota: {maxStudents}</span>
                  </div>
                  <Progress value={studentUsage} className="h-2 rounded-full bg-white" />
                </div>
                {!currentSub && currentStudents >= 5 && (
                  <p className="text-[10px] text-red-500 font-black mt-3 uppercase tracking-wider">Limite gratuite atteinte</p>
                )}
              </Card>

              <Card className="p-6 rounded-[2rem] border-none bg-purple-50/50 shadow-sm border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    <span className="font-black text-slate-900 text-sm tracking-tight">Formations</span>
                  </div>
                  <Badge variant="outline" className="bg-white border-purple-200 text-purple-600 font-bold">
                    {Math.round(formationUsage)}%
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>{currentFormations} Actives</span>
                    <span>quota: {maxFormations}</span>
                  </div>
                  <Progress value={formationUsage} className="h-2 rounded-full bg-white" />
                </div>
              </Card>

              <Card className="p-6 rounded-[2rem] border-none bg-amber-50/50 shadow-sm border border-amber-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-amber-500" />
                    <span className="font-black text-slate-900 text-sm tracking-tight">Tokens OF</span>
                  </div>
                </div>
                <div className="space-y-3 text-center py-2">
                  <p className="text-3xl font-black text-slate-900">
                    {metrics?.tokens_total?.toLocaleString() || 0}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solde actuel disponible</p>
                  <Button size="sm" variant="outline" className="mt-2 rounded-full text-[10px] h-7 px-4 border-amber-200 bg-white text-amber-700 font-black">
                    ACHETER DES TOKENS
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Features Check */}
          <Card className="rounded-[2.5rem] border-none bg-slate-900 text-white p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: Shield, title: "Qualiopi Ready", desc: "Processus conformes aux exigences du référentiel national qualité." },
                { icon: Library, title: "Catalogue Premium", desc: "Des centaines de formations prêtes à l'emploi pour vos apprenants." },
                { icon: Sparkles, title: "Outils IA", desc: "Tuteurs intelligents et assistance à la création de contenu pédagogique." }
              ].map((f, i) => (
                <div key={i} className="space-y-4">
                  <div className="p-3 bg-white/10 rounded-2xl w-fit">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">{f.title}</h4>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Faites passer votre OF au niveau supérieur</h2>
            <p className="text-slate-500 font-medium">Choisissez le plan qui correspond à vos ambitions de croissance.</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-slate-100 p-2 rounded-[2rem] inline-flex items-center gap-2 shadow-inner">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${!isAnnual ? 'bg-white shadow-xl text-slate-900 scale-105' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all flex items-center gap-2 ${isAnnual ? 'bg-white shadow-xl text-slate-900 scale-105' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Annuel
                <Badge className="bg-green-500 text-white font-black text-[10px] px-2 py-0">PROMO -17%</Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((offer) => {
              const isActive = currentSub?.plan_id === offer.id;
              return (
                <Card
                  key={offer.id}
                  className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 rounded-[2.5rem] border-2 ${isActive ? 'border-primary ring-4 ring-primary/10 shadow-xl' : 'border-slate-100'}`}
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${getGradient(offer.name)}`} />

                  <CardHeader className="pt-10 text-center pb-6">
                    <div className={`mx-auto w-16 h-16 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-center mb-5 transition-transform duration-500 group-hover:rotate-6 ${getTextColor(offer.name)}`}>
                      {offer.name.toLowerCase().includes('starter') ? <Gift className="w-8 h-8" /> :
                        offer.name.toLowerCase().includes('enterprise') ? <Crown className="w-8 h-8" /> :
                          <Zap className="w-8 h-8" />}
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">{offer.name}</CardTitle>
                    <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2 px-6">
                      {offer.duration_days} jours de service inclus
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-8 pb-10">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-baseline gap-1">
                        <span className={`text-4xl font-black text-slate-900`}>
                          {calculatePrice(offer.price)}€
                        </span>
                        <span className="text-slate-400 font-bold text-sm">
                          /{isAnnual ? 'an' : 'mois'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6 mb-10">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Inclus dans le plan</p>
                      <ul className="space-y-4">
                        {offer.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm font-bold leading-tight">
                            <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 border border-slate-100 bg-white ${getTextColor(offer.name)}`}>
                              <Check className="h-3 w-3" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                        {offer.max_users && (
                          <li className="flex items-center gap-3 text-slate-900 text-sm font-black pt-4 border-t border-slate-50">
                            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
                              <Users className="h-4 w-4" />
                            </div>
                            <span>{offer.max_users} Apprenants max</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <Button
                      className={`w-full py-8 text-lg font-black tracking-wide rounded-[1.5rem] shadow-xl transition-all duration-300 ${isActive
                          ? 'bg-green-50 text-green-600 border-2 border-green-600 hover:bg-green-100 cursor-default shadow-none'
                          : `bg-gradient-to-r ${getGradient(offer.name)} text-white hover:opacity-95 hover:scale-[1.02] border-none`
                        }`}
                      onClick={() => !isActive && handleSubscribe(offer.id)}
                      disabled={isActionLoading || isActive}
                    >
                      {isActive ? (
                        <div className="flex items-center gap-2">
                          <Check className="h-5 w-5" /> Offre Actuelle
                        </div>
                      ) : isActionLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Choisir ce plan"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-white border-b p-8">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                <History className="h-6 w-6 text-primary" />
                Historique des transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableRow className="border-none">
                    <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 px-8 py-6 h-16">Plan souscrit</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 h-16">Date d'activation</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 h-16">Fin de période</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-right pr-8 h-16">Statut actuel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSub ? (
                    <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-slate-50 ${getTextColor(currentSub.plan?.name || "")}`}>
                            <Star className="h-4 w-4" />
                          </div>
                          <span className="font-black text-slate-900">{currentSub.plan?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-500 text-sm">
                        {format(new Date(currentSub.start_date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="font-bold text-slate-500 text-sm">
                        {currentSub.end_date ? format(new Date(currentSub.end_date), "dd/MM/yyyy") : "-"}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        {getStatusBadge(currentSub.status)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <History className="h-10 w-10 text-slate-200" />
                          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Aucune donnée enregistrée</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};