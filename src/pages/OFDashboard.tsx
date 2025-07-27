
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { FileText, Users, BookOpen, TrendingUp, Shield, Mail, Key, Zap, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { OFDashboard as OFDashboardComponent } from '@/components/admin/OFDashboard';
import AdminDocumentsOF from './admin/AdminDocumentsOF';
import { OFApprenants } from '@/components/admin/OFApprenants';
import { OFFormations } from '@/components/admin/OFFormations';
import { OFSuiviPedagogique } from '@/components/admin/OFSuiviPedagogique';
import { OFLogs } from '@/components/admin/OFLogs';
import { OFEnvois } from '@/components/admin/OFEnvois';
import { OFLicences } from '@/components/admin/OFLicences';
import { OFIntegrations } from '@/components/admin/OFIntegrations';

const OFDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/organisme-formation", icon: Home, isActive: currentPath === "/dashboard/organisme-formation" },
    { title: "Documents", href: "/dashboard/organisme-formation/documents", icon: FileText, isActive: currentPath === "/dashboard/organisme-formation/documents" },
    { title: "Apprenants", href: "/dashboard/organisme-formation/apprenants", icon: Users, isActive: currentPath === "/dashboard/organisme-formation/apprenants" },
    { title: "Formations", href: "/dashboard/organisme-formation/formations", icon: BookOpen, isActive: currentPath === "/dashboard/organisme-formation/formations" },
    { title: "Suivi pédagogique", href: "/dashboard/organisme-formation/suivi", icon: TrendingUp, isActive: currentPath === "/dashboard/organisme-formation/suivi" },
    { title: "Logs & sécurité", href: "/dashboard/organisme-formation/logs", icon: Shield, isActive: currentPath === "/dashboard/organisme-formation/logs" },
    { title: "Envois & relances", href: "/dashboard/organisme-formation/envois", icon: Mail, isActive: currentPath === "/dashboard/organisme-formation/envois" },
    { title: "Licences", href: "/dashboard/organisme-formation/licences", icon: Key, isActive: currentPath === "/dashboard/organisme-formation/licences" },
    { title: "Intégrations", href: "/dashboard/organisme-formation/integrations", icon: Zap, isActive: currentPath === "/dashboard/organisme-formation/integrations" },
  ];

  const userInfo = {
    name: "Organisme Formation",
    email: "contact@organisme-formation.com"
  };

  // Dashboard principal
  const OFDashboardHome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Organisme de Formation
          </h1>
          <p className="text-gray-600">Vue d'ensemble de votre organisme de formation</p>
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Formations actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Apprenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">+12 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2% ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Documents générés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+23 cette semaine</p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal du dashboard */}
      <OFDashboardComponent />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Organisme Formation"
          subtitle="Gestion de l'organisme"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<OFDashboardHome />} />
            <Route path="/documents" element={<AdminDocumentsOF />} />
            <Route path="/apprenants" element={<OFApprenants />} />
            <Route path="/formations" element={<OFFormations />} />
            <Route path="/suivi" element={<OFSuiviPedagogique />} />
            <Route path="/logs" element={<OFLogs />} />
            <Route path="/envois" element={<OFEnvois />} />
            <Route path="/licences" element={<OFLicences />} />
            <Route path="/integrations" element={<OFIntegrations />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default OFDashboard;
