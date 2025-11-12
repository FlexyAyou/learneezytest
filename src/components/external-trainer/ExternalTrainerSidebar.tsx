import { Link, useLocation } from "react-router-dom";
import {
  Calendar, 
  Euro, 
  Star, 
  BookOpen,
  Settings,
  Award,
  TrendingUp,
  Target,
  History,
  HelpCircle,
  Download,
  Video,
  TestTube,
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

import { useFastAPIAuth } from "@/hooks/useFastAPIAuth";

const navigationItems = [
  { title: "Tableau de bord", href: "/formateur-independant", icon: TrendingUp },
  { title: "Mes spécialités", href: "/formateur-independant/specialites", icon: Target },
  { title: "Mes disponibilités", href: "/formateur-independant/disponibilites", icon: Calendar },
  { title: "Mes tarifs", href: "/formateur-independant/tarifs", icon: Euro },
  { title: "Mes réservations", href: "/formateur-independant/reservations", icon: BookOpen },
  { title: "Historique séances", href: "/formateur-independant/historique", icon: History },
];

const toolsItems = [
  { title: "Mes avis", href: "/formateur-independant/evaluations", icon: Star },
  { title: "Mes revenus", href: "/formateur-independant/revenus", icon: Award },
  { title: "Tests de positionnement", href: "/formateur-independant/tests", icon: TestTube },
  { title: "Visioconférence", href: "/formateur-independant/video", icon: Video },
  { title: "Mes documents", href: "/formateur-independant/documents", icon: Download },
  { title: "Support & Assistance", href: "/formateur-independant/support", icon: HelpCircle },
  { title: "Profil formateur", href: "/formateur-independant/profil", icon: Settings },
];

export function ExternalTrainerSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useFastAPIAuth();
  
  // Utiliser l'image du backend en priorité, fallback sur localStorage pour compatibilité
  const avatar = user?.image || localStorage.getItem('trainer-avatar') || '';
  
  // Informations utilisateur dynamiques
  const userInfo = {
    name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "Formateur",
    email: user?.email || "",
    initials: user 
      ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
      : "F"
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
            <h2 className="text-lg font-semibold">Formateur Independant</h2>
            <p className="text-sm text-muted-foreground">Mon portail</p>
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
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
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
          <SidebarGroupLabel>Outils & Profil</SidebarGroupLabel>
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
          className="w-full justify-start cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="font-medium">Se déconnecter</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
