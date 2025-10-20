import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';

const UserMenu = () => {
  const { user, logout, redirectByRole, getUserRole } = useFastAPIAuth();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    const role = getUserRole();
    if (role) {
      redirectByRole(role);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.email || 'Utilisateur';
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-11 w-11 rounded-full cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all duration-200"
        >
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground font-semibold text-sm">
              {getInitials(getFullName())}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 z-50 bg-background/95 backdrop-blur-sm border shadow-lg" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal py-3 px-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground font-semibold">
                {getInitials(getFullName())}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">{getFullName()}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuItem 
            onClick={handleGoToDashboard}
            className="cursor-pointer py-2.5 px-3 rounded-md hover:bg-primary/10 transition-colors"
          >
            <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
            <span className="font-medium">Voir mon dashboard</span>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer py-2.5 px-3 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-medium">Se déconnecter</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
