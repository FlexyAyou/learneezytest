
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
import LoginNew from './pages/LoginNew';
import RegisterNew from './pages/RegisterNew';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Toaster } from '@/components/ui/toaster';
import { AdminUsers } from './components/admin/AdminUsers';
import UserDetailPage from './components/admin/UserDetailPage';
import { LanguageProvider } from './contexts/LanguageContext';
import CourseViewer from './pages/student/CourseViewer';
import LessonViewer from './pages/student/LessonViewer';
import StudentPayment from './pages/student/StudentPayment';
import CourseReviewPage from '@/pages/admin/CourseReviewPage';
import SystemArchitecture from './pages/SystemArchitecture';

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
          <Route path="/dashboard/apprenant/*" element={<StudentDashboard />} />
          <Route path="/dashboard/apprenant/courses/:id" element={<CourseViewer />} />
          <Route path="/dashboard/apprenant/courses/:courseId/lessons/:lessonId" element={<LessonViewer />} />
          <Route path="/dashboard/apprenant/payment" element={<StudentPayment />} />
          <Route path="/profil" element={<Profile />} />
        <Route path="/connexion" element={<LoginNew />} />
        <Route path="/inscription" element={<RegisterNew />} />
          <Route path="/mot-de-passe-oublié" element={<ForgotPassword />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
          
          {/* Public Trainer Pages */}
          <Route path="/formateur-independant/*" element={<ExternalTrainerDashboard />} />
          <Route path="/formateur-interne/*" element={<InternalTrainerDashboard />} />
          
          {/* Super Admin Routes */}
          <Route path="/dashboard/superadmin/*" element={<AdminDashboard />} />
          
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
          
          {/* Route pour la review des cours */}
          <Route path="/dashboard/superadmin/courses/:courseId/review" element={<CourseReviewPage />} />
          
          {/* Route pour l'architecture système */}
          <Route path="/architecture" element={<SystemArchitecture />} />
          
        </Routes>
        <Toaster />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
