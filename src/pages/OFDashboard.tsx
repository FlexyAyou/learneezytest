
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { OFSidebar } from '@/components/admin/OFSidebar';
import { OFDashboard as OFDashboardContent } from '@/components/admin/OFDashboard';
import { OFUtilisateurs } from '@/components/admin/OFUtilisateurs';
import { OFCourses } from '@/components/admin/OFCourses';
import OFDocumentsAdvanced from '@/components/admin/documents/OFDocumentsAdvanced';
import OFProgrammeLibraryPage from '@/pages/admin/OFProgrammeLibraryPage';
import { OFLicences } from '@/components/admin/OFLicences';
import { OFSuiviPedagogique } from '@/components/admin/OFSuiviPedagogique';
import OFVideoConferences from '@/components/admin/OFVideoConferences';
import { OFEnvois } from '@/components/admin/OFEnvois';
import { OFIntegrations } from '@/components/admin/OFIntegrations';
import { OFLogs } from '@/components/admin/OFLogs';
import { OFSettings } from '@/components/admin/OFSettings';
import { OFOffres } from '@/components/admin/OFOffres';
import OFStudentDetailPage from '@/pages/admin/OFStudentDetailPage';
import OFTrainerDetailPage from '@/pages/admin/OFTrainerDetailPage';
import OFManagerDetailPage from '@/pages/admin/OFManagerDetailPage';
import CreateCoursePage from '@/pages/admin/CreateCoursePage';
import EditCoursePage from '@/pages/admin/EditCoursePage';
import CourseDetailPage from '@/pages/admin/CourseDetailPage';

const OFDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <OFSidebar />
        
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          
          <main className="flex-1 p-6">
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard/organisme-formation/tableau-de-bord" replace />} />
                <Route path="/tableau-de-bord" element={<OFDashboardContent />} />
                <Route path="/utilisateurs" element={<OFUtilisateurs />} />
                <Route path="/utilisateurs/apprenant/:userSlug" element={<OFStudentDetailPage />} />
                <Route path="/utilisateurs/formateur/:userSlug" element={<OFTrainerDetailPage />} />
                <Route path="/utilisateurs/gestionnaire/:userSlug" element={<OFManagerDetailPage />} />
                <Route path="/formations" element={<OFCourses />} />
                <Route path="/formations/create" element={<CreateCoursePage />} />
                <Route path="/formations/:courseId" element={<CourseDetailPage />} />
                <Route path="/formations/:id/edit" element={<EditCoursePage />} />
              <Route path="/documents-of" element={<OFDocumentsAdvanced />} />
              <Route path="/documents" element={<OFDocumentsAdvanced />} />
              <Route path="/programmes" element={<OFProgrammeLibraryPage />} />
                <Route path="/licences" element={<OFLicences />} />
                <Route path="/suivi-pedagogique" element={<OFSuiviPedagogique />} />
                <Route path="/visio" element={<OFVideoConferences />} />
                <Route path="/envois" element={<OFEnvois />} />
                <Route path="/offres" element={<OFOffres />} />
                <Route path="/integrations" element={<OFIntegrations />} />
                <Route path="/logs" element={<OFLogs />} />
                <Route path="/parametres" element={<OFSettings />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default OFDashboard;
