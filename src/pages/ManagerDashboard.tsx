
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  ClipboardList,
  Settings,
  MessageSquare,
  UserPlus,
  FileText
} from 'lucide-react';
import ManagerPlanning from '@/components/manager/ManagerPlanning';
import ManagerAttendance from '@/components/manager/ManagerAttendance';
import ManagerEnrollments from '@/components/manager/ManagerEnrollments';
import ManagerSettings from '@/components/manager/ManagerSettings';
import ManagerMessaging from '@/components/manager/ManagerMessaging';
import ManagerReports from '@/components/manager/ManagerReports';
import ManagerApprenants from '@/components/manager/ManagerApprenants';
import ManagerFormations from '@/components/manager/ManagerFormations';
import { ManagerDashboardHome } from '@/components/manager/ManagerDashboardHome';
import AIChatButton from '@/components/common/AIChatButton';

const ManagerDashboard = () => {
  const location = useLocation();

  const sidebarItems = [
    { 
      title: 'Vue d\'ensemble', 
      href: '/dashboard/gestionnaire', 
      icon: TrendingUp, 
      isActive: location.pathname === '/dashboard/gestionnaire' 
    },
    { 
      title: 'Apprenants', 
      href: '/dashboard/gestionnaire/apprenants', 
      icon: Users, 
      isActive: location.pathname === '/dashboard/gestionnaire/apprenants' 
    },
    { 
      title: 'Formations', 
      href: '/dashboard/gestionnaire/formations', 
      icon: BookOpen, 
      isActive: location.pathname === '/dashboard/gestionnaire/formations' 
    },
    { 
      title: 'Planning', 
      href: '/dashboard/gestionnaire/planning', 
      icon: Calendar, 
      isActive: location.pathname === '/dashboard/gestionnaire/planning' 
    },
    { 
      title: 'Inscriptions', 
      href: '/dashboard/gestionnaire/inscriptions', 
      icon: UserCheck, 
      isActive: location.pathname === '/dashboard/gestionnaire/inscriptions' 
    },
    { 
      title: 'Suivi des présences', 
      href: '/dashboard/gestionnaire/presences', 
      icon: UserPlus, 
      isActive: location.pathname === '/dashboard/gestionnaire/presences' 
    },
    { 
      title: 'Rapports', 
      href: '/dashboard/gestionnaire/rapports', 
      icon: ClipboardList, 
      isActive: location.pathname === '/dashboard/gestionnaire/rapports' 
    },
    { 
      title: 'Messages', 
      href: '/dashboard/gestionnaire/messages', 
      icon: MessageSquare, 
      isActive: location.pathname === '/dashboard/gestionnaire/messages' 
    },
    { 
      title: 'Paramètres', 
      href: '/dashboard/gestionnaire/parametres', 
      icon: Settings, 
      isActive: location.pathname === '/dashboard/gestionnaire/parametres' 
    },
  ];

  const userInfo = {
    name: "Sophie Laurent",
    email: "sophie.laurent@learneezy.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Gestionnaire"
        subtitle="Supervision des formations"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<ManagerDashboardHome />} />
          <Route path="apprenants" element={<ManagerApprenants />} />
          <Route path="formations" element={<ManagerFormations />} />
          <Route path="planning" element={<ManagerPlanning />} />
          <Route path="inscriptions" element={<ManagerEnrollments />} />
          <Route path="presences" element={<ManagerAttendance />} />
          <Route path="rapports" element={<ManagerReports />} />
          <Route path="messages" element={<ManagerMessaging />} />
          <Route path="parametres" element={<ManagerSettings />} />
        </Routes>
      </main>
      <AIChatButton />
    </div>
  );
};

export default ManagerDashboard;
