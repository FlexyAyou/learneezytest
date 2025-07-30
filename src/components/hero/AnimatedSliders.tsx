
import React, { useState, useEffect } from 'react';

const AnimatedSliders = () => {
  const [currentSlide1, setCurrentSlide1] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [currentSlide3, setCurrentSlide3] = useState(0);

  const slider1Images = [
    {
      src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center',
      title: 'Programmation',
      description: 'Développement web et applications'
    },
    {
      src: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop&crop=center',
      title: 'Code Créatif',
      description: 'Programmation créative et design'
    },
    {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&crop=center',
      title: 'Développement',
      description: 'Projets et applications'
    }
  ];

  const slider2Images = [
    {
      src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop&crop=center',
      title: 'Collaboration',
      description: 'Travail en équipe'
    },
    {
      src: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop&crop=center',
      title: 'Innovation',
      description: 'Idées créatives'
    },
    {
      src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&crop=center',
      title: 'Technologie',
      description: 'Outils modernes'
    }
  ];

  const slider3Images = [
    {
      src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop&crop=center',
      title: 'Recherche',
      description: 'Sciences et données'
    },
    {
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&crop=center',
      title: 'Technologie IA',
      description: 'Intelligence artificielle'
    },
    {
      src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center',
      title: 'Formation',
      description: 'Apprentissage continu'
    }
  ];

  useEffect(() => {
    const interval1 = setInterval(() => {
      setCurrentSlide1((prev) => (prev + 1) % slider1Images.length);
    }, 3000);

    const interval2 = setInterval(() => {
      setCurrentSlide2((prev) => (prev + 1) % slider2Images.length);
    }, 4000);

    const interval3 = setInterval(() => {
      setCurrentSlide3((prev) => (prev + 1) % slider3Images.length);
    }, 5000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
    };
  }, []);

  const SliderComponent = ({ images, currentSlide, className = '' }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 ${className}`}>
      <div 
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full">
            <img 
              src={image.src}
              alt={image.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-white">
              <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
              <p className="text-sm text-gray-300">{image.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicateurs */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-pink-400' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SliderComponent 
        images={slider1Images} 
        currentSlide={currentSlide1}
        className="animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      />
      <SliderComponent 
        images={slider2Images} 
        currentSlide={currentSlide2}
        className="animate-fade-in-up"
        style={{ animationDelay: '0.4s' }}
      />
      <SliderComponent 
        images={slider3Images} 
        currentSlide={currentSlide3}
        className="animate-fade-in-up"
        style={{ animationDelay: '0.6s' }}
      />
    </div>
  );
};

export default AnimatedSliders;
