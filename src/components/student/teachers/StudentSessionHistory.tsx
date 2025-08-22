import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MessageSquare, MapPin, Video } from 'lucide-react';
import { mockTrainerBookings } from '@/data/mockTrainerBookingData';
import { StudentTeacherReviewModal } from './StudentTeacherReviewModal';

export const StudentSessionHistory = () => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming' | 'cancelled'>('all');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const filteredSessions = mockTrainerBookings.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'upcoming':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">À venir</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const openReviewModal = (session: any) => {
    setSelectedSession(session);
    setReviewModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Historique des séances</h3>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les séances</SelectItem>
            <SelectItem value="completed">Terminées</SelectItem>
            <SelectItem value="upcoming">À venir</SelectItem>
            <SelectItem value="cancelled">Annulées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={session.trainerPhoto} />
                  <AvatarFallback>{session.trainerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{session.trainerName}</h4>
                      <p className="text-muted-foreground">{session.subject} - {session.specialty}</p>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date et heure</p>
                      <p className="text-sm">
                        {new Date(session.sessionDate).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm">{session.sessionTime} ({session.duration} min)</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Type de séance</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {session.sessionType === 'online' ? (
                          <Video className="h-4 w-4 text-blue-600" />
                        ) : (
                          <MapPin className="h-4 w-4 text-green-600" />
                        )}
                        <span className="text-sm">
                          {session.sessionType === 'online' ? 'En ligne' : 'Présentiel'}
                        </span>
                      </div>
                      {session.location && (
                        <p className="text-xs text-muted-foreground mt-1">{session.location}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Prix</p>
                      <p className="text-lg font-semibold">{session.price}€</p>
                    </div>
                  </div>

                  {session.notes && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-muted-foreground">Notes</p>
                      <p className="text-sm text-muted-foreground italic">{session.notes}</p>
                    </div>
                  )}

                  {/* Review Section */}
                  {session.status === 'completed' && (
                    <div className="mt-4 pt-4 border-t">
                      {session.rating ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Mon évaluation:</span>
                            <div className="flex">{renderStars(session.rating)}</div>
                            {session.isAnonymousReview && (
                              <Badge variant="outline" className="text-xs">Anonyme</Badge>
                            )}
                          </div>
                          {session.review && (
                            <p className="text-sm text-muted-foreground italic">"{session.review}"</p>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openReviewModal(session)}
                          >
                            Modifier l'avis
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => openReviewModal(session)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Donner un avis
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Modal */}
      <StudentTeacherReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        session={selectedSession}
        onSubmit={(reviewData) => {
          console.log('Review submitted:', reviewData);
          setReviewModalOpen(false);
        }}
      />
    </div>
  );
};