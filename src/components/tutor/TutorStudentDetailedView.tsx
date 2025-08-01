
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoConference from '@/components/common/VideoConference';
import { 
  User, 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp, 
  MessageSquare,
  Award,
  Clock,
  CheckCircle,
  Star,
  Video,
  Phone,
  Mail
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  progress: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'completed';
  parentContact: string;
  notes: string;
}

interface TutorStudentDetailedViewProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TutorStudentDetailedView = ({ student, isOpen, onClose }: TutorStudentDetailedViewProps) => {
  const [showVideoConference, setShowVideoConference] = useState(false);
  
  if (!student) return null;

  // Données mockées pour l'exemple
  const studentDetails = {
    generalInfo: {
      age: 16,
      level: '1ère',
      startDate: '2024-01-10',
      totalHours: 45,
      parentName: 'M. et Mme Dupont',
      parentEmail: 'parents.dupont@email.com',
      parentPhone: '06 12 34 56 78',
    },
    formations: [
      {
        id: '1',
        name: 'React Avancé',
        progress: 78,
        instructor: 'Prof. Dubois',
        startDate: '2024-01-10',
        endDate: '2024-03-10',
        status: 'in_progress',
        totalHours: 30,
        completedHours: 23
      },
      {
        id: '2',
        name: 'JavaScript ES6',
        progress: 100,
        instructor: 'Prof. Martin',
        startDate: '2023-11-15',
        endDate: '2023-12-20',
        status: 'completed',
        totalHours: 20,
        completedHours: 20
      }
    ],
    instructors: [
      {
        id: '1',
        name: 'Prof. Dubois',
        subject: 'React Avancé',
        email: 'dubois@learneezy.com',
        phone: '06 11 22 33 44',
        specialties: ['React', 'JavaScript', 'Frontend'],
        rating: 4.8
      },
      {
        id: '2',
        name: 'Prof. Martin',
        subject: 'JavaScript ES6',
        email: 'martin@learneezy.com',
        phone: '06 55 66 77 88',
        specialties: ['JavaScript', 'Node.js', 'Backend'],
        rating: 4.9
      }
    ],
    reservations: [
      {
        id: '1',
        date: '2024-01-25',
        time: '14:00-16:00',
        subject: 'React Hooks',
        type: 'upcoming',
        instructor: 'Prof. Dubois',
        meetingLink: 'https://meet.learneezy.com/react-session-001',
        status: 'confirmed'
      },
      {
        id: '2',
        date: '2024-01-27',
        time: '10:00-12:00',
        subject: 'State Management',
        type: 'upcoming',
        instructor: 'Prof. Dubois',
        meetingLink: 'https://meet.learneezy.com/react-session-002',
        status: 'pending'
      },
      {
        id: '3',
        date: '2024-01-20',
        time: '10:00-12:00',
        subject: 'Components',
        type: 'past',
        instructor: 'Prof. Dubois',
        status: 'completed',
        attended: true
      },
      {
        id: '4',
        date: '2024-01-18',
        time: '15:00-17:00',
        subject: 'JavaScript Promises',
        type: 'past',
        instructor: 'Prof. Martin',
        status: 'completed',
        attended: true
      },
    ],
    moduleProgress: [
      { module: 'Introduction React', progress: 100, score: 85, timeSpent: '8h 30min' },
      { module: 'Components & Props', progress: 100, score: 92, timeSpent: '6h 15min' },
      { module: 'Hooks & State', progress: 75, score: 78, timeSpent: '4h 45min' },
      { module: 'State Management', progress: 25, score: null, timeSpent: '2h 10min' },
      { module: 'Routing', progress: 0, score: null, timeSpent: '0h' },
    ],
    evaluations: [
      {
        id: '1',
        name: 'Quiz Components',
        score: 92,
        maxScore: 100,
        date: '2024-01-18',
        type: 'quiz',
        duration: '30min',
        attempts: 1
      },
      {
        id: '2',
        name: 'TP React Hooks',
        score: 85,
        maxScore: 100,
        date: '2024-01-15',
        type: 'practical',
        duration: '2h',
        attempts: 2
      },
      {
        id: '3',
        name: 'Projet Final React',
        score: 88,
        maxScore: 100,
        date: '2024-01-12',
        type: 'project',
        duration: '1 semaine',
        attempts: 1
      },
    ],
    feedbacks: [
      {
        id: '1',
        instructor: 'Prof. Dubois',
        date: '2024-01-20',
        subject: 'React Hooks',
        feedback: 'Excellente compréhension des concepts. Marie maîtrise parfaitement useState et useEffect. Je recommande de passer aux hooks personnalisés.',
        rating: 5,
        strengths: ['Logique claire', 'Code propre', 'Participation active'],
        improvements: ['Performance optimization', 'Tests unitaires']
      },
      {
        id: '2',
        instructor: 'Prof. Martin',
        date: '2024-01-15',
        subject: 'JavaScript ES6',
        feedback: 'Très bon travail sur les promesses et async/await. Quelques difficultés sur les destructurations complexes mais progresse rapidement.',
        rating: 4,
        strengths: ['Asynchrone', 'Arrow functions'],
        improvements: ['Destructuring', 'Modules ES6']
      },
    ],
    upcomingMeetings: [
      {
        id: '1',
        title: 'Session React Hooks',
        date: '2024-01-25',
        time: '14:00',
        instructor: 'Prof. Dubois',
        meetingId: 'react-session-001',
        canJoin: true
      }
    ]
  };

