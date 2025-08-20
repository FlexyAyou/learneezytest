
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User, Award, MessageSquare, Settings, Home, Video, Download, FileText, PenTool, TrendingUp, CreditCard, ShoppingBag } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import StudentCourses from './StudentCourses';
import StudentProgress from './StudentProgress';
import StudentCertificates from './StudentCertificates';
import StudentSettings from './StudentSettings';
import StudentMessaging from './StudentMessaging';
import StudentInscriptions from './student/StudentInscriptions';
import StudentEmargements from './student/StudentEmargements';
import StudentEvaluations from './student/StudentEvaluations';
import EvaluationDetail from './student/EvaluationDetail';
import TakeEvaluation from './student/TakeEvaluation';
import CourseViewer from './student/CourseViewer';
import { StudentDocuments } from '@/components/student/StudentDocuments';
import { StudentSubscription } from '@/components/student/StudentSubscription';
import VideoConference from '@/components/common/VideoConference';
import StudentVideoConferences from '@/components/student/StudentVideoConferences';
import { StudentDashboardHome } from '@/components/student/StudentDashboardHome';
import { StudentShop } from '@/components/student/StudentShop';
import AIChatButton from '@/components/common/AIChatButton';

const StudentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: t('dashboard.student.dashboard'), href: "/dashboard/etudiant", icon: Home, isActive: currentPath === "/dashboard/etudiant" },
    { title: t('dashboard.student.courseCatalog'), href: "/cours", icon: BookOpen, isActive: currentPath === "/cours" },
    { title: t('dashboard.student.myCourses'), href: "/dashboard/etudiant/courses", icon: BookOpen, isActive: currentPath === "/dashboard/etudiant/courses" },
    { title: t('dashboard.student.myPath'), href: "/dashboard/etudiant/progress", icon: Award, isActive: currentPath === "/dashboard/etudiant/progress" },
    { title: t('dashboard.student.certificates'), href: "/dashboard/etudiant/certificates", icon: Award, isActive: currentPath === "/dashboard/etudiant/certificates" },
    { title: t('dashboard.student.myInscriptions'), href: "/dashboard/etudiant/inscriptions", icon: FileText, isActive: currentPath === "/dashboard/etudiant/inscriptions" },
    { title: t('dashboard.student.attendance'), href: "/dashboard/etudiant/emargements", icon: PenTool, isActive: currentPath === "/dashboard/etudiant/emargements" },
    { title: t('dashboard.student.evaluations'), href: "/dashboard/etudiant/evaluations", icon: TrendingUp, isActive: currentPath === "/dashboard/etudiant/evaluations" },
    { title: t('dashboard.student.shop'), href: "/dashboard/etudiant/boutique", icon: ShoppingBag, isActive: currentPath === "/dashboard/etudiant/boutique" },
    { title: t('dashboard.student.myDocuments'), href: "/dashboard/etudiant/documents", icon: Download, isActive: currentPath === "/dashboard/etudiant/documents" },
    { title: t('dashboard.student.subscriptions'), href: "/dashboard/etudiant/subscription", icon: CreditCard, isActive: currentPath === "/dashboard/etudiant/subscription" },
    { title: t('dashboard.student.messages'), href: "/dashboard/etudiant/messages", icon: MessageSquare, badge: "3", isActive: currentPath === "/dashboard/etudiant/messages" },
    { title: t('dashboard.student.videoConference'), href: "/dashboard/etudiant/video", icon: Video, isActive: currentPath === "/dashboard/etudiant/video" },
    { title: t('dashboard.student.settings'), href: "/dashboard/etudiant/settings", icon: Settings, isActive: currentPath === "/dashboard/etudiant/settings" },
  ];

  const userInfo = {
    name: "Alice Martin",
    email: "alice.martin@email.com"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title={t('dashboard.student.title')}
          subtitle={t('dashboard.student.subtitle')}
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<StudentDashboardHome />} />
            <Route path="/courses" element={<StudentCourses />} />
            <Route path="/courses/:id" element={<CourseViewer />} />
            <Route path="/progress" element={<StudentProgress />} />
            <Route path="/certificates" element={<StudentCertificates />} />
            {/* === ROUTES OF COMPLÈTES === */}
            <Route path="/inscriptions" element={<StudentInscriptions />} />
            <Route path="/emargements" element={<StudentEmargements />} />
            <Route path="/evaluations" element={<StudentEvaluations />} />
            <Route path="/evaluations/:id/results" element={<EvaluationDetail />} />
            <Route path="/evaluations/:id/take" element={<TakeEvaluation />} />
            {/* === ROUTES OUTILS === */}
            <Route path="/boutique" element={<StudentShop />} />
            <Route path="/video" element={<StudentVideoConferences />} />
            <Route path="/documents" element={<StudentDocuments />} />
            <Route path="/subscription" element={<StudentSubscription />} />
            <Route path="/messages" element={<StudentMessaging />} />
            <Route path="/settings" element={<StudentSettings />} />
          </Routes>
        </main>
      </div>
      <AIChatButton />
    </div>
  );
};

export default StudentDashboard;
