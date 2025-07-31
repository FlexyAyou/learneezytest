import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Courses from '@/pages/Courses';
import CourseDetails from '@/pages/CourseDetails';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/admin/Dashboard';
import AdminCourses from '@/pages/admin/Courses';
import AdminUsers from '@/pages/admin/Users';
import InstructorDashboard from '@/pages/instructor/Dashboard';
import InstructorCourses from '@/pages/instructor/Courses';
import StudentDashboard from '@/pages/student/Dashboard';
import StudentCourses from '@/pages/student/Courses';
import StudentProfile from '@/pages/student/Profile';
import PublicInscription from '@/pages/PublicInscription';
import { Toaster } from '@/components/ui/toaster';
import DownloadAppButton from '@/components/common/DownloadAppButton';
import AIChatButton from '@/components/common/AIChatButton';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cours" element={<Courses />} />
          <Route path="/cours/:id" element={<CourseDetails />} />
          <Route path="/tarifs" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/profil" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin/tableau-de-bord" element={<Dashboard />} />
          <Route path="/admin/cours" element={<AdminCourses />} />
          <Route path="/admin/utilisateurs" element={<AdminUsers />} />
          
          {/* Instructor Routes */}
          <Route path="/instructor/tableau-de-bord" element={<InstructorDashboard />} />
          <Route path="/instructor/cours" element={<InstructorCourses />} />
          
          {/* Student Routes */}
          <Route path="/student/tableau-de-bord" element={<StudentDashboard />} />
          <Route path="/student/cours" element={<StudentCourses />} />
          <Route path="/student/profil" element={<StudentProfile />} />

          {/* Public Inscription */}
          <Route path="/inscription-formation" element={<PublicInscription />} />
        </Routes>
        <Toaster />
        
        {/* Global floating buttons */}
        <DownloadAppButton />
        <AIChatButton />
      </div>
    </Router>
  );
}

export default App;
