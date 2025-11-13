import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RestoreDraftDialogProps {
  open: boolean;
  onRestore: () => void;
  onDiscard: () => void;
  draftTimestamp: number;
}

export const RestoreDraftDialog: React.FC<RestoreDraftDialogProps> = ({
  open,
  onRestore,
  onDiscard,
  draftTimestamp,
}) => {
  const formattedDate = format(new Date(draftTimestamp), "dd MMMM yyyy 'à' HH:mm", { locale: fr });

  return (
    <Dialog open={open} onOpenChange={() => { }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Brouillon détecté
          </DialogTitle>
          {/* Utiliser DialogDescription uniquement pour un bloc de texte simple afin d'éviter le nesting invalide (<p> dans <p>) */}
          <DialogDescription className="pt-2">
            Un brouillon de cours a été trouvé, sauvegardé le{' '}
            <span className="font-semibold text-foreground">{formattedDate}</span>.
          </DialogDescription>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted p-3">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Les fichiers uploadés (vidéos, images, PDFs) devront être ajoutés à nouveau.
            </p>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onDiscard}
            className="w-full sm:w-auto"
          >
            Recommencer à zéro
          </Button>
          <Button
            onClick={onRestore}
            className="w-full sm:w-auto"
          >
            Restaurer le brouillon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
