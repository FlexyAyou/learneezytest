
import React from 'react';
import { BarChart3, Users, BookOpen, TrendingUp, Activity, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminStats } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const AdminStats = () => {
  const { data: stats, isLoading, error, refetch } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message="Impossible de charger les statistiques administrateur"
        onRetry={() => refetch()}
        className="max-w-md mx-auto mt-8"
      />
    );
  }

  // Données de fallback si pas de stats
  const fallbackStats = {
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    monthlyGrowth: { users: 0, courses: 0, revenue: 0 },
    topCourses: []
  };

  const displayStats = stats || fallbackStats;

  return (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {displayStats.monthlyGrowth.users > 0 ? '+' : ''}{displayStats.monthlyGrowth.users}% ce mois-ci
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours complétés</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalEnrollments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {displayStats.monthlyGrowth.courses > 0 ? '+' : ''}{displayStats.monthlyGrowth.courses}% cette semaine
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{displayStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {displayStats.monthlyGrowth.revenue > 0 ? '+' : ''}{displayStats.monthlyGrowth.revenue}% vs mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Cours disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Performances des cours
            </CardTitle>
            <CardDescription>Top cours les plus populaires</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayStats.topCourses.length > 0 ? (
              displayStats.topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-600">{course.enrollments} étudiants</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">€{course.revenue}</p>
                    <p className="text-xs text-gray-500">Revenus</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune donnée de cours disponible</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-green-600" />
              Activité récente
            </CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Connectez la base de données pour voir l'activité récente</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button className="bg-pink-600 hover:bg-pink-700">
          <Calendar className="h-4 w-4 mr-2" />
          Rapport mensuel
        </Button>
        <Button variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          Statistiques avancées
        </Button>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Analyse de croissance
        </Button>
      </div>
    </div>
  );
};

export default AdminStats;
