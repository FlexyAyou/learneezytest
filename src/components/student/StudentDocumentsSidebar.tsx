
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  UserPlus,
  School,
  Award,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface PhaseProgress {
  total: number;
  signed: number;
  pending: number;
}

interface StudentDocumentsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  phaseProgress?: Record<string, PhaseProgress>;
}

export const StudentDocumentsSidebar = ({
  activeTab,
  onTabChange,
  phaseProgress = {}
}: StudentDocumentsSidebarProps) => {
  const phases: SidebarItem[] = [
    {
      id: 'phase-inscription',
      label: 'Phase Inscription',
      icon: UserPlus,
      description: 'Analyse du besoin, test de positionnement, convention'
    },
    {
      id: 'phase-formation',
      label: 'Phase Formation',
      icon: School,
      description: 'Convocation, programme, CGV, règlement intérieur'
    },
    {
      id: 'phase-post-formation',
      label: 'Phase Post-formation',
      icon: Award,
      description: 'Test de sortie, satisfaction à chaud, certificat, émargements'
    },
    {
      id: 'phase-suivi',
      label: 'Phase +3 mois',
      icon: Clock,
      description: 'Questionnaire à froid'
    },
    {
      id: 'phase-assigned',
      label: "Feuilles d'émargement",
      icon: FileText,
      description: 'Feuilles de présence et émargements'
    }
  ];

  const getProgressInfo = (phaseId: string) => {
    const progress = phaseProgress[phaseId];
    if (!progress) return null;

    const allSigned = progress.pending === 0 && progress.signed > 0;
    const hasPending = progress.pending > 0;

    return { ...progress, allSigned, hasPending };
  };

  const renderSidebarItem = (item: SidebarItem) => {
    const progressInfo = getProgressInfo(item.id);
    const isActive = activeTab === item.id;

    return (
      <Button
        key={item.id}
        variant="ghost"
        className={cn(
          "w-full justify-start text-left h-auto p-4 mb-2 rounded-xl transition-all duration-200 border-2",
          isActive
            ? "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 border-pink-300 shadow-sm"
            : "border-transparent hover:bg-gray-50 hover:border-gray-200"
        )}
        onClick={() => onTabChange(item.id)}
      >
        <div className="flex items-start gap-3 w-full">
          <div className={cn(
            "p-2 rounded-lg",
            isActive ? "bg-pink-100" : "bg-gray-100"
          )}>
            <item.icon className={cn(
              "h-5 w-5",
              isActive ? "text-pink-600" : "text-gray-500"
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={cn(
                "font-semibold text-sm",
                isActive ? "text-pink-700" : "text-gray-700"
              )}>
                {item.label}
              </span>
              {progressInfo && (
                <div className="flex items-center gap-1">
                  {progressInfo.allSigned ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : progressInfo.hasPending ? (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0">
                      {progressInfo.pending}
                    </Badge>
                  ) : null}
                </div>
              )}
            </div>
            <p className={cn(
              "text-xs mt-1 leading-tight truncate",
              isActive ? "text-pink-600/80" : "text-gray-500"
            )} title={item.description}>
              {item.description}
            </p>
            {progressInfo && progressInfo.total > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">
                    {progressInfo.signed}/{progressInfo.total} signés
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${(progressInfo.signed / progressInfo.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Button>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-pink-600" />
          <h2 className="text-lg font-bold text-gray-900">Documents</h2>
        </div>
        <p className="text-sm text-gray-500">
          Parcourez vos documents par phase de formation
        </p>
      </div>

      <div className="space-y-1">
        {phases.map(renderSidebarItem)}
      </div>

      {/* Légende */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Légende</p>
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            <span>Tous documents signés</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-[10px] px-1 py-0">1</Badge>
            <span>Documents à signer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
