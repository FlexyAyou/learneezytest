
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Offers from './pages/Offers';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CourseViewer from './pages/student/CourseViewer';
import LessonViewer from './pages/student/LessonViewer';
import StudentPayment from './pages/student/StudentPayment';
import TutorPayment from './pages/tutor/TutorPayment';
import CourseReviewPage from '@/pages/admin/CourseReviewPage';
import OrganizationDashboard from './pages/OFDashboard';
import { TutorSubscription } from './components/tutor/TutorSubscription';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/instructors" element={<InstructorDashboard />} />
        <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
        <Route path="/dashboard/instructor/*" element={<InstructorDashboard />} />
        <Route path="/dashboard/manager/*" element={<ManagerDashboard />} />
        <Route path="/dashboard/tuteur/*" element={<TutorDashboard />} />
        <Route path="/dashboard/tuteur/payment" element={<TutorPayment />} />
        <Route path="/dashboard/tuteur/abonnements" element={<TutorSubscription />} />
        <Route path="/dashboard/apprenant/*" element={<StudentDashboard />} />
        <Route path="/dashboard/apprenant/courses/:id" element={<CourseViewer />} />
        <Route path="/dashboard/apprenant/courses/:courseId/lessons/:lessonId" element={<LessonViewer />} />
        <Route path="/dashboard/apprenant/payment" element={<StudentPayment />} />
        <Route path="/dashboard/organization/*" element={<OrganizationDashboard />} />
        <Route path="/dashboard/admin/review" element={<CourseReviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
