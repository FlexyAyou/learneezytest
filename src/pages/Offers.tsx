
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import CourseSection from '@/components/CourseSection';

const Offers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bouton retour */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard/etudiant')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard/etudiant')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Nos Formations</h1>
            <div className="w-32"></div> {/* Spacer pour centrer le titre */}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Découvrez nos formations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choisissez parmi notre large catalogue de formations professionnelles 
            et trouvez le professeur particulier qui vous accompagnera dans votre apprentissage.
          </p>
        </div>
        
        <CourseSection />
      </div>
    </div>
  );
};

export default Offers;
