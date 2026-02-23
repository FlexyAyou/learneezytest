import { Link, useLocation } from "react-router-dom";
import {
  Building,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  FileText,
  Key,
  Video,
  Mail,
  Puzzle,
  FileArchive,
  Home,
  CreditCard,
  LogOut,
  Tag,
  MessageSquare
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

import { useFastAPIAuth } from "@/hooks/useFastAPIAuth";
import { useOrganization } from "@/contexts/OrganizationContext";

const sidebarItems = [
  { title: "Tableau de bord", href: "/dashboard/organisme-formation/tableau-de-bord", icon: Home },
  { title: "Utilisateurs", href: "/dashboard/organisme-formation/utilisateurs", icon: Users },
  { title: "Formations", href: "/dashboard/organisme-formation/formations", icon: BookOpen },
  { title: "Documents", href: "/dashboard/organisme-formation/documents", icon: FileText },
  // { title: "Licences", href: "/dashboard/organisme-formation/licences", icon: Key },
  { title: "Suivi pédagogique", href: "/dashboard/organisme-formation/suivi-pedagogique", icon: BarChart3 },
  { title: "Visioconférence", href: "/dashboard/organisme-formation/visio", icon: Video },
  { title: "Messages", href: "/dashboard/organisme-formation/messages", icon: MessageSquare },
  { title: "Envois", href: "/dashboard/organisme-formation/envois", icon: Mail },
  { title: "Offres", href: "/dashboard/organisme-formation/offres", icon: Tag },
  // { title: "Intégrations", href: "/dashboard/organisme-formation/integrations", icon: Puzzle },
  { title: "Logs", href: "/dashboard/organisme-formation/logs", icon: FileArchive },
  { title: "Paramètres", href: "/dashboard/organisme-formation/parametres", icon: Settings },
];

const userInfo = {
  name: "Organisme Formation",
  email: "contact@organisme.fr"
};

export function OFSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useFastAPIAuth();
  const { organization } = useOrganization();

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  // Use user.image from backend for avatar
  const avatar = user?.image;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {organization?.exists ? (
          <div className="flex items-center justify-center mb-2">
            <img
              src={organization?.logoUrl || "/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png"}
              alt={organization?.organizationName || "Learneezy"}
              className={isCollapsed ? "h-8 w-auto object-contain" : "h-16 w-auto object-contain"}
            />
          </div>
        ) : (
          <Link to="/" className="flex items-center justify-center mb-2">
            <img
              src={organization?.logoUrl || "/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png"}
              alt={organization?.organizationName || "Learneezy"}
              className={isCollapsed ? "h-8 w-auto object-contain" : "h-16 w-auto object-contain"}
            />
          </Link>
        )}
        {!isCollapsed && (
          <div className="text-center">
            <h2 className="text-lg font-semibold">Organisme de Formation</h2>
            <p className="text-sm text-muted-foreground">Gestion de formation</p>
          </div>
        )}
      </SidebarHeader>

      {!isCollapsed && (
        <div className="border-b border-border p-4">
          <div className="flex items-center space-x-3 mb-3">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-600 font-medium text-sm">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
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
