
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CreditCard, Settings, AlertCircle, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const StudentSubscription = () => {
  const { toast } = useToast();
  const [subscription] = useState({
    plan: 'Étudiant Premium',
    status: 'active',
    coursesTotal: 50,
    coursesUsed: 12,
    renewalDate: '2024-02-15',
    price: '29€',
    period: 'mensuel'
  });

  const handleModifySubscription = () => {
    toast({
      title: "Modification d'abonnement",
      description: "Redirection vers la page de gestion d'abonnement...",
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Résiliation d'abonnement",
      description: "Un email de confirmation vous sera envoyé.",
      variant: "destructive"
    });
  };

  const coursesUsagePercentage = (subscription.coursesUsed / subscription.coursesTotal) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Abonnements</h1>
        <p className="text-gray-600">Gérez votre abonnement et consultez votre utilisation</p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Abonnement actuel
              </CardTitle>
              <CardDescription>Plan {subscription.plan}</CardDescription>
            </div>
            <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
              {subscription.status === 'active' ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Actif
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactif
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{subscription.price}</div>
              <p className="text-sm text-gray-600">par mois</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{subscription.coursesTotal - subscription.coursesUsed}</div>
              <p className="text-sm text-gray-600">Tokens restants</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{subscription.renewalDate}</div>
              <p className="text-sm text-gray-600">renouvellement</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tokens utilisés</span>
              <span className="text-sm text-gray-600">
                {subscription.coursesUsed}/{subscription.coursesTotal}
              </span>
            </div>
            <Progress value={coursesUsagePercentage} className="h-2" />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleModifySubscription} className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Changer l'abonnement
            </Button>
            <Button onClick={handleCancelSubscription} variant="outline" className="flex-1">
              <AlertCircle className="h-4 w-4 mr-2" />
              Résilier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Historique des cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2024-01-20', course: 'React pour Débutants', status: 'Terminé', progress: 100 },
              { date: '2024-01-18', course: 'JavaScript Avancé', status: 'En cours', progress: 75 },
              { date: '2024-01-15', course: 'CSS Grid & Flexbox', status: 'En cours', progress: 45 },
              { date: '2024-01-12', course: 'Node.js Fondamentaux', status: 'Terminé', progress: 100 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${item.status === 'Terminé' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    <BookOpen className={`h-4 w-4 ${item.status === 'Terminé' ? 'text-green-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium">{item.course}</p>
                    <p className="text-sm text-gray-600">{item.date} • {item.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{item.progress}%</span>
                    <Badge variant={item.status === 'Terminé' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
