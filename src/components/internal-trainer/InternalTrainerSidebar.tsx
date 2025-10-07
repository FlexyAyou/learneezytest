import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  Settings,
  Video,
  Download,
  Brain,
  TestTube,
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
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/common/LanguageSelector";

const navigationItems = [
  { title: "Tableau de bord", href: "/formateur-interne", icon: Home },
  { title: "Contenus pédagogiques", href: "/formateur-interne/contenus", icon: BookOpen },
  { title: "Sessions de formation", href: "/formateur-interne/sessions", icon: Calendar },
  { title: "Suivi des apprenants", href: "/formateur-interne/apprenants", icon: Users },
];

const toolsItems = [
  { title: "Messagerie interne", href: "/formateur-interne/messagerie", icon: MessageSquare },
  { title: "Tests de positionnement", href: "/formateur-interne/tests", icon: TestTube },
  { title: "Visioconférence", href: "/formateur-interne/video", icon: Video },
  { title: "Chat IA", href: "/formateur-interne/chat", icon: Brain },
  { title: "Mes documents", href: "/formateur-interne/documents", icon: Download },
  { title: "Paramètres", href: "/formateur-interne/parametres", icon: Settings },
];

const userInfo = {
  name: "Sophie Moreau",
  email: "sophie.moreau@learneezy.com"
};

export function InternalTrainerSidebar() {
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
            <h2 className="text-lg font-semibold">Formateur Interne</h2>
            <p className="text-sm text-muted-foreground">Formation continue</p>
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
          <SidebarGroupLabel>Outils</SidebarGroupLabel>
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
