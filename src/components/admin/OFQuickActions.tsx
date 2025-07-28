
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, FileText, Mail, Calendar, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OFQuickActions = () => {
  const navigate = useNavigate();

  const quickStats = [
    { 
      label: 'Inscriptions en attente', 
      value: 12, 
      color: 'bg-orange-500', 
      action: () => navigate('/dashboard/organisme-formation/apprenants'),
      icon: Users
    },
    { 
      label: 'Documents à générer', 
      value: 5, 
      color: 'bg-blue-500', 
      action: () => navigate('/dashboard/organisme-formation/documents'),
      icon: FileText
    },
    { 
      label: 'Convocations à envoyer', 
      value: 8, 
      color: 'bg-green-500', 
      action: () => navigate('/dashboard/organisme-formation/envois'),
      icon: Mail
    },
    { 
      label: 'Sessions aujourd\'hui', 
      value: 3, 
      color: 'bg-purple-500', 
      action: () => navigate('/dashboard/organisme-formation/suivi'),
      icon: Calendar
    },
  ];

  const quickActions = [
    {
      title: 'Nouvel apprenant',
      description: 'Inscrire un nouvel apprenant',
      icon: UserPlus,
      color: 'bg-blue-500',
      action: () => navigate('/dashboard/organisme-formation/apprenants')
    },
    {
      title: 'Nouvelle formation',
      description: 'Créer une nouvelle formation',
      icon: BookOpen,
      color: 'bg-green-500',
      action: () => navigate('/dashboard/organisme-formation/formations')
    },
    {
      title: 'Générer documents',
      description: 'Créer attestations et certificats',
      icon: FileText,
      color: 'bg-purple-500',
      action: () => navigate('/dashboard/organisme-formation/documents')
    },
    {
      title: 'Envoi groupé',
      description: 'Envoyer des emails aux apprenants',
      icon: Mail,
      color: 'bg-orange-500',
      action: () => navigate('/dashboard/organisme-formation/envois')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={stat.action}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3"
                onClick={action.action}
              >
                <div className={`p-3 rounded-full ${action.color}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
