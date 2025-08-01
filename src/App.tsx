import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from '@/components/ui/toaster';
import AdminUsers from './components/admin/AdminUsers';
import UserDetailPage from './components/admin/UserDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cours" element={<Courses />} />
        <Route path="/cours/:id" element={<CourseDetail />} />
        <Route path="/tarifs" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tableau-de-bord" element={<Dashboard />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/users" element={<AdminUsers />} />
        <Route path="/dashboard/admin/users/:userSlug" element={<UserDetailPage />} />
        <Route path="/dashboard/admin/courses" element={<AdminCourses />} />
        
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
