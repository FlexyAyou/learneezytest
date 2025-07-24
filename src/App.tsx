
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseDetailStudent from "./pages/CourseDetailStudent";
import SearchCourses from "./pages/SearchCourses";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import InstructorAnalytics from "./pages/InstructorAnalytics";
import InstructorOFDocuments from "./pages/InstructorOFDocuments";
import ManagerDashboard from "./pages/ManagerDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cours" element={<Courses />} />
          <Route path="/cours/:id" element={<CourseDetailStudent />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/rechercher" element={<SearchCourses />} />
          <Route path="/lesson/:id" element={<Lesson />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/apropos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          
          {/* Protected Student routes */}
          <Route 
            path="/dashboard/etudiant/*" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Instructor routes */}
          <Route 
            path="/dashboard/instructeur" 
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/instructeur/courses" 
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorCourses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/instructeur/analytics" 
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorAnalytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/instructeur/of-documents" 
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorOFDocuments />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected other role routes */}
          <Route 
            path="/dashboard/gestionnaire/*" 
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/parent/*" 
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/tuteur/*" 
            element={
              <ProtectedRoute requiredRole="tutor">
                <TutorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/admin/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/technicien" 
            element={
              <ProtectedRoute>
                <TechnicianDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
