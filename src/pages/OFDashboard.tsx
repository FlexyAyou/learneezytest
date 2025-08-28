
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OFDashboard as OFDashboardContent } from '@/components/admin/OFDashboard';
import { OFUtilisateurs } from '@/components/admin/OFUtilisateurs';
import { OFFormations } from '@/components/admin/OFFormations';
import { OFFormationDetail } from '@/components/admin/OFFormationDetail';
import { OFDocuments } from '@/components/admin/OFDocuments';
import { OFLicences } from '@/components/admin/OFLicences';
import { OFLicenceDetail } from '@/components/admin/OFLicenceDetail';
import { OFLicenceEdit } from '@/components/admin/OFLicenceEdit';
import { OFSuiviPedagogique } from '@/components/admin/OFSuiviPedagogique';
import { OFVideoConferences } from '@/components/admin/OFVideoConferences';
import { OFEnvois } from '@/components/admin/OFEnvois';
import { OFNouvelEnvoi } from '@/components/admin/OFNouvelEnvoi';
import { OFEnvoiDetail } from '@/components/admin/OFEnvoiDetail';
import { OFIntegrations } from '@/components/admin/OFIntegrations';
import { OFIntegrationDetail } from '@/components/admin/OFIntegrationDetail';
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
      <Route path="/formations/:id" element={<OFFormationDetail />} />
      <Route path="/documents-of" element={<OFDocuments />} />
      <Route path="/documents" element={<OFDocuments />} />
      <Route path="/licences" element={<OFLicences />} />
      <Route path="/licences/:id" element={<OFLicenceDetail />} />
      <Route path="/licences/:id/edit" element={<OFLicenceEdit />} />
      <Route path="/suivi-pedagogique" element={<OFSuiviPedagogique />} />
      <Route path="/visio" element={<OFVideoConferences />} />
      <Route path="/envois" element={<OFEnvois />} />
      <Route path="/envois/nouveau" element={<OFNouvelEnvoi />} />
      <Route path="/envois/:id" element={<OFEnvoiDetail />} />
      <Route path="/integrations" element={<OFIntegrations />} />
      <Route path="/integrations/:id" element={<OFIntegrationDetail />} />
      <Route path="/logs" element={<OFLogs />} />
      <Route path="/parametres" element={<OFSettings />} />
    </Routes>
  );
};

export default OFDashboard;
