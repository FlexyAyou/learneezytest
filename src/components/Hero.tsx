
import React, { useState, useEffect } from 'react';
import { Play, Star, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      title: "Développez vos",
      highlight: "compétences", 
      subtitle: "avec Learneezy",
      description: "Accédez à plus de 1000 cours en ligne créés par des experts. Apprenez à votre rythme et obtenez des certifications reconnues.",
      gradient: "from-pink-600 to-orange-600",
    },
    {
      title: "Maîtrisez",
      highlight: "l'art du code",
      subtitle: "en toute simplicité",
      description: "Des cours de programmation pour tous les niveaux. JavaScript, Python, React et bien plus encore.",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "Rejoignez",
      highlight: "notre communauté",
      subtitle: "d'apprenants",
      description: "Plus de 50 000 étudiants nous font confiance. Échangez, partagez et progressez ensemble.",
      gradient: "from-green-600 to-teal-600",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSlideChange = (newSlide) => {
    if (typeof newSlide === 'function') {
      newSlide = newSlide(currentSlide);
    }
    
    if (newSlide !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(newSlide);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }
  };

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    handleSlideChange(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      id="accueil" 
      className="pt-20 min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eed653c1358a2d1d20e97f0b1ea2b6fd74325&profile_id=165&oauth2_token_id=57447761" type="video/mp4" />
        </video>
        {/* Dark overlay - plus transparent pour voir la vidéo */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left relative">
            <div className="relative min-h-[200px] flex items-center">
              <div
                className={`transition-all duration-700 ease-out transform ${
                  isTransitioning 
                    ? 'opacity-0 translate-y-8 scale-95' 
                    : 'opacity-100 translate-y-0 scale-100'
                }`}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  <span className="inline-block animate-fade-in">
                    {currentSlideData.title}
                  </span>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentSlideData.gradient} inline-block animate-fade-in delay-150`}>
                    {" "}{currentSlideData.highlight}
                  </span>
                  <span className="inline-block animate-fade-in delay-300">
                    {" "}{currentSlideData.subtitle}
                  </span>
                </h1>
                <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0 animate-fade-in delay-500">
                  {currentSlideData.description}
                </p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in delay-700">
              <Link to="/offres">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  Voir nos offres
                </Button>
              </Link>
              <Link to="/nos-formations">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300 hover:shadow-md border-white text-white hover:bg-white/20 hover:text-white hover:border-white bg-white/10 backdrop-blur-sm"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Voir nos formations
                </Button>
              </Link>
            </div>

            {/* Slide Indicators */}
            <div className="mt-8 flex justify-center lg:justify-start space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative transition-all duration-500 ${
                    index === currentSlide 
                      ? 'w-8 h-3' 
                      : 'w-3 h-3 hover:w-4'
                  }`}
                  aria-label={`Aller au slide ${index + 1}`}
                >
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    index === currentSlide 
                      ? `bg-gradient-to-r ${currentSlideData.gradient} shadow-lg` 
                      : 'bg-white/40 hover:bg-white/60'
                  }`} />
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 text-center lg:text-left animate-fade-in delay-1000">
              <div className="flex flex-col items-center lg:items-start transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-1 text-yellow-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                  ))}
                </div>
                <p className="text-sm text-gray-300">4.9/5 étoiles</p>
              </div>
              <div className="flex flex-col items-center lg:items-start transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center text-pink-400 mb-1">
                  <Users className="h-5 w-5 mr-1" />
                  <span className="font-bold text-lg text-white">50k+</span>
                </div>
                <p className="text-sm text-gray-300">Étudiants actifs</p>
              </div>
              <div className="flex flex-col items-center lg:items-start transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center text-orange-400 mb-1">
                  <Award className="h-5 w-5 mr-1" />
                  <span className="font-bold text-lg text-white">1000+</span>
                </div>
                <p className="text-sm text-gray-300">Cours disponibles</p>
              </div>
            </div>
          </div>

          {/* Image with Navigation */}
          <div className="mt-12 lg:mt-0 relative">
            <div className="relative min-h-[400px] flex items-center justify-center">
              <div
                className={`transition-all duration-700 ease-out transform ${
                  isTransitioning 
                    ? 'opacity-0 translate-x-8 scale-95 rotate-1' 
                    : 'opacity-100 translate-x-0 scale-100 rotate-0'
                }`}
              >
                <div className="relative group">
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg animate-bounce">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-800">12,543 en ligne</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text text-transparent`}>
                        98%
                      </div>
                      <div className="text-xs text-gray-600">Taux de réussite</div>
                    </div>
                  </div>

                  {/* Central content area with glass effect */}
                  <div className="w-96 h-64 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Plateforme d'apprentissage</h3>
                      <p className="text-sm text-gray-200">Interactive et moderne</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white/30 hover:scale-110 transition-all duration-300 group z-10"
              aria-label="Slide précédent"
            >
              <ChevronLeft className="h-6 w-6 text-white group-hover:text-pink-400 transition-colors duration-300" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white/30 hover:scale-110 transition-all duration-300 group z-10"
              aria-label="Slide suivant"
            >
              <ChevronRight className="h-6 w-6 text-white group-hover:text-pink-400 transition-colors duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
