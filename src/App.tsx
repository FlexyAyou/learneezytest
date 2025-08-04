
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CourseDetail from "./pages/CourseDetail";
import { PositioningTest } from "./components/common/PositioningTest";
import LearnerDashboard from "./pages/LearnerDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import ExternalTrainerDashboard from "./pages/ExternalTrainerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VideoConference from "./components/common/VideoConference";

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/tests" element={<PositioningTest userRole="student" />} />
          <Route path="/video" element={<VideoConference />} />
          
          {/* Learner Dashboard */}
          <Route path="/dashboard/*" element={<LearnerDashboard />} />
          
          {/* Instructor Dashboard */}
          <Route path="/instructor/*" element={<InstructorDashboard />} />
          
          {/* External Trainer Dashboard - Updated route */}
          <Route path="/formateur-independant/*" element={<ExternalTrainerDashboard />} />
          
          {/* Admin Dashboard */}
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
