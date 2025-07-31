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
      image: "/lovable-uploads/hero-white-man-professional.png",
      gradient: "from-pink-600 to-orange-600",
      bgGradient: "from-pink-50 via-white to-orange-50"
    },
    {
      title: "Maîtrisez",
      highlight: "l'art du code",
      subtitle: "en toute simplicité",
      description: "Des cours de programmation pour tous les niveaux. JavaScript, Python, React et bien plus encore.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      gradient: "from-blue-600 to-purple-600",
      bgGradient: "from-blue-50 via-white to-purple-50"
    },
    {
      title: "Rejoignez",
      highlight: "notre communauté",
      subtitle: "d'apprenants",
      description: "Plus de 50 000 étudiants nous font confiance. Échangez, partagez et progressez ensemble.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      gradient: "from-green-600 to-teal-600",
      bgGradient: "from-green-50 via-white to-teal-50"
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
      className={`pt-20 bg-gradient-to-br ${currentSlideData.bgGradient} min-h-screen flex items-center relative overflow-hidden transition-all duration-1000 ease-in-out`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-200/10 to-teal-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
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
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
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
                <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 animate-fade-in delay-500">
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
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300 hover:shadow-md">
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
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`} />
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 text-center lg:text-left animate-fade-in delay-1000">
              <div className="flex flex-col items-center lg:items-start transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-1 text-yellow-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">4.9/5 étoiles</p>
              </div>
              <div className="flex flex-col items-center lg:items-start transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center text-pink-600 mb-1">
                  <Users className="h-5 w-5 mr-1" />
                  <span className="font-bold text-lg">50k+</span>
                </div>
                <p className="text-sm text-gray-600">Étudiants actifs</p>
              </div>
              <div className="flex flex-col items-center lg:items-start transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center text-orange-600 mb-1">
                  <Award className="h-5 w-5 mr-1" />
                  <span className="font-bold text-lg">1000+</span>
                </div>
                <p className="text-sm text-gray-600">Cours disponibles</p>
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
                  <img
                    src={currentSlideData.image}
                    alt={`${currentSlideData.title} ${currentSlideData.highlight}`}
                    className="rounded-2xl shadow-2xl w-full transform group-hover:scale-105 transition-all duration-500 group-hover:shadow-3xl"
                  />
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-lg p-4 shadow-lg animate-bounce">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">12,543 en ligne</span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text text-transparent`}>
                        98%
                      </div>
                      <div className="text-xs text-gray-600">Taux de réussite</div>
                    </div>
                  </div>

                  {/* Decorative gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${currentSlideData.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group z-10"
              aria-label="Slide précédent"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700 group-hover:text-pink-600 transition-colors duration-300" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group z-10"
              aria-label="Slide suivant"
            >
              <ChevronRight className="h-6 w-6 text-gray-700 group-hover:text-pink-600 transition-colors duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
