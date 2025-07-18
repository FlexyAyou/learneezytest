
import React from 'react';
import { Target, Users, Award, Zap, BookOpen, Globe, Shield, Clock } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Target,
      title: "Formation Ciblée",
      description: "Des cours conçus pour répondre aux besoins spécifiques du marché du travail actuel.",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Users,
      title: "Experts Reconnus",
      description: "Apprenez avec des professionnels expérimentés et des leaders de l'industrie.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Obtenez des certificats reconnus pour valoriser votre profil professionnel.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Zap,
      title: "Apprentissage Rapide",
      description: "Méthodes d'apprentissage optimisées pour une progression efficace et durable.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: BookOpen,
      title: "Contenu Actualisé",
      description: "Nos formations sont constamment mises à jour selon les dernières tendances.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Globe,
      title: "Accès Global",
      description: "Apprenez depuis n'importe où dans le monde, 24h/24 et 7j/7.",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: Shield,
      title: "Garantie Qualité",
      description: "Satisfaction garantie ou remboursé dans les 30 premiers jours.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Clock,
      title: "Flexibilité Totale",
      description: "Étudiez à votre rythme avec un accès à vie aux contenus.",
      color: "bg-yellow-100 text-yellow-600"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Étudiants actifs" },
    { number: "1,200+", label: "Cours disponibles" },
    { number: "95%", label: "Taux de satisfaction" },
    { number: "24/7", label: "Support disponible" }
  ];

  return (
    <section id="apropos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pourquoi Choisir <span className="text-pink-600">InfinitiaX</span> ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous révolutionnons l'apprentissage en ligne avec une approche moderne, 
            pratique et axée sur les résultats.
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
              Notre Mission
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              Chez <span className="text-pink-600 font-semibold">InfinitiaX</span>, nous croyons que l'éducation est la clé du succès. 
              Notre mission est de démocratiser l'accès à un apprentissage de qualité 
              en offrant des formations pratiques, actuelles et accessibles à tous, 
              partout dans le monde.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
