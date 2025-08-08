
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';

const DownloadAppButton = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    // Simulation du téléchargement
    setTimeout(() => setIsAnimating(false), 2000);
    
    // Ici vous pouvez ajouter la logique pour rediriger vers l'App Store ou Google Play
    console.log('Redirection vers le téléchargement de l\'application');
  };

  return (
    <Button
      onClick={handleClick}
      className={`
        fixed bottom-4 left-4 z-50 
        bg-gradient-to-r from-pink-600 to-purple-600 
        hover:from-pink-700 hover:to-purple-700
        text-white shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        transform hover:scale-105
        ${isAnimating ? 'animate-pulse' : 'animate-bounce'}
      `}
      size="sm"
    >
      {isAnimating ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Téléchargement...
        </>
      ) : (
        <>
          <Smartphone className="w-4 h-4 mr-2" />
          <Download className="w-3 h-3 mr-1" />
          App
        </>
      )}
    </Button>
  );
};

export default DownloadAppButton;
