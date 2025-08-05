
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import Documentation from './pages/Documentation';
import StudentDashboard from './pages/StudentDashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import OFDashboard from './pages/OFDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import TutorDashboard from './pages/TutorDashboard';
import ParentDashboard from './pages/ParentDashboard';
import ExternalTrainerDashboard from './pages/ExternalTrainerDashboard';
import InternalTrainerDashboard from './pages/InternalTrainerDashboard';
import ContentCreatorDashboard from './pages/ContentCreatorDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import { Toaster } from '@/components/ui/toaster';
import AdminUsers from './components/admin/AdminUsers';
import UserDetailPage from './components/admin/UserDetailPage';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/apropos" element={<About />} />
          <Route path="/cours" element={<Courses />} />
          <Route path="/nos-formations" element={<Courses />} />
          <Route path="/cours/:id" element={<CourseDetail />} />
          <Route path="/tarifs" element={<Offers />} />
          <Route path="/offres" element={<Offers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/tableau-de-bord" element={<StudentDashboard />} />
          <Route path="/dashboard/etudiant/*" element={<StudentDashboard />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          
          {/* Public Trainer Pages */}
          <Route path="/formateur-independant/*" element={<ExternalTrainerDashboard />} />
          <Route path="/formateur-interne/*" element={<InternalTrainerDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
          
          {/* Organisme de Formation Routes */}
          <Route path="/dashboard/organisme-formation/*" element={<OFDashboard />} />
          
          {/* Instructor Routes */}
          <Route path="/dashboard/instructor/*" element={<InstructorDashboard />} />
          
          {/* Manager Routes */}
          <Route path="/dashboard/gestionnaire/*" element={<ManagerDashboard />} />
          
          {/* Tutor Routes */}
          <Route path="/dashboard/tuteur/*" element={<TutorDashboard />} />
          
          {/* Parent Routes */}
          <Route path="/dashboard/parent/*" element={<ParentDashboard />} />
          
          {/* External Trainer Routes */}
          <Route path="/dashboard/formateur-independant/*" element={<ExternalTrainerDashboard />} />
          
          {/* Internal Trainer Routes */}
          <Route path="/dashboard/formateur-interne/*" element={<InternalTrainerDashboard />} />
          
          {/* Content Creator Routes */}
          <Route path="/dashboard/createur-contenu/*" element={<ContentCreatorDashboard />} />
          
          {/* Technician Routes */}
          <Route path="/dashboard/technicien/*" element={<TechnicianDashboard />} />
          
        </Routes>
        <Toaster />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
