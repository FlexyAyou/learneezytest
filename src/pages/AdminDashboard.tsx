import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Settings, BarChart3, Shield, Key, FileText, MessageSquare, Video, Download, Brain, TestTube, Home, UserCheck, PenTool, Mail, FileSignature, Building, CreditCard, Database, Coins } from 'lucide-react';
import AdminInscriptions from './admin/AdminInscriptions';
import AdminDocumentsOF from './admin/AdminDocumentsOF';
import AdminAutomaticMailings from './admin/AdminAutomaticMailings';
import AdminConventionGenerator from './admin/AdminConventionGenerator';
import SuperAdminDocuments from './admin/SuperAdminDocuments';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import AdminStats from '@/components/admin/AdminStats';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminSecurity from '@/components/admin/AdminSecurity';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminSupport from '@/components/admin/AdminSupport';
import AdminTrainers from '@/components/admin/AdminTrainers';
import AdminPromotions from '@/components/admin/AdminPromotions';
import { LicenseManagement } from '@/components/admin/LicenseManagement';
import { IdentityVerification } from '@/components/admin/IdentityVerification';
import AdminVideoConferences from './admin/AdminVideoConferences';
import { PositioningTest } from '@/components/common/PositioningTest';
import { AddUser } from '@/components/admin/AddUser';
import AIChatButton from '@/components/common/AIChatButton';
import { GroupEnrollment } from '@/components/admin/GroupEnrollment';
import UserDetailPage from '@/components/admin/UserDetailPage';
import AdminEmargements from '@/components/admin/AdminEmargements';
import { SuperAdminDashboard } from '@/components/admin/SuperAdminDashboard';
import AdminOrganisations from '@/components/admin/AdminOrganisations';
import AdminRessources from '@/components/admin/AdminRessources';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import OrganismeDetail from './admin/OrganismeDetail';
import AdminTokens from '@/components/admin/AdminTokens';
import { useTranslation } from '@/hooks/useTranslation';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const sidebarItems = [
    { title: t('dashboard.admin.dashboard'), href: "/dashboard/superadmin", icon: Home, isActive: currentPath === "/dashboard/superadmin" },
    { title: t('dashboard.admin.users'), href: "/dashboard/superadmin/users", icon: Users, isActive: currentPath === "/dashboard/superadmin/users" },
    { title: t('dashboard.admin.trainers'), href: "/dashboard/superadmin/trainers", icon: UserCheck, isActive: currentPath === "/dashboard/superadmin/trainers" },
    { title: t('dashboard.admin.organizations'), href: "/dashboard/superadmin/organisations", icon: Building, isActive: currentPath === "/dashboard/superadmin/organisations" },
    { title: t('dashboard.admin.courses'), href: "/dashboard/superadmin/courses", icon: BookOpen, isActive: currentPath === "/dashboard/superadmin/courses" },
    { title: t('dashboard.admin.documents'), href: "/dashboard/superadmin/documents", icon: FileText, isActive: currentPath === "/dashboard/superadmin/documents" },
    { title: t('dashboard.admin.inscriptions'), href: "/dashboard/superadmin/inscriptions", icon: UserCheck, isActive: currentPath === "/dashboard/superadmin/inscriptions" },
    { title: t('dashboard.admin.ofDocuments'), href: "/dashboard/superadmin/of-documents", icon: FileText, isActive: currentPath === "/dashboard/superadmin/of-documents" },
    { title: t('dashboard.admin.conventions'), href: "/dashboard/superadmin/conventions", icon: FileSignature, isActive: currentPath === "/dashboard/superadmin/conventions" },
    { title: t('dashboard.admin.mailings'), href: "/dashboard/superadmin/mailings", icon: Mail, isActive: currentPath === "/dashboard/superadmin/mailings" },
    { title: t('dashboard.admin.attendance'), href: "/dashboard/superadmin/emargements", icon: PenTool, isActive: currentPath === "/dashboard/superadmin/emargements" },
    { title: t('dashboard.admin.promotions'), href: "/dashboard/superadmin/promotions", icon: TestTube, isActive: currentPath === "/dashboard/superadmin/promotions" },
    { title: t('dashboard.admin.tokens'), href: "/dashboard/superadmin/tokens", icon: Coins, isActive: currentPath === "/dashboard/superadmin/tokens" },
    { title: t('dashboard.admin.licenses'), href: "/dashboard/superadmin/licenses", icon: Key, isActive: currentPath === "/dashboard/superadmin/licenses" },
    { title: t('dashboard.admin.identity'), href: "/dashboard/superadmin/identity", icon: Shield, isActive: currentPath === "/dashboard/superadmin/identity" },
    { title: t('dashboard.admin.tests'), href: "/dashboard/superadmin/tests", icon: TestTube, isActive: currentPath === "/dashboard/superadmin/tests" },
    { title: t('dashboard.admin.videoConference'), href: "/dashboard/superadmin/video", icon: Video, isActive: currentPath === "/dashboard/superadmin/video" },
    { title: t('dashboard.admin.resources'), href: "/dashboard/superadmin/ressources", icon: Database, isActive: currentPath === "/dashboard/superadmin/ressources" },
    { title: t('dashboard.admin.subscriptions'), href: "/dashboard/superadmin/subscriptions", icon: CreditCard, isActive: currentPath === "/dashboard/superadmin/subscriptions" },
    { title: t('dashboard.admin.payments'), href: "/dashboard/superadmin/payments", icon: DollarSign, isActive: currentPath === "/dashboard/superadmin/payments" },
    { title: t('dashboard.admin.security'), href: "/dashboard/superadmin/security", icon: Shield, isActive: currentPath === "/dashboard/superadmin/security" },
    { title: t('dashboard.admin.support'), href: "/dashboard/superadmin/support", icon: MessageSquare, isActive: currentPath === "/dashboard/superadmin/support" },
    { title: t('dashboard.admin.settings'), href: "/dashboard/superadmin/settings", icon: Settings, isActive: currentPath === "/dashboard/superadmin/settings" },
  ];

  const userInfo = {
    name: "Super Admin",
    email: "superadmin@Learneezy.com"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title={t('dashboard.admin.title')}
          subtitle={t('dashboard.admin.subtitle')}
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.admin.welcomeTitle')}</h1>
                  <p className="text-gray-600">{t('dashboard.admin.welcomeSubtitle')}</p>
                </div>
                <SuperAdminDashboard />
              </div>
            } />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/users/:userSlug" element={<UserDetailPage />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/users/group-enrollment" element={<GroupEnrollment />} />
            <Route path="/trainers" element={<AdminTrainers />} />
            <Route path="/organisations" element={<AdminOrganisations />} />
            <Route path="/organisations/:id" element={<OrganismeDetail />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/documents" element={<SuperAdminDocuments />} />
            <Route path="/licenses" element={<LicenseManagement />} />
            <Route path="/identity" element={<IdentityVerification />} />
            <Route path="/tests" element={<PositioningTest userRole="admin" />} />
            <Route path="/inscriptions" element={<AdminInscriptions />} />
            <Route path="/of-documents" element={<AdminDocumentsOF />} />
            <Route path="/conventions" element={<AdminConventionGenerator />} />
            <Route path="/mailings" element={<AdminAutomaticMailings />} />
            <Route path="/emargements" element={<AdminEmargements />} />
            <Route path="/promotions" element={<AdminPromotions />} />
            <Route path="/tokens" element={<AdminTokens />} />
            <Route path="/video" element={<AdminVideoConferences />} />
            <Route path="/ressources" element={<AdminRessources />} />
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
