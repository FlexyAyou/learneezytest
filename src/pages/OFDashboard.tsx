
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
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
import { 
  Building,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  FileText,
  Key,
  Video,
  Mail,
  Puzzle,
  FileArchive,
  Home,
  CreditCard
} from 'lucide-react';

const OFDashboard = () => {
  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/organisme-formation/tableau-de-bord", icon: Home, isActive: false },
    { title: "Utilisateurs", href: "/dashboard/organisme-formation/utilisateurs", icon: Users, isActive: false },
    { title: "Formations", href: "/dashboard/organisme-formation/formations", icon: BookOpen, isActive: false },
    { title: "Documents", href: "/dashboard/organisme-formation/documents", icon: FileText, isActive: false },
    { title: "Licences", href: "/dashboard/organisme-formation/licences", icon: Key, isActive: false },
    { title: "Suivi pédagogique", href: "/dashboard/organisme-formation/suivi-pedagogique", icon: BarChart3, isActive: false },
    { title: "Visioconférence", href: "/dashboard/organisme-formation/visio", icon: Video, isActive: false },
    { title: "Envois", href: "/dashboard/organisme-formation/envois", icon: Mail, isActive: false },
    { title: "Abonnement", href: "/dashboard/organisme-formation/abonnement", icon: CreditCard, isActive: false },
    { title: "Intégrations", href: "/dashboard/organisme-formation/integrations", icon: Puzzle, isActive: false },
    { title: "Logs", href: "/dashboard/organisme-formation/logs", icon: FileArchive, isActive: false },
    { title: "Paramètres", href: "/dashboard/organisme-formation/parametres", icon: Settings, isActive: false },
  ];

  const userInfo = {
    name: "Organisme Formation",
    email: "contact@organisme.fr"
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Organisme de Formation"
          subtitle="Gestion de formation"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64">
        <div className="h-full flex flex-col">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard/organisme-formation/tableau-de-bord" replace />} />
                <Route path="/tableau-de-bord" element={<OFDashboardContent />} />
                <Route path="/utilisateurs" element={<OFUtilisateurs />} />
                <Route path="/utilisateurs/apprenant/:userSlug" element={<OFStudentDetailPage />} />
                <Route path="/utilisateurs/formateur/:userSlug" element={<OFTrainerDetailPage />} />
                <Route path="/utilisateurs/gestionnaire/:userSlug" element={<OFManagerDetailPage />} />
                <Route path="/formations" element={<OFFormations />} />
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OFDashboard;
