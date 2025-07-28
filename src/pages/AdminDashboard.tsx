
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  Settings,
  Shield,
  FileText,
  Award,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  MessageSquare,
  Zap,
  Globe,
  Database
} from 'lucide-react';

import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminCourses } from '@/components/admin/AdminCourses';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminSecurity } from '@/components/admin/AdminSecurity';
import { AdminPayments } from '@/components/admin/AdminPayments';
import { AdminSupport } from '@/components/admin/AdminSupport';
import { StatsCard } from '@/components/common/StatsCard';
import { DashboardChart } from '@/components/common/DashboardChart';

const AdminDashboardHome = () => {
  const stats = [
    {
      title: "Utilisateurs totaux",
      value: "2,847",
      icon: Users,
      change: "+12% ce mois",
      changeType: "positive" as const,
      color: "text-blue-600"
    },
    {
      title: "Cours actifs",
      value: "156",
      icon: BookOpen,
      change: "+8 nouveaux",
      changeType: "positive" as const,
      color: "text-green-600"
    },
    {
      title: "Revenus ce mois",
      value: "€84,230",
      icon: DollarSign,
      change: "+18% vs dernier mois",
      changeType: "positive" as const,
      color: "text-purple-600"
    },
    {
      title: "Taux de satisfaction",
      value: "94%",
      icon: Award,
      change: "+2% ce trimestre",
      changeType: "positive" as const,
      color: "text-orange-600"
    }
  ];

  const userGrowthData = [
    { name: 'Jan', utilisateurs: 2100, revenus: 65000 },
    { name: 'Fév', utilisateurs: 2300, revenus: 68000 },
    { name: 'Mar', utilisateurs: 2450, revenus: 72000 },
    { name: 'Avr', utilisateurs: 2600, revenus: 76000 },
    { name: 'Mai', utilisateurs: 2750, revenus: 80000 },
    { name: 'Juin', utilisateurs: 2847, revenus: 84230 }
  ];

  const userTypeData = [
    { name: 'Étudiants', value: 2100 },
    { name: 'Formateurs', value: 450 },
    { name: 'Gestionnaires', value: 180 },
    { name: 'Tuteurs', value: 117 }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Utilisation serveur élevée (85%)', time: '2h' },
    { id: 2, type: 'info', message: 'Maintenance programmée demain à 2h', time: '1j' },
    { id: 3, type: 'success', message: 'Sauvegarde automatique terminée', time: '30min' },
  ];

  const topCourses = [
    { id: 1, title: 'Formation React Avancée', students: 245, rating: 4.8, revenue: '€12,450' },
    { id: 2, title: 'JavaScript Mastery', students: 189, rating: 4.7, revenue: '€9,876' },
    { id: 3, title: 'UI/UX Design Pro', students: 167, rating: 4.9, revenue: '€8,234' },
  ];

  const recentActivity = [
    { id: 1, user: 'Alice Martin', action: 'Inscription cours React', time: '2h' },
    { id: 2, user: 'Jean Dupont', action: 'Certificat obtenu', time: '3h' },
    { id: 3, user: 'Marie Claire', action: 'Nouveau cours créé', time: '5h' },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'info': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600">Gérez votre plateforme e-learning</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            Système opérationnel
          </Badge>
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Actions rapides
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
          title="Croissance des utilisateurs et revenus"
          data={userGrowthData}
          type="line"
          dataKey="utilisateurs"
          color="#3B82F6"
          height={300}
        />
        
        <DashboardChart
          title="Répartition des utilisateurs"
          data={userTypeData}
          type="pie"
          height={300}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Alertes Système
            </CardTitle>
            <CardDescription>Notifications importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Il y a {alert.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Cours Populaires
            </CardTitle>
            <CardDescription>Performances des formations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{course.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span>{course.students} étudiants</span>
                    <span>•</span>
                    <span>⭐ {course.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{course.revenue}</div>
                  <Button size="sm" variant="outline">
                    Voir
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
          <CardDescription>Dernières actions sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xs">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Il y a {activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/dashboard/admin', icon: BarChart3, isActive: true },
    { title: 'Utilisateurs', href: '/dashboard/admin/users', icon: Users },
    { title: 'Cours', href: '/dashboard/admin/courses', icon: BookOpen },
    { title: 'Statistiques', href: '/dashboard/admin/stats', icon: TrendingUp },
    { title: 'Paiements', href: '/dashboard/admin/payments', icon: DollarSign },
    { title: 'Support', href: '/dashboard/admin/support', icon: MessageSquare },
    { title: 'Sécurité', href: '/dashboard/admin/security', icon: Shield },
    { title: 'Rapports', href: '/dashboard/admin/reports', icon: FileText },
    { title: 'Paramètres', href: '/dashboard/admin/settings', icon: Settings },
  ];

  const userInfo = {
    name: "Admin System",
    email: "admin@learneezy.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Administration"
        subtitle="Gestion Plateforme"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<AdminDashboardHome />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/courses" element={<AdminCourses />} />
          <Route path="/stats" element={<AdminStats />} />
          <Route path="/payments" element={<AdminPayments />} />
          <Route path="/support" element={<AdminSupport />} />
          <Route path="/security" element={<AdminSecurity />} />
          <Route path="/reports" element={<AdminStats />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
