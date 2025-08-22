import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Star, TrendingUp } from 'lucide-react';
import { mockTrainerBookings, mockTrainerProfiles } from '@/data/mockTrainerBookingData';

export const StudentTeacherOverview = () => {
  const upcomingSessions = mockTrainerBookings.filter(booking => booking.status === 'upcoming');
  const completedSessions = mockTrainerBookings.filter(booking => booking.status === 'completed');
  const totalHours = mockTrainerBookings.reduce((total, booking) => total + booking.duration, 0) / 60;
  const averageRating = completedSessions.filter(s => s.rating).reduce((sum, s) => sum + (s.rating || 0), 0) / completedSessions.filter(s => s.rating).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Séances à venir</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating ? averageRating.toFixed(1) : '-'}/5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professeurs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTrainerProfiles.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Prochaines séances</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <p className="text-muted-foreground">Aucune séance planifiée</p>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarImage src={session.trainerPhoto} />
                    <AvatarFallback>{session.trainerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{session.trainerName}</h4>
                    <p className="text-sm text-muted-foreground">{session.subject} - {session.specialty}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="secondary">
                        {new Date(session.sessionDate).toLocaleDateString('fr-FR')} à {session.sessionTime}
                      </Badge>
                      <Badge variant="outline">{session.duration} min</Badge>
                      <Badge variant={session.sessionType === 'online' ? 'default' : 'secondary'}>
                        {session.sessionType === 'online' ? 'En ligne' : 'Présentiel'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{session.price}€</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};