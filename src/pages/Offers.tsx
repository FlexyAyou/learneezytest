import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
        "Certificats de base",
        "Validité : 3 mois"
      ],
      gradient: "from-pink-500 to-purple-500"
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
        "Certificats avancés",
        "Validité : 6 mois"
      ],
      gradient: "from-pink-500 to-purple-500"
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
        "Support 24/7",
        "Validité : 12 mois"
      ],
      gradient: "from-pink-500 to-purple-500"
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
      gradient: "from-pink-500 to-purple-500"
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
      gradient: "from-pink-500 to-purple-500"
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
      gradient: "from-pink-500 to-purple-500"
    }
  ];

  const currentOffers = isOF ? ofOffers : particulierOffers;
  
  const calculatePrice = (offer: any) => {
    const basePrice = isAnnual ? offer.annualPrice : offer.monthlyPrice;
    return isAnnual ? Math.round(basePrice * 0.83) : basePrice; // 17% de réduction annuelle
  };

  const getDiscountPercentage = () => "17%";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-pink-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {isOF ? "Solutions pour Organismes de Formation" : "Nos Offres d'Abonnement"}
              </h1>
              <p className="text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto">
                {isOF 
                  ? "Gérez vos formations et apprenants avec notre plateforme complète"
                  : "Choisissez le pack de crédits qui correspond à vos besoins d'apprentissage"
                }
              </p>
            </div>

            {/* Toggles */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 max-w-4xl mx-auto">
              {/* Toggle Particulier / OF */}
              <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className={`font-medium transition-colors ${!isOF ? 'text-white' : 'text-white/70'}`}>
                  Particulier
                </span>
                <Switch
                  checked={isOF}
                  onCheckedChange={setIsOF}
                  className="data-[state=checked]:bg-white/30"
                />
                <span className={`font-medium transition-colors ${isOF ? 'text-white' : 'text-white/70'}`}>
                  Organisme de Formation
                </span>
              </div>

              {/* Toggle Mensuel / Annuel */}
              <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className={`font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-white/70'}`}>
                  Paiement mensuel
                </span>
                <Switch
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                  className="data-[state=checked]:bg-white/30"
                />
                <span className={`font-medium transition-colors ${isAnnual ? 'text-white' : 'text-white/70'}`}>
                  Paiement annuel
                </span>
                {isAnnual && (
                  <Badge className="bg-yellow-400 text-yellow-900 font-semibold">
                    -{getDiscountPercentage()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        {!isOF && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Comment fonctionnent les crédits ?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Utilisez vos crédits pour accéder aux formations et réserver des créneaux avec nos formateurs
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-10 w-10 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Formations</h3>
                  <p className="text-gray-600">5-20 crédits par cours selon la complexité</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Coaching</h3>
                  <p className="text-gray-600">30-50 crédits par séance individuelle</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-10 w-10 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ateliers</h3>
                  <p className="text-gray-600">15-35 crédits par atelier en groupe</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How OF Works */}
        {isOF && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Pourquoi choisir Learneezy pour votre OF ?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Une plateforme complète pour gérer vos formations, apprenants et être conforme aux exigences qualité
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-10 w-10 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestion LMS</h3>
                  <p className="text-gray-600">Plateforme d'apprentissage complète avec suivi pédagogique</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Conformité</h3>
                  <p className="text-gray-600">Outils pour respecter les exigences Qualiopi et CPF</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-10 w-10 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Automatisation</h3>
                  <p className="text-gray-600">Émargements, certificats et reporting automatisés</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Offers Grid */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {isOF ? "Choisissez votre solution" : "Choisissez votre pack"}
              </h2>
              <p className="text-xl text-gray-600">
                {isOF 
                  ? "Des solutions adaptées à la taille de votre organisme"
                  : "Des offres adaptées à tous vos besoins d'apprentissage"
                }
              </p>
            </div>

            <div className={`grid ${isOF ? 'lg:grid-cols-3' : 'lg:grid-cols-3'} md:grid-cols-2 gap-8`}>
              {currentOffers.map((offer) => (
                <Card 
                  key={offer.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    offer.popular ? 'ring-2 ring-pink-500 shadow-xl' : ''
                  }`}
                >
                  {offer.popular && (
                    <Badge className="absolute top-4 right-4 bg-pink-500 text-white">
                      Populaire
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-2">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${offer.gradient} flex items-center justify-center text-white mx-auto mb-4`}>
                      {offer.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">{offer.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {offer.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <div className="mb-6">
                      {!isOF && (
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {offer.credits}
                          <span className="text-lg text-gray-500 ml-1">crédits</span>
                        </div>
                      )}
                      {isOF && (
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {offer.students}
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {isAnnual && (
                          <span className="text-xl text-gray-500 line-through">
                            {isOF ? offer.monthlyPrice : offer.monthlyPrice}€
                          </span>
                        )}
                        <div className="text-3xl font-bold text-pink-600">
                          {calculatePrice(offer)}€
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {isAnnual ? "par an" : "par mois"} {isOF ? "" : `• ${(calculatePrice(offer) / offer.credits).toFixed(2)}€ par crédit`}
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
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions fréquentes
              </h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mes crédits expirent-ils ?
                </h3>
                <p className="text-gray-600">
                  Oui, chaque pack a une durée de validité indiquée. Vous pouvez prolonger vos crédits en achetant un nouveau pack.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Puis-je transférer mes crédits ?
                </h3>
                <p className="text-gray-600">
                  Les crédits sont liés à votre compte et ne peuvent pas être transférés à un autre utilisateur.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Que se passe-t-il si j'annule une réservation ?
                </h3>
                <p className="text-gray-600">
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