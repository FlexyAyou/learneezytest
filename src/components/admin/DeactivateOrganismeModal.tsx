
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Power } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeactivateOrganismeModalProps {
  isOpen: boolean;
  onClose: () => void;
  organisme: {
    id: string;
    name: string;
    isActive: boolean;
  };
  onConfirm: (organismeId: string, reason: string) => void;
}

export const DeactivateOrganismeModal = ({ isOpen, onClose, organisme, onConfirm }: DeactivateOrganismeModalProps) => {
  const { toast } = useToast();
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer une raison pour la désactivation.",
        variant: "destructive",
      });
      return;
    }

    onConfirm(organisme.id, reason);
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-orange-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {organisme.isActive ? 'Désactiver' : 'Activer'} l'organisme
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {organisme.isActive 
                ? `Vous êtes sur le point de désactiver l'organisme "${organisme.name}". Cette action empêchera l'accès à la plateforme pour tous les utilisateurs de cet organisme.`
                : `Vous êtes sur le point d'activer l'organisme "${organisme.name}". Cet organisme pourra à nouveau accéder à la plateforme.`
              }
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="reason">
              Raison de la {organisme.isActive ? 'désactivation' : 'activation'} *
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={organisme.isActive 
                ? "Indiquez la raison de la désactivation (ex: non-paiement, violation des conditions...)"
                : "Indiquez la raison de l'activation (ex: problème résolu, nouveau contrat...)"
              }
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => {
              setReason('');
              onClose();
            }}>
              Annuler
            </Button>
            <Button 
              variant={organisme.isActive ? "destructive" : "default"}
              onClick={handleConfirm}
            >
              <Power className="h-4 w-4 mr-2" />
              {organisme.isActive ? 'Désactiver' : 'Activer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
