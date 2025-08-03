
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { OFDashboard as OFDashboardHome } from '@/components/admin/OFDashboard';
import { OFUtilisateurs } from '@/components/admin/OFUtilisateurs';
import { OFFormations } from '@/components/admin/OFFormations';
import { OFLicences } from '@/components/admin/OFLicences';
import { OFSuiviPedagogique } from '@/components/admin/OFSuiviPedagogique';
import { OFEnvois } from '@/components/admin/OFEnvois';
import { OFIntegrations } from '@/components/admin/OFIntegrations';
import { OFLogs } from '@/components/admin/OFLogs';
import { OFSettings } from '@/components/admin/OFSettings';
import AdminDocumentsOF from '@/pages/admin/AdminDocumentsOF';
import OFDocuments from '@/components/admin/OFDocuments';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  GraduationCap,
  Send,
  Plug,
  FileText,
  Settings,
  File
} from 'lucide-react';

const OFDashboard = () => {
  const location = useLocation();

  const sidebarItems = [
    {
      title: 'Tableau de bord',
      href: '/dashboard/organisme-formation',
      icon: LayoutDashboard,
      isActive: location.pathname === '/dashboard/organisme-formation'
    },
    {
      title: 'Utilisateurs',
      href: '/dashboard/organisme-formation/utilisateurs',
      icon: Users,
      isActive: location.pathname === '/dashboard/organisme-formation/utilisateurs'
    },
    {
      title: 'Formations',
      href: '/dashboard/organisme-formation/formations',
      icon: BookOpen,
      isActive: location.pathname === '/dashboard/organisme-formation/formations'
    },
    {
      title: 'Documents OF',
      href: '/dashboard/organisme-formation/documents-of',
      icon: FileText,
      isActive: location.pathname === '/dashboard/organisme-formation/documents-of'
    },
    {
      title: 'Document',
      href: '/dashboard/organisme-formation/documents',
      icon: File,
      isActive: location.pathname === '/dashboard/organisme-formation/documents'
    },
    {
      title: 'Licences',
      href: '/dashboard/organisme-formation/licences',
      icon: CreditCard,
      isActive: location.pathname === '/dashboard/organisme-formation/licences'
    },
    {
      title: 'Suivi pédagogique',
      href: '/dashboard/organisme-formation/suivi-pedagogique',
      icon: GraduationCap,
      isActive: location.pathname === '/dashboard/organisme-formation/suivi-pedagogique'
    },
    {
      title: 'Envois',
      href: '/dashboard/organisme-formation/envois',
      icon: Send,
      isActive: location.pathname === '/dashboard/organisme-formation/envois'
    },
    {
      title: 'Intégrations',
      href: '/dashboard/organisme-formation/integrations',
      icon: Plug,
      isActive: location.pathname === '/dashboard/organisme-formation/integrations'
    },
    {
      title: 'Logs',
      href: '/dashboard/organisme-formation/logs',
      icon: FileText,
      isActive: location.pathname === '/dashboard/organisme-formation/logs'
    },
    {
      title: 'Paramètres',
      href: '/dashboard/organisme-formation/parametres',
      icon: Settings,
      isActive: location.pathname === '/dashboard/organisme-formation/parametres'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        title="Organisme de Formation"
        subtitle="Centre de Formation Digital"
        items={sidebarItems}
        userInfo={{
          name: 'Marie Gestionnaire',
          email: 'marie@cfdigital.fr'
        }}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route index element={<OFDashboardHome />} />
            <Route path="utilisateurs" element={<OFUtilisateurs />} />
            <Route path="formations" element={<OFFormations />} />
            <Route path="documents-of" element={<AdminDocumentsOF />} />
            <Route path="documents" element={<OFDocuments />} />
            <Route path="licences" element={<OFLicences />} />
            <Route path="suivi-pedagogique" element={<OFSuiviPedagogique />} />
            <Route path="envois" element={<OFEnvois />} />
            <Route path="integrations" element={<OFIntegrations />} />
            <Route path="logs" element={<OFLogs />} />
            <Route path="parametres" element={<OFSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default OFDashboard;
