
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { ManagerSidebar } from '@/components/manager/ManagerSidebar';
import ManagerPlanning from '@/components/manager/ManagerPlanning';
import ManagerAttendance from '@/components/manager/ManagerAttendance';
import ManagerEnrollments from '@/components/manager/ManagerEnrollments';
import ManagerSettings from '@/components/manager/ManagerSettings';
import ManagerMessaging from '@/components/manager/ManagerMessaging';
import ManagerReports from '@/components/manager/ManagerReports';
import ManagerApprenants from '@/components/manager/ManagerApprenants';
import ManagerTrainers from '@/components/manager/ManagerTrainers';
import { ManagerDashboardHome } from '@/components/manager/ManagerDashboardHome';
import ManagerCourses from '@/components/manager/ManagerCourses';
import CreateCoursePage from './admin/CreateCoursePage';
import ManagerStudentDetailPage from './manager/ManagerStudentDetailPage';
import AIChatButton from '@/components/common/AIChatButton';

const ManagerDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ManagerSidebar />
        
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 shadow-sm">
            <SidebarTrigger className="flex-shrink-0" />
            <div className="flex-1" />
          </header>
          
          <main className="flex-1 p-6">
            <Routes>
              <Route index element={<ManagerDashboardHome />} />
              <Route path="apprenants" element={<ManagerApprenants />} />
              <Route path="apprenants/:userSlug" element={<ManagerStudentDetailPage />} />
              <Route path="formateurs" element={<ManagerTrainers />} />
              <Route path="courses" element={<ManagerCourses />} />
              <Route path="courses/create" element={<CreateCoursePage />} />
              <Route path="planning" element={<ManagerPlanning />} />
              <Route path="inscriptions" element={<ManagerEnrollments />} />
              <Route path="presences" element={<ManagerAttendance />} />
              <Route path="rapports" element={<ManagerReports />} />
              <Route path="messages" element={<ManagerMessaging />} />
              <Route path="parametres" element={<ManagerSettings />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
      <AIChatButton />
    </SidebarProvider>
  );
};

export default ManagerDashboard;
