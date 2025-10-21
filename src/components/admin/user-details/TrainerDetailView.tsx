import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, DollarSign, Star, Calendar, TrendingUp } from "lucide-react";
import { useUserDetail } from "@/hooks/useApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface TrainerDetailViewProps {
  user: any;
}

export const TrainerDetailView = ({ user }: TrainerDetailViewProps) => {
  const { data: userDetail, isLoading: userLoading } = useUserDetail(user.id);

  if (userLoading) {
    return <LoadingSpinner size="lg" className="py-8" />;
  }

  // Données réelles du backend
  const realData = {
    firstName: userDetail?.first_name || user.first_name,
    lastName: userDetail?.last_name || user.last_name,
    email: userDetail?.email || user.email,
    isActive: userDetail?.is_active ?? user.is_active,
    createdAt: userDetail?.created_at || user.created_at,
    lastLogin: userDetail?.last_login || user.last_login,
    ofId: userDetail?.of_id || user.of_id,
  };

  // Mock data spécifique aux formateurs
  const trainerData = {
    courses: [
      { id: 1, title: "Formation React Avancée", students: 0, revenue: 0, rating: 0, status: "active" },
      { id: 2, title: "JavaScript pour débutants", students: 0, revenue: 0, rating: 0, status: "active" },
      { id: 3, title: "HTML/CSS Responsive", students: 0, revenue: 0, status: "draft", rating: 0 },
    ],
    stats: {
      totalStudents: 0,
      totalRevenue: 0,
      averageRating: 0,
      activeCourses: 0,
    },
    schedule: [
      { date: "2024-01-25", time: "14:00-16:00", course: "React Avancée", students: 0 },
      { date: "2024-01-26", time: "10:00-12:00", course: "JavaScript", students: 0 },
      { date: "2024-01-27", time: "16:00-18:00", course: "React Avancée", students: 0 },
    ],
    reviews: [
      { student: "Marie D.", course: "React Avancée", rating: 5, comment: "Excellent formateur, très pédagogue" },
      { student: "Paul M.", course: "JavaScript", rating: 4, comment: "Bonne formation, contenu de qualité" },
    ],
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { variant: "default" as const, label: "Actif" },
      draft: { variant: "secondary" as const, label: "Brouillon" },
      paused: { variant: "outline" as const, label: "En pause" },
    };
    return configs[status as keyof typeof configs] || configs.draft;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques du formateur (mockées) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{trainerData.stats.activeCourses}</div>
            <div className="text-sm text-gray-600">Cours actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{trainerData.stats.totalStudents}</div>
            <div className="text-sm text-gray-600">Étudiants formés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{trainerData.stats.totalRevenue}€</div>
            <div className="text-sm text-gray-600">Revenus générés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-1">
              <Star className="h-6 w-6" />
              {trainerData.stats.averageRating}
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
            Cours créés et gérés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainerData.courses.map((course) => {
              const config = getStatusBadge(course.status);
              return (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{course.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.students} étudiants
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {course.revenue}€ générés
                        </span>
                        {course.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {course.rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Planning à venir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planning des prochaines sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trainerData.schedule.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{session.course}</p>
                  <p className="text-sm text-gray-600">
                    {session.date} • {session.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{session.students} participants</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Évaluations reçues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évaluations des étudiants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trainerData.reviews.map((review, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.student}</p>
                    <p className="text-sm text-gray-600">{review.course}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{review.rating}/5</span>
                  </div>
                </div>
                <p className="text-sm italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
