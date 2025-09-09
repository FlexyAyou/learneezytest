
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TutorStudentDetailedView } from '@/components/tutor/TutorStudentDetailedView';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  BookOpen, 
  TrendingUp,
  Award,
  MessageCircle,
  Eye
} from 'lucide-react';

const TutorStudentTracking = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const students = [
    {
      id: 1,
      name: 'Emma Martin',
      email: 'emma.martin@email.com',
      phone: '06 12 34 56 78',
      course: 'Mathématiques Niveau 1ère',
      progress: 75,
      lastActivity: '2024-01-15',
      status: 'active',
      parentContact: 'parents.martin@email.com',
      notes: 'Élève très motivée',
      age: 16,
      avatar: '/placeholder.svg',
      modules: [
        { name: 'Mathématiques Niveau 1ère', progress: 75, grade: 15.5, status: 'active' },
        { name: 'Anglais Conversation', progress: 60, grade: 16.2, status: 'active' },
        { name: 'Histoire Géographie', progress: 85, grade: 17.8, status: 'completed' }
      ],
      recentResults: [
        { subject: 'Mathématiques', type: 'Quiz', score: 17, date: '2024-01-12' },
        { subject: 'Anglais', type: 'Devoir', score: 18.4, date: '2024-01-10' }
      ],
      feedback: [
        {
          instructor: 'M. Bertrand',
          subject: 'Mathématiques',
          comment: 'Emma montre de bons progrès en algèbre.',
          date: '2024-01-12'
        }
      ]
    },
    {
      id: 2,
      name: 'Lucas Dubois',
      email: 'lucas.dubois@email.com',
      phone: '06 98 76 54 32',
      course: 'Sciences Physiques 3ème',
      progress: 90,
      lastActivity: '2024-01-14',
      status: 'active',
      parentContact: 'parents.dubois@email.com',
      notes: 'Très bon élève en sciences',
      age: 14,
      avatar: '/placeholder.svg',
      modules: [
        { name: 'Sciences Physiques 3ème', progress: 90, grade: 18.0, status: 'active' },
        { name: 'Français', progress: 70, grade: 14.0, status: 'active' }
      ],
      recentResults: [
        { subject: 'Sciences', type: 'Contrôle', score: 19, date: '2024-01-11' },
        { subject: 'Français', type: 'Rédaction', score: 15.6, date: '2024-01-09' }
      ],
      feedback: [
        {
          instructor: 'M. Dupont',
          subject: 'Sciences Physiques',
          comment: 'Excellent travail sur le chapitre électricité.',
          date: '2024-01-10'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'bg-green-100 text-green-800';
    if (grade >= 14) return 'bg-blue-100 text-blue-800';
    if (grade >= 12) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleContactTeacher = () => {
    navigate('/dashboard/tuteur/messagerie');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Suivi des Élèves</h1>
        <p className="text-gray-600">Suivez la progression et les résultats de vos élèves</p>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {students.map((student) => (
          <Card key={student.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription>{student.age} ans</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Modules Progress */}
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Progression des Modules
                </h4>
                <div className="space-y-3">
                  {student.modules.map((module, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium truncate">{module.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={getGradeColor(module.grade)} variant="secondary">
                            {module.grade}/20
                          </Badge>
                          <Badge className={getStatusColor(module.status)} variant="secondary">
                            {module.progress}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Results */}
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  Résultats Récents
                </h4>
                <div className="space-y-2">
                  {student.recentResults.map((result, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm font-medium">{result.subject}</span>
                        <span className="text-xs text-gray-600 ml-2">({result.type})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600">{result.score}/20</span>
                        <p className="text-xs text-gray-500">{result.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Feedback */}
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Retours Pédagogiques
                </h4>
                <div className="space-y-2">
                  {student.feedback.map((feedback, idx) => (
                    <div key={idx} className="p-3 border rounded-lg bg-blue-50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-blue-800">{feedback.instructor}</span>
                        <span className="text-xs text-gray-500">{feedback.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{feedback.comment}</p>
                      <span className="text-xs text-blue-600">{feedback.subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewDetails(student)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Détails
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleContactTeacher}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contacter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de détails de l'élève */}
      <TutorStudentDetailedView
        student={selectedStudent}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
};

export default TutorStudentTracking;
