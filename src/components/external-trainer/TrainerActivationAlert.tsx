import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface TrainerActivationAlertProps {
  isFirstLogin: boolean;
  onDismiss?: () => void;
}

export const TrainerActivationAlert = ({ 
  isFirstLogin,
  onDismiss 
}: TrainerActivationAlertProps) => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  return (
    <Alert 
      className="mb-6 border-pink-300 bg-pink-50 text-pink-900 animate-in fade-in slide-in-from-top duration-300"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-pink-600 mt-0.5 shrink-0" />
        
        <div className="flex-1 min-w-0">
          <AlertDescription className="text-sm md:text-base">
            {isFirstLogin ? (
              <p className="font-medium mb-2">
                Bienvenue sur Learneezy ! 👋
              </p>
            ) : null}
            <p>
              Votre profil n'est pas encore complet. Merci de renseigner toutes les 
              informations requises afin de valider votre compte formateur. Tant que 
              ces informations ne sont pas complétées, votre compte restera inactif.
            </p>
          </AlertDescription>
          
          <Button
            onClick={() => navigate('/formateur-independant/profil')}
            className="mt-3 bg-pink-600 hover:bg-pink-700 text-white"
            size="sm"
          >
            Compléter mon profil
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-pink-600 hover:text-pink-800 hover:bg-pink-100"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};
