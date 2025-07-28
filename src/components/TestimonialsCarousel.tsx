
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Développeuse Frontend',
      company: 'TechCorp',
      image: '/placeholder.svg',
      rating: 5,
      content: 'Grâce à Learneezy, j\'ai pu me reconvertir dans le développement web. Les cours sont excellents et les formateurs très compétents.',
      course: 'Formation React.js Avancé'
    },
    {
      id: 2,
      name: 'Jean Dupont',
      role: 'Chef de Projet',
      company: 'Innovation Ltd',
      image: '/placeholder.svg',
      rating: 5,
      content: 'La plateforme est intuitive et les contenus sont de qualité. J\'ai obtenu ma certification en gestion de projet rapidement.',
      course: 'Certification PMP'
    },
    {
      id: 3,
      name: 'Marie Dubois',
      role: 'UX Designer',
      company: 'Design Studio',
      image: '/placeholder.svg',
      rating: 5,
      content: 'Les formations UX/UI sont remarquables. J\'ai pu monter en compétences et décrocher mon poste actuel.',
      course: 'Formation UX Design'
    },
    {
      id: 4,
      name: 'Pierre Lambert',
      role: 'Data Analyst',
      company: 'DataCorp',
      image: '/placeholder.svg',
      rating: 5,
      content: 'Excellente expérience ! Les cours de data science sont très pratiques avec de vrais cas d\'usage.',
      course: 'Formation Data Science'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ce que disent nos apprenants
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les témoignages de ceux qui ont transformé leur carrière avec nos formations
          </p>
        </div>

        <div 
          className="relative bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100 overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Quote decoration */}
          <div className="absolute top-6 right-6 opacity-10">
            <Quote className="w-16 h-16 text-primary" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar and info */}
            <div className="flex-shrink-0 text-center md:text-left">
              <div className="relative">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-24 h-24 rounded-full mx-auto md:mx-0 object-cover border-4 border-primary/20"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-bold">{currentTestimonial.rating}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold text-lg text-gray-900">{currentTestimonial.name}</h4>
                <p className="text-gray-600">{currentTestimonial.role}</p>
                <p className="text-sm text-gray-500">{currentTestimonial.company}</p>
                
                {/* Rating stars */}
                <div className="flex justify-center md:justify-start mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < currentTestimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
                "{currentTestimonial.content}"
              </blockquote>
              
              <div className="bg-primary/5 rounded-lg p-3 inline-block">
                <p className="text-sm text-primary font-medium">
                  Formation suivie : {currentTestimonial.course}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
