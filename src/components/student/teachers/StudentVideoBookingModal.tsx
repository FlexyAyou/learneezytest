
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video, Star, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface StudentVideoBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: any;
}

export const StudentVideoBookingModal = ({ isOpen, onClose, teacher }: StudentVideoBookingModalProps) => {
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [sessionType, setSessionType] = useState<'1-on-1' | 'group'>('1-on-1');
  const [notes, setNotes] = useState('');

  if (!teacher) return null;

  // Mock available video slots
  const availableSlots = [
    { day: 'Lundi 29 Janvier', time: '09:00 - 10:00' },
    { day: 'Lundi 29 Janvier', time: '14:00 - 15:00' },
    { day: 'Mardi 30 Janvier', time: '10:00 - 11:00' },
    { day: 'Mercredi 31 Janvier', time: '16:00 - 17:00' },
    { day: 'Jeudi 1 Février', time: '09:00 - 10:00' },
    { day: 'Vendredi 2 Février', time: '15:00 - 16:00' },
  ];

  const handleBooking = () => {
    if (!selectedSlot) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un créneau",
        variant: "destructive",
      });
      return;
    }

    // Mock booking logic
    toast({
      title: "Visioconférence réservée !",
      description: `Votre séance avec ${teacher.name} est confirmée pour ${selectedSlot.day} de ${selectedSlot.time}`,
    });

    onClose();
    setSelectedSlot(null);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Video className="h-5 w-5 text-primary" />
            Réserver une visioconférence avec {teacher.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Teacher Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Informations du professeur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={teacher.photo} />
                  <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{teacher.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{teacher.rating}</span>
                    <span className="text-muted-foreground">({teacher.totalReviews} avis)</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{teacher.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    {teacher.subjects.map((subject) => (
                      <Badge key={subject} variant="default">{subject}</Badge>
                    ))}
                    <Badge variant="outline">{teacher.hourlyRate}€/h</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Type de séance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setSessionType('1-on-1')}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                    sessionType === '1-on-1'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Cours particulier</div>
                  <div className="text-sm text-muted-foreground">Séance individuelle personnalisée</div>
                  <div className="text-sm font-medium text-primary mt-1">{teacher.hourlyRate}€/h</div>
                </button>
                <button
                  onClick={() => setSessionType('group')}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                    sessionType === 'group'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Cours en groupe</div>
                  <div className="text-sm text-muted-foreground">Séance avec d'autres élèves</div>
                  <div className="text-sm font-medium text-primary mt-1">{Math.round(teacher.hourlyRate * 0.7)}€/h</div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Available Slots */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Créneaux disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      selectedSlot === slot
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{slot.day}</div>
                    <div className="text-sm text-muted-foreground">{slot.time}</div>
                  </button>
                ))}
              </div>
              
              {selectedSlot && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Créneau sélectionné :</strong> {selectedSlot.day} de {selectedSlot.time}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notes supplémentaires (optionnel)</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="notes" className="text-sm text-muted-foreground">
                Partagez vos objectifs ou sujets spécifiques à aborder
              </Label>
              <Textarea
                id="notes"
                placeholder="Ex: Je souhaite revoir le chapitre sur les équations, j'ai des difficultés avec..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleBooking}
              disabled={!selectedSlot}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Video className="h-4 w-4 mr-2" />
              Confirmer la réservation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
