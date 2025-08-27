
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Video, VideoOff, Eye, Plus } from 'lucide-react';
import VideoConference from '@/components/common/VideoConference';
import TrainerCard from '@/components/TrainerCard';
import TrainerBookingModal from '@/components/TrainerBookingModal';

interface VideoSession {
  id: string;
  title: string;
  course: string;
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  participants?: number;
  maxParticipants?: number;
  meetingId?: string;
  description?: string;
}

const StudentVideoConferences = () => {
  const [selectedSession, setSelectedSession] = useState<VideoSession | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);

  // Mock trainers data
  const mockTrainers = [
    {
      id: 1,
      name: "Dr. Marie Dubois",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      specialty: "Mathématiques Appliquées",
      description: "Docteure en mathématiques avec 15 ans d'expérience dans l'enseignement supérieur et la recherche appliquée.",
      experience: "15+ ans d'expérience",
      rating: 4.9,
      languages: ["Français", "Anglais", "Espagnol"],
      supportType: "Tutorat",
      availableSlots: [
        { day: "Lundi", time: "14h00-15h30" },
        { day: "Mercredi", time: "10h00-11h30" },
        { day: "Vendredi", time: "16h00-17h30" }
      ],
      hourlyRate: "45€/h"
    },
    {
      id: 2,
      name: "Prof. Jean Martin", 
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      specialty: "Physique Quantique",
      description: "Professeur agrégé spécialisé en physique quantique et mécanique des fluides.",
      experience: "12+ ans d'expérience",
      rating: 4.8,
      languages: ["Français", "Anglais"],
      supportType: "Coaching",
      availableSlots: [
        { day: "Mardi", time: "09h00-10h30" },
        { day: "Jeudi", time: "14h00-15h30" }
      ],
      hourlyRate: "50€/h"
    },
    {
      id: 3,
      name: "Dr. Sophie Laurent",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      specialty: "Chimie Organique",
      description: "Docteure en chimie, spécialisée en synthèse organique et chimie médicinale.",
      experience: "8+ ans d'expérience",
      rating: 4.7,
      languages: ["Français", "Italien"],
      supportType: "Soutien technique",
      availableSlots: [
        { day: "Lundi", time: "11h00-12h30" },
        { day: "Mercredi", time: "15h00-16h30" },
        { day: "Vendredi", time: "09h00-10h30" }
      ],
      hourlyRate: "42€/h"
    }
  ];

  const upcomingSessions: VideoSession[] = [
    {
      id: '1',
      title: 'Cours de Mathématiques - Algèbre',
      course: 'Mathématiques CE2',
      instructor: 'Marie Dubois',
      date: '2024-01-20',
      startTime: '14:00',
      endTime: '15:30',
      status: 'upcoming',
      participants: 0,
      maxParticipants: 25,
      meetingId: 'MTG-MATH-001',
      description: 'Introduction aux équations du premier degré'
    },
    {
      id: '2',
      title: 'Session de Questions/Réponses',
      course: 'Sciences Physiques',
      instructor: 'Pierre Martin',
      date: '2024-01-21',
      startTime: '16:00',
      endTime: '17:00',
      status: 'live',
      participants: 12,
      maxParticipants: 20,
      meetingId: 'MTG-PHYS-002',
      description: 'Révision du chapitre sur la mécanique'
    },
    {
      id: '3',
      title: 'Cours de Français - Littérature',
      course: 'Français CM1',
      instructor: 'Sophie Laurent',
      date: '2024-01-22',
      startTime: '10:00',
      endTime: '11:30',
      status: 'upcoming',
      participants: 0,
      maxParticipants: 30,
      meetingId: 'MTG-FR-003',
      description: 'Analyse des œuvres classiques'
    }
  ];

  const pastSessions: VideoSession[] = [
    {
      id: '4',
      title: 'Cours d\'Histoire - Révolution',
      course: 'Histoire CM2',
      instructor: 'Jean Dupont',
      date: '2024-01-15',
      startTime: '15:00',
      endTime: '16:30',
      status: 'completed',
      participants: 18,
      maxParticipants: 25,
      meetingId: 'MTG-HIST-004',
      description: 'La Révolution française et ses conséquences'
    },
    {
      id: '5',
      title: 'TP Sciences - Expériences',
      course: 'Sciences CM1',
      instructor: 'Anne Moreau',
      date: '2024-01-12',
      startTime: '14:00',
      endTime: '15:00',
      status: 'completed',
      participants: 15,
      maxParticipants: 20,
      meetingId: 'MTG-SCI-005',
      description: 'Expériences sur les états de la matière'
    },
    {
      id: '6',
      title: 'Cours de Géographie',
      course: 'Géographie CE2',
      instructor: 'Michel Bernard',
      date: '2024-01-10',
      startTime: '13:00',
      endTime: '14:00',
      status: 'cancelled',
      participants: 0,
      maxParticipants: 20,
      meetingId: 'MTG-GEO-006',
      description: 'Les continents et les océans'
    }
  ];

  const getStatusBadge = (status: VideoSession['status']) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-100 text-red-800 animate-pulse">🔴 En direct</Badge>;
      case 'upcoming':
        return <Badge variant="outline">À venir</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const canJoinSession = (session: VideoSession) => {
    return session.status === 'live' || (session.status === 'upcoming' && 
      new Date(`${session.date} ${session.startTime}`) <= new Date(Date.now() + 10 * 60 * 1000));
  };

  const handleJoinSession = (session: VideoSession) => {
    setSelectedSession(session);
    setShowVideoCall(true);
  };

  const handleViewRecording = (session: VideoSession) => {
    // Simulation de visualisation d'enregistrement
    console.log('Visualisation de l\'enregistrement:', session.id);
  };

  const handleTrainerBooking = (trainer: any) => {
    setSelectedTrainer(trainer);
    setIsTrainerModalOpen(true);
  };

  if (showVideoCall && selectedSession) {
    return (
      <VideoConference
        meetingId={selectedSession.meetingId}
        onLeave={() => {
          setShowVideoCall(false);
          setSelectedSession(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Visioconférences</h1>
        <Badge variant="outline" className="text-sm">
          {upcomingSessions.filter(s => s.status === 'live').length} session(s) en cours
        </Badge>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Sessions à venir</TabsTrigger>
          <TabsTrigger value="past">Sessions passées</TabsTrigger>
          <TabsTrigger value="booking">Réserver une visio</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune session à venir</h3>
                <p className="text-gray-600">
                  Les prochaines visioconférences apparaîtront ici.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription>
                          <div className="space-y-1">
                            <div className="font-medium text-primary">{session.course}</div>
                            <div className="text-sm">Formateur : {session.instructor}</div>
                            {session.description && (
                              <div className="text-sm text-gray-600">{session.description}</div>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(session.status)}
                        {session.status === 'live' && (
                          <div className="flex items-center space-x-1 text-sm text-red-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span>En cours</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.startTime} - {session.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {session.participants || 0}/{session.maxParticipants} participants
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {canJoinSession(session) ? (
                          <Button
                            onClick={() => handleJoinSession(session)}
                            className={session.status === 'live' 
                              ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                              : "bg-blue-600 hover:bg-blue-700"
                            }
                          >
                            <Video className="w-4 h-4 mr-2" />
                            {session.status === 'live' ? 'Rejoindre' : 'Pré-rejoindre'}
                          </Button>
                        ) : (
                          <Button variant="outline" disabled>
                            <VideoOff className="w-4 h-4 mr-2" />
                            Non disponible
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastSessions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune session passée</h3>
                <p className="text-gray-600">
                  L'historique de vos visioconférences apparaîtra ici.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pastSessions.map((session) => (
                <Card key={session.id} className="relative opacity-90">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription>
                          <div className="space-y-1">
                            <div className="font-medium text-primary">{session.course}</div>
                            <div className="text-sm">Formateur : {session.instructor}</div>
                            {session.description && (
                              <div className="text-sm text-gray-600">{session.description}</div>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.startTime} - {session.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {session.participants || 0} participants
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {session.status === 'completed' ? (
                          <Button
                            variant="outline"
                            onClick={() => handleViewRecording(session)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir l'enregistrement
                          </Button>
                        ) : (
                          <Badge variant="secondary">
                            {session.status === 'cancelled' ? 'Session annulée' : 'Non disponible'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="booking" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Réserver une visioconférence</h2>
            <p className="text-gray-600">
              Choisissez un formateur et réservez un créneau personnalisé
            </p>
          </div>

          {mockTrainers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun formateur disponible</h3>
                <p className="text-gray-600">
                  Les formateurs disponibles pour les réservations apparaîtront ici.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTrainers.map((trainer) => (
                <TrainerCard
                  key={trainer.id}
                  trainer={trainer}
                  onBooking={handleTrainerBooking}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TrainerBookingModal
        isOpen={isTrainerModalOpen}
        onClose={() => setIsTrainerModalOpen(false)}
        trainer={selectedTrainer}
      />
    </div>
  );
};

export default StudentVideoConferences;
