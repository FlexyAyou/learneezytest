
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock,
  Star,
  BookOpen,
  MessageSquare,
  Settings,
  TrendingUp,
  CheckCircle,
  FileText,
  Award,
  Target,
  BarChart3
} from 'lucide-react';

import TrainerAvailabilities from '@/components/external-trainer/TrainerAvailabilities';
import TrainerBookings from '@/components/external-trainer/TrainerBookings';
import TrainerEarnings from '@/components/external-trainer/TrainerEarnings';
import TrainerHistory from '@/components/external-trainer/TrainerHistory';
import TrainerProfile from '@/components/external-trainer/TrainerProfile';
import TrainerReviews from '@/components/external-trainer/TrainerReviews';
import TrainerRates from '@/components/external-trainer/TrainerRates';
import TrainerSpecialties from '@/components/external-trainer/TrainerSpecialties';
import TrainerSupport from '@/components/external-trainer/TrainerSupport';
import { StatsCard } from '@/components/common/StatsCard';
import { DashboardChart } from '@/components/common/DashboardChart';

const ExternalTrainerDashboardHome = () => {
  const stats = [
    {
      title: "Réservations ce mois",
      value: "28",
      icon: Calendar,
      change: "+15% vs mois dernier",
      changeType: "positive" as const,
      color: "text-blue-600"
    },
    {
      title: "Étudiants formés",
      value: "156",
      icon: Users,
      change: "+23 ce mois",
      changeType: "positive" as const,
      color: "text-green-600"
    },
    {
      title: "Revenus ce mois",
      value: "€2,840",
      icon: DollarSign,
      change: "+18% vs mois dernier",
      changeType: "positive" as const,
      color: "text-purple-600"
    },
    {
      title: "Note moyenne",
      value: "4.8/5",
      icon: Star,
      change: "+0.2 ce mois",
      changeType: "positive" as const,
      color: "text-orange-600"
    }
  ];

  const earningsData = [
    { name: 'Jan', value: 1200, heures: 48 },
    { name: 'Fév', value: 1850, heures: 52 },
    { name: 'Mar', value: 2100, heures: 58 },
    { name: 'Avr', value: 2450, heures: 62 },
    { name: 'Mai', value: 2840, heures: 68 },
    { name: 'Juin', value: 3200, heures: 72 }
  ];

  const subjectData = [
    { name: 'Mathématiques', value: 40 },
    { name: 'Français', value: 30 },
    { name: 'Anglais', value: 20 },
    { name: 'Sciences', value: 10 }
  ];

  const upcomingBookings = [
    { id: 1, student: 'Alice Martin', date: '2024-01-22', time: '14:00', subject: 'Mathématiques', type: 'Présentiel' },
    { id: 2, student: 'Thomas Petit', date: '2024-01-22', time: '16:00', subject: 'Français', type: 'À distance' },
    { id: 3, student: 'Emma Dubois', date: '2024-01-23', time: '10:00', subject: 'Anglais', type: 'Présentiel' },
  ];

  const recentEarnings = [
    { id: 1, student: 'Alice Martin', date: '2024-01-20', amount: '€80' },
    { id: 2, student: 'Thomas Petit', date: '2024-01-19', amount: '€120' },
    { id: 3, student: 'Emma Dubois', date: '2024-01-21', amount: '€95' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Formateur Externe</h1>
          <p className="text-gray-600">Gérez vos disponibilités et réservations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Profil vérifié
          </Badge>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Nouvelle disponibilité
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            color={stat.color}
          />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Évolution des revenus (6 derniers mois)"
          data={earningsData}
          type="area"
          dataKey="value"
          color="#3B82F6"
          height={300}
        />
        
        <DashboardChart
          title="Répartition par matière"
          data={subjectData}
          type="pie"
          height={300}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Réservations à venir
            </CardTitle>
            <CardDescription>Vos prochaines sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{booking.student}</h4>
                  <p className="text-xs text-gray-600">{booking.subject}</p>
                  <p className="text-xs text-gray-500">{booking.date} à {booking.time}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {booking.type}
                  </Badge>
                  <Button size="sm" className="ml-2">
                    Gérer
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Earnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Derniers revenus
            </CardTitle>
            <CardDescription>Vos dernières transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEarnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{earning.student}</h4>
                    <p className="text-xs text-gray-500">{earning.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{earning.amount}</div>
                    <Button size="sm" variant="outline">
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Accès rapide à vos outils principaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              variant="outline"
            >
              <Calendar className="h-6 w-6" />
              <span>Gérer planning</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <Users className="h-6 w-6" />
              <span>Voir étudiants</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <FileText className="h-6 w-6" />
              <span>Rapports</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Contacter support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ExternalTrainerDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/formateur-externe', icon: TrendingUp, isActive: true },
    { title: 'Disponibilités', href: '/formateur-externe/disponibilites', icon: Calendar },
    { title: 'Réservations', href: '/formateur-externe/reservations', icon: BookOpen },
    { title: 'Revenus', href: '/formateur-externe/revenus', icon: DollarSign },
    { title: 'Historique', href: '/formateur-externe/historique', icon: Clock },
    { title: 'Profil', href: '/formateur-externe/profil', icon: Users },
    { title: 'Avis', href: '/formateur-externe/avis', icon: Star },
    { title: 'Tarifs', href: '/formateur-externe/tarifs', icon: Award },
    { title: 'Spécialités', href: '/formateur-externe/specialites', icon: Target },
    { title: 'Support', href: '/formateur-externe/support', icon: MessageSquare },
    { title: 'Paramètres', href: '/formateur-externe/parametres', icon: Settings },
  ];

  const userInfo = {
    name: "Jean Martin",
    email: "jean.martin@learneezy.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Formateur Externe"
        subtitle="Freelance & Disponibilités"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<ExternalTrainerDashboardHome />} />
          <Route path="/disponibilites" element={<TrainerAvailabilities />} />
          <Route path="/reservations" element={<TrainerBookings />} />
          <Route path="/revenus" element={<TrainerEarnings />} />
          <Route path="/historique" element={<TrainerHistory />} />
          <Route path="/profil" element={<TrainerProfile />} />
          <Route path="/avis" element={<TrainerReviews />} />
          <Route path="/tarifs" element={<TrainerRates />} />
          <Route path="/specialites" element={<TrainerSpecialties />} />
          <Route path="/support" element={<TrainerSupport />} />
        </Routes>
      </main>
    </div>
  );
};

export default ExternalTrainerDashboard;
