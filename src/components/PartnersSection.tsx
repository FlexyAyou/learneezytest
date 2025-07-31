
import React from 'react';
import { ExternalLink, Shield, Award } from 'lucide-react';

const PartnersSection = () => {
  const partners = [
    { name: 'Microsoft', logo: '/lovable-uploads/microsoft-logo.png' },
    { name: 'Google', logo: '/lovable-uploads/google-logo.png' },
    { name: 'AWS', logo: '/lovable-uploads/aws-logo.png' },
    { name: 'Adobe', logo: '/lovable-uploads/adobe-logo.png' },
    { name: 'Salesforce', logo: '/lovable-uploads/salesforce-logo.png' },
    { name: 'IBM', logo: '/lovable-uploads/ibm-logo.png' },
    { name: 'Oracle', logo: '/lovable-uploads/oracle-logo.png' },
    { name: 'Meta', logo: '/lovable-uploads/meta-logo.png' }
  ];

  const certifications = [
    {
      name: 'Qualiopi',
      icon: Shield,
      description: 'Certification qualité des organismes de formation',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Datadock',
      icon: Award,
      description: 'Référencement qualité des organismes de formation',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'OPCO',
      icon: ExternalLink,
      description: 'Référencé par les principaux OPCO',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Partenaires */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Partenaires Technologiques
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nous collaborons avec les leaders du marché pour vous offrir les meilleures formations
          </p>
        </div>

        {/* Logos qui défilent */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-16">
          <div className="flex animate-scroll space-x-12">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Nos Certifications Qualité
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre garantie de qualité et de reconnaissance professionnelle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${cert.bgColor} mb-4`}>
                <cert.icon className={`w-8 h-8 ${cert.color}`} />
              </div>
              
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{cert.name}</h4>
              <p className="text-gray-600">{cert.description}</p>
              
              <div className="mt-6">
                <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Certifié</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Témoignages d'entreprises */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Ils nous font confiance
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                "Learneezy nous a permis de former nos équipes efficacement. La qualité des formations est remarquable."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">TC</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">TechCorp</p>
                  <p className="text-sm text-gray-600">Directeur RH</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                "Un partenaire de confiance pour la montée en compétences de nos collaborateurs."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">IL</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Innovation Ltd</p>
                  <p className="text-sm text-gray-600">CEO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