  const handleJoinMeeting = (meetingId: string) => {
    setShowVideoConference(true);
  };

  const handleContactParent = () => {
    window.location.href = `mailto:${studentDetails.generalInfo.parentEmail}`;
  };

  const handleCallParent = () => {
    window.location.href = `tel:${studentDetails.generalInfo.parentPhone}`;
  };

  if (showVideoConference) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <VideoConference
            meetingId="react-session-001"
            isHost={true}
            onLeave={() => {
              setShowVideoConference(false);
              onClose();
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil détaillé - {student.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="formations">Formations</TabsTrigger>
            <TabsTrigger value="instructors">Professeurs</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
            <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-gray-900">{student.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Âge</label>
                      <p className="text-gray-900">{studentDetails.generalInfo.age} ans</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Niveau</label>
                      <p className="text-gray-900">{studentDetails.generalInfo.level}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date d'inscription</label>
                      <p className="text-gray-900">{studentDetails.generalInfo.startDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{student.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Téléphone</label>
                      <p className="text-gray-900">{student.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Parents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nom des parents</label>
                    <p className="text-gray-900">{studentDetails.generalInfo.parentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{studentDetails.generalInfo.parentEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="text-gray-900">{studentDetails.generalInfo.parentPhone}</p>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" onClick={handleContactParent}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCallParent}>
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{studentDetails.generalInfo.totalHours}h</div>
                    <p className="text-sm text-gray-600">Total d'heures</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{student.progress}%</div>
                    <p className="text-sm text-gray-600">Progression globale</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{studentDetails.formations.length}</div>
                    <p className="text-sm text-gray-600">Formations</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(studentDetails.evaluations.reduce((sum, e) => sum + e.score, 0) / studentDetails.evaluations.length)}%
                    </div>
                    <p className="text-sm text-gray-600">Note moyenne</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Réunions à venir */}
            {studentDetails.upcomingMeetings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">Prochaines visioconférences</CardTitle>
                </CardHeader>
                <CardContent>
                  {studentDetails.upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-sm text-gray-600">{meeting.date} à {meeting.time} - {meeting.instructor}</p>
                      </div>
                      <Button 
                        onClick={() => handleJoinMeeting(meeting.meetingId)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Rejoindre
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="formations" className="space-y-4">
            <div className="grid gap-4">
              {studentDetails.formations.map((formation) => (
                <Card key={formation.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{formation.name}</h3>
                      <Badge variant={formation.status === 'completed' ? 'default' : 'secondary'}>
                        {formation.status === 'completed' ? 'Terminé' : 'En cours'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{formation.progress}%</span>
                      </div>
                      <Progress value={formation.progress} />
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mt-3">
                        <div>
                          <span className="font-medium">Formateur:</span> {formation.instructor}
                        </div>
                        <div>
                          <span className="font-medium">Heures:</span> {formation.completedHours}/{formation.totalHours}h
                        </div>
                        <div>
                          <span className="font-medium">Début:</span> {formation.startDate}
                        </div>
                        <div>
                          <span className="font-medium">Fin:</span> {formation.endDate}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Professeurs associés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentDetails.instructors.map((instructor) => (
                  <div key={instructor.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{instructor.name}</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{instructor.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{instructor.subject}</p>
                      <p className="text-sm text-gray-500">{instructor.email}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {instructor.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">Prochaines réservations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {studentDetails.reservations.filter(r => r.type === 'upcoming').map((reservation) => (
                    <div key={reservation.id} className="p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{reservation.subject}</p>
                          <p className="text-sm text-gray-600">{reservation.instructor}</p>
                          <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'} className="mt-1">
                            {reservation.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{reservation.date}</p>
                          <p className="text-gray-600">{reservation.time}</p>
                          {reservation.meetingLink && (
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => handleJoinMeeting('session-001')}
                            >
                              <Video className="h-3 w-3 mr-1" />
                              Rejoindre
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-600">Réservations passées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {studentDetails.reservations.filter(r => r.type === 'past').map((reservation) => (
                    <div key={reservation.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{reservation.subject}</p>
                          <p className="text-sm text-gray-600">{reservation.instructor}</p>
                          <div className="flex items-center mt-1">
                            {reservation.attended && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
                            <span className="text-sm text-green-600">
                              {reservation.attended ? 'Présent' : 'Absent'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">{reservation.date}</p>
                          <p className="text-gray-600">{reservation.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Progression par module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentDetails.moduleProgress.map((module, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{module.module}</span>
                      <div className="flex items-center space-x-2">
                        {module.score && (
                          <Badge variant="outline">{module.score}/100</Badge>
                        )}
                        <Badge variant="secondary">{module.timeSpent}</Badge>
                        <span className="text-sm">{module.progress}%</span>
                      </div>
                    </div>
                    <Progress value={module.progress} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Résultats des évaluations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentDetails.evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{evaluation.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{evaluation.date}</span>
                        <span>•</span>
                        <span>{evaluation.duration}</span>
                        <span>•</span>
                        <span>{evaluation.attempts} tentative{evaluation.attempts > 1 ? 's' : ''}</span>
                      </div>
                      <Badge variant={evaluation.type === 'quiz' ? 'default' : evaluation.type === 'practical' ? 'secondary' : 'outline'} className="mt-1">
                        {evaluation.type === 'quiz' ? 'Quiz' : evaluation.type === 'practical' ? 'TP' : 'Projet'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {evaluation.score}/{evaluation.maxScore}
                      </div>
                      <Badge variant={evaluation.score >= 80 ? 'default' : 'secondary'}>
                        {Math.round((evaluation.score / evaluation.maxScore) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedbacks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Feedbacks pédagogiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentDetails.feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{feedback.subject}</p>
                        <p className="text-sm text-gray-600">{feedback.instructor} • {feedback.date}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{feedback.feedback}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-1">Points forts :</p>
                        <div className="flex flex-wrap gap-1">
                          {feedback.strengths.map((strength, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-700 mb-1">À améliorer :</p>
                        <div className="flex flex-wrap gap-1">
                          {feedback.improvements.map((improvement, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700">
                              {improvement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
