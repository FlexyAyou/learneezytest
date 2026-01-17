import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

interface TrainerValidationCardProps {
  userId: number;
  userName: string;
  currentStatus: 'active' | 'inactive' | string;
  onValidate: (userId: number) => void;
  onReject: (userId: number, motif: string) => void;
  isLoading?: boolean;
}

export const TrainerValidationCard = ({
  userId,
  userName,
  currentStatus,
  onValidate,
  onReject,
  isLoading = false,
}: TrainerValidationCardProps) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectMotif, setRejectMotif] = useState('');

  // Déterminer si le formateur est validé ou en attente
  const isValidated = currentStatus === 'active';
  const isPending = currentStatus === 'inactive';

  const handleReject = () => {
    if (!rejectMotif.trim()) return;
    onReject(userId, rejectMotif);
    setShowRejectForm(false);
    setRejectMotif('');
  };

  return (
    <Card className="border-2 border-dashed border-orange-300 bg-orange-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-orange-600" />
          Validation du formateur
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="space-y-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">En attente de validation</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Ce formateur n'a pas encore été validé. Vérifiez ses informations et documents avant d'approuver son inscription.
              </AlertDescription>
            </Alert>
            
            {!showRejectForm ? (
              <div className="flex gap-3">
                <Button 
                  onClick={() => onValidate(userId)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Valider le formateur
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => setShowRejectForm(true)}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="Motif du rejet (sera envoyé par email au formateur)..."
                  value={rejectMotif}
                  onChange={(e) => setRejectMotif(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="destructive"
                    onClick={handleReject}
                    disabled={!rejectMotif.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Confirmer le rejet
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectMotif('');
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {isValidated && (
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="h-3 w-3 mr-1" />
              Formateur validé
            </Badge>
            <span className="text-sm text-muted-foreground">
              {userName} peut créer des cours et accéder à la plateforme.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
