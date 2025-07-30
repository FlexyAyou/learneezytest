
import React, { useState, useEffect } from 'react';

interface GeometricMorphingProps {
  animationSpeed: number;
  colorIntensity: number;
  shapeComplexity: number;
}

const GeometricMorphing: React.FC<GeometricMorphingProps> = ({
  animationSpeed,
  colorIntensity,
  shapeComplexity
}) => {
  const [currentShape, setCurrentShape] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape(prev => (prev + 1) % 4);
    }, 4000 / animationSpeed);

    return () => clearInterval(interval);
  }, [animationSpeed]);

  const shapes = [
    // Circle
    `M 50 10 
     A 40 40 0 0 1 90 50 
     A 40 40 0 0 1 50 90 
     A 40 40 0 0 1 10 50 
     A 40 40 0 0 1 50 10 Z`,
    
    // Triangle
    `M 50 10 
     L ${90 - (shapeComplexity * 5)} ${80 + (shapeComplexity * 2)} 
     L ${10 + (shapeComplexity * 5)} ${80 + (shapeComplexity * 2)} 
     Z`,
    
    // Pentagon
    `M 50 10 
     L ${78 + (shapeComplexity * 2)} 35 
     L ${69 + (shapeComplexity * 3)} 75 
     L ${31 - (shapeComplexity * 3)} 75 
     L ${22 - (shapeComplexity * 2)} 35 
     Z`,
    
    // Star
    `M 50 10 
     L ${57 + shapeComplexity} ${35 - shapeComplexity} 
     L 85 40 
     L ${65 + shapeComplexity} ${57 + shapeComplexity} 
     L 75 85 
     L 50 70 
     L 25 85 
     L ${35 - shapeComplexity} ${57 + shapeComplexity} 
     L 15 40 
     L ${43 - shapeComplexity} ${35 - shapeComplexity} 
     Z`
  ];

  const colors = [
    `hsl(${330 + (colorIntensity * 20)} 81% 60%)`, // Pink variant
    `hsl(${250 + (colorIntensity * 15)} 85% 65%)`, // Purple variant
    `hsl(${200 + (colorIntensity * 25)} 80% 70%)`, // Blue variant
    `hsl(${300 + (colorIntensity * 10)} 75% 65%)`  // Magenta variant
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large morphing shape */}
      <svg 
        className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[currentShape]} />
            <stop offset="100%" stopColor={colors[(currentShape + 1) % colors.length]} />
          </linearGradient>
        </defs>
        <path
          d={shapes[currentShape]}
          fill="url(#gradient1)"
          className="transition-all duration-1000 ease-in-out"
          style={{
            filter: `blur(${2 - (colorIntensity * 0.3)}px)`,
            animationDuration: `${4 / animationSpeed}s`
          }}
        />
      </svg>

      {/* Medium morphing shape */}
      <svg 
        className="absolute top-1/2 right-1/4 w-64 h-64 opacity-15"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[(currentShape + 1) % colors.length]} />
            <stop offset="100%" stopColor={colors[(currentShape + 2) % colors.length]} />
          </linearGradient>
        </defs>
        <path
          d={shapes[(currentShape + 1) % shapes.length]}
          fill="url(#gradient2)"
          className="transition-all duration-1000 ease-in-out"
          style={{
            filter: `blur(${1.5 - (colorIntensity * 0.2)}px)`,
            animationDuration: `${3 / animationSpeed}s`
          }}
        />
      </svg>

      {/* Small morphing shapes */}
      <svg 
        className="absolute top-3/4 left-1/2 w-32 h-32 opacity-25"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[(currentShape + 2) % colors.length]} />
            <stop offset="100%" stopColor={colors[(currentShape + 3) % colors.length]} />
          </linearGradient>
        </defs>
        <path
          d={shapes[(currentShape + 2) % shapes.length]}
          fill="url(#gradient3)"
          className="transition-all duration-1000 ease-in-out"
          style={{
            filter: `blur(${1 - (colorIntensity * 0.1)}px)`,
            animationDuration: `${2 / animationSpeed}s`
          }}
        />
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: Math.floor(shapeComplexity * 10) }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: colors[i % colors.length],
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GeometricMorphing;
