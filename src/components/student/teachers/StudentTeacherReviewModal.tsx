
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Send } from 'lucide-react';
import { TrainerBooking } from '@/types/trainer-booking';

interface StudentTeacherReviewModalProps {
  bookingId: string;
  booking: TrainerBooking;
  onClose: () => void;
  onSubmit: (reviewData: {
    rating: number;
    comment: string;
    isAnonymous: boolean;
    pedagogyRating?: number;
    communicationRating?: number;
    punctualityRating?: number;
    expertiseRating?: number;
    wouldRecommend?: boolean;
  }) => void;
}

export const StudentTeacherReviewModal: React.FC<StudentTeacherReviewModalProps> = ({
  bookingId,
  booking,
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [pedagogyRating, setPedagogyRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [expertiseRating, setExpertiseRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | undefined>(undefined);
  const [showDetailedRatings, setShowDetailedRatings] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;

    onSubmit({
      rating,
      comment,
      isAnonymous,
      pedagogyRating: showDetailedRatings ? pedagogyRating : undefined,
      communicationRating: showDetailedRatings ? communicationRating : undefined,
      punctualityRating: showDetailedRatings ? punctualityRating : undefined,
      expertiseRating: showDetailedRatings ? expertiseRating : undefined,
      wouldRecommend
    });
  };

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    label: string; 
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star 
              className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} 
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value > 0 ? `${value}/5` : 'Non noté'}
        </span>
      </div>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={booking.trainerPhoto} />
              <AvatarFallback>
                {booking.trainerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div>Évaluer {booking.trainerName}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {booking.subject} • {new Date(booking.sessionDate).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Votre avis nous aide à maintenir la qualité de notre plateforme et aide les autres étudiants dans leur choix.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Note globale */}
          <div className="space-y-4">
            <StarRating 
              value={rating} 
              onChange={setRating} 
              label="Note globale *" 
            />
          </div>

          {/* Évaluations détaillées */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="detailed-ratings"
                checked={showDetailedRatings}
                onCheckedChange={setShowDetailedRatings}
              />
              <Label htmlFor="detailed-ratings">Évaluation détaillée (optionnel)</Label>
            </div>

            {showDetailedRatings && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <StarRating 
                  value={pedagogyRating} 
                  onChange={setPedagogyRating} 
                  label="Pédagogie" 
                />
                <StarRating 
                  value={communicationRating} 
                  onChange={setCommunicationRating} 
                  label="Communication" 
                />
                <StarRating 
                  value={punctualityRating} 
                  onChange={setPunctualityRating} 
                  label="Ponctualité" 
                />
                <StarRating 
                  value={expertiseRating} 
                  onChange={setExpertiseRating} 
                  label="Expertise" 
                />
              </div>
            )}
          </div>

          {/* Recommandation */}
          <div className="space-y-3">
            <Label>Recommanderiez-vous ce professeur ?</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={wouldRecommend === true ? "default" : "outline"}
                onClick={() => setWouldRecommend(true)}
                size="sm"
              >
                Oui
              </Button>
              <Button
                type="button"
                variant={wouldRecommend === false ? "destructive" : "outline"}
                onClick={() => setWouldRecommend(false)}
                size="sm"
              >
                Non
              </Button>
              <Button
                type="button"
                variant={wouldRecommend === undefined ? "secondary" : "outline"}
                onClick={() => setWouldRecommend(undefined)}
                size="sm"
              >
                Ne sais pas
              </Button>
            </div>
          </div>

          {/* Commentaire */}
          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience avec ce professeur..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Votre commentaire aidera les autres étudiants à choisir leur professeur.
            </p>
          </div>

          {/* Anonymat */}
          <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Publier cet avis de manière anonyme
            </Label>
          </div>

          {isAnonymous && (
            <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
              <strong>Mode anonyme :</strong> Votre nom ne sera pas affiché avec cet avis. 
              Seule la mention "Étudiant vérifié" apparaîtra.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Publier l'évaluation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
