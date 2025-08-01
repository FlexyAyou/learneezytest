
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  DollarSign,
  Settings,
  Crown,
  Star,
  Zap,
  Check,
  X,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  maxUsers?: number;
  maxCourses?: number;
  isActive: boolean;
  isPopular?: boolean;
  createdAt: string;
  subscribers: number;
}

interface SubscriptionSettings {
  id: string;
  allowTrialPeriod: boolean;
  trialDurationDays: number;
  allowCancellation: boolean;
  refundPolicy: string;
  autoRenewal: boolean;
  gracePeriodDays: number;
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basique',
    description: 'Pour les particuliers et petites structures',
    price: 9.99,
    currency: 'EUR',
    interval: 'month',
    features: ['Accès à 10 cours', 'Support email', '1 utilisateur'],
    maxUsers: 1,
    maxCourses: 10,
    isActive: true,
    createdAt: '2024-01-01',
    subscribers: 145
  },
  {
    id: '2',
    name: 'Pro',
    description: 'Pour les professionnels et équipes',
    price: 29.99,
    currency: 'EUR',
    interval: 'month',
    features: ['Accès illimité aux cours', 'Support prioritaire', 'Jusqu\'à 5 utilisateurs', 'Statistiques avancées'],
    maxUsers: 5,
    isActive: true,
    isPopular: true,
    createdAt: '2024-01-01',
    subscribers: 89
  },
  {
    id: '3',
    name: 'Entreprise',
    description: 'Pour les grandes organisations',
    price: 99.99,
    currency: 'EUR',
    interval: 'month',
    features: ['Tout du plan Pro', 'Utilisateurs illimités', 'Support dédié', 'API personnalisée', 'Intégrations avancées'],
    isActive: true,
    createdAt: '2024-01-01',
    subscribers: 23
  }
];

const mockSettings: SubscriptionSettings = {
  id: '1',
  allowTrialPeriod: true,
  trialDurationDays: 14,
  allowCancellation: true,
  refundPolicy: 'Remboursement sous 30 jours',
  autoRenewal: true,
  gracePeriodDays: 3
};

