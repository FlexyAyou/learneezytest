
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, BookOpen, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/common/LanguageSelector';

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
  const { t } = useLanguage();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center mb-4">
          <img src="/lovable-uploads/52aaa383-7635-46d0-ac37-eb3ee6b878d1.png" alt="Learneezy" className="h-20 w-auto" />
        </Link>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
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
        <div className="mt-4">
          <LanguageSelector />
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 space-y-1">
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
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="flex-1 truncate">{item.title}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded-full flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          {t('nav.logout')}
        </Button>
      </div>
    </div>
  );
};
