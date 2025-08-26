import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { SuperAdminDashboard } from '@/components/admin/SuperAdminDashboard';
import { AdminUsers } from '@/components/admin/AdminUsers';
import AdminTrainers from '@/components/admin/AdminTrainers';
import AdminOrganisations from '@/components/admin/AdminOrganisations';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminSecurity from '@/components/admin/AdminSecurity';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import AdminSupport from '@/components/admin/AdminSupport';
import { AddUser } from '@/components/admin/AddUser';
import StudentDetailPage from './admin/StudentDetailPage';
import TrainerDetailPage from './admin/TrainerDetailPage';
import IndependentTrainerDetailPage from './admin/IndependentTrainerDetailPage';
import ManagerDetailPage from './admin/ManagerDetailPage';
import AnimatorDetailPage from './admin/AnimatorDetailPage';
import AdminDetailPage from './admin/AdminDetailPage';
import OrganismeDetail from './admin/OrganismeDetail';
import SuperAdminDocuments from './admin/SuperAdminDocuments';
import AdminInscriptions from './admin/AdminInscriptions';
import AdminDocumentsOF from './admin/AdminDocumentsOF';
import AdminConventionGenerator from './admin/AdminConventionGenerator';
import AdminAutomaticMailings from './admin/AdminAutomaticMailings';
import AdminVideoConferences from './admin/AdminVideoConferences';
import { AdminEmargements } from '@/components/admin/AdminEmargements';
import { OFLicences } from '@/components/admin/OFLicences';
import { IdentityVerification } from '@/components/admin/IdentityVerification';
import { PositioningTest } from '@/components/common/PositioningTest';
import { 
  Building,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  CreditCard,
  DollarSign,
  MessageSquare,
  UserCheck,
  FileText,
  FileSignature,
  Mail,
  PenTool,
  Key,
  TestTube,
  Video,
  Download,
  Home,
  GraduationCap
} from 'lucide-react';
import CreateOrganisme from './admin/CreateOrganisme';

const AdminDashboard = () => {
  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/superadmin", icon: Home, isActive: false },
    { title: "Utilisateurs", href: "/dashboard/superadmin/users", icon: Users, isActive: false },
    { title: "Formateurs", href: "/dashboard/superadmin/trainers", icon: GraduationCap, isActive: false },
    { title: "Organismes de formations", href: "/dashboard/superadmin/organisations", icon: Building, isActive: false },
    { title: "Cours", href: "/dashboard/superadmin/courses", icon: BookOpen, isActive: false },
    { title: "Inscriptions", href: "/dashboard/superadmin/inscriptions", icon: UserCheck, isActive: false },
    { title: "Documents OF", href: "/dashboard/superadmin/of-documents", icon: FileText, isActive: false },
    { title: "Conventions", href: "/dashboard/superadmin/conventions", icon: FileSignature, isActive: false },
    { title: "Envois automatiques", href: "/dashboard/superadmin/mailings", icon: Mail, isActive: false },
    { title: "Émargements", href: "/dashboard/superadmin/emargements", icon: PenTool, isActive: false },
    { title: "Gestion licences", href: "/dashboard/superadmin/licenses", icon: Key, isActive: false },
    { title: "Vérification identité", href: "/dashboard/superadmin/identity", icon: Shield, isActive: false },
    { title: "Tests positionnement", href: "/dashboard/superadmin/tests", icon: TestTube, isActive: false },
    { title: "Visioconférence", href: "/dashboard/superadmin/video", icon: Video, isActive: false },
    { title: "Bibliothèque", href: "/dashboard/superadmin/library", icon: Download, isActive: false },
    { title: "Abonnements", href: "/dashboard/superadmin/subscriptions", icon: CreditCard, isActive: false },
    { title: "Paiements", href: "/dashboard/superadmin/payments", icon: DollarSign, isActive: false },
    { title: "Sécurité", href: "/dashboard/superadmin/security", icon: Shield, isActive: false },
    { title: "Support", href: "/dashboard/superadmin/support", icon: MessageSquare, isActive: false },
    { title: "Paramètres", href: "/dashboard/superadmin/settings", icon: Settings, isActive: false },
  ];

  const userInfo = {
    name: "Super Admin",
    email: "superadmin@Learneezy.com"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Super Administration"
          subtitle="Gestion de la plateforme"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64">
        <div className="h-full flex flex-col">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Routes>
                <Route index element={<SuperAdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/add" element={<AddUser />} />
                <Route path="users/student/:userSlug" element={<StudentDetailPage />} />
                <Route path="users/trainer/:userSlug" element={<TrainerDetailPage />} />
                <Route path="users/independent-trainer/:userSlug" element={<IndependentTrainerDetailPage />} />
                <Route path="users/manager/:userSlug" element={<ManagerDetailPage />} />
                <Route path="users/animator/:userSlug" element={<AnimatorDetailPage />} />
                <Route path="users/admin/:userSlug" element={<AdminDetailPage />} />
                <Route path="trainers" element={<AdminTrainers />} />
                <Route path="organisations" element={<AdminOrganisations />} />
                <Route path="organisations/create" element={<CreateOrganisme />} />
                <Route path="organisations/:id" element={<OrganismeDetail />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="inscriptions" element={<AdminInscriptions />} />
                <Route path="of-documents" element={<AdminDocumentsOF />} />
                <Route path="conventions" element={<AdminConventionGenerator />} />
                <Route path="mailings" element={<AdminAutomaticMailings />} />
                <Route path="emargements" element={<AdminEmargements />} />
                <Route path="licenses" element={<OFLicences />} />
                <Route path="identity" element={<IdentityVerification />} />
                <Route path="tests" element={<PositioningTestPage />} />
                <Route path="video" element={<AdminVideoConferences />} />
                <Route path="library" element={<SuperAdminDocuments />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="security" element={<AdminSecurity />} />
                <Route path="support" element={<AdminSupport />} />
                <Route path="settings" element={<AdminSettings />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Composant wrapper pour les tests de positionnement
const PositioningTestPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tests de positionnement</h1>
        <p className="text-gray-600">Gestion des tests de positionnement pour les apprenants</p>
      </div>
      <PositioningTest userRole="admin" />
    </div>
  );
};

export default AdminDashboard;
