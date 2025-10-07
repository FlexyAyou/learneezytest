import { Link, useLocation } from "react-router-dom";
import { BookOpen, User, Award, MessageSquare, Settings, Home, Video, Download, FileText, PenTool, TrendingUp, CreditCard, ShoppingBag, LogOut } from 'lucide-react';
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
  { title: "Tableau de bord", href: "/dashboard/apprenant", icon: Home },
  { title: "Catalogue", href: "/dashboard/apprenant/catalogue", icon: BookOpen },
  { title: "Mes cours", href: "/dashboard/apprenant/courses", icon: BookOpen },
  { title: "Mon parcours", href: "/dashboard/apprenant/progress", icon: Award },
  { title: "Certificats", href: "/dashboard/apprenant/certificates", icon: Award },
];

const formationItems = [
  { title: "Mes inscriptions", href: "/dashboard/apprenant/inscriptions", icon: FileText },
  { title: "Émargement", href: "/dashboard/apprenant/emargements", icon: PenTool },
  { title: "Évaluations", href: "/dashboard/apprenant/evaluations", icon: TrendingUp },
];

const toolsItems = [
  { title: "Boutique", href: "/dashboard/apprenant/boutique", icon: ShoppingBag },
  { title: "Mes documents", href: "/dashboard/apprenant/documents", icon: Download },
  { title: "Abonnements", href: "/dashboard/apprenant/subscription", icon: CreditCard },
  { title: "Messages", href: "/dashboard/apprenant/messages", icon: MessageSquare, badge: "3" },
  { title: "Visioconférence", href: "/dashboard/apprenant/video", icon: Video },
  { title: "Paramètres", href: "/dashboard/apprenant/settings", icon: Settings },
];

const userInfo = {
  name: "Alice Martin",
  email: "alice.martin@email.com"
};

export function StudentSidebar() {
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
            <h2 className="text-lg font-semibold">Espace Apprenant</h2>
            <p className="text-sm text-muted-foreground">Votre parcours d'apprentissage</p>
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
          <SidebarGroupLabel>Formation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {formationItems.map((item) => (
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
                      {item.badge && (
                        <span className="ml-auto bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
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
