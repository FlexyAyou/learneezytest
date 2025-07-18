
import React from 'react';
import { Target, Users, Award, Zap, Heart, Globe, BookOpen, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  const features = [
    {
      icon: Target,
      title: "Mission Claire",
      description: "Démocratiser l'accès à l'éducation de qualité et rendre l'apprentissage accessible à tous, partout dans le monde."
    },
    {
      icon: Users,
      title: "Communauté Active",
      description: "Plus de 50,000 apprenants et instructeurs passionnés qui partagent leurs connaissances et s'entraident."
    },
    {
      icon: Award,
      title: "Excellence Reconnue",
      description: "Des certifications reconnues par l'industrie et des partenariats avec les meilleures institutions."
    },
    {
      icon: Zap,
      title: "Innovation Continue",
      description: "Utilisation des dernières technologies et méthodes pédagogiques pour optimiser l'apprentissage."
    }
  ];

  const stats = [
    { icon: Users, number: "50,000+", label: "Étudiants actifs" },
    { icon: BookOpen, number: "1,200+", label: "Cours disponibles" },
    { icon: Globe, number: "45+", label: "Pays représentés" },
    { icon: TrendingUp, number: "95%", label: "Taux de satisfaction" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Fondatrice & CEO",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Ancienne directrice pédagogique chez Educatech, passionnée par l'éducation numérique."
    },
    {
      name: "Marc Dubois",
      role: "CTO & Co-fondateur",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Expert en technologies éducatives avec 15 ans d'expérience dans la tech."
    },
    {
      name: "Elena Rodriguez",
      role: "Directrice Pédagogique",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Docteure en sciences de l'éducation, spécialisée dans l'apprentissage adaptatif."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              À propos d'
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600">
                InfinitiaX
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Nous révolutionnons l'apprentissage en ligne en créant des expériences éducatives 
              exceptionnelles qui transforment des vies et ouvrent de nouveaux horizons.
            </p>
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/35025812-1694-4fb2-aa20-1b03dae12929.png"
                alt="Notre équipe InfinitiaX"
                className="rounded-2xl shadow-xl max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                InfinitiaX est née en 2020 d'une vision simple mais puissante : rendre l'éducation 
                de qualité accessible à tous, peu importe la localisation ou les circonstances.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Fondée par une équipe d'experts passionnés par l'éducation et la technologie, 
                notre plateforme combine innovation pédagogique et excellence technique pour 
                créer des expériences d'apprentissage uniques.
              </p>
              <div className="flex items-center space-x-4">
                <Heart className="h-8 w-8 text-pink-600" />
                <span className="text-lg font-medium text-gray-900">
                  Plus de 1 million d'heures d'apprentissage délivrées
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop"
                alt="Équipe collaborative"
                className="rounded-lg shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=200&fit=crop"
                alt="Innovation technologique"
                className="rounded-lg shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ces valeurs guident chacune de nos décisions et façonnent l'expérience InfinitiaX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:bg-white p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-100 to-orange-100 rounded-xl mb-4 group-hover:from-pink-200 group-hover:to-orange-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">InfinitiaX en Chiffres</h2>
            <p className="text-xl text-pink-100">Notre impact grandissant dans le monde</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-pink-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre équipe */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des experts passionnés dédiés à votre réussite éducative
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-pink-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Chez InfinitiaX, nous croyons que l'éducation est la clé pour débloquer le potentiel humain. 
            Notre mission est de créer un monde où chaque personne peut accéder à une éducation de qualité, 
            développer ses compétences et réaliser ses rêves, peu importe ses origines ou sa situation.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Nous nous engageons à fournir des expériences d'apprentissage innovantes, personnalisées 
            et accessibles qui transforment la façon dont les gens apprennent et grandissent.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
