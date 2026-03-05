import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentDocumentsSidebar } from './StudentDocumentsSidebar';
import { StudentPhaseInscription } from './documents/StudentPhaseInscription';
import { StudentPhaseFormation } from './documents/StudentPhaseFormation';
import { StudentPhasePostFormation } from './documents/StudentPhasePostFormation';
import { StudentPhaseSuivi } from './documents/StudentPhaseSuivi';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { useMyDocuments } from '@/hooks/useApi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

export const StudentDocuments = () => {
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('phase-inscription');
  const { data: assignments = [] } = useMyDocuments();
  const { user } = useFastAPIAuth();



  const formations: Formation[] = [
    { id: '1', name: 'Mathématiques Avancées', category: 'Mathématiques', level: 'Niveau 3', status: 'active' },
    { id: '2', name: 'Français Littérature', category: 'Français', level: 'Niveau 2', status: 'active' },
    { id: '3', name: 'Histoire Contemporaine', category: 'Histoire', level: 'Niveau 1', status: 'completed' },
    { id: '4', name: 'Sciences Physiques', category: 'Sciences', level: 'Niveau 2', status: 'pending' },
  ];

  // Dynamic progress calculation
  const phaseProgress = useMemo(() => {
    const baseProgress: Record<string, { total: number; signed: number; pending: number }> = {
      'phase-inscription': { total: 0, signed: 0, pending: 0 },
      'phase-formation': { total: 0, signed: 0, pending: 0 },
      'phase-post-formation': { total: 0, signed: 0, pending: 0 },
      'phase-suivi': { total: 0, signed: 0, pending: 0 },
      'phase-assigned': { total: 0, signed: 0, pending: 0 }
    };

    assignments.forEach((a: any) => {
      const phaseKey = `phase-${a.phase}`;
      if (baseProgress[phaseKey]) {
        baseProgress[phaseKey].total++;
        if (a.is_viewed) {
          baseProgress[phaseKey].signed++;
        } else {
          baseProgress[phaseKey].pending++;
        }
      }
      // Also count in assigned tab
      baseProgress['phase-assigned'].total++;
      if (a.is_viewed) baseProgress['phase-assigned'].signed++;
      else baseProgress['phase-assigned'].pending++;
    });

    return baseProgress;
  }, [assignments]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const totalPendingDocuments = useMemo(() => {
    return Object.values(phaseProgress).reduce((sum, phase) => sum + phase.pending, 0);
  }, [phaseProgress]);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="w-72 bg-background border-r shrink-0">
        <StudentDocumentsSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          phaseProgress={phaseProgress}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">Mes Documents</h1>
                {totalPendingDocuments > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {totalPendingDocuments} à signer
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                Parcourez et signez vos documents de formation
              </p>
            </div>
            <div className="flex items-center space-x-3">

              <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                <SelectTrigger className="w-64 bg-background">
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">Toutes les formations</SelectItem>
                  {formations.map((formation) => (
                    <SelectItem key={formation.id} value={formation.id}>
                      {formation.name} - {formation.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main content area */}
          <div className="bg-background rounded-xl shadow-sm border">
            {activeTab === 'phase-inscription' && (
              <StudentPhaseInscription
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'phase-formation' && (
              <StudentPhaseFormation
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'phase-post-formation' && (
              <StudentPhasePostFormation
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'phase-suivi' && (
              <StudentPhaseSuivi
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
