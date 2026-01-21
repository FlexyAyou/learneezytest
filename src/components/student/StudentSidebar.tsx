import { useMemo } from 'react';
import { Link, useLocation } from "react-router-dom";
import { BookOpen, User, Award, MessageSquare, Settings, Home, Video, Download, FileText, PenTool, TrendingUp, CreditCard, ShoppingBag, LogOut, Building2 } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";

import { useFastAPIAuth } from "@/hooks/useFastAPIAuth";
import { useStudentContext } from "@/hooks/useStudentContext";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  disabled?: boolean;
}

// Routes à griser (fonctionnalités non disponibles pour le moment)
const DISABLED_ROUTES = [
  '/dashboard/apprenant/progress',
  '/dashboard/apprenant/certificates',
  '/dashboard/apprenant/boutique',
  '/dashboard/apprenant/evaluations',
  '/dashboard/apprenant/subscription',
];

export function StudentSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useFastAPIAuth();
  const { isOFStudent, ofName, hasAccess } = useStudentContext();
  
  // Utiliser l'image du backend en priorité, fallback sur localStorage pour compatibilité
  const avatar = user?.image || localStorage.getItem('student-avatar') || '';
  
  // Informations utilisateur dynamiques
  const userInfo = {
    name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "Apprenant",
    email: user?.email || "",
    initials: user 
      ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
      : "A"
  };

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  // Items de navigation filtrés selon le type d'apprenant
  const navigationItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { title: "Tableau de bord", href: "/dashboard/apprenant", icon: Home },
    ];

    // Catalogue uniquement pour apprenants Learneezy
    if (hasAccess('catalogue')) {
      items.push({ title: "Catalogue", href: "/dashboard/apprenant/catalogue", icon: BookOpen });
    }

    items.push(
      { title: "Mes cours", href: "/dashboard/apprenant/courses", icon: BookOpen },
      { title: "Mon parcours", href: "/dashboard/apprenant/progress", icon: Award, disabled: DISABLED_ROUTES.includes('/dashboard/apprenant/progress') },
      { title: "Certificats", href: "/dashboard/apprenant/certificates", icon: Award, disabled: DISABLED_ROUTES.includes('/dashboard/apprenant/certificates') }
    );

    return items;
  }, [hasAccess]);

  // Items formation (identiques pour tous)
  const formationItems: NavItem[] = [
    { title: "Mes inscriptions", href: "/dashboard/apprenant/inscriptions", icon: FileText },
    { title: "Émargement", href: "/dashboard/apprenant/emargements", icon: PenTool },
    { title: "Évaluations", href: "/dashboard/apprenant/evaluations", icon: TrendingUp, disabled: DISABLED_ROUTES.includes('/dashboard/apprenant/evaluations') },
  ];

  // Items outils filtrés selon le type d'apprenant
  const toolsItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [];

    // Boutique uniquement pour apprenants Learneezy
    if (hasAccess('boutique')) {
      items.push({ title: "Boutique", href: "/dashboard/apprenant/boutique", icon: ShoppingBag, disabled: DISABLED_ROUTES.includes('/dashboard/apprenant/boutique') });
    }

    items.push({ title: "Mes documents", href: "/dashboard/apprenant/documents", icon: Download });

    // Abonnements uniquement pour apprenants Learneezy
    if (hasAccess('subscription')) {
      items.push({ title: "Abonnements", href: "/dashboard/apprenant/subscription", icon: CreditCard, disabled: DISABLED_ROUTES.includes('/dashboard/apprenant/subscription') });
    }

    items.push(
      { title: "Messages", href: "/dashboard/apprenant/messages", icon: MessageSquare, badge: "3" },
      { title: "Visioconférence", href: "/dashboard/apprenant/video", icon: Video },
      { title: "Paramètres", href: "/dashboard/apprenant/settings", icon: Settings }
    );

    return items;
  }, [hasAccess]);

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
            {isOFStudent && ofName ? (
              <div className="flex items-center justify-center gap-1 mt-1">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {ofName}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Votre parcours d'apprentissage</p>
            )}
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
                  <SidebarMenuButton 
                    asChild={!item.disabled} 
                    isActive={isActive(item.href)}
                    disabled={item.disabled}
                    className={item.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
                  >
                    {item.disabled ? (
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <span className="ml-auto text-[10px] text-muted-foreground">Bientôt</span>
                      </div>
                    ) : (
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
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
                  <SidebarMenuButton 
                    asChild={!item.disabled} 
                    isActive={isActive(item.href)}
                    disabled={item.disabled}
                    className={item.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
                  >
                    {item.disabled ? (
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <span className="ml-auto text-[10px] text-muted-foreground">Bientôt</span>
                      </div>
                    ) : (
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
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
                  <SidebarMenuButton 
                    asChild={!item.disabled} 
                    isActive={isActive(item.href)}
                    disabled={item.disabled}
                    className={item.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
                  >
                    {item.disabled ? (
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <span className="ml-auto text-[10px] text-muted-foreground">Bientôt</span>
                      </div>
                    ) : (
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
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
