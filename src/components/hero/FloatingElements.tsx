
import React from 'react';
import { Star, Users, Award, TrendingUp, Zap, Target } from 'lucide-react';

const FloatingElements = () => {
  const elements = [
    { icon: Star, top: '20%', left: '10%', delay: '0s', color: 'text-yellow-400' },
    { icon: Users, top: '30%', right: '15%', delay: '0.5s', color: 'text-blue-400' },
    { icon: Award, bottom: '25%', left: '8%', delay: '1s', color: 'text-purple-400' },
    { icon: TrendingUp, top: '60%', right: '20%', delay: '1.5s', color: 'text-green-400' },
    { icon: Zap, top: '15%', right: '30%', delay: '2s', color: 'text-orange-400' },
    { icon: Target, bottom: '40%', right: '10%', delay: '2.5s', color: 'text-pink-400' },
  ];

  return (
    <>
      {elements.map((element, index) => {
        const Icon = element.icon;
        return (
          <div
            key={index}
            className={`absolute ${element.color} opacity-20 animate-float`}
            style={{
              top: element.top,
              left: element.left,
              right: element.right,
              bottom: element.bottom,
              animationDelay: element.delay,
              animationDuration: '4s'
            }}
          >
            <Icon size={32} />
          </div>
        );
      })}
    </>
  );
};

export default FloatingElements;
