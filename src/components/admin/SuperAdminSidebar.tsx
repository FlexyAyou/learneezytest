import { Link, useLocation } from "react-router-dom";
import {
  Building,
  Users,
  BookOpen,
  Settings,
  Shield,
  CreditCard,
  DollarSign,
  MessageSquare,
  UserCheck,
  FileText,
  FileSignature,
  Mail,
  PenTool,
  Key,
  TestTube,
  Video,
  Download,
  Home,
  GraduationCap,
  LogOut
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useFastAPIAuth } from "@/hooks/useFastAPIAuth";

const mainNavigationItems = [
  { title: "Tableau de bord", href: "/dashboard/superadmin", icon: Home },
  { title: "Utilisateurs", href: "/dashboard/superadmin/users", icon: Users },
  { title: "Formateurs", href: "/dashboard/superadmin/trainers", icon: GraduationCap },
  { title: "Organismes de formations", href: "/dashboard/superadmin/organisations", icon: Building },
  { title: "Cours", href: "/dashboard/superadmin/courses", icon: BookOpen },
];

const managementItems = [
  { title: "Inscriptions", href: "/dashboard/superadmin/inscriptions", icon: UserCheck },
  { title: "Documents OF", href: "/dashboard/superadmin/of-documents", icon: FileText },
  { title: "Conventions", href: "/dashboard/superadmin/conventions", icon: FileSignature },
  { title: "Envois automatiques", href: "/dashboard/superadmin/mailings", icon: Mail },
  { title: "Émargements", href: "/dashboard/superadmin/emargements", icon: PenTool },
  { title: "Gestion licences", href: "/dashboard/superadmin/licenses", icon: Key },
];

const toolsItems = [
  { title: "Vérification identité", href: "/dashboard/superadmin/identity", icon: Shield },
  { title: "Tests positionnement", href: "/dashboard/superadmin/tests", icon: TestTube },
  { title: "Visioconférence", href: "/dashboard/superadmin/video", icon: Video },
  { title: "Bibliothèque", href: "/dashboard/superadmin/library", icon: Download },
  { title: "Abonnements", href: "/dashboard/superadmin/subscriptions", icon: CreditCard },
  { title: "Paiements", href: "/dashboard/superadmin/payments", icon: DollarSign },
  { title: "Sécurité", href: "/dashboard/superadmin/security", icon: Shield },
  { title: "Support", href: "/dashboard/superadmin/support", icon: MessageSquare },
  { title: "Paramètres", href: "/dashboard/superadmin/settings", icon: Settings },
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useFastAPIAuth();
  
  // Utiliser l'image du backend en priorité, fallback sur localStorage pour compatibilité
  const avatar = user?.image || localStorage.getItem('admin-avatar') || '';
  
  // Informations utilisateur dynamiques
  const userInfo = {
    name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || "Super Admin" : "Super Admin",
    email: user?.email || "superadmin@Learneezy.com",
    initials: user 
      ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || "SA"
      : "SA"
  };

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/" className="flex items-center justify-center mb-2">
          <img 
            src="/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png" 
            alt="Learneezy" 
            className={isCollapsed ? "h-8 w-auto" : "h-16 w-auto"}
          />
        </Link>
        {!isCollapsed && (
          <div className="text-center">
            <h2 className="text-lg font-semibold">Super Administration</h2>
            <p className="text-sm text-muted-foreground">Gestion de la plateforme</p>
          </div>
        )}
      </SidebarHeader>

      {!isCollapsed && (
        <div className="border-b border-border p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              {avatar && <AvatarImage src={avatar} alt={userInfo.name} />}
              <AvatarFallback className="bg-pink-100 text-pink-600 font-medium text-sm">
                {userInfo.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Outils & Paramètres</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Se déconnecter</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
