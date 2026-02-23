import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Crown, Gift, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fastAPIClient } from '@/services/fastapi-client';
import { SubscriptionPlanResponse } from '@/types/fastapi';
import { useToast } from '@/hooks/use-toast';

const Offers = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isOF, setIsOF] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await fastAPIClient.getSubscriptionPlans();
        // Filtrer les plans actifs
        setPlans(data.filter(p => p.is_active));
      } catch (err) {
        console.error('Error fetching plans:', err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les offres pour le moment.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: number) => {
    setIsSubscribing(planId);
    try {
      await fastAPIClient.subscribeToPlan(planId);
      toast({
        title: "Souscription réussie !",
        description: "Votre abonnement a été activé avec succès.",
      });
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: "Erreur",
        description: "La souscription a échoué. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(null);
    }
  };

  const calculatePrice = (price: number) => {
    if (isAnnual) {
      return Math.round(price * 12 * 0.83); // 17% discount on annual
    }
    return price;
  };

  const getGradient = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('starter')) return "from-blue-500 to-blue-600 shadow-blue-500/20";
    if (n.includes('growth') || n.includes('business')) return "from-purple-500 to-purple-600 shadow-purple-500/20";
    if (n.includes('premium') || n.includes('enterprise')) return "from-amber-500 to-amber-600 shadow-amber-500/20";
    return "from-slate-500 to-slate-600 shadow-slate-500/20";
  };

  const getTextColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('starter')) return "text-blue-700";
    if (n.includes('growth') || n.includes('business')) return "text-purple-700";
    if (n.includes('premium') || n.includes('enterprise')) return "text-amber-700";
    return "text-slate-700";
  };

  const getBgColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('starter')) return "bg-blue-50";
    if (n.includes('growth') || n.includes('business')) return "bg-purple-50";
    if (n.includes('premium') || n.includes('enterprise')) return "bg-amber-50";
    return "bg-slate-50";
  };

  const getBorderColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('starter')) return "border-blue-200";
    if (n.includes('growth') || n.includes('business')) return "border-purple-200";
    if (n.includes('premium') || n.includes('enterprise')) return "border-amber-200";
    return "border-slate-200";
  };

  const filteredPlans = plans.filter(p => {
    const isOfPlan = p.name.toLowerCase().includes('of');
    if (isOF) return isOfPlan;
    return !isOfPlan;
  });

  const ModernToggle = ({ active, onClick, children, badge }: {
    active: boolean,
    onClick: () => void,
    children: React.ReactNode,
    badge?: string
  }) => (
    <button
      onClick={onClick}
      className={`relative px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-95 ${active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
        }`}
    >
      {children}
      {badge && active && (
        <span className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full border-2 border-white shadow-sm">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />

      <div className="pt-20">
        {/* Premium Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
          <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-[120px] -z-10" />

          <div className="max-w-7xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-6 py-1.5 text-sm font-bold tracking-wide">
              NOS OFFRES 2024
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              L'excellence pédagogique <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                à portée de clic.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              Choisissez le pack qui soutient votre croissance, que vous soyez un curieux assoiffé de savoir ou un organisme de formation en pleine expansion.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white">
                <ModernToggle active={!isOF} onClick={() => setIsOF(false)}>
                  Particulier
                </ModernToggle>
                <ModernToggle active={isOF} onClick={() => setIsOF(true)}>
                  Organisme
                </ModernToggle>
              </div>

              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white">
                <ModernToggle active={!isAnnual} onClick={() => setIsAnnual(false)}>
                  Mensuel
                </ModernToggle>
                <ModernToggle
                  active={isAnnual}
                  onClick={() => setIsAnnual(true)}
                  badge="-17%"
                >
                  Annuel
                </ModernToggle>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Pricing Grid */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full" />
              </div>
              <p className="mt-6 text-slate-500 font-bold tracking-widest text-sm uppercase">Analyse des meilleures offres...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPlans.map((offer) => (
                <Card
                  key={offer.id}
                  className={`group relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-3 border-2 ${getBorderColor(offer.name)} ${getBgColor(offer.name)}/30`}
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${getGradient(offer.name)}`} />

                  <CardHeader className="pt-10 text-center pb-6">
                    <div className={`mx-auto w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-6 ${getTextColor(offer.name)}`}>
                      {offer.name.toLowerCase().includes('starter') ? <Gift className="w-10 h-10" /> :
                        offer.name.toLowerCase().includes('premium') || offer.name.toLowerCase().includes('enterprise') ? <Crown className="w-10 h-10" /> :
                          <Zap className="w-10 h-10" />}
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{offer.name}</CardTitle>
                    <CardDescription className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2 px-6">
                      {offer.duration_days} jours d'excellence
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-8 pb-10">
                    <div className="text-center mb-10">
                      <div className="inline-flex items-baseline gap-1">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">
                          {calculatePrice(offer.price)}€
                        </span>
                        <span className="text-slate-400 font-bold text-lg">
                          /{isAnnual ? 'an' : 'm'}
                        </span>
                      </div>
                      {isAnnual && (
                        <p className="text-xs font-black text-green-600 mt-2 tracking-wide uppercase">
                          Économie annuelle réalisée
                        </p>
                      )}
                    </div>

                    <div className="space-y-5 mb-10">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Fonctionnalités incluses</h4>
                      <ul className="space-y-4">
                        {offer.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                            <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 border border-slate-200 bg-white ${getTextColor(offer.name)}`}>
                              <Check className="h-3 w-3" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                        {offer.max_users && (
                          <li className="flex items-start gap-3 text-slate-900 text-sm font-bold pt-2 border-t border-slate-200/50">
                            <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 border-2 border-slate-900 bg-slate-900 text-white`}>
                              <Star className="h-2.5 w-2.5" />
                            </div>
                            <span>Jusqu'à {offer.max_users} apprenants</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <Button
                      className={`w-full py-8 text-lg font-black tracking-wide rounded-2xl shadow-2xl transition-all duration-300 bg-gradient-to-r ${getGradient(offer.name)} text-white hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] border-none`}
                      onClick={() => handleSubscribe(offer.id)}
                      disabled={isSubscribing !== null}
                    >
                      {isSubscribing === offer.id ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        "Choisir ce plan"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Premium FAQ Section */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Une question ? <br />
                <span className="text-slate-400">On vous dit tout.</span>
              </h2>
              <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
            </div>

            <Accordion type="single" collapsible className="space-y-6">
              {[
                {
                  q: "Puis-je changer de plan en cours de route ?",
                  a: "Absolument. La flexibilité est au cœur de notre service. Vous pouvez passer à l'offre supérieure à tout moment, et la différence sera ajustée instantanément."
                },
                {
                  q: "Quelles sont les méthodes de paiement acceptées ?",
                  a: "Nous acceptons toutes les cartes de crédit majeures (Visa, Mastercard, AMEX) ainsi que les virements SEPA pour les comptes organismes. Tous les paiements sont sécurisés par Stripe."
                },
                {
                  q: "L'offre OF est-elle éligible Qualiopi ?",
                  a: "Oui, notre plateforme est conçue pour répondre point par point aux indicateurs du référentiel national qualité (RNQ / Qualiopi), facilitant grandement vos audits."
                },
                {
                  q: "Y a-t-il une limite de stockage ?",
                  a: "Selon votre plan, vous bénéficiez d'un espace de stockage généreux pour vos vidéos et documents. Si vous avez besoin de plus, des extensions sont disponibles sur demande."
                }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-none bg-slate-50/50 rounded-3xl px-8 transition-all duration-300 hover:bg-slate-50">
                  <AccordionTrigger className="text-left font-bold text-slate-900 text-lg py-8 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed text-base pb-8 font-medium">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Big CTA */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto relative rounded-[40px] bg-slate-900 overflow-hidden px-8 py-20 text-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[120px] -z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] -z-0" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                Prêt à redéfinir <br />
                votre futur ?
              </h2>
              <p className="text-blue-100/70 text-xl max-w-2xl mx-auto mb-12 font-medium">
                Rejoignez la communauté LEARNEEZY et profitez d'outils de pointe pour votre réussite.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-white/90 text-lg font-black h-16 px-10 rounded-2xl shadow-2xl"
                  onClick={() => navigate('/auth/register')}
                >
                  Démarrer Gratuitement
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 text-white hover:bg-white/10 text-lg font-black h-16 px-10 rounded-2xl"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Comparer les offres
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Offers;
