import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Settings, BarChart3, MessageSquare, Video, Download, Brain, TestTube, Home, FileText, Calendar, Award, TrendingUp } from 'lucide-react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import InstructorAnalytics from './InstructorAnalytics';
import InstructorCourses from './InstructorCourses';
import InstructorMessaging from './InstructorMessaging';
import InstructorSettings from './InstructorSettings';
import InstructorOFDocuments from './InstructorOFDocuments';
import AIChat from '@/components/common/AIChat';
import VideoConference from '@/components/common/VideoConference';
import { PositioningTest } from '@/components/common/PositioningTest';
import AIChatButton from '@/components/common/AIChatButton';
import { DocumentDownload } from '@/components/common/DocumentDownload';
import { OFDashboard } from '@/components/admin/OFDashboard';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/instructor", icon: Home, isActive: currentPath === "/dashboard/instructor" },
    { title: "Analytiques", href: "/dashboard/instructor/analytics", icon: BarChart3, isActive: currentPath === "/dashboard/instructor/analytics" },
    { title: "Mes cours", href: "/dashboard/instructor/courses", icon: BookOpen, isActive: currentPath === "/dashboard/instructor/courses" },
    { title: "Documents OF", href: "/dashboard/instructor/of-documents", icon: FileText, isActive: currentPath === "/dashboard/instructor/of-documents" },
    { title: "Tests de positionnement", href: "/dashboard/instructor/tests", icon: TestTube, isActive: currentPath === "/dashboard/instructor/tests" },
    { title: "Visioconférence", href: "/dashboard/instructor/video", icon: Video, isActive: currentPath === "/dashboard/instructor/video" },
    { title: "Chat IA", href: "/dashboard/instructor/chat", icon: Brain, isActive: currentPath === "/dashboard/instructor/chat" },
    { title: "Documents", href: "/dashboard/instructor/documents", icon: Download, isActive: currentPath === "/dashboard/instructor/documents" },
    { title: "Messages", href: "/dashboard/instructor/messages", icon: MessageSquare, badge: "3", isActive: currentPath === "/dashboard/instructor/messages" },
    { title: "Paramètres", href: "/dashboard/instructor/settings", icon: Settings, isActive: currentPath === "/dashboard/instructor/settings" },
  ];

  const userInfo = {
    name: "John Smith",
    email: "john.smith@email.com"
  };

  const mockDocuments = [
    { id: '1', name: 'Syllabus_React.pdf', type: 'PDF', date: '2024-01-20', size: '2.3 MB' },
    { id: '2', name: 'Notes_JavaScript.pdf', type: 'PDF', date: '2024-01-18', size: '1.8 MB' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Espace Formateur"
          subtitle="Votre espace dédié"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<OFDashboard />} />
            <Route path="/analytics" element={<InstructorAnalytics />} />
            <Route path="/courses" element={<InstructorCourses />} />
            <Route path="/of-documents" element={<InstructorOFDocuments />} />
            <Route path="/tests" element={<PositioningTest userRole="instructor" />} />
            <Route path="/video" element={<VideoConference />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/documents" element={<DocumentDownload documents={mockDocuments} userRole="instructor" />} />
            <Route path="/messages" element={<InstructorMessaging />} />
            <Route path="/settings" element={<InstructorSettings />} />
          </Routes>
        </main>
      </div>
      <AIChatButton />
    </div>
  );
};

export default InstructorDashboard;
