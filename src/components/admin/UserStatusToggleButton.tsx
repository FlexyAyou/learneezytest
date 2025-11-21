import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserCheck, UserX, Loader2 } from 'lucide-react';
import { useUpdateUserStatus } from '@/hooks/useApi';

interface UserStatusToggleButtonProps {
  userId: number;
  currentStatus: string;
  userName: string;
  onStatusChanged?: () => void;
}

export const UserStatusToggleButton: React.FC<UserStatusToggleButtonProps> = ({
  userId,
  currentStatus,
  userName,
  onStatusChanged,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const updateStatus = useUpdateUserStatus();

  useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  const isActive = localStatus === 'active';
  const newStatus = isActive ? 'inactive' : 'active';
  const actionLabel = isActive ? 'Désactiver' : 'Activer';
  const actionDescription = isActive
    ? 'désactivera l\'accès'
    : 'réactivera l\'accès';

  const handleConfirm = () => {
    updateStatus.mutate(
      { userId, status: newStatus },
      {
        onSuccess: () => {
          setLocalStatus(newStatus);
          setIsDialogOpen(false);
          onStatusChanged?.();
        },
      }
    );
  };

  return (
    <>
      <Button
        variant={isActive ? 'destructive' : 'default'}
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        disabled={updateStatus.isPending}
      >
        {updateStatus.isPending ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : isActive ? (
          <UserX className="h-4 w-4 mr-2" />
        ) : (
          <UserCheck className="h-4 w-4 mr-2" />
        )}
        {actionLabel}
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionLabel} l'utilisateur ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action {actionDescription} de <strong>{userName}</strong> à la plateforme.
              {isActive && ' L\'utilisateur ne pourra plus se connecter.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateStatus.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={updateStatus.isPending}
              className={isActive ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {updateStatus.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                `Confirmer`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
