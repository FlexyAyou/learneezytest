
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { StudentSidebar } from '@/components/student/StudentSidebar';
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
import StudentCourseCatalog from './student/StudentCourseCatalog';
import AIChatButton from '@/components/common/AIChatButton';
import { useStudentContext } from '@/hooks/useStudentContext';

// Routes désactivées - bloquées au niveau routing (pas juste CSS)
const DISABLED_ROUTES = [
  '/progress',
  '/certificates',
  '/boutique',
  '/evaluations',
  '/subscription'
];

/**
 * Composant de protection pour les routes désactivées
 * Redirige vers le dashboard si l'utilisateur tente d'accéder directement
 */
const DisabledRoute = ({ children }: { children: React.ReactNode }) => {
  // Toujours rediriger vers le dashboard pour les routes désactivées
  return <Navigate to="/dashboard/apprenant" replace />;
};

/**
 * Composant de protection de route pour les fonctionnalités Learneezy uniquement
 */
const LearneezyOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isOFStudent } = useStudentContext();
  
  if (isOFStudent) {
    return <Navigate to="/dashboard/apprenant" replace />;
  }
  
  return <>{children}</>;
};

const StudentDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<StudentDashboardHome />} />
              
              {/* Routes désactivées - redirigent vers le dashboard (protection côté serveur) */}
              <Route path="/progress" element={<DisabledRoute><StudentProgress /></DisabledRoute>} />
              <Route path="/certificates" element={<DisabledRoute><StudentCertificates /></DisabledRoute>} />
              <Route path="/evaluations" element={<DisabledRoute><StudentEvaluations /></DisabledRoute>} />
              <Route path="/evaluations/:id/results" element={<DisabledRoute><EvaluationDetail /></DisabledRoute>} />
              <Route path="/evaluations/:id/take" element={<DisabledRoute><TakeEvaluation /></DisabledRoute>} />
              <Route path="/boutique" element={<DisabledRoute><StudentShop /></DisabledRoute>} />
              <Route path="/subscription" element={<DisabledRoute><StudentSubscription /></DisabledRoute>} />
              
              {/* Routes restreintes pour apprenants Learneezy uniquement */}
              <Route path="/catalogue" element={
                <LearneezyOnlyRoute>
                  <StudentCourseCatalog />
                </LearneezyOnlyRoute>
              } />
              
              {/* Routes accessibles à tous les apprenants */}
              <Route path="/courses" element={<StudentCourses />} />
              <Route path="/courses/:id" element={<CourseViewer />} />
              <Route path="/inscriptions" element={<StudentInscriptions />} />
              <Route path="/emargements" element={<StudentEmargements />} />
              <Route path="/video" element={<StudentVideoConferences />} />
              <Route path="/documents" element={<StudentDocuments />} />
              <Route path="/messages" element={<StudentMessaging />} />
              <Route path="/settings" element={<StudentSettings />} />
            </Routes>
          </main>
        </SidebarInset>
        
        <AIChatButton />
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;
