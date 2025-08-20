
import React from 'react';
import { Target, Users, Award, Zap, BookOpen, Globe, Shield, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Target,
      title: t('about.targetedTraining'),
      description: t('about.targetedTrainingDesc'),
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Users,
      title: t('about.recognizedExperts'),
      description: t('about.recognizedExpertsDesc'),
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Award,
      title: t('about.certifications'),
      description: t('about.certificationsDesc'),
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Zap,
      title: t('about.fastLearning'),
      description: t('about.fastLearningDesc'),
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: BookOpen,
      title: t('about.updatedContent'),
      description: t('about.updatedContentDesc'),
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Globe,
      title: t('about.globalAccess'),
      description: t('about.globalAccessDesc'),
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: Shield,
      title: t('about.qualityGuarantee'),
      description: t('about.qualityGuaranteeDesc'),
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Clock,
      title: t('about.totalFlexibility'),
      description: t('about.totalFlexibilityDesc'),
      color: "bg-yellow-100 text-yellow-600"
    }
  ];

  const stats = [
    { number: "50,000+", label: t('about.stats.activeStudents') },
    { number: "1,200+", label: t('about.stats.availableCourses') },
    { number: "95%", label: t('about.stats.satisfaction') },
    { number: "24/7", label: t('about.stats.support') }
  ];

  return (
    <section id="apropos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-b from-white to-gray-50 border border-gray-100"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-pink-600 to-orange-500 rounded-3xl p-12 text-white mb-20 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-pink-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {t('about.mission')}
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('about.missionText')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
