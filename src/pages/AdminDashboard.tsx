
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Settings, BarChart3, Shield, Key, FileText, MessageSquare, Video, Download, Brain, TestTube, Home, UserCheck, PenTool, Mail, FileSignature } from 'lucide-react';
import AdminInscriptions from './admin/AdminInscriptions';
import AdminDocumentsOF from './admin/AdminDocumentsOF';
import AdminAutomaticMailings from './admin/AdminAutomaticMailings';
import AdminConventionGenerator from './admin/AdminConventionGenerator';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import AdminStats from '@/components/admin/AdminStats';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminSecurity from '@/components/admin/AdminSecurity';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminSupport from '@/components/admin/AdminSupport';
import { LicenseManagement } from '@/components/admin/LicenseManagement';
import { IdentityVerification } from '@/components/admin/IdentityVerification';
import { DocumentDownload } from '@/components/common/DocumentDownload';
import AIChat from '@/components/common/AIChat';
import VideoConference from '@/components/common/VideoConference';
import { PositioningTest } from '@/components/common/PositioningTest';
import { AddUser } from '@/components/admin/AddUser';
import { GroupEnrollment } from '@/components/admin/GroupEnrollment';
import AdminEmargements from '@/components/admin/AdminEmargements';
import { OFDashboard } from '@/components/admin/OFDashboard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/admin", icon: Home, isActive: currentPath === "/dashboard/admin" },
    { title: "Utilisateurs", href: "/dashboard/admin/users", icon: Users, isActive: currentPath === "/dashboard/admin/users" },
    { title: "Cours", href: "/dashboard/admin/courses", icon: BookOpen, isActive: currentPath === "/dashboard/admin/courses" },
    // === SECTION OF COMPLÈTE ===
    { title: "Inscriptions", href: "/dashboard/admin/inscriptions", icon: UserCheck, isActive: currentPath === "/dashboard/admin/inscriptions" },
    { title: "Documents OF", href: "/dashboard/admin/of-documents", icon: FileText, isActive: currentPath === "/dashboard/admin/of-documents" },
    { title: "Conventions", href: "/dashboard/admin/conventions", icon: FileSignature, isActive: currentPath === "/dashboard/admin/conventions" },
    { title: "Envois automatiques", href: "/dashboard/admin/mailings", icon: Mail, isActive: currentPath === "/dashboard/admin/mailings" },
    { title: "Émargements", href: "/dashboard/admin/emargements", icon: PenTool, isActive: currentPath === "/dashboard/admin/emargements" },
    // === SECTION ADMINISTRATION ===
    { title: "Gestion licences", href: "/dashboard/admin/licenses", icon: Key, isActive: currentPath === "/dashboard/admin/licenses" },
    { title: "Vérification identité", href: "/dashboard/admin/identity", icon: Shield, isActive: currentPath === "/dashboard/admin/identity" },
    { title: "Tests positionnement", href: "/dashboard/admin/tests", icon: TestTube, isActive: currentPath === "/dashboard/admin/tests" },
    { title: "Visioconférence", href: "/dashboard/admin/video", icon: Video, isActive: currentPath === "/dashboard/admin/video" },
    { title: "Chat IA", href: "/dashboard/admin/chat", icon: Brain, isActive: currentPath === "/dashboard/admin/chat" },
    { title: "Tous les documents", href: "/dashboard/admin/documents", icon: Download, isActive: currentPath === "/dashboard/admin/documents" },
    { title: "Paiements", href: "/dashboard/admin/payments", icon: DollarSign, isActive: currentPath === "/dashboard/admin/payments" },
    { title: "Sécurité", href: "/dashboard/admin/security", icon: Shield, isActive: currentPath === "/dashboard/admin/security" },
    { title: "Support", href: "/dashboard/admin/support", icon: MessageSquare, isActive: currentPath === "/dashboard/admin/support" },
    { title: "Paramètres", href: "/dashboard/admin/settings", icon: Settings, isActive: currentPath === "/dashboard/admin/settings" },
  ];

  const userInfo = {
    name: "Admin Système",
    email: "admin@Learneezy.com"
  };

  const mockAllDocuments = [
    { id: '1', name: 'Rapport_Global_2024.pdf', type: 'PDF', date: '2024-01-20', size: '5.2 MB' },
    { id: '2', name: 'Logs_Systeme_Jan.zip', type: 'ZIP', date: '2024-01-19', size: '12.1 MB' },
    { id: '3', name: 'Statistiques_Cours.xlsx', type: 'XLSX', date: '2024-01-18', size: '3.8 MB' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Administration"
          subtitle="Gestion de la plateforme"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<OFDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/users/group-enrollment" element={<GroupEnrollment />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/licenses" element={<LicenseManagement />} />
            <Route path="/identity" element={<IdentityVerification />} />
            <Route path="/tests" element={<PositioningTest userRole="admin" />} />
            <Route path="/inscriptions" element={<AdminInscriptions />} />
            <Route path="/of-documents" element={<AdminDocumentsOF />} />
            <Route path="/conventions" element={<AdminConventionGenerator />} />
            <Route path="/mailings" element={<AdminAutomaticMailings />} />
            <Route path="/emargements" element={<AdminEmargements />} />
            <Route path="/video" element={<VideoConference isHost={true} />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/documents" element={<DocumentDownload documents={mockAllDocuments} userRole="admin" />} />
            <Route path="/payments" element={<AdminPayments />} />
            <Route path="/security" element={<AdminSecurity />} />
            <Route path="/support" element={<AdminSupport />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
