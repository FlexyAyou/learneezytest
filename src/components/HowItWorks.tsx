
import React from 'react';
import { Search, BookOpen, Award, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      step: 1,
      icon: Search,
      title: t('howItWorks.discover'),
      description: t('howItWorks.discoverDesc'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      step: 2,
      icon: BookOpen,
      title: t('howItWorks.learn'),
      description: t('howItWorks.learnDesc'),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      step: 3,
      icon: Award,
      title: t('howItWorks.certify'),
      description: t('howItWorks.certifyDesc'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      step: 4,
      icon: Users,
      title: t('howItWorks.evolve'),
      description: t('howItWorks.evolveDesc'),
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Ligne de connexion */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform -translate-x-1/2 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              )}
              
              <div className="relative bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group-hover:border-primary/20">
                {/* Numéro d'étape */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} text-white text-xl font-bold mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {step.step}
                </div>
                
                {/* Icône */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${step.bgColor} mb-4`}>
                  <step.icon className="w-7 h-7 text-gray-700" />
                </div>
                
                {/* Contenu */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            {t('howItWorks.startNow')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
