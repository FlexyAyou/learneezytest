
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useApi';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Profile from '@/pages/Profile';
import StudentCourses from '@/pages/StudentCourses';
import CourseViewer from '@/pages/student/CourseViewer';
import LessonViewer from '@/pages/student/LessonViewer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/cours" element={<Courses />} />
        <Route path="/cours/:id" element={<CourseDetail />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />

        {/* Auth routes */}
        <Route path="/profil" element={<Profile />} />
        
        {/* Student routes */}
        <Route path="/dashboard/etudiant/courses" element={<StudentCourses />} />
        <Route path="/dashboard/etudiant/courses/:id" element={<CourseViewer />} />
        <Route path="/dashboard/etudiant/courses/:courseId/lessons/:lessonId" element={<LessonViewer />} />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
