import React from 'react';
import { Check, Star, Zap, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Offers = () => {
  const offers = [
    {
      id: 1,
      name: "Pack Starter",
      credits: 100,
      price: 29,
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
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      name: "Pack Growth",
      credits: 300,
      price: 79,
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
      gradient: "from-pink-500 to-orange-500"
    },
    {
      id: 3,
      name: "Pack Premium",
      credits: 500,
      price: 120,
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
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      id: 4,
      name: "Pack Enterprise",
      credits: 1000,
      price: 199,
      popular: false,
      icon: <Star className="h-8 w-8" />,
      description: "Solution complète pour les professionnels",
      features: [
        "1000 crédits d'apprentissage",
        "Accès illimité premium",
        "Réservations illimitées",
        "Coaching individuel",
        "Parcours personnalisés",
        "Reporting avancé",
        "Support dédié",
        "Validité : 12 mois"
      ],
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-pink-600 via-orange-600 to-pink-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nos Offres d'Abonnement
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto mb-8">
              Choisissez le pack de crédits qui correspond à vos besoins d'apprentissage
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <Zap className="h-5 w-5 mr-2 text-yellow-300" />
              <span className="font-medium">Système de crédits simple et flexible</span>
            </div>
          </div>
        </div>

        {/* How Credits Work */}
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
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Formations</h3>
                <p className="text-gray-600">5-20 crédits par cours selon la complexité</p>
              </div>
              
              <div className="text-center">
                <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-10 w-10 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Coaching</h3>
                <p className="text-gray-600">30-50 crédits par séance individuelle</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ateliers</h3>
                <p className="text-gray-600">15-35 crédits par atelier en groupe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choisissez votre pack
              </h2>
              <p className="text-xl text-gray-600">
                Des offres adaptées à tous vos besoins d'apprentissage
              </p>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
              {offers.map((offer) => (
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
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {offer.credits}
                        <span className="text-lg text-gray-500 ml-1">crédits</span>
                      </div>
                      <div className="text-3xl font-bold text-pink-600">
                        {offer.price}€
                      </div>
                      <div className="text-sm text-gray-500">
                        {(offer.price / offer.credits).toFixed(2)}€ par crédit
                      </div>
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
                      Choisir ce pack
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