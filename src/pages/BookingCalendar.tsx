import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Video, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useParams } from 'react-router-dom';

const BookingCalendar = () => {
  const { courseId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  // Mock data pour les créneaux disponibles
  const availableSlots = [
    {
      id: '1',
      instructorName: 'Marie Dubois',
      instructorPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b9c9b3c8?w=100&h=100&fit=crop&crop=face',
      startTime: '09:00',
      endTime: '10:00',
      date: '2024-01-25',
      maxStudents: 8,
      bookedStudents: 3,
      price: 25,
      location: 'Salle A101',
      type: 'presential' as const,
      rating: 4.8,
      totalReviews: 156
    },
    {
      id: '2',
      instructorName: 'Paul Martin',
      instructorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      startTime: '14:00',
      endTime: '15:30',
      date: '2024-01-25',
      maxStudents: 12,
      bookedStudents: 7,
      price: 30,
      type: 'online' as const,
      rating: 4.9,
      totalReviews: 203
    },
    {
      id: '3',
      instructorName: 'Sophie Laurent',
      instructorPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      startTime: '16:00',
      endTime: '17:00',
      date: '2024-01-25',
      maxStudents: 6,
      bookedStudents: 4,
      price: 35,
      location: 'Salle B203',
      type: 'presential' as const,
      rating: 4.7,
      totalReviews: 89
    }
  ];

  const courseInfo = {
    title: 'Mathématiques - Fractions et Nombres Décimaux',
    level: 'CM1',
    category: 'Mathématiques',
    description: 'Apprenez les bases des fractions et des nombres décimaux avec des exercices pratiques.'
  };

  const selectedDateSlots = availableSlots.filter(slot => slot.date === selectedDate?.toISOString().split('T')[0]);

  const handleBookSlot = (slotId: string) => {
    setSelectedSlot(slotId);
    setIsBookingDialogOpen(true);
  };

  const confirmBooking = () => {
    if (selectedSlot) {
      // Redirection vers la page de paiement
      window.location.href = `/cours/${courseId}/paiement/${selectedSlot}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header du cours */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseInfo.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Badge variant="secondary">{courseInfo.level}</Badge>
            <Badge variant="outline">{courseInfo.category}</Badge>
          </div>
          <p className="mt-4 text-gray-700">{courseInfo.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendrier */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Sélectionner une date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Créneaux disponibles */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Créneaux disponibles
                  {selectedDate && (
                    <span className="text-sm font-normal text-gray-600">
                      - {selectedDate.toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun créneau disponible pour cette date</p>
                    <p className="text-sm mt-2">Sélectionnez une autre date dans le calendrier</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateSlots.map((slot) => (
                      <div key={slot.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Photo du formateur */}
                            <img
                              src={slot.instructorPhoto}
                              alt={slot.instructorName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            
                            <div>
                              <h3 className="font-semibold text-gray-900">{slot.instructorName}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {slot.bookedStudents}/{slot.maxStudents}
                                </span>
                                {slot.type === 'presential' ? (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {slot.location}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Video className="h-4 w-4" />
                                    En ligne
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  <span className="text-yellow-500">★</span>
                                  <span className="text-sm text-gray-600 ml-1">
                                    {slot.rating} ({slot.totalReviews} avis)
                                  </span>
                                </div>
                                <Badge 
                                  variant={slot.type === 'online' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {slot.type === 'online' ? 'En ligne' : 'Présentiel'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 mb-2">
                              {slot.price}€
                            </div>
                            <Button
                              onClick={() => handleBookSlot(slot.id)}
                              disabled={slot.bookedStudents >= slot.maxStudents}
                              className="min-w-[120px]"
                            >
                              {slot.bookedStudents >= slot.maxStudents ? 'Complet' : 'Réserver'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de confirmation de réservation */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la réservation</DialogTitle>
          </DialogHeader>
          
          {selectedSlot && (
            <div className="space-y-4">
              {(() => {
                const slot = availableSlots.find(s => s.id === selectedSlot);
                if (!slot) return null;
                
                return (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Détails du créneau</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Formateur:</span>
                          <span className="font-medium">{slot.instructorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">{new Date(slot.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Horaire:</span>
                          <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium">
                            {slot.type === 'online' ? 'En ligne' : `Présentiel - ${slot.location}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prix:</span>
                          <span className="font-bold text-blue-600">{slot.price}€</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Notes (optionnel)
                      </label>
                      <Textarea
                        placeholder="Ajoutez des informations ou des questions pour le formateur..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)} className="flex-1">
                        Annuler
                      </Button>
                      <Button onClick={confirmBooking} className="flex-1">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Confirmer et Payer
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default BookingCalendar;