
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { OFSidebar } from '@/components/admin/OFSidebar';
import { OFDashboard as OFDashboardContent } from '@/components/admin/OFDashboard';
import { OFUtilisateurs } from '@/components/admin/OFUtilisateurs';
import { OFFormations } from '@/components/admin/OFFormations';
import OFDocuments from '@/components/admin/OFDocuments';
import { OFLicences } from '@/components/admin/OFLicences';
import { OFSuiviPedagogique } from '@/components/admin/OFSuiviPedagogique';
import OFVideoConferences from '@/components/admin/OFVideoConferences';
import { OFEnvois } from '@/components/admin/OFEnvois';
import { OFIntegrations } from '@/components/admin/OFIntegrations';
import { OFLogs } from '@/components/admin/OFLogs';
import { OFSettings } from '@/components/admin/OFSettings';
import { OFSubscription } from '@/components/admin/OFSubscription';
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
                <Route path="/formations" element={<OFFormations />} />
                <Route path="/formations/create" element={<CreateCoursePage />} />
                <Route path="/formations/:courseId" element={<CourseDetailPage />} />
                <Route path="/formations/:id/edit" element={<EditCoursePage />} />
                <Route path="/documents-of" element={<OFDocuments />} />
                <Route path="/documents" element={<OFDocuments />} />
                <Route path="/licences" element={<OFLicences />} />
                <Route path="/suivi-pedagogique" element={<OFSuiviPedagogique />} />
                <Route path="/visio" element={<OFVideoConferences />} />
                <Route path="/envois" element={<OFEnvois />} />
                <Route path="/abonnement" element={<OFSubscription />} />
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
