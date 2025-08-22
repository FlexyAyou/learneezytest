
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Star, Users, TrendingUp, BookOpen, Video, MapPin } from 'lucide-react';
import { TrainerProfile, TrainerBooking } from '@/types/trainer-booking';

interface StudentTeacherOverviewProps {
  stats: {
    totalSessions: number;
    completedSessions: number;
    scheduledSessions: number;
    uniqueTeachers: number;
    totalSpent: number;
    averageRating: number;
  };
  currentTeachers: TrainerProfile[];
  upcomingBookings: TrainerBooking[];
}

export const StudentTeacherOverview: React.FC<StudentTeacherOverviewProps> = ({
  stats,
  currentTeachers,
  upcomingBookings
}) => {
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

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.totalSessions}</p>
            <p className="text-sm text-muted-foreground">Total séances</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.uniqueTeachers}</p>
            <p className="text-sm text-muted-foreground">Professeurs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.scheduledSessions}</p>
            <p className="text-sm text-muted-foreground">À venir</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.completedSessions}</p>
            <p className="text-sm text-muted-foreground">Terminées</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Note moyenne</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-indigo-600 font-bold">€</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{stats.totalSpent}€</p>
            <p className="text-sm text-muted-foreground">Dépensé</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Prochaines séances
            </CardTitle>
            <CardDescription>Vos séances programmées à venir</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune séance programmée</h3>
                <p className="text-muted-foreground mb-4">
                  Réservez une séance avec un de vos professeurs
                </p>
                <Button>Réserver une séance</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={booking.trainerPhoto} />
                            <AvatarFallback>{booking.trainerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{booking.trainerName}</h4>
                            <p className="text-sm text-muted-foreground">{booking.subject}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(booking.sessionDate).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {booking.sessionStartTime} - {booking.sessionEndTime}
                              </span>
                              <span className="flex items-center gap-1">
                                {booking.sessionType === 'online' ? (
                                  <>
                                    <Video className="w-3 h-3" />
                                    En ligne
                                  </>
                                ) : (
                                  <>
                                    <MapPin className="w-3 h-3" />
                                    Présentiel
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(booking.status)}
                          <p className="text-sm font-medium mt-1">{booking.price}€</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {upcomingBookings.length > 3 && (
                  <Button variant="outline" className="w-full">
                    Voir toutes les séances ({upcomingBookings.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Teachers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Mes professeurs actuels
            </CardTitle>
            <CardDescription>Les professeurs avec qui vous travaillez</CardDescription>
          </CardHeader>
          <CardContent>
            {currentTeachers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun professeur actuel</h3>
                <p className="text-muted-foreground mb-4">
                  Découvrez notre catalogue de professeurs
                </p>
                <Button>Parcourir les professeurs</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentTeachers.map((teacher) => (
                  <Card key={teacher.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={teacher.photo} />
                            <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{teacher.name}</h4>
                            <p className="text-sm text-muted-foreground">{teacher.specialty}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{teacher.averageRating}</span>
                              <span className="text-sm text-muted-foreground">({teacher.totalReviews} avis)</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{teacher.hourlyRate}€/h</p>
                          <p className="text-xs text-muted-foreground">{teacher.totalSessions} séances</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
