
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User, Award, MessageSquare, Settings, Home, Video, Download, FileText, PenTool, TrendingUp, CreditCard, ShoppingBag } from 'lucide-react';
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
import StudentCatalog from '@/components/student/StudentCatalog';
import AIChatButton from '@/components/common/AIChatButton';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/apprenant", icon: Home, isActive: currentPath === "/dashboard/apprenant" },
    { title: "Catalogue", href: "/dashboard/apprenant/catalogue", icon: BookOpen, isActive: currentPath === "/dashboard/apprenant/catalogue" },
    { title: "Mes cours", href: "/dashboard/apprenant/courses", icon: BookOpen, isActive: currentPath === "/dashboard/apprenant/courses" },
    { title: "Mon parcours", href: "/dashboard/apprenant/progress", icon: Award, isActive: currentPath === "/dashboard/apprenant/progress" },
    { title: "Certificats", href: "/dashboard/apprenant/certificates", icon: Award, isActive: currentPath === "/dashboard/apprenant/certificates" },
    // === SECTION OF COMPLÈTE ===
    { title: "Mes inscriptions", href: "/dashboard/apprenant/inscriptions", icon: FileText, isActive: currentPath === "/dashboard/apprenant/inscriptions" },
    { title: "Émargement", href: "/dashboard/apprenant/emargements", icon: PenTool, isActive: currentPath === "/dashboard/apprenant/emargements" },
    { title: "Évaluations", href: "/dashboard/apprenant/evaluations", icon: TrendingUp, isActive: currentPath === "/dashboard/apprenant/evaluations" },
    // === SECTION OUTILS ===
    { title: "Boutique", href: "/dashboard/apprenant/boutique", icon: ShoppingBag, isActive: currentPath === "/dashboard/apprenant/boutique" },
    { title: "Mes documents", href: "/dashboard/apprenant/documents", icon: Download, isActive: currentPath === "/dashboard/apprenant/documents" },
    { title: "Abonnements", href: "/dashboard/apprenant/subscription", icon: CreditCard, isActive: currentPath === "/dashboard/apprenant/subscription" },
    { title: "Messages", href: "/dashboard/apprenant/messages", icon: MessageSquare, badge: "3", isActive: currentPath === "/dashboard/apprenant/messages" },
    { title: "Visioconférence", href: "/dashboard/apprenant/video", icon: Video, isActive: currentPath === "/dashboard/apprenant/video" },
    { title: "Paramètres", href: "/dashboard/apprenant/settings", icon: Settings, isActive: currentPath === "/dashboard/apprenant/settings" },
  ];

  const userInfo = {
    name: "Alice Martin",
    email: "alice.martin@email.com"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Espace Apprenant"
          subtitle="Votre parcours d'apprentissage"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<StudentDashboardHome />} />
            <Route path="/catalogue" element={<StudentCatalog />} />
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
