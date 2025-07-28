import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/contexts/ThemeContext"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import StudentDashboard from '@/pages/StudentDashboard';
import ForgotPassword from './pages/ForgotPassword';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import About from './pages/About';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/connexion" element={<Login />} />
                <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
                <Route path="/cours" element={<Courses />} />
                <Route path="/apropos" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard/etudiant/*" element={<StudentDashboard />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
