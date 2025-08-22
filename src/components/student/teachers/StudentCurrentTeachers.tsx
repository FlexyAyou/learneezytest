import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, Calendar } from 'lucide-react';
import { mockTrainerProfiles, mockTrainerBookings } from '@/data/mockTrainerBookingData';

export const StudentCurrentTeachers = () => {
  // Get unique trainers from bookings
  const uniqueTrainerIds = [...new Set(mockTrainerBookings.map(booking => booking.trainerId))];
  const currentTeachers = mockTrainerProfiles.filter(trainer => 
    uniqueTrainerIds.includes(trainer.id)
  );

  const getTeacherStats = (trainerId: string) => {
    const trainerBookings = mockTrainerBookings.filter(booking => booking.trainerId === trainerId);
    const completedSessions = trainerBookings.filter(booking => booking.status === 'completed');
    const upcomingSessions = trainerBookings.filter(booking => booking.status === 'upcoming');
    const totalHours = trainerBookings.reduce((total, booking) => total + booking.duration, 0) / 60;
    
    return {
      totalSessions: trainerBookings.length,
      completedSessions: completedSessions.length,
      upcomingSessions: upcomingSessions.length,
      totalHours: totalHours.toFixed(1)
    };
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {currentTeachers.map((teacher) => {
          const stats = getTeacherStats(teacher.id);
          
          return (
            <Card key={teacher.id}>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={teacher.photo} />
                    <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{teacher.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{teacher.rating}</span>
                      <span className="text-muted-foreground">({teacher.totalReviews} avis)</span>
                    </div>
                    <p className="text-muted-foreground mt-2">{teacher.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{teacher.hourlyRate}€/h</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Subjects and Specialties */}
                  <div>
                    <h4 className="font-medium mb-2">Matières et spécialités</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="default">{subject}</Badge>
                      ))}
                      {teacher.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h4 className="font-medium mb-2">Mes statistiques avec ce professeur</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
                        <div className="text-sm text-muted-foreground">Séances totales</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.completedSessions}</div>
                        <div className="text-sm text-muted-foreground">Terminées</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.upcomingSessions}</div>
                        <div className="text-sm text-muted-foreground">À venir</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{stats.totalHours}h</div>
                        <div className="text-sm text-muted-foreground">Heures totales</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="default" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Réserver une séance
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};