const AdminSubscriptions = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [settings, setSettings] = useState<SubscriptionSettings>(mockSettings);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isEditSettingsModalOpen, setIsEditSettingsModalOpen] = useState(false);
  const { toast } = useToast();

  const totalSubscribers = plans.reduce((acc, plan) => acc + plan.subscribers, 0);
  const monthlyRevenue = plans.reduce((acc, plan) => acc + (plan.price * plan.subscribers), 0);

  const handleCreatePlan = () => {
    toast({
      title: "Plan créé",
      description: "Le nouveau plan d'abonnement a été créé avec succès",
    });
    setIsAddPlanModalOpen(false);
  };

  const handleUpdateSettings = () => {
    toast({
      title: "Paramètres mis à jour",
      description: "Les paramètres d'abonnement ont été sauvegardés",
    });
    setIsEditSettingsModalOpen(false);
  };

  const togglePlanStatus = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
    ));
    toast({
      title: "Statut modifié",
      description: "Le statut du plan a été mis à jour",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des abonnements</h1>
          <p className="text-gray-600 mt-2">
            Configurez les plans d'abonnement et les règles de facturation
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isEditSettingsModalOpen} onOpenChange={setIsEditSettingsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Paramètres d'abonnement</DialogTitle>
                <DialogDescription>
                  Configurez les règles globales des abonnements
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Période d'essai</Label>
                    <p className="text-sm text-gray-500">Autoriser une période d'essai gratuite</p>
                  </div>
                  <Switch 
                    checked={settings.allowTrialPeriod} 
                    onCheckedChange={(checked) => 
                      setSettings({...settings, allowTrialPeriod: checked})
                    } 
                  />
                </div>
                {settings.allowTrialPeriod && (
                  <div>
                    <Label htmlFor="trialDays">Durée d'essai (jours)</Label>
                    <Input
                      id="trialDays"
                      type="number"
                      value={settings.trialDurationDays}
                      onChange={(e) => 
                        setSettings({...settings, trialDurationDays: parseInt(e.target.value)})
                      }
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Annulation autorisée</Label>
                    <p className="text-sm text-gray-500">Permettre l'annulation d'abonnement</p>
                  </div>
                  <Switch 
                    checked={settings.allowCancellation} 
                    onCheckedChange={(checked) => 
                      setSettings({...settings, allowCancellation: checked})
                    } 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Renouvellement automatique</Label>
                    <p className="text-sm text-gray-500">Renouveler automatiquement les abonnements</p>
                  </div>
                  <Switch 
                    checked={settings.autoRenewal} 
                    onCheckedChange={(checked) => 
                      setSettings({...settings, autoRenewal: checked})
                    } 
                  />
                </div>
                <div>
                  <Label htmlFor="gracePeriod">Période de grâce (jours)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    value={settings.gracePeriodDays}
                    onChange={(e) => 
                      setSettings({...settings, gracePeriodDays: parseInt(e.target.value)})
                    }
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Délai accordé après expiration avant suspension du service
                  </p>
                </div>
                <div>
                  <Label htmlFor="refundPolicy">Politique de remboursement</Label>
                  <Textarea
                    id="refundPolicy"
                    value={settings.refundPolicy}
                    onChange={(e) => 
                      setSettings({...settings, refundPolicy: e.target.value})
                    }
                    placeholder="Décrivez votre politique de remboursement..."
                  />
                </div>
                <Button onClick={handleUpdateSettings} className="w-full">
                  Sauvegarder les paramètres
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddPlanModalOpen} onOpenChange={setIsAddPlanModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau plan</DialogTitle>
                <DialogDescription>
                  Définissez les caractéristiques du nouveau plan d'abonnement
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="planName">Nom du plan</Label>
                    <Input id="planName" placeholder="Ex: Premium" />
                  </div>
                  <div>
                    <Label htmlFor="planPrice">Prix</Label>
                    <Input id="planPrice" type="number" step="0.01" placeholder="19.99" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="planDescription">Description</Label>
                  <Textarea id="planDescription" placeholder="Description du plan..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxUsers">Nombre max d'utilisateurs</Label>
                    <Input id="maxUsers" type="number" placeholder="Illimité si vide" />
                  </div>
                  <div>
                    <Label htmlFor="maxCourses">Nombre max de cours</Label>
                    <Input id="maxCourses" type="number" placeholder="Illimité si vide" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="interval">Période de facturation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir la période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Mensuel</SelectItem>
                      <SelectItem value="year">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fonctionnalités incluses</Label>
                  <div className="mt-2 space-y-2">
                    <Input placeholder="Fonctionnalité 1" />
                    <Input placeholder="Fonctionnalité 2" />
                    <Input placeholder="Fonctionnalité 3" />
                  </div>
                </div>
                <Button onClick={handleCreatePlan} className="w-full">
                  Créer le plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plans actifs</p>
                <p className="text-2xl font-bold">{plans.filter(p => p.isActive).length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Abonnés totaux</p>
                <p className="text-2xl font-bold">{totalSubscribers}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus mensuels</p>
                <p className="text-2xl font-bold">{monthlyRevenue.toFixed(2)}€</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Croissance</p>
                <p className="text-2xl font-bold text-green-600">+12%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans d'abonnement */}
      <Card>
        <CardHeader>
          <CardTitle>Plans d'abonnement</CardTitle>
          <CardDescription>
            Gérez les différents plans disponibles pour vos utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-purple-500 border-2' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Populaire
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={plan.isActive ? "default" : "secondary"}>
                        {plan.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold">{plan.price}€</span>
                    <span className="text-gray-500">/{plan.interval === 'month' ? 'mois' : 'an'}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Abonnés</span>
                      <span className="font-medium">{plan.subscribers}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">Fonctionnalités:</p>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePlanStatus(plan.id)}
                        className="flex-1"
                      >
                        {plan.isActive ? (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Activer
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" className="p-2">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-2 text-red-500">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Paramètres actuels */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres actuels</CardTitle>
          <CardDescription>
            Configuration globale des abonnements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Période d'essai</span>
                <Badge variant={settings.allowTrialPeriod ? "default" : "secondary"}>
                  {settings.allowTrialPeriod ? `${settings.trialDurationDays} jours` : "Désactivé"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Annulation</span>
                <Badge variant={settings.allowCancellation ? "default" : "secondary"}>
                  {settings.allowCancellation ? "Autorisée" : "Interdite"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Renouvellement auto</span>
                <Badge variant={settings.autoRenewal ? "default" : "secondary"}>
                  {settings.autoRenewal ? "Activé" : "Désactivé"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Période de grâce</span>
                <Badge variant="outline">
                  {settings.gracePeriodDays} jours
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Politique de remboursement</h4>
            <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
              {settings.refundPolicy}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;
