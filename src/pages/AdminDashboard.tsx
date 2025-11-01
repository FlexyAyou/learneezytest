import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { SuperAdminSidebar } from '@/components/admin/SuperAdminSidebar';
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
import { AddUserPage } from '@/components/admin/AddUserPage';
import StudentDetailPage from './admin/StudentDetailPage';
import TrainerDetailPage from './admin/TrainerDetailPage';
import IndependentTrainerDetailPage from './admin/IndependentTrainerDetailPage';
import ManagerDetailPage from './admin/ManagerDetailPage';
import AnimatorDetailPage from './admin/AnimatorDetailPage';
import AdminDetailPage from './admin/AdminDetailPage';
import SuperAdminDetailPage from './admin/SuperAdminDetailPage';
import TutorDetailPage from './admin/TutorDetailPage';
import OFStudentDetailPageSuperadmin from './admin/OFStudentDetailPageSuperadmin';
import OFManagerDetailPageSuperadmin from './admin/OFManagerDetailPageSuperadmin';
import OFTrainerDetailPageSuperadmin from './admin/OFTrainerDetailPageSuperadmin';
import OFAdminDetailPageSuperadmin from './admin/OFAdminDetailPageSuperadmin';
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
import CreateCoursePage from './admin/CreateCoursePage';
import CourseDetailPage from './admin/CourseDetailPage';
import EditCourse from './EditCourse';

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SuperAdminSidebar />
        
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 shadow-sm">
            <SidebarTrigger className="flex-shrink-0" />
            <div className="flex-1" />
          </header>
          
          <main className="flex-1 p-6">
            <Routes>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/add" element={<AddUserPage />} />
              <Route path="users/student/:userSlug" element={<StudentDetailPage />} />
              <Route path="users/trainer/:userSlug" element={<TrainerDetailPage />} />
              <Route path="users/independent-trainer/:userSlug" element={<IndependentTrainerDetailPage />} />
              <Route path="users/manager/:userSlug" element={<ManagerDetailPage />} />
              <Route path="users/animator/:userSlug" element={<AnimatorDetailPage />} />
              <Route path="users/admin/:userSlug" element={<AdminDetailPage />} />
              <Route path="users/superadmin/:userSlug" element={<SuperAdminDetailPage />} />
              <Route path="users/tutor/:userSlug" element={<TutorDetailPage />} />
              <Route path="users/of-student/:userSlug" element={<OFStudentDetailPageSuperadmin />} />
              <Route path="users/of-manager/:userSlug" element={<OFManagerDetailPageSuperadmin />} />
              <Route path="users/of-trainer/:userSlug" element={<OFTrainerDetailPageSuperadmin />} />
              <Route path="users/of-admin/:userSlug" element={<OFAdminDetailPageSuperadmin />} />
              <Route path="trainers" element={<AdminTrainers />} />
              <Route path="organisations" element={<AdminOrganisations />} />
              <Route path="organisations/create" element={<CreateOrganisme />} />
              <Route path="organisations/:id" element={<OrganismeDetail />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="courses/create" element={<CreateCoursePage />} />
              <Route path="courses/:courseId" element={<CourseDetailPage />} />
              <Route path="courses/:courseId/edit" element={<EditCourse />} />
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
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
