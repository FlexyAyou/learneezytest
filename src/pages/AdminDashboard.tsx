import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Cog, Users, Home, GraduationCap, FileText, Book, Calendar, Coins, Mail, TestTube2, Video, ListChecks, ShieldAlert, MessageSquare, Settings as SettingsIcon, CreditCard, TrendingUp, LayoutDashboard } from 'lucide-react';

import SuperAdminDashboard from '@/components/admin/SuperAdminDashboard';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminTrainers from '@/components/admin/AdminTrainers';
import AdminOrganisations from '@/components/admin/AdminOrganisations';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminDocuments from '@/components/admin/AdminDocuments';
import AdminRessources from '@/components/admin/AdminRessources';
import AdminEmargements from '@/components/admin/AdminEmargements';
import AdminInscriptions from '@/components/admin/AdminInscriptions';
import AdminTokens from '@/components/admin/AdminTokens';
import AdminPromotions from '@/components/admin/AdminPromotions';
import AdminAutomaticMailings from '@/components/admin/AdminAutomaticMailings';
import AdminConventionGenerator from '@/components/admin/AdminConventionGenerator';
import PositioningTestPage from '@/components/admin/PositioningTestPage';
import AdminVideoConferences from '@/components/admin/AdminVideoConferences';
import SuperAdminDocuments from '@/components/admin/SuperAdminDocuments';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminSecurity from '@/components/admin/AdminSecurity';
import AdminSupport from '@/components/admin/AdminSupport';
import AdminSettings from '@/components/admin/AdminSettings';
import UserDetailPage from '@/components/admin/UserDetailPage';
import OrganismeDetail from '@/components/admin/OrganismeDetail';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CreateOrganisme from './admin/CreateOrganisme';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === `/dashboard/superadmin${path}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`bg-white w-64 flex-shrink-0 border-r transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full px-4 py-6">
          <div className="mb-8 flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Your Name" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="  justify-start text-left font-normal">
                  <div className="flex flex-col truncate">
                    <span className="w-[200px] line-clamp-1 font-semibold">Nom Admin</span>
                    <span className="w-[200px] line-clamp-1 text-muted-foreground">admin@email.com</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate('/dashboard/superadmin/settings')}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')}>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator className="mb-4" />

          <nav className="space-y-1">
            <Button variant="ghost" className={`w-full justify-start ${isActive('') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/users') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/users')}>
              <Users className="mr-2 h-4 w-4" />
              Utilisateurs
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/trainers') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/trainers')}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Formateurs
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/organisations') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/organisations')}>
              <Home className="mr-2 h-4 w-4" />
              Organismes
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/courses') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/courses')}>
              <Book className="mr-2 h-4 w-4" />
              Formations
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/documents') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/documents')}>
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/ressources') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/ressources')}>
              <Book className="mr-2 h-4 w-4" />
              Ressources
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/emargements') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/emargements')}>
              <ListChecks className="mr-2 h-4 w-4" />
              Emargements
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/inscriptions') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/inscriptions')}>
              <Calendar className="mr-2 h-4 w-4" />
              Inscriptions
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/tokens') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/tokens')}>
              <Coins className="mr-2 h-4 w-4" />
              Tokens
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/promotions') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/promotions')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Promotions
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/mailings') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/mailings')}>
              <Mail className="mr-2 h-4 w-4" />
              Mailings
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/generator') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/generator')}>
              <FileText className="mr-2 h-4 w-4" />
              Generator
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/tests') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/tests')}>
              <TestTube2 className="mr-2 h-4 w-4" />
              Tests
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/video') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/video')}>
              <Video className="mr-2 h-4 w-4" />
              Video
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/library') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/library')}>
              <Book className="mr-2 h-4 w-4" />
              Library
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/subscriptions') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/subscriptions')}>
              <CreditCard className="mr-2 h-4 w-4" />
              Subscriptions
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/payments') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/payments')}>
              <Coins className="mr-2 h-4 w-4" />
              Payments
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/security') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/security')}>
              <ShieldAlert className="mr-2 h-4 w-4" />
              Security
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/support') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/support')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Support
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${isActive('/settings') ? 'text-blue-600' : ''}`} onClick={() => navigate('/dashboard/superadmin/settings')}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            <Routes>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="trainers" element={<AdminTrainers />} />
              <Route path="organisations" element={<AdminOrganisations />} />
              <Route path="organisations/create" element={<CreateOrganisme />} />
              <Route path="organisations/:id" element={<OrganismeDetail />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="documents" element={<AdminDocuments />} />
              <Route path="ressources" element={<AdminRessources />} />
              <Route path="emargements" element={<AdminEmargements />} />
              <Route path="inscriptions" element={<AdminInscriptions />} />
              <Route path="tokens" element={<AdminTokens />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="mailings" element={<AdminAutomaticMailings />} />
              <Route path="generator" element={<AdminConventionGenerator />} />
              <Route path="tests" element={<PositioningTestPage />} />
              <Route path="video" element={<AdminVideoConferences />} />
              <Route path="library" element={<SuperAdminDocuments />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="security" element={<AdminSecurity />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
