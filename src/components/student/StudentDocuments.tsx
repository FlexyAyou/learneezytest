
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, FileText, FolderOpen } from 'lucide-react';
import { StudentDocumentsSidebar } from './StudentDocumentsSidebar';
import { StudentCoursDocuments } from './documents/StudentCoursDocuments';
import { StudentExercicesDocuments } from './documents/StudentExercicesDocuments';
import { StudentDocumentsAdministratifs } from './documents/StudentDocumentsAdministratifs';
import { StudentPhaseInscription } from './documents/StudentPhaseInscription';
import { StudentPhaseFormation } from './documents/StudentPhaseFormation';
import { StudentPhasePostFormation } from './documents/StudentPhasePostFormation';
import { StudentPhaseSuivi } from './documents/StudentPhaseSuivi';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

export const StudentDocuments = () => {
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('cours');

  const formations: Formation[] = [
    { id: '1', name: 'Mathématiques Avancées', category: 'Mathématiques', level: 'Niveau 3', status: 'active' },
    { id: '2', name: 'Français Littérature', category: 'Français', level: 'Niveau 2', status: 'active' },
    { id: '3', name: 'Histoire Contemporaine', category: 'Histoire', level: 'Niveau 1', status: 'completed' },
    { id: '4', name: 'Sciences Physiques', category: 'Sciences', level: 'Niveau 2', status: 'pending' },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <StudentDocumentsSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
              <p className="text-gray-600">Accédez à vos documents de formation par phase</p>
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
              <StudentCoursDocuments 
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'exercices' && (
              <StudentExercicesDocuments 
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
            {activeTab === 'administratifs' && (
              <StudentDocumentsAdministratifs 
                selectedFormation={selectedFormation}
                formations={formations}
              />
            )}
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
