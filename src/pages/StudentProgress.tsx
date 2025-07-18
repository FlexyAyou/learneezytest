
import React from 'react';
import { ArrowLeft, Book, Clock, Award, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';

const StudentProgressDetail = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  // Mock data - sera remplacé par l'API
  const student = {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b78bd5e0?w=40&h=40&fit=crop&crop=face',
    joinDate: '15 Mars 2024'
  };

  const courses = [
    {
      id: 1,
      title: 'React pour Débutants',
      progress: 85,
      totalLessons: 24,
      completedLessons: 20,
      timeSpent: 12.5, // heures
      lastActivity: '2 heures',
      lessons: [
        { id: 1, title: 'Introduction à React', completed: true, duration: 30 },
        { id: 2, title: 'Les composants', completed: true, duration: 45 },
        { id: 3, title: 'Props et State', completed: true, duration: 60 },
        { id: 4, title: 'Hooks', completed: false, duration: 75 },
        { id: 5, title: 'Router', completed: false, duration: 90 }
      ]
    },
    {
      id: 2,
      title: 'JavaScript Avancé',
      progress: 45,
      totalLessons: 18,
      completedLessons: 8,
      timeSpent: 6.2,
      lastActivity: '1 jour',
      lessons: [
        { id: 6, title: 'ES6+ Features', completed: true, duration: 45 },
        { id: 7, title: 'Async/Await', completed: true, duration: 60 },
        { id: 8, title: 'Promises', completed: false, duration: 50 },
        { id: 9, title: 'Modules', completed: false, duration: 40 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard/instructeur/students')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Progression de {student.name}</h1>
              <p className="text-gray-600">Détails de progression sur vos cours</p>
            </div>
          </div>
        </div>

        {/* Profil étudiant */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
                <p className="text-gray-600">{student.email}</p>
                <p className="text-sm text-gray-500">Inscrit le {student.joinDate}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-600">
                  {Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%
                </div>
                <p className="text-sm text-gray-600">Progression moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cours inscrits</p>
                  <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                </div>
                <Book className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Leçons terminées</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {courses.reduce((acc, course) => acc + course.completedLessons, 0)}
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps d'étude</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {courses.reduce((acc, course) => acc + course.timeSpent, 0).toFixed(1)}h
                  </div>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cours terminés</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {courses.filter(course => course.progress === 100).length}
                  </div>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détails des cours */}
        <div className="space-y-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>
                      {course.completedLessons}/{course.totalLessons} leçons • {course.timeSpent}h d'étude
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{course.progress}%</div>
                    <p className="text-sm text-gray-600">Dernière activité: {course.lastActivity}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Progress value={course.progress} className="h-3" />
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Progression des leçons</h4>
                  {course.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className={`${lesson.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressDetail;
