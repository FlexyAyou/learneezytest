
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentDocumentsSidebar } from './StudentDocumentsSidebar';
import { StudentPhaseInscription } from './documents/StudentPhaseInscription';
import { StudentPhaseFormation } from './documents/StudentPhaseFormation';
import { StudentPhasePostFormation } from './documents/StudentPhasePostFormation';
import { StudentPhaseSuivi } from './documents/StudentPhaseSuivi';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle } from 'lucide-react';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

// Mock data for document counts per phase
const mockPhaseProgress = {
  'phase-inscription': { total: 3, signed: 2, pending: 1 },
  'phase-formation': { total: 5, signed: 3, pending: 2 },
  'phase-post-formation': { total: 4, signed: 3, pending: 1 },
  'phase-suivi': { total: 1, signed: 0, pending: 1 },
};

export const StudentDocuments = () => {
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('phase-inscription');

  const formations: Formation[] = [
    { id: '1', name: 'Mathématiques Avancées', category: 'Mathématiques', level: 'Niveau 3', status: 'active' },
    { id: '2', name: 'Français Littérature', category: 'Français', level: 'Niveau 2', status: 'active' },
    { id: '3', name: 'Histoire Contemporaine', category: 'Histoire', level: 'Niveau 1', status: 'completed' },
    { id: '4', name: 'Sciences Physiques', category: 'Sciences', level: 'Niveau 2', status: 'pending' },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const totalPendingDocuments = useMemo(() => {
    return Object.values(mockPhaseProgress).reduce((sum, phase) => sum + phase.pending, 0);
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="w-72 bg-background border-r shrink-0">
        <StudentDocumentsSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          phaseProgress={mockPhaseProgress}
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
