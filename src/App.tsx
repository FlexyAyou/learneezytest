
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
import StudentCourses from "./pages/StudentCourses";
import StudentProgress from "./pages/StudentProgress";
import StudentCertificates from "./pages/StudentCertificates";
import StudentSettings from "./pages/StudentSettings";
import StudentMessaging from "./pages/StudentMessaging";
import InternalTrainerDashboard from "./pages/InternalTrainerDashboard";
import ExternalTrainerDashboard from "./pages/ExternalTrainerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import ContentCreatorDashboard from "./pages/ContentCreatorDashboard";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import AdminDashboard from "./pages/AdminDashboard";
import OFDashboard from "./pages/OFDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import InstructorAnalytics from "./pages/InstructorAnalytics";
import InstructorOFDocuments from "./pages/InstructorOFDocuments";
import BookingCalendar from "./pages/BookingCalendar";
import BookingHistory from "./pages/BookingHistory";
import Payment from "./pages/Payment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cours" element={<Courses />} />
          <Route path="/cours/:id" element={<CourseDetailStudent />} />
          <Route path="/cours/:courseId/reservation" element={<BookingCalendar />} />
          <Route path="/cours/:courseId/paiement/:slotId" element={<Payment />} />
          <Route path="/reservations" element={<BookingHistory />} />
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
          
          {/* Student routes */}
          <Route path="/dashboard/etudiant/*" element={<StudentDashboard />} />
          
          {/* Instructor routes */}
          <Route path="/dashboard/instructeur" element={<InstructorDashboard />} />
          <Route path="/dashboard/instructeur/courses" element={<InstructorCourses />} />
          <Route path="/dashboard/instructeur/analytics" element={<InstructorAnalytics />} />
          <Route path="/dashboard/instructeur/of-documents" element={<InstructorOFDocuments />} />
          
          {/* New Dashboard routes */}
          <Route path="/dashboard/gestionnaire/*" element={<ManagerDashboard />} />
          <Route path="/formateur-interne/*" element={<InternalTrainerDashboard />} />
          <Route path="/formateur-externe/*" element={<ExternalTrainerDashboard />} />
          <Route path="/parent/*" element={<ParentDashboard />} />
          <Route path="/dashboard/tuteur/*" element={<TutorDashboard />} />
          <Route path="/createur-de-contenu" element={<ContentCreatorDashboard />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/edit-course/:id" element={<EditCourse />} />
          
          {/* Admin routes - all under /dashboard/admin */}
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
          
          {/* Organisme de Formation routes */}
          <Route path="/dashboard/organisme-formation/*" element={<OFDashboard />} />
          
          {/* Technician dashboard */}
          <Route path="/technicien" element={<TechnicianDashboard />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
