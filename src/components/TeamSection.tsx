
import React from 'react';
import { Star, Award, Users, BookOpen } from 'lucide-react';

const TeamSection = () => {
  const instructors = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      specialty: 'Développement Web',
      experience: '10 ans',
      image: '/placeholder.svg',
      rating: 4.9,
      students: 2500,
      courses: 12,
      certifications: ['React Expert', 'Node.js Advanced', 'AWS Solutions Architect'],
      description: 'Experte en développement frontend et backend avec une passion pour l\'enseignement.'
    },
    {
      id: 2,
      name: 'Marc Rodriguez',
      specialty: 'Data Science',
      experience: '8 ans',
      image: '/placeholder.svg',
      rating: 4.8,
      students: 1800,
      courses: 8,
      certifications: ['Python Expert', 'Machine Learning', 'Data Analytics'],
      description: 'Data scientist senior avec une approche pratique de l\'apprentissage automatique.'
    },
    {
      id: 3,
      name: 'Julie Martin',
      specialty: 'UX/UI Design',
      experience: '6 ans',
      image: '/placeholder.svg',
      rating: 4.9,
      students: 1200,
      courses: 6,
      certifications: ['Adobe Certified', 'UX Design Master', 'Figma Advanced'],
      description: 'Designer experte avec une vision moderne du design d\'expérience utilisateur.'
    },
    {
      id: 4,
      name: 'Thomas Leroy',
      specialty: 'Cybersécurité',
      experience: '12 ans',
      image: '/placeholder.svg',
      rating: 4.7,
      students: 950,
      courses: 5,
      certifications: ['CISSP', 'CEH', 'Security+'],
      description: 'Expert en cybersécurité avec une expérience terrain en entreprise.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre Équipe Pédagogique
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Apprenez avec des experts reconnus dans leur domaine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                {/* Avatar */}
                <div className="relative mb-6">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-colors duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">{instructor.name}</h3>
                  <p className="text-primary font-medium">{instructor.specialty}</p>
                  <p className="text-sm text-gray-500">{instructor.experience} d'expérience</p>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{instructor.rating}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{instructor.students}</p>
                    <p className="text-xs text-gray-500">Étudiants</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{instructor.courses}</p>
                    <p className="text-xs text-gray-500">Cours</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Award className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{instructor.certifications.length}</p>
                    <p className="text-xs text-gray-500">Certifs</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-4 text-center">
                  {instructor.description}
                </p>

                {/* Certifications */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {instructor.certifications.slice(0, 2).map((cert, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {cert}
                      </span>
                    ))}
                    {instructor.certifications.length > 2 && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        +{instructor.certifications.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            Rejoindre notre équipe
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
