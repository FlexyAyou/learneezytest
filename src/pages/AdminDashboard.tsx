import React from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, Shield, Settings, BarChart3, Headphones, Bell, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardSidebar from '@/components/DashboardSidebar';

const AdminDashboard = () => {
  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/admin", icon: Home, isActive: true },
    { title: "Statistiques", href: "/dashboard/admin/stats", icon: BarChart3 },
    { title: "Utilisateurs", href: "/dashboard/admin/users", icon: Users },
    { title: "Cours", href: "/dashboard/admin/courses", icon: BookOpen },
    { title: "Paiements", href: "/dashboard/admin/payments", icon: DollarSign },
    { title: "Sécurité", href: "/dashboard/admin/security", icon: Shield },
    { title: "Support", href: "/dashboard/admin/support", icon: Headphones, badge: "5" },
    { title: "Paramètres", href: "/dashboard/admin/settings", icon: Settings },
  ];

  const userInfo = {
    name: "Admin Système",
    email: "admin@infintiax.com"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Espace Admin"
          subtitle="Administration de la plateforme"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de bord Admin 🛡️
            </h1>
            <p className="text-gray-600">Gérez et supervisez votre plateforme d'apprentissage</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
                <Users className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+12.3% depuis le mois dernier</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours publiés</CardTitle>
                <BookOpen className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+8 ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€24,582</div>
                <p className="text-xs text-muted-foreground">+18.2% depuis le mois dernier</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4%</div>
                <p className="text-xs text-muted-foreground">+2.1% depuis la semaine dernière</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activité récente */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Les dernières actions sur la plateforme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Nouvel utilisateur inscrit</h3>
                      <p className="text-sm text-gray-600">Marie Dupont s'est inscrite</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Il y a 5 min</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Nouveau cours publié</h3>
                      <p className="text-sm text-gray-600">"Vue.js Avancé" par Pierre Martin</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Il y a 1h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-pink-600 mr-3" />
                      <span className="font-medium">Gérer les utilisateurs</span>
                    </div>
                  </button>
                  <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium">Modérer les cours</span>
                    </div>
                  </button>
                  <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-red-600 mr-3" />
                      <span className="font-medium">Logs de sécurité</span>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;