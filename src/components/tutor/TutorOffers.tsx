
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TutorOffersProps {
  currentPlan?: string;
  currentCredits?: number;
}

export const TutorOffers = ({ currentPlan = 'Premium', currentCredits = 342 }: TutorOffersProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAnnual, setIsAnnual] = useState(false);

  const offers = [
    {
      id: 1,
      name: "Pack Starter",
      credits: 200,
      monthlyPrice: 50,
      annualPrice: 500,
      popular: false,
      icon: <Gift className="h-6 w-6" />,
      description: "Idéal pour débuter l'accompagnement",
      features: [
        "200 crédits de tutorat",
        "Suivi de 5 apprenants max",
        "Support par email",
        "Outils de base"
      ],
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700"
    },
    {
      id: 2,
      name: "Pack Premium",
      credits: 500,
      monthlyPrice: 100,
      annualPrice: 1000,
      popular: true,
      icon: <Zap className="h-6 w-6" />,
      description: "Le choix des tuteurs expérimentés",
      features: [
        "500 crédits de tutorat",
        "Suivi illimité d'apprenants",
        "Outils avancés de suivi",
        "Support prioritaire",
        "Rapports détaillés"
      ],
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700"
    },
    {
      id: 3,
      name: "Pack Expert",
      credits: 1000,
      monthlyPrice: 180,
      annualPrice: 1800,
      popular: false,
      icon: <Crown className="h-6 w-6" />,
      description: "Pour les tuteurs professionnels",
      features: [
        "1000 crédits de tutorat",
        "Suivi illimité d'apprenants",
        "Outils de gestion avancés",
        "API d'intégration",
        "Support 24/7",
        "Formation personnalisée"
      ],
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700"
    }
  ];

  const calculatePrice = (offer: any) => {
    if (isAnnual) {
      return Math.round(offer.annualPrice * 0.83);
    }
    return offer.monthlyPrice;
  };

  const calculateCredits = (offer: any) => {
    return isAnnual ? offer.credits * 12 : offer.credits;
  };

  const handleChoosePack = (offerId: number) => {
    navigate('/payment', { 
      state: { 
        offerId, 
        isAnnual, 
        isOF: false,
        offerType: 'tuteur'
      } 
    });
  };

  const handleViewAllOffers = () => {
    navigate('/offres');
  };

  const isCurrentPlan = (offerName: string) => {
    return offerName.toLowerCase().includes(currentPlan.toLowerCase());
  };

  const getRecommendation = () => {
    if (currentCredits < 50) {
      return {
        message: "Vos crédits sont bientôt épuisés. Pensez à renouveler votre abonnement pour continuer à accompagner vos apprenants.",
        type: "warning"
      };
    }
    if (currentCredits > 400) {
      return {
        message: "Vous avez un excellent usage de vos crédits ! Votre plan actuel vous convient parfaitement.",
        type: "success"
      };
    }
    return null;
  };

  const recommendation = getRecommendation();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Nos offres tuteur
            </CardTitle>
            <CardDescription>
              Choisissez le pack adapté à vos besoins d'accompagnement
            </CardDescription>
          </div>
          <Button onClick={handleViewAllOffers} variant="outline" size="sm">
            Voir toutes les offres
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendation && (
          <div className={`p-4 rounded-lg border ${
            recommendation.type === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
          }`}>
            <p className={`text-sm font-medium ${
              recommendation.type === 'warning' ? 'text-orange-800' : 'text-green-800'
            }`}>
              {recommendation.message}
            </p>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !isAnnual 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                isAnnual 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
              {isAnnual && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -17%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <Card 
              key={offer.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${offer.bgColor} ${offer.borderColor} border ${
                offer.popular ? 'ring-2 ring-purple-200' : ''
              } ${
                isCurrentPlan(offer.name) ? 'ring-2 ring-green-200 bg-green-50' : ''
              }`}
            >
              {offer.popular && !isCurrentPlan(offer.name) && (
                <Badge className="absolute -top-2 right-4 bg-purple-500 text-white">
                  Populaire
                </Badge>
              )}
              
              {isCurrentPlan(offer.name) && (
                <Badge className="absolute -top-2 right-4 bg-green-500 text-white">
                  Actuel
                </Badge>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${offer.gradient} flex items-center justify-center text-white mx-auto mb-3`}>
                  {offer.icon}
                </div>
                <CardTitle className={`text-lg font-bold ${offer.textColor}`}>{offer.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {offer.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="mb-4">
                  <div className={`text-2xl font-bold ${offer.textColor} mb-1`}>
                    {calculateCredits(offer)}
                    <span className="text-sm text-muted-foreground ml-1">crédits</span>
                  </div>
                  <div className={`text-xl font-bold ${offer.textColor}`}>
                    {calculatePrice(offer)}€
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isAnnual ? "par an" : "par mois"}
                  </div>
                  {isAnnual && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      Économisez 17%
                    </div>
                  )}
                </div>
                
                <ul className="space-y-2 mb-4 text-left">
                  {offer.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-xs">
                      <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleChoosePack(offer.id)}
                  className={`w-full text-xs py-2 ${
                    isCurrentPlan(offer.name) 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : `bg-gradient-to-r ${offer.gradient} hover:opacity-90`
                  } text-white`}
                  disabled={isCurrentPlan(offer.name)}
                >
                  {isCurrentPlan(offer.name) ? "Plan actuel" : "Choisir ce pack"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
