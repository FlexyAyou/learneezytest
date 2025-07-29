import React, { useState } from 'react';
import { Calendar, Clock, User, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

interface TrainerBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: {
    id: number;
    name: string;
    photo: string;
    specialty: string;
    description: string;
    experience: string;
    rating: number;
    languages: string[];
    supportType: string;
    availableSlots: Array<{ day: string; time: string }>;
    hourlyRate: string;
  } | null;
}

const TrainerBookingModal = ({ isOpen, onClose, trainer }: TrainerBookingModalProps) => {
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  if (!trainer) return null;

  const handleBooking = () => {
    if (!selectedSlot) return;
    
    // Simuler la réservation - en réalité, cela devrait appeler une API
    console.log('Réservation:', {
      trainerId: trainer.id,
      slot: selectedSlot,
      notes
    });
    
    // Redirection vers la page de confirmation
    navigate('/trainer-booking-confirmation', { 
      state: { 
        type: 'trainer-booking',
        trainer: trainer,
        slot: selectedSlot,
        notes: notes
      }
    });
    
    onClose();
  };

  const getSupportTypeColor = (type: string) => {
    switch (type) {
      case 'Tutorat': return 'bg-blue-100 text-blue-800';
      case 'Coaching': return 'bg-green-100 text-green-800';
      case 'Soutien technique': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            Réserver un créneau avec {trainer.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations du formateur */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Informations du formateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <img 
                  src={trainer.photo} 
                  alt={trainer.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{trainer.name}</h3>
                  <p className="text-primary font-medium mb-2">{trainer.specialty}</p>
                  <p className="text-sm text-gray-600 mb-3">{trainer.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`text-xs ${getSupportTypeColor(trainer.supportType)}`}>
                      {trainer.supportType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {trainer.hourlyRate}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {trainer.experience}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sélection du créneau */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Choisir un créneau
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trainer.availableSlots.map((slot, index) => (
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
                    <div className="text-sm text-gray-600">{slot.time}</div>
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

          {/* Notes supplémentaires */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notes supplémentaires (optionnel)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="notes" className="text-sm text-gray-600">
                Partagez vos objectifs, difficultés ou demandes spécifiques
              </Label>
              <Textarea
                id="notes"
                placeholder="Ex: Je souhaite me concentrer sur les équations du second degré, j'ai des difficultés avec..."
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
              Confirmer la réservation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerBookingModal;