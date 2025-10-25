import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, FileText, Users, TrendingUp, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useUserDetail } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ContentCreatorDetailViewProps {
  user: any;
}

export const ContentCreatorDetailView = ({ user }: ContentCreatorDetailViewProps) => {
  const { data: userDetail, isLoading: userLoading } = useUserDetail(user.id);

  if (userLoading) {
    return <LoadingSpinner size="lg" className="py-8" />;
  }

  const realData = {
    firstName: userDetail?.first_name || user.first_name,
    lastName: userDetail?.last_name || user.last_name,
    email: userDetail?.email || user.email,
    isActive: userDetail?.is_active ?? user.is_active,
    createdAt: userDetail?.created_at || user.created_at,
    lastLogin: userDetail?.last_login || user.last_login,
    ofId: userDetail?.of_id || user.of_id,
  };

  // Mock data spécifique aux créateurs de contenu
  const contentCreatorData = {
    createdCourses: [
      { 
        id: 1, 
        title: 'Introduction à React', 
        status: 'published', 
        modules: 8, 
        lessons: 42,
        students: 156,
        rating: 4.7,
        lastUpdate: '2024-01-15'
      },
      { 
        id: 2, 
        title: 'Maîtrise TypeScript', 
        status: 'draft', 
        modules: 6, 
        lessons: 28,
        students: 0,
        rating: 0,
        lastUpdate: '2024-01-20'
      },
      { 
        id: 3, 
        title: 'Node.js Avancé', 
        status: 'review', 
        modules: 10, 
        lessons: 55,
        students: 0,
        rating: 0,
        lastUpdate: '2024-01-18'
      }
    ],
    resources: [
      { type: 'video', count: 124, totalDuration: '18h 45min' },
      { type: 'document', count: 87, totalSize: '245 MB' },
      { type: 'quiz', count: 42, questions: 312 },
      { type: 'exercise', count: 56, submissions: 1248 }
    ],
    stats: {
      totalCourses: 3,
      publishedCourses: 1,
      totalStudents: 156,
      averageRating: 4.7,
      totalModules: 24,
      totalLessons: 125,
      completionRate: 78
    },
    recentActivity: [
      { date: '2024-01-20', action: 'Création nouveau module', course: 'Maîtrise TypeScript' },
      { date: '2024-01-19', action: 'Ajout de quiz', course: 'Introduction à React' },
      { date: '2024-01-18', action: 'Soumission pour révision', course: 'Node.js Avancé' },
      { date: '2024-01-17', action: 'Upload vidéo', course: 'Maîtrise TypeScript' }
    ],
    collaborations: [
      { trainer: 'Marie Dubois', course: 'Introduction à React', role: 'Formateur principal' },
      { trainer: 'Jean Martin', course: 'Node.js Avancé', role: 'Expert technique' }
    ]
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      published: { variant: 'default' as const, label: 'Publié', color: 'bg-green-100 text-green-800' },
      draft: { variant: 'secondary' as const, label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
      review: { variant: 'outline' as const, label: 'En révision', color: 'bg-yellow-100 text-yellow-800' }
    };
    return configs[status as keyof typeof configs] || configs.draft;
  };

  const getResourceIcon = (type: string) => {
    const icons = {
      video: Video,
      document: FileText,
      quiz: CheckCircle,
      exercise: BookOpen
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques du créateur de contenu */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {contentCreatorData.stats.totalCourses}
            </div>
            <div className="text-sm text-gray-600">Cours créés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {contentCreatorData.stats.publishedCourses}
            </div>
            <div className="text-sm text-gray-600">Cours publiés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {contentCreatorData.stats.totalStudents}
            </div>
            <div className="text-sm text-gray-600">Apprenants inscrits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {contentCreatorData.stats.averageRating}
            </div>
            <div className="text-sm text-gray-600">Note moyenne</div>
          </CardContent>
        </Card>
      </div>

      {/* Cours créés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Cours créés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentCreatorData.createdCourses.map((course) => {
              const statusConfig = getStatusBadge(course.status);
              return (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{course.title}</h4>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{course.modules}</span> modules
                        </div>
                        <div>
                          <span className="font-medium">{course.lessons}</span> leçons
                        </div>
                        <div>
                          <span className="font-medium">{course.students}</span> apprenants
                        </div>
                        {course.rating > 0 && (
                          <div>
                            Note: <span className="font-medium">{course.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(course.lastUpdate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ressources créées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ressources pédagogiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentCreatorData.resources.map((resource, index) => {
              const Icon = getResourceIcon(resource.type);
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{resource.count}</p>
                      <p className="text-sm text-gray-600 capitalize">{resource.type}s</p>
                      {resource.type === 'video' && (
                        <p className="text-xs text-gray-500 mt-1">{resource.totalDuration}</p>
                      )}
                      {resource.type === 'document' && (
                        <p className="text-xs text-gray-500 mt-1">{resource.totalSize}</p>
                      )}
                      {resource.type === 'quiz' && (
                        <p className="text-xs text-gray-500 mt-1">{resource.questions} questions</p>
                      )}
                      {resource.type === 'exercise' && (
                        <p className="text-xs text-gray-500 mt-1">{resource.submissions} soumissions</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contentCreatorData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 text-sm text-gray-500 w-24">
                  {new Date(activity.date).toLocaleDateString()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.course}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collaborations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaborations avec formateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contentCreatorData.collaborations.map((collab, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{collab.trainer}</p>
                  <p className="text-sm text-gray-600">{collab.course}</p>
                </div>
                <Badge variant="outline">{collab.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de production */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance de contenu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Modules créés</span>
              <span className="text-2xl font-bold text-blue-600">{contentCreatorData.stats.totalModules}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Leçons totales</span>
              <span className="text-2xl font-bold text-green-600">{contentCreatorData.stats.totalLessons}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taux de complétion moyen</span>
              <span className="text-2xl font-bold text-purple-600">{contentCreatorData.stats.completionRate}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
