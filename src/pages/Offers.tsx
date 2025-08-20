
import React, { useState } from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

const Offers = () => {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: t('offers.basicPlan'),
      description: t('offers.basicDesc'),
      monthlyPrice: 29,
      yearlyPrice: 299,
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      features: [
        t('offers.basicCourses'),
        t('offers.certificates'),
        t('common.support'),
        t('offers.community')
      ]
    },
    {
      name: t('offers.premiumPlan'),
      description: t('offers.premiumDesc'),
      monthlyPrice: 49,
      yearlyPrice: 499,
      icon: Crown,
      color: 'from-pink-500 to-pink-600',
      popular: true,
      features: [
        t('offers.allCourses'),
        t('offers.downloadableContent'),
        t('offers.prioritySupport'),
        t('offers.liveWebinars'),
        t('offers.certificates')
      ]
    },
    {
      name: t('offers.proPlan'),
      description: t('offers.proDesc'),
      monthlyPrice: 99,
      yearlyPrice: 999,
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      features: [
        t('offers.premiumCourses'),
        t('offers.personalMentor'),
        t('offers.prioritySupport'),
        t('offers.liveWebinars'),
        t('offers.downloadableContent'),
        t('offers.certificates')
      ]
    }
  ];

  const getPrice = (plan: any) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: any) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    const savings = Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
    return savings;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-600 to-orange-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('offers.title')}
              </h1>
              <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                {t('offers.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Toggle */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg font-medium ${!isYearly ? 'text-pink-600' : 'text-gray-500'}`}>
                {t('offers.monthly')}
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-pink-600"
              />
              <span className={`text-lg font-medium ${isYearly ? 'text-pink-600' : 'text-gray-500'}`}>
                {t('offers.yearly')}
              </span>
              {isYearly && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {t('offers.save')} 20%
                </span>
              )}
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => {
                const Icon = plan.icon;
                const price = getPrice(plan);
                const savings = getSavings(plan);
                
                return (
                  <div
                    key={index}
                    className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      plan.popular ? 'border-pink-500 scale-105' : 'border-gray-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {t('offers.popular')}
                        </span>
                      </div>
                    )}

                    <div className="p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-8">
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-gray-900">€{price}</span>
                          <span className="text-gray-500 ml-2">
                            /{isYearly ? t('offers.yearly').toLowerCase() : t('offers.monthly').toLowerCase()}
                          </span>
                        </div>
                        {isYearly && (
                          <p className="text-green-600 text-sm mt-2">
                            {t('offers.save')} {savings}% {t('offers.yearly').toLowerCase()}
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-pink-600 hover:bg-pink-700'
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                      >
                        {t('offers.choosePlan')}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                Tous les plans incluent un accès de 30 jours ou remboursé
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Annulation facile
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Paiement sécurisé
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Support 24/7
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions Fréquentes
              </h2>
              <p className="text-gray-600">
                Trouvez les réponses aux questions les plus courantes sur nos offres
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Puis-je changer de plan à tout moment ?
                </h3>
                <p className="text-gray-600">
                  Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. 
                  Les changements prennent effet immédiatement.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Y a-t-il une période d'essai gratuite ?
                </h3>
                <p className="text-gray-600">
                  Nous offrons une garantie de remboursement de 30 jours sur tous nos plans. 
                  Si vous n'êtes pas satisfait, nous vous remboursons intégralement.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Les certificats sont-ils reconnus ?
                </h3>
                <p className="text-gray-600">
                  Oui, tous nos certificats sont reconnus par l'industrie et peuvent être 
                  ajoutés à votre profil LinkedIn ou CV.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Offers;
