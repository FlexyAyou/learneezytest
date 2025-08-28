
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import OFStudentDetailPage from '@/pages/admin/OFStudentDetailPage';
import OFTrainerDetailPage from '@/pages/admin/OFTrainerDetailPage';
import OFManagerDetailPage from '@/pages/admin/OFManagerDetailPage';

const OFDashboard = () => {
  return (
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
      <Route path="/integrations" element={<OFIntegrations />} />
      <Route path="/logs" element={<OFLogs />} />
      <Route path="/parametres" element={<OFSettings />} />
    </Routes>
  );
};

export default OFDashboard;
