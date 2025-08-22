
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Star, Video, MapPin, MessageSquare, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { TrainerBooking, TrainerReview } from '@/types/trainer-booking';

interface StudentSessionHistoryProps {
  bookings: TrainerBooking[];
  reviews: TrainerReview[];
  onReviewSession: (bookingId: string) => void;
}

export const StudentSessionHistory: React.FC<StudentSessionHistoryProps> = ({
  bookings,
  reviews,
  onReviewSession
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  const filteredBookings = bookings
    .filter(booking => statusFilter === 'all' || booking.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
        case 'date_asc':
          return new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
        case 'price_desc':
          return b.price - a.price;
        case 'price_asc':
          return a.price - b.price;
        default:
          return 0;
      }
    });

  const getStatusBadge = (status: TrainerBooking['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Programmée</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      case 'no_show':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Absence</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: TrainerBooking['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'no_show':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const hasReview = (bookingId: string) => {
    return reviews.some(review => review.bookingId === bookingId);
  };

  const getReview = (bookingId: string) => {
    return reviews.find(review => review.bookingId === bookingId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historique des Séances</CardTitle>
          <CardDescription>
            Consultez toutes vos séances passées et à venir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="scheduled">Programmées</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
                <SelectItem value="no_show">Absence</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date (plus récent)</SelectItem>
                <SelectItem value="date_asc">Date (plus ancien)</SelectItem>
                <SelectItem value="price_desc">Prix (décroissant)</SelectItem>
                <SelectItem value="price_asc">Prix (croissant)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            {filteredBookings.length} séance(s) trouvée(s)
          </div>
        </CardContent>
      </Card>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune séance trouvée</h3>
            <p className="text-muted-foreground">
              Aucune séance ne correspond à vos critères de recherche
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const review = getReview(booking.id);
            
            return (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {getStatusIcon(booking.status)}
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={booking.trainerPhoto} />
                        <AvatarFallback>
                          {booking.trainerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-lg">{booking.trainerName}</h4>
                        <p className="text-muted-foreground">{booking.trainerSpecialty}</p>
                        <h5 className="font-medium mt-1">{booking.subject}</h5>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
                      <p className="text-lg font-bold mt-2">{booking.price}€</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(booking.sessionDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.sessionStartTime} - {booking.sessionEndTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.sessionType === 'online' ? (
                        <>
                          <Video className="w-4 h-4 text-muted-foreground" />
                          <span>En ligne</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>Présentiel</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.sessionDuration} min</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-muted-foreground italic">"{booking.notes}"</p>
                    </div>
                  )}

                  {/* Review Section */}
                  {review ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Votre évaluation</h5>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                      )}
                      {review.isAnonymous && (
                        <Badge variant="outline" className="mt-2 text-xs">Évaluation anonyme</Badge>
                      )}
                    </div>
                  ) : booking.status === 'completed' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-700 mb-3">
                        Cette séance est terminée. Évaluez votre professeur pour aider la communauté !
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => onReviewSession(booking.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Évaluer cette séance
                      </Button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {booking.status === 'scheduled' && booking.sessionType === 'online' && booking.meetingUrl && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Video className="w-4 h-4 mr-2" />
                        Rejoindre la session
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contacter le prof
                    </Button>
                    {booking.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Réserver à nouveau
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
