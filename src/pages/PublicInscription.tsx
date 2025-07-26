import React from 'react';
import InscriptionForm from './student/InscriptionForm';

const PublicInscription = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Inscription à nos formations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Inscrivez-vous facilement à nos formations avec signature électronique intégrée. 
            Recevez automatiquement tous les documents nécessaires.
          </p>
        </div>
        
        <InscriptionForm />
      </div>
    </div>
  );
};

export default PublicInscription;