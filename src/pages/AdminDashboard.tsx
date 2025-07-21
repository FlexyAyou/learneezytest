
import React from 'react';
import { Users, BookOpen, DollarSign, AlertTriangle, UserCheck, Settings, Shield, TrendingUp, MoreHorizontal, Home, Database, MessageSquare, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminStats from '@/components/admin/AdminStats';
import AdminSupport from '@/components/admin/AdminSupport';
import AdminSecurity from '@/components/admin/AdminSecurity';
import AdminSettings from '@/components/admin/AdminSettings';

const AdminDashboardHome = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const recentUsers = [
    { id: 1, name: "Marie Dubois", email: "marie@email.com", type: "Instructeur", status: "Actif" },
    { id: 2, name: "Pierre Martin", email: "pierre@email.com", type: "Étudiant", status: "Actif" },
    { id: 3, name: "Sophie Durand", email: "sophie@email.com", type: "Instructeur", status: "En attente" }
  ];

  const pendingCourses = [
    { id: 1, title: "Python pour Data Science", instructor: "Jean Dupont", status: "En révision" },
    { id: 2, title: "Design Thinking", instructor: "Marie Claire", status: "En attente" }
  ];

  const handleUserAction = (userId: number, action: string) => {
    toast({
      title: `Action utilisateur`,
      description: `${action} pour l'utilisateur ${userId}`,
    });
  };

  const handleReviewCourse = (courseId: number) => {
    navigate('/dashboard/admin/courses');
    toast({
      title: "Révision de cours",
      description: `Ouverture de l'interface de révision pour le cours ${courseId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/admin/users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,248</div>
            <p className="text-xs text-muted-foreground">+12% ce mois-ci</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/admin/courses')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours total</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+23 cette semaine</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/admin/payments')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€234,567</div>
            <p className="text-xs text-muted-foreground">+8.2% vs mois dernier</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/admin/stats')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de croissance</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground">Nouvelles inscriptions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Utilisateurs récents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs récents</CardTitle>
              <CardDescription>Gérez les nouveaux utilisateurs et leurs permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-pink-600 font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {user.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'Actif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'Approuver')}
                            title="Approuver l'utilisateur"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'Plus d\'options')}
                            title="Plus d'options"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cours en attente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Cours en attente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingCourses.map((course) => (
                <div key={course.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-sm">{course.title}</h4>
                  <p className="text-xs text-gray-600">par {course.instructor}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {course.status}
                    </span>
                    <Button 
                      size="sm" 
                      className="bg-pink-600 hover:bg-pink-700"
                      onClick={() => handleReviewCourse(course.id)}
                    >
                      Réviser
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alertes système */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Alertes système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors" onClick={() => navigate('/dashboard/admin/security')}>
                <p className="text-sm font-medium text-red-800">Pic de trafic détecté</p>
                <p className="text-xs text-red-600">Surveillance des performances recommandée</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => navigate('/dashboard/admin/settings')}>
                <p className="text-sm font-medium text-yellow-800">Maintenance programmée</p>
                <p className="text-xs text-yellow-600">Dimanche 2h00 - 4h00</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => navigate('/dashboard/admin/support')}>
                <p className="text-sm font-medium text-blue-800">12 nouveaux tickets</p>
                <p className="text-xs text-blue-600">Support client en attente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/admin", icon: Home, isActive: currentPath === "/dashboard/admin" },
    { title: "Utilisateurs", href: "/dashboard/admin/users", icon: Users, isActive: currentPath === "/dashboard/admin/users" },
    { title: "Cours", href: "/dashboard/admin/courses", icon: BookOpen, badge: "5", isActive: currentPath === "/dashboard/admin/courses" },
    { title: "Paiements", href: "/dashboard/admin/payments", icon: DollarSign, isActive: currentPath === "/dashboard/admin/payments" },
    { title: "Statistiques", href: "/dashboard/admin/stats", icon: BarChart3, isActive: currentPath === "/dashboard/admin/stats" },
    { title: "Support", href: "/dashboard/admin/support", icon: MessageSquare, badge: "12", isActive: currentPath === "/dashboard/admin/support" },
    { title: "Sécurité", href: "/dashboard/admin/security", icon: Shield, isActive: currentPath === "/dashboard/admin/security" },
    { title: "Paramètres", href: "/dashboard/admin/settings", icon: Settings, isActive: currentPath === "/dashboard/admin/settings" },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const AdminDashboard = () => {

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-background border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Administration InfinitiaX</h1>
                  <p className="text-muted-foreground">Gérez la plateforme et supervisez les activités</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route index element={<AdminDashboardHome />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="security" element={<AdminSecurity />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
