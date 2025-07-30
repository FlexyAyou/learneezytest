
import React, { useState, useEffect } from 'react';
import { Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ParticleBackground from './hero/ParticleBackground';
import AnimatedText from './hero/AnimatedText';
import FloatingElements from './hero/FloatingElements';
import AnimatedSliders from './hero/AnimatedSliders';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      id="accueil" 
      className="relative pt-20 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Floating Elements */}
      <FloatingElements />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/20 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
              <span className="block">Développez vos</span>
              <AnimatedText
                text="compétences"
                className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
                delay={500}
              />
              <span className="block">avec Learneezy</span>
            </h1>
          </div>

          {/* Description */}
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Accédez à plus de <span className="text-pink-400 font-semibold">1000 cours</span> en ligne 
              créés par des experts. Apprenez à votre rythme et obtenez des 
              <span className="text-purple-400 font-semibold"> certifications reconnues</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/inscription">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg px-10 py-4 rounded-full shadow-2xl shadow-pink-500/25 transform hover:scale-105 transition-all duration-300 hover:shadow-pink-500/40"
                >
                  <span className="relative z-10 flex items-center">
                    Commencer gratuitement
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <Link to="/cours">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group text-lg px-10 py-4 rounded-full border-2 border-emerald-400/50 text-white hover:border-emerald-400 hover:bg-emerald-400/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"
                >
                  <Play className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Découvrir nos cours
                </Button>
              </Link>
            </div>
          </div>

          {/* Animated Sliders */}
          <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8">Explorez nos domaines de formation</h3>
              <AnimatedSliders />
            </div>
          </div>

          {/* Stats Cards */}
          <div className={`transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { number: '50K+', label: 'Étudiants actifs', icon: '👥' },
                { number: '1000+', label: 'Cours disponibles', icon: '📚' },
                { number: '4.9/5', label: 'Note moyenne', icon: '⭐' },
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
