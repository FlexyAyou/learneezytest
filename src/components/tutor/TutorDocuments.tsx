
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, GraduationCap, Clock } from 'lucide-react';
import { TutorDocumentsSidebar } from './TutorDocumentsSidebar';
import { CoursDocuments } from './documents/CoursDocuments';
import { ExercicesDocuments } from './documents/ExercicesDocuments';
import { DocumentsAdministratifs } from './documents/DocumentsAdministratifs';
import { PhaseInscription } from './documents/PhaseInscription';
import { PhaseFormation } from './documents/PhaseFormation';
import { PhasePostFormation } from './documents/PhasePostFormation';
import { PhaseSuivi } from './documents/PhaseSuivi';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

export const TutorDocuments = () => {
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('cours');

  const formations: Formation[] = [
    { id: '1', name: 'Mathématiques CE2', category: 'Mathématiques', level: 'CE2', status: 'active' },
    { id: '2', name: 'Français CM1', category: 'Français', level: 'CM1', status: 'active' },
    { id: '3', name: 'Histoire-Géo 6ème', category: 'Histoire-Géographie', level: '6ème', status: 'completed' },
    { id: '4', name: 'Sciences CM2', category: 'Sciences', level: 'CM2', status: 'pending' },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <TutorDocumentsSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
              <p className="text-gray-600">Gérez vos documents par formation et par phase</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
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
          <div className="bg-white rounded-lg shadow-sm">
            {activeTab === 'cours' && (
              <CoursDocuments 
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'exercices' && (
              <ExercicesDocuments 
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'administratifs' && (
              <DocumentsAdministratifs 
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'phase-inscription' && (
              <PhaseInscription 
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'phase-formation' && (
              <PhaseFormation 
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'phase-post-formation' && (
              <PhasePostFormation 
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'phase-suivi' && (
              <PhaseSuivi 
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
