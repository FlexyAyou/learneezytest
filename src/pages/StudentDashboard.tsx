
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
              
              {/* Routes restreintes pour apprenants Learneezy uniquement */}
              <Route path="/catalogue" element={
                <LearneezyOnlyRoute>
                  <StudentCourseCatalog />
                </LearneezyOnlyRoute>
              } />
              <Route path="/boutique" element={
                <LearneezyOnlyRoute>
                  <StudentShop />
                </LearneezyOnlyRoute>
              } />
              <Route path="/subscription" element={
                <LearneezyOnlyRoute>
                  <StudentSubscription />
                </LearneezyOnlyRoute>
              } />
              
              {/* Routes accessibles à tous les apprenants */}
              <Route path="/courses" element={<StudentCourses />} />
              <Route path="/courses/:id" element={<CourseViewer />} />
              <Route path="/progress" element={<StudentProgress />} />
              <Route path="/certificates" element={<StudentCertificates />} />
              <Route path="/inscriptions" element={<StudentInscriptions />} />
              <Route path="/emargements" element={<StudentEmargements />} />
              <Route path="/evaluations" element={<StudentEvaluations />} />
              <Route path="/evaluations/:id/results" element={<EvaluationDetail />} />
              <Route path="/evaluations/:id/take" element={<TakeEvaluation />} />
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
