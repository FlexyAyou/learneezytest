
import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const KeyFigures = () => {
  const [counts, setCounts] = useState({
    students: 0,
    courses: 0,
    certificates: 0,
    satisfaction: 0
  });

  const finalCounts = {
    students: 50000,
    courses: 1200,
    certificates: 25000,
    satisfaction: 98
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = duration / steps;

    const timer = setInterval(() => {
      setCounts(prev => ({
        students: Math.min(prev.students + Math.ceil(finalCounts.students / steps), finalCounts.students),
        courses: Math.min(prev.courses + Math.ceil(finalCounts.courses / steps), finalCounts.courses),
        certificates: Math.min(prev.certificates + Math.ceil(finalCounts.certificates / steps), finalCounts.certificates),
        satisfaction: Math.min(prev.satisfaction + Math.ceil(finalCounts.satisfaction / steps), finalCounts.satisfaction)
      }));
    }, increment);

    setTimeout(() => clearInterval(timer), duration);

    return () => clearInterval(timer);
  }, []);

  const figures = [
    {
      icon: Users,
      count: counts.students,
      suffix: '+',
      label: 'Étudiants formés',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BookOpen,
      count: counts.courses,
      suffix: '+',
      label: 'Cours disponibles',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Award,
      count: counts.certificates,
      suffix: '+',
      label: 'Certificats délivrés',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      count: counts.satisfaction,
      suffix: '%',
      label: 'Taux de satisfaction',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Chiffres Clés
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez l'impact de notre plateforme sur la formation professionnelle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {figures.map((figure, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${figure.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <figure.icon className={`w-8 h-8 ${figure.color}`} />
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    {figure.count.toLocaleString()}
                  </span>
                  <span className="text-2xl font-semibold text-gray-600 ml-1">
                    {figure.suffix}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">{figure.label}</p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFigures;
