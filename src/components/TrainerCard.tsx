import React from 'react';
import { Star, Calendar, Languages as LanguagesIcon, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TrainerCardProps {
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
  };
  onBooking: (trainer: any) => void;
}

const TrainerCard = ({ trainer, onBooking }: TrainerCardProps) => {
  const getSupportTypeColor = (type: string) => {
    switch (type) {
      case 'Tutorat': return 'bg-pink-100 text-pink-800';
      case 'Coaching': return 'bg-purple-100 text-purple-800';
      case 'Soutien technique': return 'bg-pink-100 text-pink-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img 
              src={trainer.photo} 
              alt={trainer.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
              {trainer.name}
            </h3>
            <p className="text-primary font-medium mb-1">{trainer.specialty}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{trainer.rating}</span>
              </div>
              <span className="text-sm text-gray-500">• {trainer.experience}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {trainer.description}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getSupportTypeColor(trainer.supportType)}`}>
              {trainer.supportType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {trainer.hourlyRate}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <LanguagesIcon className="h-4 w-4 text-gray-500" />
            {trainer.languages.map((lang, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">Créneaux disponibles :</p>
              <div className="flex flex-wrap gap-1">
                {trainer.availableSlots.slice(0, 3).map((slot, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {slot.day} {slot.time}
                  </Badge>
                ))}
                {trainer.availableSlots.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{trainer.availableSlots.length - 3} autres
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => onBooking(trainer)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          Réserver un créneau
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrainerCard;