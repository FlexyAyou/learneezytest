
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  UserPlus, 
  School, 
  Award, 
  Clock,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface TutorDocumentsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TutorDocumentsSidebar = ({ activeTab, onTabChange }: TutorDocumentsSidebarProps) => {
  const mainCategories: SidebarItem[] = [
    {
      id: 'cours',
      label: 'Cours',
      icon: BookOpen,
      description: 'Documents de cours par formation'
    },
    {
      id: 'exercices',
      label: 'Exercices',
      icon: FileText,
      description: 'Exercices et évaluations'
    },
    {
      id: 'administratifs',
      label: 'Documents Administratifs',
      icon: FolderOpen,
      description: 'Vue globale des 4 phases'
    }
  ];

  const phases: SidebarItem[] = [
    {
      id: 'phase-inscription',
      label: 'Phase : Inscription',
      icon: UserPlus,
      description: 'Analyse, test, convention'
    },
    {
      id: 'phase-formation',
      label: 'Phase : Formation',
      icon: School,
      description: 'CGV/RI, programme, convocation, émargement'
    },
    {
      id: 'phase-post-formation',
      label: 'Phase : Post-formation',
      icon: Award,
      description: 'Test final, satisfaction, attestation'
    },
    {
      id: 'phase-suivi',
      label: 'Phase : +3 mois',
      icon: Clock,
      description: 'Satisfaction à froid, financeur'
    }
  ];

  const renderSidebarItem = (item: SidebarItem) => (
    <Button
      key={item.id}
      variant={activeTab === item.id ? "default" : "ghost"}
      className={cn(
        "w-full justify-start text-left h-auto p-3 mb-2",
        activeTab === item.id && "bg-blue-50 text-blue-700 border-blue-200"
      )}
      onClick={() => onTabChange(item.id)}
    >
      <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{item.label}</div>
        <div className="text-xs text-gray-500 mt-1 leading-tight">
          {item.description}
        </div>
      </div>
    </Button>
  );

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
          Catégories Principales
        </h3>
        <div className="space-y-1">
          {mainCategories.map(renderSidebarItem)}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
          Phases de Formation
        </h3>
        <div className="space-y-1">
          {phases.map(renderSidebarItem)}
        </div>
      </div>
    </div>
  );
};
