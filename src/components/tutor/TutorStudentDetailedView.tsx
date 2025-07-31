
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Star
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
  if (!student) return null;

  // Données mockées pour l'exemple
  const studentDetails = {
    generalInfo: {
      age: 16,
      level: '1ère',
      startDate: '2024-01-10',
      totalHours: 45,
    },
    formations: [
      {
        id: '1',
        name: 'React Avancé',
        progress: 78,
        instructor: 'Prof. Dubois',
        startDate: '2024-01-10',
        endDate: '2024-03-10',
        status: 'in_progress'
      },
      {
        id: '2',
        name: 'JavaScript ES6',
        progress: 100,
        instructor: 'Prof. Martin',
        startDate: '2023-11-15',
        endDate: '2023-12-20',
        status: 'completed'
      }
    ],
    reservations: [
      {
        id: '1',
        date: '2024-01-25',
        time: '14:00-16:00',
        subject: 'React Hooks',
        type: 'upcoming',
        instructor: 'Prof. Dubois'
      },
      {
        id: '2',
        date: '2024-01-20',
        time: '10:00-12:00',
        subject: 'Components',
        type: 'past',
        instructor: 'Prof. Dubois'
      },
    ],
    moduleProgress: [
      { module: 'Introduction React', progress: 100, score: 85 },
      { module: 'Components', progress: 100, score: 92 },
      { module: 'Hooks', progress: 75, score: 78 },
      { module: 'State Management', progress: 25, score: null },
    ],
    evaluations: [
      {
        id: '1',
        name: 'Quiz Components',
        score: 92,
        maxScore: 100,
        date: '2024-01-18',
        type: 'quiz'
      },
      {
        id: '2',
        name: 'Projet Final React',
        score: 85,
        maxScore: 100,
        date: '2024-01-15',
        type: 'project'
      },
    ],
    feedbacks: [
      {
        id: '1',
        instructor: 'Prof. Dubois',
        date: '2024-01-20',
        subject: 'React Hooks',
        feedback: 'Excellente compréhension des concepts. Continue comme ça !',
        rating: 5
      },
      {
        id: '2',
        instructor: 'Prof. Martin',
        date: '2024-01-15',
        subject: 'JavaScript ES6',
        feedback: 'Très bon travail sur les promesses. Quelques difficultés sur les async/await.',
        rating: 4
      },
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil détaillé - {student.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="formations">Formations</TabsTrigger>
            <TabsTrigger value="instructors">Professeurs</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
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
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{studentDetails.generalInfo.totalHours}h</div>
                      <p className="text-sm text-gray-600">Total d'heures</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{student.progress}%</div>
                      <p className="text-sm text-gray-600">Progression globale</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Début: {formation.startDate}</span>
                        <span>Fin: {formation.endDate}</span>
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
                {[...new Set(studentDetails.formations.map(f => f.instructor))].map((instructor, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{instructor}</p>
                      <p className="text-sm text-gray-600">
                        {studentDetails.formations.filter(f => f.instructor === instructor).map(f => f.name).join(', ')}
                      </p>
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
                        <span className="text-sm">{module.progress}%</span>
                      </div>
                    </div>
                    <Progress value={module.progress} />
                  </div>
                ))}
              </CardContent>
            </Card>

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
                      <p className="text-sm text-gray-600">{evaluation.date}</p>
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
                    <div className="flex items-start justify-between mb-2">
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
                    <p className="text-gray-700">{feedback.feedback}</p>
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
