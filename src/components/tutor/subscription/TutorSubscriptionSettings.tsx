
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Bell, 
  CreditCard,
  AlertTriangle,
  Shield,
  Zap,
  Mail,
  Smartphone,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TutorSubscriptionSettingsProps {
  subscription: {
    plan: string;
    status: string;
  };
}

export const TutorSubscriptionSettings: React.FC<TutorSubscriptionSettingsProps> = ({ subscription }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    billing: true,
    usage: true,
    renewal: true
  });

  const [billingSettings, setBillingSettings] = useState({
    autoRenewal: true,
    invoiceEmail: true,
    taxInfo: false
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
    toast({
      title: "Paramètre mis à jour",
      description: `Notifications ${type} ${value ? 'activées' : 'désactivées'}.`,
    });
  };

  const handleBillingChange = (type: string, value: boolean) => {
    setBillingSettings(prev => ({ ...prev, [type]: value }));
    toast({
      title: "Paramètre de facturation mis à jour",
      description: `${type} ${value ? 'activé' : 'désactivé'}.`,
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Résiliation d'abonnement",
      description: "Un email de confirmation vous sera envoyé.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
          <CardDescription>
            Gérez vos préférences de notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-gray-500">Recevoir les notifications importantes par email</p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(value) => handleNotificationChange('email', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Notifications SMS</p>
                  <p className="text-sm text-gray-500">Recevoir des SMS pour les alertes urgentes</p>
                </div>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(value) => handleNotificationChange('sms', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Notifications push</p>
                  <p className="text-sm text-gray-500">Recevoir des notifications dans le navigateur</p>
                </div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(value) => handleNotificationChange('push', value)}
              />
            </div>
          </div>

          <hr />

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Types de notifications</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Facturation</p>
                  <p className="text-sm text-gray-500">Rappels de paiement et factures</p>
                </div>
              </div>
              <Switch
                checked={notifications.billing}
                onCheckedChange={(value) => handleNotificationChange('billing', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Utilisation des crédits</p>
                  <p className="text-sm text-gray-500">Alertes sur la consommation</p>
                </div>
              </div>
              <Switch
                checked={notifications.usage}
                onCheckedChange={(value) => handleNotificationChange('usage', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Renouvellement</p>
                  <p className="text-sm text-gray-500">Rappels de renouvellement d'abonnement</p>
                </div>
              </div>
              <Switch
                checked={notifications.renewal}
                onCheckedChange={(value) => handleNotificationChange('renewal', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Paramètres de facturation
          </CardTitle>
          <CardDescription>
            Gérez vos préférences de paiement et facturation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Renouvellement automatique</p>
                <p className="text-sm text-gray-500">Renouveler automatiquement votre abonnement</p>
              </div>
              <Switch
                checked={billingSettings.autoRenewal}
                onCheckedChange={(value) => handleBillingChange('autoRenewal', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Factures par email</p>
                <p className="text-sm text-gray-500">Recevoir les factures par email automatiquement</p>
              </div>
              <Switch
                checked={billingSettings.invoiceEmail}
                onCheckedChange={(value) => handleBillingChange('invoiceEmail', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Informations fiscales</p>
                <p className="text-sm text-gray-500">Inclure les informations fiscales détaillées</p>
              </div>
              <Switch
                checked={billingSettings.taxInfo}
                onCheckedChange={(value) => handleBillingChange('taxInfo', value)}
              />
            </div>
          </div>

          <hr />

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Actions sur l'abonnement</h4>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Modifier le plan
              </Button>
              <Button variant="outline" className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Changer le mode de paiement
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Sécurité du compte
          </CardTitle>
          <CardDescription>
            Paramètres de sécurité liés à votre abonnement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">Compte sécurisé</p>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Votre compte est protégé et vos paiements sont sécurisés.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Changer le mot de passe
            </Button>
            <Button variant="outline" size="sm">
              Authentification à deux facteurs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Zone de danger
          </CardTitle>
          <CardDescription>
            Actions irréversibles sur votre abonnement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">Résilier l'abonnement</h4>
            <p className="text-sm text-red-700 mb-4">
              Cette action annulera votre abonnement à la fin de la période de facturation actuelle. 
              Vous perdrez l'accès aux fonctionnalités premium.
            </p>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleCancelSubscription}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Résilier l'abonnement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
