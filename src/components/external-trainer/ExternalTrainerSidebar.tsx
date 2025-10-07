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
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/common/LanguageSelector";

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

const userInfo = {
  name: "Jean Martin",
  email: "jean.martin@email.com"
};

export function ExternalTrainerSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

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
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-pink-600 font-medium text-sm">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
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
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Se déconnecter</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
