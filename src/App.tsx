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
import CourseViewer from "./pages/student/CourseViewer";
import LessonViewer from "./pages/student/LessonViewer";
import StudentPayment from "./pages/student/StudentPayment";
import CourseReviewPage from "@/pages/admin/CourseReviewPage";
import SystemArchitecture from "./pages/SystemArchitecture";

function App() {
  return <LanguageProvider></LanguageProvider>;
}

export default App;
