import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  FileText, 
  Settings, 
  MessageSquare, 
  Calendar,
  Award,
  ShoppingCart,
  CreditCard,
  Video,
  Users,
  Menu,
  X,
  Bell,
  Search,
  Home
} from 'lucide-react';
import { StudentDashboardHome } from '@/components/student/StudentDashboardHome';
import StudentCourses from '@/pages/StudentCourses';
import StudentProgress from '@/pages/StudentProgress';
import StudentCertificates from '@/pages/StudentCertificates';
import StudentMessaging from '@/pages/StudentMessaging';
import StudentSettings from '@/pages/StudentSettings';
import StudentInscriptions from '@/pages/student/StudentInscriptions';
import { StudentDocuments } from '@/components/student/StudentDocuments';
import { StudentShop } from '@/components/student/StudentShop';
import { StudentSubscription } from '@/components/student/StudentSubscription';
import StudentVideoConferences from '@/components/student/StudentVideoConferences';
import StudentTeachers from '@/pages/student/StudentTeachers';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/dashboard/etudiant', icon: Home },
    { name: 'Mes Cours', href: '/dashboard/etudiant/courses', icon: BookOpen },
    { name: 'Mon Progrès', href: '/dashboard/etudiant/progress', icon: Award },
    { name: 'Mes Profs', href: '/dashboard/etudiant/teachers', icon: Users },
    { name: 'Inscriptions', href: '/dashboard/etudiant/inscriptions', icon: Calendar },
    { name: 'Documents', href: '/dashboard/etudiant/documents', icon: FileText },
    { name: 'Visioconférences', href: '/dashboard/etudiant/video', icon: Video },
    { name: 'Boutique', href: '/dashboard/etudiant/shop', icon: ShoppingCart },
    { name: 'Abonnement', href: '/dashboard/etudiant/subscription', icon: CreditCard },
    { name: 'Messages', href: '/dashboard/etudiant/messaging', icon: MessageSquare },
    { name: 'Certificats', href: '/dashboard/etudiant/certificates', icon: Award },
    { name: 'Paramètres', href: '/dashboard/etudiant/settings', icon: Settings },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Étudiant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = currentPath === item.href || 
                              (item.href !== '/dashboard/etudiant' && currentPath.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">Tableau de bord étudiant</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<StudentDashboardHome />} />
            <Route path="/courses/*" element={<StudentCourses />} />
            <Route path="/progress" element={<StudentProgress />} />
            <Route path="/teachers" element={<StudentTeachers />} />
            <Route path="/inscriptions" element={<StudentInscriptions />} />
            <Route path="/documents" element={<StudentDocuments />} />
            <Route path="/video" element={<StudentVideoConferences />} />
            <Route path="/shop" element={<StudentShop />} />
            <Route path="/subscription" element={<StudentSubscription />} />
            <Route path="/messaging" element={<StudentMessaging />} />
            <Route path="/certificates" element={<StudentCertificates />} />
            <Route path="/settings" element={<StudentSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
