
import React, { useState } from 'react';
import { Play, CheckCircle, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  completed: boolean;
  score?: number;
}

interface PositioningTestProps {
  userRole: 'student' | 'instructor' | 'admin';
}

export const PositioningTest = ({ userRole }: PositioningTestProps) => {
  const [tests] = useState<Test[]>([
    {
      id: '1',
      title: 'Test de positionnement JavaScript',
      description: 'Évaluez votre niveau en JavaScript',
      duration: 30,
      difficulty: 'Intermédiaire',
      completed: true,
      score: 85
    },
    {
      id: '2',
      title: 'Test de positionnement React',
      description: 'Évaluez votre niveau en React',
      duration: 45,
      difficulty: 'Avancé',
      completed: false
    }
  ]);

  const handleStartTest = (testId: string) => {
    console.log(`Démarrage du test: ${testId}`);
  };

  const handleCreateTest = () => {
    console.log('Création d\'un nouveau test');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tests de positionnement</CardTitle>
            <CardDescription>
              {userRole === 'student' 
                ? 'Évaluez votre niveau dans différents domaines'
                : 'Créez et gérez les tests de positionnement'
              }
            </CardDescription>
          </div>
          {(userRole === 'instructor' || userRole === 'admin') && (
            <Button onClick={handleCreateTest}>
              Créer un test
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">{test.title}</h3>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={test.difficulty === 'Débutant' ? 'secondary' : 
                                 test.difficulty === 'Intermédiaire' ? 'default' : 'destructive'}>
                    {test.difficulty}
                  </Badge>
                  {test.completed && (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {test.score}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {test.duration} minutes
                </div>
                
                {userRole === 'student' && (
                  <Button
                    variant={test.completed ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleStartTest(test.id)}
                    disabled={test.completed}
                  >
                    {test.completed ? (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Terminé
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Commencer
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
