
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentDocumentsSidebar } from './StudentDocumentsSidebar';
import { StudentPhaseInscription } from './documents/StudentPhaseInscription';
import { StudentPhaseFormation } from './documents/StudentPhaseFormation';
import { StudentPhasePostFormation } from './documents/StudentPhasePostFormation';
import { StudentPhaseSuivi } from './documents/StudentPhaseSuivi';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useMyDocuments } from '@/hooks/useMyDocuments';

export const StudentDocuments = () => {
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('phase-inscription');

  const {
    documentsByPhase,
    formations,
    phaseProgress,
    isLoading,
    error,
    learnerId,
  } = useMyDocuments();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const totalPendingDocuments = useMemo(() => {
    return Object.values(phaseProgress).reduce((sum, phase) => sum + phase.pending, 0);
  }, [phaseProgress]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Chargement de vos documents...</span>
      </div>
    );
  }

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
            <div className="flex items-center space-x-4">
              <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                <SelectTrigger className="w-64 bg-background">
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">Toutes les formations</SelectItem>
                  {formations.map((formation) => (
                    <SelectItem key={formation.id} value={formation.id}>
                      {formation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              Impossible de charger vos documents. Veuillez réessayer.
            </div>
          )}

          {/* Main content area */}
          <div className="bg-background rounded-xl shadow-sm border">
            {activeTab === 'phase-inscription' && (
              <StudentPhaseInscription 
                selectedFormation={selectedFormation}
                formations={formations}
                documents={documentsByPhase['phase-inscription'] || []}
                learnerId={learnerId}
              />
            )}
            {activeTab === 'phase-formation' && (
              <StudentPhaseFormation 
                selectedFormation={selectedFormation}
                formations={formations}
                documents={documentsByPhase['phase-formation'] || []}
                learnerId={learnerId}
              />
            )}
            {activeTab === 'phase-post-formation' && (
              <StudentPhasePostFormation 
                selectedFormation={selectedFormation}
                formations={formations}
                documents={documentsByPhase['phase-post-formation'] || []}
                learnerId={learnerId}
              />
            )}
            {activeTab === 'phase-suivi' && (
              <StudentPhaseSuivi 
                selectedFormation={selectedFormation}
                formations={formations}
                documents={documentsByPhase['phase-suivi'] || []}
                learnerId={learnerId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
