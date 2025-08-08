
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  courseTitle: string;
}

export const CourseRejectionModal = ({ isOpen, onClose, onConfirm, courseTitle }: CourseRejectionModalProps) => {
  const { toast } = useToast();
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une raison pour le rejet.",
        variant: "destructive",
      });
      return;
    }

    onConfirm(reason);
    setReason('');
    onClose();
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Rejeter le cours</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Vous êtes sur le point de rejeter le cours : <strong>"{courseTitle}"</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Raison du rejet *</Label>
            <Textarea
              id="rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez pourquoi ce cours est rejeté. Ces commentaires seront envoyés à l'instructeur..."
              rows={4}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmer le rejet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
