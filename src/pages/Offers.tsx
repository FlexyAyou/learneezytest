
import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Offers = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isOF, setIsOF] = useState(false); // false = particulier, true = organisme de formation

  const particulierOffers = [
    {
      id: 1,
      name: "Pack Starter",
      credits: 100,
      monthlyPrice: 29,
      annualPrice: 290,
      popular: false,
      icon: <Gift className="h-8 w-8" />,
      description: "Parfait pour débuter votre apprentissage",
      features: [
        "100 crédits d'apprentissage",
        "Accès aux cours de base",
        "Support par email",
        "Certificats de base"
      ],
      gradient: "from-primary to-primary/80"
    },
    {
      id: 2,
      name: "Pack Growth",
      credits: 300,
      monthlyPrice: 79,
      annualPrice: 790,
      popular: true,
      icon: <Zap className="h-8 w-8" />,
      description: "Le choix idéal pour progresser rapidement",
      features: [
        "300 crédits d'apprentissage",
        "Accès à tous les cours",
        "Réservation de créneaux formateurs",
        "Support prioritaire",
        "Certificats avancés"
      ],
      gradient: "from-primary to-primary/80"
    },
    {
      id: 3,
      name: "Pack Premium",
      credits: 500,
      monthlyPrice: 120,
      annualPrice: 1200,
      popular: false,
      icon: <Crown className="h-8 w-8" />,
      description: "L'excellence pour les apprenants exigeants",
      features: [
        "500 crédits d'apprentissage",
        "Accès illimité à tous les cours",
        "Réservations prioritaires",
        "Coaching personnalisé",
        "Certificats premium",
        "Support 24/7"
      ],
      gradient: "from-primary to-primary/80"
    }
  ];

  const ofOffers = [
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
      gradient: "from-primary to-primary/80"
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
      gradient: "from-primary to-primary/80"
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
      gradient: "from-primary to-primary/80"
    }
  ];

  const currentOffers = isOF ? ofOffers : particulierOffers;
  
  const calculatePrice = (offer: any) => {
    if (isAnnual) {
      // Annual pricing is more cost-effective per credit/month
      return Math.round(offer.annualPrice * 0.83); // 17% discount
    }
    return offer.monthlyPrice;
  };

  const calculateCredits = (offer: any) => {
    if (isOF) return null; // OF offers don't use credits
    return isAnnual ? offer.credits * 12 : offer.credits;
  };

  const getDiscountPercentage = () => "17%";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Nos Offres d'Abonnement
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                Choisissez le pack de crédits qui correspond à vos besoins d'apprentissage
              </p>
            </div>
          </div>
        </div>

        {/* How it Works - Particulier */}
        {!isOF && (
          <div className="py-16 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Comment fonctionnent les crédits ?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Utilisez vos crédits pour accéder aux formations et réserver des créneaux avec nos formateurs
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Formations</h3>
                  <p className="text-muted-foreground">5-20 crédits par cours selon la complexité</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Coaching</h3>
                  <p className="text-muted-foreground">30-50 crédits par séance individuelle</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Ateliers</h3>
                  <p className="text-muted-foreground">15-35 crédits par atelier en groupe</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How OF Works */}
        {isOF && (
          <div className="py-16 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Pourquoi choisir Learneezy pour votre OF ?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Une plateforme complète pour gérer vos formations, apprenants et être conforme aux exigences qualité
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Gestion LMS</h3>
                  <p className="text-muted-foreground">Plateforme d'apprentissage complète avec suivi pédagogique</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Conformité</h3>
                  <p className="text-muted-foreground">Outils pour respecter les exigences Qualiopi et CPF</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Automatisation</h3>
                  <p className="text-muted-foreground">Émargements, certificats et reporting automatisés</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Offers Grid */}
        <div className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Choisissez votre pack
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Des offres adaptées à tous vos besoins d'apprentissage
              </p>
            </div>

            {/* Selection Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
              {/* Type Selection */}
              <div className="flex items-center space-x-1 bg-card rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setIsOF(false)}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                    !isOF 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  Particulier
                </button>
                <button
                  onClick={() => setIsOF(true)}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                    isOF 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  Organisme de Formation
                </button>
              </div>

              {/* Billing Period Selection */}
              <div className="flex items-center space-x-1 bg-card rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                    !isAnnual 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-300 relative ${
                    isAnnual 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  Annuel
                  {isAnnual && (
                    <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 font-semibold text-xs px-1 py-0">
                      -{getDiscountPercentage()}
                    </Badge>
                  )}
                </button>
              </div>
            </div>

            <div className={`grid ${isOF ? 'lg:grid-cols-3' : 'lg:grid-cols-3'} md:grid-cols-2 gap-8`}>
              {currentOffers.map((offer) => (
                <Card 
                  key={offer.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    offer.popular ? 'ring-2 ring-primary shadow-xl' : ''
                  }`}
                >
                  {offer.popular && (
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                      Populaire
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-2">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${offer.gradient} flex items-center justify-center text-white mx-auto mb-4`}>
                      {offer.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">{offer.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {offer.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <div className="mb-6">
                      {!isOF && (
                        <div className="text-4xl font-bold text-foreground mb-2">
                          {calculateCredits(offer)}
                          <span className="text-lg text-muted-foreground ml-1">crédits</span>
                        </div>
                      )}
                      {isOF && (
                        <div className="text-2xl font-bold text-foreground mb-2">
                          {offer.students}
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {isAnnual && (
                          <span className="text-xl text-muted-foreground line-through">
                            {isOF ? offer.annualPrice : offer.annualPrice}€
                          </span>
                        )}
                        <div className="text-3xl font-bold text-primary">
                          {calculatePrice(offer)}€
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isAnnual ? "par an" : "par mois"} {isOF ? "" : `• ${(calculatePrice(offer) / calculateCredits(offer)).toFixed(3)}€ par crédit`}
                      </div>
                      {isAnnual && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          Économisez {getDiscountPercentage()}
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8 text-left">
                      {offer.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${offer.gradient} hover:opacity-90 text-white font-semibold py-3`}
                    >
                      {isOF ? "Démarrer gratuitement" : "Choisir ce pack"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Questions fréquentes
              </h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Mes crédits expirent-ils ?
                </h3>
                <p className="text-muted-foreground">
                  {isOF ? "Non, vos accès à la plateforme sont renouvelés automatiquement selon votre abonnement." : "Non, vos crédits n'expirent pas et restent disponibles tant que votre compte est actif."}
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Puis-je transférer mes crédits ?
                </h3>
                <p className="text-muted-foreground">
                  Les crédits sont liés à votre compte et ne peuvent pas être transférés à un autre utilisateur.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Que se passe-t-il si j'annule une réservation ?
                </h3>
                <p className="text-muted-foreground">
                  Les crédits sont remboursés sur votre compte si vous annulez au moins 24h avant le créneau réservé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Offers;
