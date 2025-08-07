import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Settings, BarChart3, Shield, Key, FileText, MessageSquare, Video, Download, Brain, TestTube, Home, UserCheck, PenTool, Mail, FileSignature, Building, CreditCard } from 'lucide-react';
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
import AdminVideoConferences from './admin/AdminVideoConferences';
import { PositioningTest } from '@/components/common/PositioningTest';
import { AddUser } from '@/components/admin/AddUser';
import AIChatButton from '@/components/common/AIChatButton';
import { GroupEnrollment } from '@/components/admin/GroupEnrollment';
import UserDetailPage from '@/components/admin/UserDetailPage';
import AdminEmargements from '@/components/admin/AdminEmargements';
import { OFDashboard } from '@/components/admin/OFDashboard';
import AdminOrganisations from '@/components/admin/AdminOrganisations';
import AdminLibrary from '@/components/admin/AdminLibrary';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import AdminDocuments from '@/components/admin/AdminDocuments';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/superadmin", icon: Home, isActive: currentPath === "/dashboard/superadmin" },
    { title: "Utilisateurs", href: "/dashboard/superadmin/users", icon: Users, isActive: currentPath === "/dashboard/superadmin/users" },
    { title: "Organismes de formations", href: "/dashboard/superadmin/organisations", icon: Building, isActive: currentPath === "/dashboard/superadmin/organisations" },
    { title: "Cours", href: "/dashboard/superadmin/courses", icon: BookOpen, isActive: currentPath === "/dashboard/superadmin/courses" },
    { title: "Documents", href: "/dashboard/superadmin/documents", icon: FileText, isActive: currentPath === "/dashboard/superadmin/documents" },
    // === SECTION OF COMPLÈTE ===
    { title: "Inscriptions", href: "/dashboard/superadmin/inscriptions", icon: UserCheck, isActive: currentPath === "/dashboard/superadmin/inscriptions" },
    { title: "Documents OF", href: "/dashboard/superadmin/of-documents", icon: FileText, isActive: currentPath === "/dashboard/superadmin/of-documents" },
    { title: "Conventions", href: "/dashboard/superadmin/conventions", icon: FileSignature, isActive: currentPath === "/dashboard/superadmin/conventions" },
    { title: "Envois automatiques", href: "/dashboard/superadmin/mailings", icon: Mail, isActive: currentPath === "/dashboard/superadmin/mailings" },
    { title: "Émargements", href: "/dashboard/superadmin/emargements", icon: PenTool, isActive: currentPath === "/dashboard/superadmin/emargements" },
    // === SECTION ADMINISTRATION ===
    { title: "Gestion licences", href: "/dashboard/superadmin/licenses", icon: Key, isActive: currentPath === "/dashboard/superadmin/licenses" },
    { title: "Vérification identité", href: "/dashboard/superadmin/identity", icon: Shield, isActive: currentPath === "/dashboard/superadmin/identity" },
    { title: "Tests positionnement", href: "/dashboard/superadmin/tests", icon: TestTube, isActive: currentPath === "/dashboard/superadmin/tests" },
    { title: "Visioconférence", href: "/dashboard/superadmin/video", icon: Video, isActive: currentPath === "/dashboard/superadmin/video" },
    { title: "Bibliothèque", href: "/dashboard/superadmin/library", icon: Download, isActive: currentPath === "/dashboard/superadmin/library" },
    { title: "Abonnements", href: "/dashboard/superadmin/subscriptions", icon: CreditCard, isActive: currentPath === "/dashboard/superadmin/subscriptions" },
    { title: "Paiements", href: "/dashboard/superadmin/payments", icon: DollarSign, isActive: currentPath === "/dashboard/superadmin/payments" },
    { title: "Sécurité", href: "/dashboard/superadmin/security", icon: Shield, isActive: currentPath === "/dashboard/superadmin/security" },
    { title: "Support", href: "/dashboard/superadmin/support", icon: MessageSquare, isActive: currentPath === "/dashboard/superadmin/support" },
    { title: "Paramètres", href: "/dashboard/superadmin/settings", icon: Settings, isActive: currentPath === "/dashboard/superadmin/settings" },
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
            <Route path="/users/:userSlug" element={<UserDetailPage />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/users/group-enrollment" element={<GroupEnrollment />} />
            <Route path="/organisations" element={<AdminOrganisations />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/documents" element={<AdminDocuments />} />
            <Route path="/licenses" element={<LicenseManagement />} />
            <Route path="/identity" element={<IdentityVerification />} />
            <Route path="/tests" element={<PositioningTest userRole="admin" />} />
            <Route path="/inscriptions" element={<AdminInscriptions />} />
            <Route path="/of-documents" element={<AdminDocumentsOF />} />
            <Route path="/conventions" element={<AdminConventionGenerator />} />
            <Route path="/mailings" element={<AdminAutomaticMailings />} />
            <Route path="/emargements" element={<AdminEmargements />} />
            <Route path="/video" element={<AdminVideoConferences />} />
            <Route path="/library" element={<AdminLibrary />} />
            <Route path="/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/payments" element={<AdminPayments />} />
            <Route path="/security" element={<AdminSecurity />} />
            <Route path="/support" element={<AdminSupport />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
      <AIChatButton />
    </div>
  );
};

export default AdminDashboard;
