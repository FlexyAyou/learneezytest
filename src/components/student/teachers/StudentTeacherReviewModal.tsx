import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StudentTeacherReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: any;
  onSubmit: (reviewData: {
    rating: number;
    comment: string;
    isAnonymous: boolean;
  }) => void;
}

export const StudentTeacherReviewModal: React.FC<StudentTeacherReviewModalProps> = ({
  open,
  onOpenChange,
  session,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (session) {
      setRating(session.rating || 0);
      setComment(session.review || '');
      setIsAnonymous(session.isAnonymousReview || false);
    }
  }, [session]);

  const handleSubmit = () => {
    if (rating === 0) {
      return; // Require at least 1 star
    }

    onSubmit({
      rating,
      comment: comment.trim(),
      isAnonymous
    });

    // Reset form
    setRating(0);
    setComment('');
    setIsAnonymous(false);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      const isActive = starNumber <= (hoveredRating || rating);

      return (
        <Star
          key={i}
          className={`h-8 w-8 cursor-pointer transition-colors ${
            isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
          }`}
          onClick={() => setRating(starNumber)}
          onMouseEnter={() => setHoveredRating(starNumber)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      );
    });
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {session.rating ? 'Modifier mon avis' : 'Évaluer le professeur'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Teacher Info */}
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={session.trainerPhoto} />
              <AvatarFallback>{session.trainerName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{session.trainerName}</h4>
              <p className="text-sm text-muted-foreground">
                {session.subject} - {new Date(session.sessionDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Note *</Label>
            <div className="flex space-x-1">
              {renderStars()}
            </div>
            <p className="text-sm text-muted-foreground">
              {rating > 0 && (
                <>
                  {rating === 1 && "Très décevant"}
                  {rating === 2 && "Décevant"}
                  {rating === 3 && "Correct"}
                  {rating === 4 && "Bien"}
                  {rating === 5 && "Excellent"}
                </>
              )}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience avec ce professeur..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          {/* Anonymous option */}
          <div className="flex items-center space-x-2">
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
            <p className="text-xs text-muted-foreground">
              Votre nom ne sera pas visible publiquement, mais votre avis contribuera à la note globale du professeur.
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={rating === 0}
            >
              {session.rating ? 'Modifier l\'avis' : 'Publier l\'avis'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};