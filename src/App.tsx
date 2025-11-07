import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import Documentation from "./pages/Documentation";
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import OFDashboard from "./pages/OFDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import ExternalTrainerDashboard from "./pages/ExternalTrainerDashboard";
import InternalTrainerDashboard from "./pages/InternalTrainerDashboard";
import ContentCreatorDashboard from "./pages/ContentCreatorDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "@/components/ui/toaster";
import { AdminUsers } from "./components/admin/AdminUsers";
import UserDetailPage from "./components/admin/UserDetailPage";
import { LanguageProvider } from "./contexts/LanguageContext";
import { OrganizationProvider } from "./contexts/OrganizationContext";
import SubdomainRouter from "./components/common/SubdomainRouter";
import CourseViewer from "./pages/student/CourseViewer";
import LessonViewer from "./pages/student/LessonViewer";
import StudentPayment from "./pages/student/StudentPayment";
import CourseReviewPage from "@/pages/admin/CourseReviewPage";
import StudentDetailPage from "./pages/admin/StudentDetailPage";
import ManagerDetailPage from "./pages/admin/ManagerDetailPage";
import ContentCreatorDetailPage from "./pages/admin/ContentCreatorDetailPage";
import SystemArchitecture from "./pages/SystemArchitecture";
import FastAPIProtectedRoute from "./components/common/FastAPIProtectedRoute";
import OFHomePage from "./pages/OFHomePage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <OrganizationProvider>
          <SubdomainRouter>
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
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/mot-de-passe-oublié" element={<ForgotPassword />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />

          {/* Protected Routes - Student */}
          <Route
            path="/tableau-de-bord"
            element={
              <FastAPIProtectedRoute requiredRole={["student", "apprenant"]}>
                <StudentDashboard />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/dashboard/apprenant/*"
            element={
              <FastAPIProtectedRoute requiredRole={["student", "apprenant"]}>
                <StudentDashboard />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/dashboard/apprenant/courses/:id"
            element={
              <FastAPIProtectedRoute requiredRole={["student", "apprenant"]}>
                <CourseViewer />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/dashboard/apprenant/courses/:courseId/lessons/:lessonId"
            element={
              <FastAPIProtectedRoute requiredRole={["student", "apprenant"]}>
                <LessonViewer />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/dashboard/apprenant/payment"
            element={
              <FastAPIProtectedRoute requiredRole={["student", "apprenant"]}>
                <StudentPayment />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <FastAPIProtectedRoute>
                <Profile />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - External Trainer */}
          <Route
            path="/formateur-independant/*"
            element={
              <FastAPIProtectedRoute requiredRole={["independent_trainer", "trainer"]}>
                <ExternalTrainerDashboard />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/dashboard/formateur-independant/*"
            element={
              <FastAPIProtectedRoute requiredRole={["independent_trainer", "trainer"]}>
                <ExternalTrainerDashboard />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - Internal Trainer */}
          <Route
            path="/formateur-interne/*"
            element={
              <FastAPIProtectedRoute requiredRole="formateur_interne">
                <InternalTrainerDashboard />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/dashboard/formateur-interne/*"
            element={
              <FastAPIProtectedRoute requiredRole="formateur_interne">
                <InternalTrainerDashboard />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - Super Admin */}
          <Route
            path="/dashboard/superadmin/*"
            element={
              <FastAPIProtectedRoute requiredRole="superadmin">
                <AdminDashboard />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/dashboard/superadmin/courses/:courseId/review"
            element={
              <FastAPIProtectedRoute requiredRole="superadmin">
                <CourseReviewPage />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/dashboard/superadmin/users/:userSlug/gestionnaire"
            element={
              <FastAPIProtectedRoute requiredRole="superadmin">
                <ManagerDetailPage />
              </FastAPIProtectedRoute>
            }
          />
          <Route
            path="/dashboard/superadmin/users/:userSlug/createur-contenu"
            element={
              <FastAPIProtectedRoute requiredRole="superadmin">
                <ContentCreatorDetailPage />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - Organisme de Formation */}
          <Route
            path="/dashboard/organisme-formation/*"
            element={
              <FastAPIProtectedRoute requiredRole="of_admin">
                <OFDashboard />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - Instructor */}
          <Route
            path="/dashboard/instructor/*"
            element={
              <FastAPIProtectedRoute requiredRole="administrator">
                <InstructorDashboard />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - Manager */}
          <Route
            path="/dashboard/gestionnaire/*"
            element={
              <FastAPIProtectedRoute requiredRole={["manager", "gestionnaire"]}>
                <ManagerDashboard />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - Tutor */}
          <Route
            path="/dashboard/tuteur/*"
            element={
              <FastAPIProtectedRoute requiredRole="tutor">
                <TutorDashboard />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - Parent */}
          <Route
            path="/dashboard/parent/*"
            element={
              <FastAPIProtectedRoute requiredRole="tutor">
                <ParentDashboard />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - Content Creator */}
          <Route
            path="/dashboard/createur-contenu/*"
            element={
              <FastAPIProtectedRoute requiredRole="createur_contenu">
                <ContentCreatorDashboard />
              </FastAPIProtectedRoute>
            }
          />

          {/* Protected Routes - Technician */}
          <Route
            path="/dashboard/technicien/*"
            element={
              <FastAPIProtectedRoute requiredRole="administrator">
                <TechnicianDashboard />
              </FastAPIProtectedRoute>
            }
          />

          {/* Route pour l'architecture système */}
          <Route path="/architecture" element={<SystemArchitecture />} />
          
          {/* 404 Route - Must be last */}
            <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </SubdomainRouter>
        </OrganizationProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
