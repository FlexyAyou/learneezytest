
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User, Award, MessageSquare, Settings, Home, Video, Download, FileText, PenTool, TrendingUp, CreditCard, ShoppingBag, Users } from 'lucide-react';
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
import StudentTeachers from './student/StudentTeachers';
import AIChatButton from '@/components/common/AIChatButton';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/etudiant", icon: Home, isActive: currentPath === "/dashboard/etudiant" },
    { title: "Catalogue de formations", href: "/cours", icon: BookOpen, isActive: currentPath === "/cours" },
    { title: "Mes cours", href: "/dashboard/etudiant/courses", icon: BookOpen, isActive: currentPath === "/dashboard/etudiant/courses" },
    { title: "Mon parcours", href: "/dashboard/etudiant/progress", icon: Award, isActive: currentPath === "/dashboard/etudiant/progress" },
    { title: "Certificats", href: "/dashboard/etudiant/certificates", icon: Award, isActive: currentPath === "/dashboard/etudiant/certificates" },
    // === SECTION OF COMPLÈTE ===
    { title: "Mes inscriptions", href: "/dashboard/etudiant/inscriptions", icon: FileText, isActive: currentPath === "/dashboard/etudiant/inscriptions" },
    { title: "Émargement", href: "/dashboard/etudiant/emargements", icon: PenTool, isActive: currentPath === "/dashboard/etudiant/emargements" },
    { title: "Évaluations", href: "/dashboard/etudiant/evaluations", icon: TrendingUp, isActive: currentPath === "/dashboard/etudiant/evaluations" },
    // === SECTION OUTILS ===
    { title: "Mes Profs", href: "/dashboard/etudiant/teachers", icon: Users, isActive: currentPath.startsWith("/dashboard/etudiant/teachers") },
    { title: "Boutique", href: "/dashboard/etudiant/boutique", icon: ShoppingBag, isActive: currentPath === "/dashboard/etudiant/boutique" },
    { title: "Mes documents", href: "/dashboard/etudiant/documents", icon: Download, isActive: currentPath === "/dashboard/etudiant/documents" },
    { title: "Abonnements", href: "/dashboard/etudiant/subscription", icon: CreditCard, isActive: currentPath === "/dashboard/etudiant/subscription" },
    { title: "Messages", href: "/dashboard/etudiant/messages", icon: MessageSquare, badge: "3", isActive: currentPath === "/dashboard/etudiant/messages" },
    { title: "Visioconférence", href: "/dashboard/etudiant/video", icon: Video, isActive: currentPath === "/dashboard/etudiant/video" },
    { title: "Paramètres", href: "/dashboard/etudiant/settings", icon: Settings, isActive: currentPath === "/dashboard/etudiant/settings" },
  ];

  const userInfo = {
    name: "Alice Martin",
    email: "alice.martin@email.com"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Espace Étudiant"
          subtitle="Votre parcours d'apprentissage"
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
            <Route path="/teachers/*" element={<StudentTeachers />} />
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
