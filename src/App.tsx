import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useApi';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Home } from '@/pages/Home';
import { Courses } from '@/pages/Courses';
import { CourseDetail } from '@/pages/CourseDetail';
import { Profile } from '@/pages/Profile';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminCourses } from '@/pages/admin/AdminCourses';
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { InstructorDashboard } from '@/pages/instructor/InstructorDashboard';
import { StudentCourses } from '@/pages/StudentCourses';
import { CourseViewer } from '@/pages/student/CourseViewer';
import { LessonViewer } from '@/pages/student/LessonViewer';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cours" element={<Courses />} />
          <Route path="/cours/:id" element={<CourseDetail />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          {/* Auth routes */}
          <Route element={<Layout />}>
            <Route path="/profil" element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          
          {/* Student routes */}
          <Route path="/dashboard/etudiant/courses" element={<StudentCourses />} />
          <Route path="/dashboard/etudiant/courses/:id" element={<CourseViewer />} />
          <Route path="/dashboard/etudiant/courses/:courseId/lessons/:lessonId" element={<LessonViewer />} />

          {/* Instructor routes */}
          <Route path="/dashboard/instructor" element={<InstructorDashboard />} />

          {/* Default route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
