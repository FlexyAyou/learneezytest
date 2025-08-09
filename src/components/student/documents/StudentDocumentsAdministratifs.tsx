
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  UserPlus, 
  School, 
  Award, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Formation {
  id: string;
  name: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'pending';
}

interface StudentDocumentsAdministratifsProps {
  selectedFormation: string;
  formations: Formation[];
}

export const StudentDocumentsAdministratifs = ({ selectedFormation, formations }: StudentDocumentsAdministratifsProps) => {
  const phases = [
    {
      id: 'inscription',
      name: 'Phase Inscription',
      icon: UserPlus,
      color: 'pink',
      progress: 100,
      documents: ['Analyse du besoin', 'Test de positionnement', 'Convention de formation'],
      status: 'completed'
    },
    {
      id: 'formation',
      name: 'Phase Formation',
      icon: School,
      color: 'green',
      progress: 75,
      documents: ['CGV/RI', 'Programme de formation', 'Convocation', 'Émargement'],
      status: 'in-progress'
    },
    {
      id: 'post-formation',
      name: 'Phase Post-formation',
      icon: Award,
      color: 'orange',
      progress: 25,
      documents: ['Test final', 'Satisfaction à chaud', 'Attestation', 'Certificat'],
      status: 'in-progress'
    },
    {
      id: 'suivi',
      name: 'Phase +3 mois',
      icon: Clock,
      color: 'purple',
      progress: 0,
      documents: ['Satisfaction à froid', 'Questionnaire financeur'],
      status: 'pending'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { variant: 'default' as const, label: 'Terminée' },
      'in-progress': { variant: 'secondary' as const, label: 'En cours' },
      pending: { variant: 'outline' as const, label: 'À venir' },
    };
    
    return <Badge variant={config[status as keyof typeof config].variant}>
      {config[status as keyof typeof config].label}
    </Badge>;
  };

  const filteredFormations = selectedFormation === 'all' 
    ? formations 
    : formations.filter(f => f.id === selectedFormation);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <FolderOpen className="h-6 w-6 text-purple-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documents Administratifs</h2>
          <p className="text-gray-600">Suivi de votre parcours de formation en 4 phases</p>
        </div>
      </div>

      {filteredFormations.map((formation) => (
        <Card key={formation.id} className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{formation.name} - {formation.level}</span>
              <Badge variant="outline">{formation.category}</Badge>
            </CardTitle>
            <CardDescription>Votre progression dans le parcours administratif</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phases.map((phase) => {
                const Icon = phase.icon;
                return (
                  <Card key={phase.id} className="border-l-4 border-l-pink-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">{phase.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(phase.status)}
                          {getStatusBadge(phase.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Progression</span>
                            <span className="font-medium">{phase.progress}%</span>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Documents concernés:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {phase.documents.map((doc, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredFormations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune formation sélectionnée</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
