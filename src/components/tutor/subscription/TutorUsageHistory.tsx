
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  BookOpen,
  Download,
  Filter,
  TrendingUp,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TutorUsageHistory = () => {
  const { toast } = useToast();
  const [usageData] = useState([
    { 
      date: '2024-01-20', 
      student: 'Marie Dupont', 
      activity: 'Cours de mathématiques', 
      credits: 5, 
      duration: '1h30',
      type: 'session'
    },
    { 
      date: '2024-01-18', 
      student: 'Lucas Martin', 
      activity: 'Session de révisions', 
      credits: 3, 
      duration: '1h00',
      type: 'revision'
    },
    { 
      date: '2024-01-15', 
      student: 'Sophie Bernard', 
      activity: 'Évaluation', 
      credits: 2, 
      duration: '45min',
      type: 'evaluation'
    },
    { 
      date: '2024-01-12', 
      student: 'Antoine Moreau', 
      activity: 'Cours de français', 
      credits: 4, 
      duration: '1h15',
      type: 'session'
    },
    { 
      date: '2024-01-10', 
      student: 'Emma Rousseau', 
      activity: 'Cours de sciences', 
      credits: 5, 
      duration: '1h30',
      type: 'session'
    }
  ]);

  const handleExportUsage = () => {
    toast({
      title: "Export en cours",
      description: "Génération du fichier CSV...",
    });
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: "Historique d'utilisation exporté en CSV.",
      });
    }, 1500);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'revision':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'evaluation':
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'session':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Cours</Badge>;
      case 'revision':
        return <Badge variant="default" className="bg-green-100 text-green-800">Révision</Badge>;
      case 'evaluation':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Évaluation</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Historique d'utilisation</h3>
          <p className="text-sm text-gray-600">Suivez votre consommation de crédits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button onClick={handleExportUsage} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ce mois</p>
                <p className="text-2xl font-bold text-blue-600">158</p>
                <p className="text-xs text-gray-500">crédits utilisés</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Étudiants actifs</p>
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-xs text-gray-500">ce mois</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions totales</p>
                <p className="text-2xl font-bold text-purple-600">45</p>
                <p className="text-xs text-gray-500">ce mois</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Durée moyenne</p>
                <p className="text-2xl font-bold text-orange-600">1h15</p>
                <p className="text-xs text-gray-500">par session</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Activité récente
          </CardTitle>
          <CardDescription>
            Vos dernières sessions et utilisations de crédits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    item.type === 'session' ? 'bg-blue-100' : 
                    item.type === 'revision' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {getActivityIcon(item.type)}
                  </div>
                  <div>
                    <p className="font-medium">{item.activity}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{item.student}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-3">
                  {getActivityBadge(item.type)}
                  <div className="text-right">
                    <span className="font-medium text-red-600">-{item.credits} crédits</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tendances hebdomadaires</CardTitle>
            <CardDescription>Votre activité par jour de la semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => {
                const usage = [20, 35, 28, 42, 38, 15, 8][index];
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium w-20">{day}</span>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${usage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-16 text-right">{usage}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top étudiants</CardTitle>
            <CardDescription>Vos étudiants les plus actifs ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Marie Dupont', sessions: 8, credits: 32 },
                { name: 'Lucas Martin', sessions: 6, credits: 24 },
                { name: 'Sophie Bernard', sessions: 5, credits: 20 },
                { name: 'Antoine Moreau', sessions: 4, credits: 16 },
                { name: 'Emma Rousseau', sessions: 4, credits: 15 }
              ].map((student, index) => (
                <div key={student.name} className="flex items-center justify-between p-2 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.sessions} sessions</p>
                    <p className="text-xs text-gray-500">{student.credits} crédits</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
