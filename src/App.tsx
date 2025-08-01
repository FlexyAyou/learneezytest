
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';
import InstructorDashboard from '@/pages/InstructorDashboard';
import InstructorCourses from '@/pages/InstructorCourses';
import StudentDashboard from '@/pages/StudentDashboard';
import StudentCourses from '@/pages/StudentCourses';
import UserProfile from '@/pages/UserProfile';
import PublicInscription from '@/pages/PublicInscription';
import Offers from '@/pages/Offers';
import OFDashboard from '@/pages/OFDashboard';
import TutorDashboard from '@/pages/TutorDashboard';
import ParentDashboard from '@/pages/ParentDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import InternalTrainerDashboard from '@/pages/InternalTrainerDashboard';
import ExternalTrainerDashboard from '@/pages/ExternalTrainerDashboard';
import ContentCreatorDashboard from '@/pages/ContentCreatorDashboard';
import TechnicianDashboard from '@/pages/TechnicianDashboard';
import { Toaster } from '@/components/ui/toaster';
import DownloadAppButton from '@/components/common/DownloadAppButton';
import AIChatButton from '@/components/common/AIChatButton';
import { LanguageProvider } from '@/contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/apropos" element={<About />} />
            {/* Redirection de l'ancienne URL vers la nouvelle */}
            <Route path="/cours" element={<Navigate to="/nos-formations" replace />} />
            <Route path="/nos-formations" element={<Courses />} />
            <Route path="/cours/:id" element={<Navigate to="/nos-formations/:id" replace />} />
            <Route path="/nos-formations/:id" element={<CourseDetail />} />
            <Route path="/tarifs" element={<Contact />} />
            <Route path="/offres" element={<Offers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/profil" element={<Profile />} />
            
            {/* Admin Routes - Routes originales restaurées */}
            <Route path="/admin/tableau-de-bord" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
            
            {/* Instructor Routes */}
            <Route path="/instructor/tableau-de-bord" element={<InstructorDashboard />} />
            <Route path="/instructor/cours" element={<InstructorCourses />} />
            
            {/* Student Routes */}
            <Route path="/student/tableau-de-bord" element={<StudentDashboard />} />
            <Route path="/student/cours" element={<StudentCourses />} />
            <Route path="/student/profil" element={<UserProfile />} />
            <Route path="/dashboard/etudiant/*" element={<StudentDashboard />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard/organisme-formation/*" element={<OFDashboard />} />
            <Route path="/dashboard/tuteur/*" element={<TutorDashboard />} />
            <Route path="/dashboard/parent/*" element={<ParentDashboard />} />
            <Route path="/dashboard/gestionnaire/*" element={<ManagerDashboard />} />
            <Route path="/dashboard/createur-contenu/*" element={<ContentCreatorDashboard />} />
            <Route path="/dashboard/technicien/*" element={<TechnicianDashboard />} />

            {/* Trainer routes - Routes originales restaurées */}
            <Route path="/formateur-interne/*" element={<InternalTrainerDashboard />} />
            <Route path="/formateur-externe/*" element={<ExternalTrainerDashboard />} />

            {/* Public Inscription */}
            <Route path="/inscription-formation" element={<PublicInscription />} />
          </Routes>
          <Toaster />
          
          {/* Global floating buttons */}
          <DownloadAppButton />
          <AIChatButton />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
