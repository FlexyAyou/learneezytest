
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Star, MessageSquare, Video, MapPin, User, BookOpen, TrendingUp, Users } from 'lucide-react';
import { mockTrainerBookings, mockTrainerProfiles, mockTrainerReviews, mockStudentTrainerNotes } from '@/data/mockTrainerBookingData';
import { StudentTeacherOverview } from '@/components/student/teachers/StudentTeacherOverview';
import { StudentCurrentTeachers } from '@/components/student/teachers/StudentCurrentTeachers';
import { StudentSessionHistory } from '@/components/student/teachers/StudentSessionHistory';
import { StudentTeacherReviewModal } from '@/components/student/teachers/StudentTeacherReviewModal';

const StudentTeachers = () => {
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<string | null>(null);
  
  // Calculate statistics
  const totalSessions = mockTrainerBookings.length;
  const completedSessions = mockTrainerBookings.filter(b => b.status === 'completed').length;
  const scheduledSessions = mockTrainerBookings.filter(b => b.status === 'scheduled').length;
  const uniqueTeachers = new Set(mockTrainerBookings.map(b => b.trainerId)).size;
  const totalSpent = mockTrainerBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);
  const averageRating = mockTrainerReviews.length > 0 
    ? mockTrainerReviews.reduce((sum, r) => sum + r.rating, 0) / mockTrainerReviews.length 
    : 0;

  const currentTeachers = mockTrainerProfiles.filter(trainer => 
    mockTrainerBookings.some(booking => 
      booking.trainerId === trainer.id && booking.status === 'scheduled'
    )
  );

  const stats = {
    totalSessions,
    completedSessions,
    scheduledSessions,
    uniqueTeachers,
    totalSpent,
    averageRating
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Professeurs</h1>
          <p className="text-muted-foreground">
            Gérez vos réservations et évaluez vos professeurs
          </p>
        </div>
        <Button onClick={() => window.location.href = '/trainers'}>
          Réserver un nouveau prof
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="current">Mes Profs Actuels</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="reviews">Mes Évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <StudentTeacherOverview 
            stats={stats}
            currentTeachers={currentTeachers}
            upcomingBookings={mockTrainerBookings.filter(b => b.status === 'scheduled')}
          />
        </TabsContent>

        <TabsContent value="current">
          <StudentCurrentTeachers 
            teachers={currentTeachers}
            bookings={mockTrainerBookings}
            notes={mockStudentTrainerNotes}
          />
        </TabsContent>

        <TabsContent value="history">
          <StudentSessionHistory 
            bookings={mockTrainerBookings}
            reviews={mockTrainerReviews}
            onReviewSession={setSelectedBookingForReview}
          />
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes Évaluations</CardTitle>
                <CardDescription>
                  Toutes les évaluations que vous avez laissées à vos professeurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockTrainerReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune évaluation</h3>
                    <p className="text-muted-foreground">
                      Vous n'avez pas encore évalué vos professeurs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockTrainerReviews.map((review) => {
                      const booking = mockTrainerBookings.find(b => b.id === review.bookingId);
                      if (!booking) return null;
                      
                      return (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={booking.trainerPhoto} />
                                  <AvatarFallback>{booking.trainerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{booking.trainerName}</h4>
                                  <p className="text-sm text-muted-foreground">{booking.subject}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                                {review.isAnonymous && (
                                  <Badge variant="outline" className="text-xs mt-1">Anonyme</Badge>
                                )}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-sm text-muted-foreground italic">
                                "{review.comment}"
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedBookingForReview && (
        <StudentTeacherReviewModal
          bookingId={selectedBookingForReview}
          booking={mockTrainerBookings.find(b => b.id === selectedBookingForReview)!}
          onClose={() => setSelectedBookingForReview(null)}
          onSubmit={(reviewData) => {
            console.log('Review submitted:', reviewData);
            setSelectedBookingForReview(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentTeachers;
