
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { ManagerDashboardHome } from '@/components/manager/ManagerDashboardHome';

const ManagerDashboard = () => {
  const sidebarItems = [
    { title: 'Vue d\'ensemble', href: '/dashboard/gestionnaire', icon: TrendingUp, isActive: true },
    { title: 'Apprenants', href: '/dashboard/gestionnaire/apprenants', icon: Users },
    { title: 'Formations', href: '/dashboard/gestionnaire/formations', icon: BookOpen },
    { title: 'Planning', href: '/dashboard/gestionnaire/planning', icon: Calendar },
    { title: 'Inscriptions', href: '/dashboard/gestionnaire/inscriptions', icon: UserCheck },
    { title: 'Suivi des présences', href: '/dashboard/gestionnaire/presences', icon: UserPlus },
    { title: 'Rapports', href: '/dashboard/gestionnaire/rapports', icon: ClipboardList },
    { title: 'Messages', href: '/dashboard/gestionnaire/messages', icon: MessageSquare },
    { title: 'Paramètres', href: '/dashboard/gestionnaire/parametres', icon: Settings },
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
          <Route path="apprenants" element={<div>Gestion des Apprenants</div>} />
          <Route path="formations" element={<div>Gestion des Formations</div>} />
          <Route path="planning" element={<ManagerPlanning />} />
          <Route path="inscriptions" element={<ManagerEnrollments />} />
          <Route path="presences" element={<ManagerAttendance />} />
          <Route path="rapports" element={<ManagerReports />} />
          <Route path="messages" element={<ManagerMessaging />} />
          <Route path="parametres" element={<ManagerSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerDashboard;
