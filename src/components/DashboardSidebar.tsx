
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, BookOpen, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string;
}

interface DashboardSidebarProps {
  title: string;
  subtitle: string;
  items: SidebarItem[];
  userInfo: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const DashboardSidebar = ({ title, subtitle, items, userInfo }: DashboardSidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-pink-600" />
          <span className="text-xl font-bold text-gray-900">InfinitiaX</span>
        </Link>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <span className="text-pink-600 font-medium text-sm">
              {userInfo.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userInfo.name}</p>
            <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                item.isActive
                  ? "bg-pink-50 text-pink-700 border-r-2 border-pink-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className="ml-2 px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
};
