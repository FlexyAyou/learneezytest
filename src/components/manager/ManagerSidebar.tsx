import { Link, useLocation } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  UserCheck,
  ClipboardList,
  Settings,
  MessageSquare,
  Home,
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
  { title: "Vue d'ensemble", href: "/dashboard/gestionnaire", icon: Home },
  { title: "Apprenants", href: "/dashboard/gestionnaire/apprenants", icon: Users },
  { title: "Formateurs", href: "/dashboard/gestionnaire/formateurs", icon: UserCheck },
  { title: "Cours", href: "/dashboard/gestionnaire/courses", icon: BookOpen },
  { title: "Planning", href: "/dashboard/gestionnaire/planning", icon: Calendar },
  { title: "Inscriptions", href: "/dashboard/gestionnaire/inscriptions", icon: UserCheck },
  { title: "Suivi des présences", href: "/dashboard/gestionnaire/presences", icon: UserCheck },
  { title: "Rapports", href: "/dashboard/gestionnaire/rapports", icon: ClipboardList },
  { title: "Messages", href: "/dashboard/gestionnaire/messages", icon: MessageSquare },
  { title: "Paramètres", href: "/dashboard/gestionnaire/parametres", icon: Settings },
];

export function ManagerSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useFastAPIAuth();
  
  // Utiliser l'image du backend en priorité
  const avatar = user?.image || '';
  
  // Informations utilisateur dynamiques
  const userInfo = {
    name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || "Gestionnaire" : "Gestionnaire",
    email: user?.email || "gestionnaire@learneezy.com",
    initials: user 
      ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || "GS"
      : "GS"
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
            <h2 className="text-lg font-semibold">Gestionnaire</h2>
            <p className="text-sm text-muted-foreground">Supervision des formations</p>
          </div>
        )}
      </SidebarHeader>

      {!isCollapsed && (
        <div className="border-b border-border p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              {avatar && <AvatarImage src={avatar} alt={userInfo.name} />}
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-medium text-sm">
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
