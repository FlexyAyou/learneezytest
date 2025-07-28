
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User, Award, MessageSquare, Settings, Home, Video, Download, Brain, TestTube, FileText, PenTool, TrendingUp } from 'lucide-react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import StudentCourses from './StudentCourses';
import StudentProgress from './StudentProgress';
import StudentCertificates from './StudentCertificates';
import StudentSettings from './StudentSettings';
import StudentMessaging from './StudentMessaging';
import StudentInscriptions from './student/StudentInscriptions';
import StudentEmargements from './student/StudentEmargements';
import StudentEvaluations from './student/StudentEvaluations';
import { DocumentDownload } from '@/components/common/DocumentDownload';
import { AIChat } from '@/components/common/AIChat';
import { VideoConference } from '@/components/common/VideoConference';
import { PositioningTest } from '@/components/common/PositioningTest';
import { StudentDashboardHome } from '@/components/student/StudentDashboardHome';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/etudiant", icon: Home, isActive: currentPath === "/dashboard/etudiant" },
    { title: "Catalogue de formations", href: "/cours", icon: BookOpen, isActive: currentPath === "/cours" },
    { title: "Mes cours", href: "/dashboard/etudiant/courses", icon: BookOpen, isActive: currentPath === "/dashboard/etudiant/courses" },
    { title: "Mon progrès", href: "/dashboard/etudiant/progress", icon: Award, isActive: currentPath === "/dashboard/etudiant/progress" },
    { title: "Certificats", href: "/dashboard/etudiant/certificates", icon: Award, isActive: currentPath === "/dashboard/etudiant/certificates" },
    // === SECTION OF COMPLÈTE ===
    { title: "Mes inscriptions", href: "/dashboard/etudiant/inscriptions", icon: FileText, isActive: currentPath === "/dashboard/etudiant/inscriptions" },
    { title: "Émargement", href: "/dashboard/etudiant/emargements", icon: PenTool, isActive: currentPath === "/dashboard/etudiant/emargements" },
    { title: "Évaluations", href: "/dashboard/etudiant/evaluations", icon: TrendingUp, isActive: currentPath === "/dashboard/etudiant/evaluations" },
    // === SECTION OUTILS ===
    { title: "Tests de positionnement", href: "/dashboard/etudiant/tests", icon: TestTube, isActive: currentPath === "/dashboard/etudiant/tests" },
    { title: "Mes documents", href: "/dashboard/etudiant/documents", icon: Download, isActive: currentPath === "/dashboard/etudiant/documents" },
    { title: "Messages", href: "/dashboard/etudiant/messages", icon: MessageSquare, badge: "3", isActive: currentPath === "/dashboard/etudiant/messages" },
    { title: "Visioconférence", href: "/dashboard/etudiant/video", icon: Video, isActive: currentPath === "/dashboard/etudiant/video" },
    { title: "Chat IA", href: "/dashboard/etudiant/chat", icon: Brain, isActive: currentPath === "/dashboard/etudiant/chat" },
    { title: "Paramètres", href: "/dashboard/etudiant/settings", icon: Settings, isActive: currentPath === "/dashboard/etudiant/settings" },
  ];

  const userInfo = {
    name: "Alice Martin",
    email: "alice.martin@email.com"
  };

  const mockDocuments = [
    { id: '1', name: 'Certificat React.pdf', type: 'PDF', date: '2024-01-20', size: '2.3 MB' },
    { id: '2', name: 'Notes de cours JS.pdf', type: 'PDF', date: '2024-01-18', size: '1.8 MB' }
  ];

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
            <Route path="/progress" element={<StudentProgress />} />
            <Route path="/certificates" element={<StudentCertificates />} />
            {/* === ROUTES OF COMPLÈTES === */}
            <Route path="/inscriptions" element={<StudentInscriptions />} />
            <Route path="/emargements" element={<StudentEmargements />} />
            <Route path="/evaluations" element={<StudentEvaluations />} />
            {/* === ROUTES OUTILS === */}
            <Route path="/tests" element={<PositioningTest userRole="student" />} />
            <Route path="/video" element={<VideoConference />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/documents" element={<DocumentDownload documents={mockDocuments} userRole="student" />} />
            <Route path="/messages" element={<StudentMessaging />} />
            <Route path="/settings" element={<StudentSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
