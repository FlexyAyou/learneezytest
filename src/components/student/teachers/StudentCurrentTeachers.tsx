
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare, Calendar, Clock, Video, MapPin, StickyNote, Send } from 'lucide-react';
import { TrainerProfile, TrainerBooking, StudentTrainerNote } from '@/types/trainer-booking';

interface StudentCurrentTeachersProps {
  teachers: TrainerProfile[];
  bookings: TrainerBooking[];
  notes: StudentTrainerNote[];
}

export const StudentCurrentTeachers: React.FC<StudentCurrentTeachersProps> = ({
  teachers,
  bookings,
  notes
}) => {
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const getTeacherBookings = (teacherId: string) => {
    return bookings.filter(b => b.trainerId === teacherId && b.status === 'scheduled');
  };

  const getTeacherNote = (teacherId: string) => {
    return notes.find(n => n.trainerId === teacherId);
  };

  const handleNoteUpdate = (teacherId: string, note: string) => {
    console.log('Updating note for teacher:', teacherId, note);
    setEditingNote(null);
    setNoteInputs({ ...noteInputs, [teacherId]: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mes Professeurs Actuels</CardTitle>
          <CardDescription>
            Gérez vos relations avec vos professeurs et planifiez vos prochaines séances
          </CardDescription>
        </CardHeader>
      </Card>

      {teachers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun professeur actuel</h3>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas de séances programmées avec des professeurs
            </p>
            <Button>Réserver un professeur</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {teachers.map((teacher) => {
            const teacherBookings = getTeacherBookings(teacher.id);
            const teacherNote = getTeacherNote(teacher.id);
            const isEditingThisNote = editingNote === teacher.id;
            
            return (
              <Card key={teacher.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={teacher.photo} />
                        <AvatarFallback className="text-lg">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{teacher.name}</CardTitle>
                        <CardDescription className="text-base">
                          <Badge variant="outline" className="mb-2">{teacher.specialty}</Badge>
                        </CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{teacher.averageRating}</span>
                            <span className="text-muted-foreground">({teacher.totalReviews} avis)</span>
                          </div>
                          <span className="font-medium">{teacher.hourlyRate}€/h</span>
                          <span className="text-muted-foreground">{teacher.totalSessions} séances avec vous</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contacter
                      </Button>
                      <Button size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Réserver
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Teacher Bio */}
                  <div>
                    <h4 className="font-medium mb-2">À propos</h4>
                    <p className="text-sm text-muted-foreground">{teacher.bio}</p>
                  </div>

                  {/* Upcoming Bookings */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Prochaines séances ({teacherBookings.length})
                    </h4>
                    {teacherBookings.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground">Aucune séance programmée</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Planifier une séance
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {teacherBookings.map((booking) => (
                          <Card key={booking.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium">{booking.subject}</h5>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
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
                                <div className="text-right">
                                  <p className="font-medium">{booking.price}€</p>
                                  {booking.sessionType === 'online' && booking.meetingUrl && (
                                    <Button variant="outline" size="sm" className="mt-2">
                                      <Video className="w-4 h-4 mr-1" />
                                      Rejoindre
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Personal Notes */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <StickyNote className="w-4 h-4" />
                      Mes notes personnelles
                    </h4>
                    {teacherNote && !isEditingThisNote ? (
                      <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="p-4">
                          <p className="text-sm">{teacherNote.note}</p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-muted-foreground">
                              Modifié le {new Date(teacherNote.updatedAt).toLocaleDateString('fr-FR')}
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditingNote(teacher.id);
                                setNoteInputs({ ...noteInputs, [teacher.id]: teacherNote.note });
                              }}
                            >
                              Modifier
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Ajoutez vos notes personnelles sur ce professeur..."
                          value={noteInputs[teacher.id] || ''}
                          onChange={(e) => setNoteInputs({ ...noteInputs, [teacher.id]: e.target.value })}
                          className="min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleNoteUpdate(teacher.id, noteInputs[teacher.id] || '')}
                            disabled={!noteInputs[teacher.id]?.trim()}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {teacherNote ? 'Mettre à jour' : 'Enregistrer'}
                          </Button>
                          {isEditingThisNote && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditingNote(null);
                                setNoteInputs({ ...noteInputs, [teacher.id]: '' });
                              }}
                            >
                              Annuler
                            </Button>
                          )}
                        </div>
                      </div>
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
