
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Settings,
  User,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';

const LearnerDashboardHome = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Apprenant</h1>
        <p className="text-gray-600">Suivez votre progression et accédez à vos cours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">12</p>
                <p className="text-gray-600 text-sm">Cours suivis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">48h</p>
                <p className="text-gray-600 text-sm">Temps d'étude</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">8</p>
                <p className="text-gray-600 text-sm">Certificats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">85%</p>
                <p className="text-gray-600 text-sm">Progression</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cours récents</CardTitle>
          <CardDescription>Vos dernières activités d'apprentissage</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Aucun cours récent pour le moment.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const LearnerDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/dashboard', icon: TrendingUp, isActive: true },
    { title: 'Mes cours', href: '/dashboard/courses', icon: BookOpen },
    { title: 'Planning', href: '/dashboard/planning', icon: Calendar },
    { title: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { title: 'Profil', href: '/dashboard/profile', icon: User },
    { title: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ];

  const userInfo = {
    name: "Apprenant",
    email: "apprenant@email.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Apprenant"
        subtitle="Espace d'apprentissage"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<LearnerDashboardHome />} />
          <Route path="/*" element={<LearnerDashboardHome />} />
        </Routes>
      </main>
    </div>
  );
};

export default LearnerDashboard;
