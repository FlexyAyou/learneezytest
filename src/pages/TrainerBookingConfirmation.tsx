import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TrainerBookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Récupérer les données de réservation depuis le state de navigation
    const data = location.state;
    if (data && data.type === 'trainer-booking') {
      setBookingData(data);
    } else {
      // Si aucune donnée, rediriger vers la page des cours
      navigate('/cours');
    }
  }, [location.state, navigate]);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  const { trainer, slot, notes } = bookingData;

  const getSupportTypeColor = (type: string) => {
    switch (type) {
      case 'Tutorat': return 'bg-blue-100 text-blue-800';
      case 'Coaching': return 'bg-green-100 text-green-800';
      case 'Soutien technique': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBackToCourses = () => {
    navigate('/cours');
  };

  const handleGoToDashboard = () => {
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête avec succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-lg text-gray-600">
            Votre créneau avec {trainer.name} a été réservé avec succès
          </p>
        </div>

        {/* Détails de la réservation */}
        <div className="space-y-6">
          {/* Informations du formateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informations du formateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <img 
                  src={trainer.photo} 
                  alt={trainer.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-xl">{trainer.name}</h3>
                  <p className="text-primary font-medium mb-2">{trainer.specialty}</p>
                  <p className="text-gray-600 mb-3">{trainer.description}</p>
                  
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

          {/* Détails du créneau */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Créneau réservé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-lg">{slot.day}</p>
                    <p className="text-gray-600">{slot.time}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Vos notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prochaines étapes */}
          <Card>
            <CardHeader>
              <CardTitle>Prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <p className="font-medium">Confirmation par email</p>
                    <p className="text-sm text-gray-600">Vous recevrez un email de confirmation avec tous les détails</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <p className="font-medium">Contact du formateur</p>
                    <p className="text-sm text-gray-600">Le formateur vous contactera 24h avant le créneau</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <p className="font-medium">Séance de formation</p>
                    <p className="text-sm text-gray-600">Rejoignez votre séance à l'heure prévue</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={handleBackToCourses}
              className="flex-1 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux cours
            </Button>
            <Button 
              onClick={handleGoToDashboard}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Mon tableau de bord
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerBookingConfirmation;