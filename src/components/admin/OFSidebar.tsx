import { Home, Users, BookOpen, FileText, Key, BarChart3, Video, Mail, CreditCard, Puzzle, FileArchive, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Tableau de bord", href: "/dashboard/organisme-formation/tableau-de-bord", icon: Home },
  { title: "Utilisateurs", href: "/dashboard/organisme-formation/utilisateurs", icon: Users },
  { title: "Formations", href: "/dashboard/organisme-formation/formations", icon: BookOpen },
  { title: "Documents", href: "/dashboard/organisme-formation/documents", icon: FileText },
];

const managementItems = [
  { title: "Licences", href: "/dashboard/organisme-formation/licences", icon: Key },
  { title: "Suivi pédagogique", href: "/dashboard/organisme-formation/suivi-pedagogique", icon: BarChart3 },
  { title: "Visioconférence", href: "/dashboard/organisme-formation/visio", icon: Video },
  { title: "Envois", href: "/dashboard/organisme-formation/envois", icon: Mail },
  { title: "Abonnement", href: "/dashboard/organisme-formation/abonnement", icon: CreditCard },
];

const systemItems = [
  { title: "Intégrations", href: "/dashboard/organisme-formation/integrations", icon: Puzzle },
  { title: "Logs", href: "/dashboard/organisme-formation/logs", icon: FileArchive },
  { title: "Paramètres", href: "/dashboard/organisme-formation/parametres", icon: Settings },
];

export function OFSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const getNavCls = (path: string) =>
    isActive(path) ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar className={open ? "w-60" : "w-14"} collapsible="icon">
      <SidebarHeader className="border-b p-4">
        {open ? (
          <div>
            <h2 className="font-semibold text-lg">Organisme de Formation</h2>
            <p className="text-sm text-muted-foreground">Gestion de formation</p>
          </div>
        ) : (
          <div className="text-center font-bold text-xl">OF</div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.href} className={getNavCls(item.href)}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
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
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.href} className={getNavCls(item.href)}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Système</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.href} className={getNavCls(item.href)}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
