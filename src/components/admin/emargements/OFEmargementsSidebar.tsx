import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, School, Award, Clock, FileText, 
  CheckCircle, AlertCircle, Users
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

interface OFEmargementsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  phaseProgress?: Record<string, PhaseProgress>;
  totalStats?: { totalLearners: number; totalDocuments: number; totalSigned: number; totalPending: number };
}

export const OFEmargementsSidebar = ({ 
  activeTab, 
  onTabChange,
  phaseProgress = {},
  totalStats,
}: OFEmargementsSidebarProps) => {
  const tabs: SidebarItem[] = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Users,
      description: 'Tous les apprenants et leurs documents'
    },
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
      description: 'Convocation, programme, CGV, règlement intérieur, émargement'
    },
    {
      id: 'phase-post-formation',
      label: 'Phase Post-formation',
      icon: Award,
      description: 'Test de sortie, satisfaction à chaud, certificat'
    },
    {
      id: 'phase-suivi',
      label: 'Phase +3 mois',
      icon: Clock,
      description: 'Questionnaire à froid, attestation'
    }
  ];

  const getProgressInfo = (tabId: string) => {
    const progress = phaseProgress[tabId];
    if (!progress) return null;
    const allSigned = progress.pending === 0 && progress.signed > 0;
    const hasPending = progress.pending > 0;
    return { ...progress, allSigned, hasPending };
  };

  const renderSidebarItem = (item: SidebarItem) => {
    const progressInfo = item.id !== 'overview' ? getProgressInfo(item.id) : null;
    const isActive = activeTab === item.id;

    return (
      <Button
        key={item.id}
        variant="ghost"
        className={cn(
          "w-full justify-start text-left h-auto p-4 mb-2 rounded-xl transition-all duration-200 border-2",
          isActive 
            ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/30 shadow-sm" 
            : "border-transparent hover:bg-muted hover:border-border"
        )}
        onClick={() => onTabChange(item.id)}
      >
        <div className="flex items-start gap-3 w-full">
          <div className={cn(
            "p-2 rounded-lg",
            isActive ? "bg-primary/15" : "bg-muted"
          )}>
            <item.icon className={cn(
              "h-5 w-5",
              isActive ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={cn(
                "font-semibold text-sm",
                isActive ? "text-primary" : "text-foreground"
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
              isActive ? "text-primary/70" : "text-muted-foreground"
            )} title={item.description}>
              {item.description}
            </p>
            {progressInfo && progressInfo.total > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {progressInfo.signed}/{progressInfo.total} signés
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-300"
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
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Émargements</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Suivi des signatures par phase de formation
        </p>
      </div>

      {/* Global stats */}
      {totalStats && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground">{totalStats.totalLearners}</div>
            <div className="text-xs text-muted-foreground">Apprenants</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground">{totalStats.totalDocuments}</div>
            <div className="text-xs text-muted-foreground">Documents</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
            <div className="text-lg font-bold text-green-600">{totalStats.totalSigned}</div>
            <div className="text-xs text-green-700">Signés</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
            <div className="text-lg font-bold text-amber-600">{totalStats.totalPending}</div>
            <div className="text-xs text-amber-700">En attente</div>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {tabs.map(renderSidebarItem)}
      </div>

      {/* Legend */}
      <div className="pt-4 border-t">
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Légende</p>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            <span>Tous documents signés</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-[10px] px-1 py-0">1</Badge>
            <span>Documents en attente</span>
          </div>
        </div>
      </div>
    </div>
  );
};
