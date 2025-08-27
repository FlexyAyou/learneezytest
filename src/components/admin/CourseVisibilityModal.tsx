
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Globe, Lock, Eye, EyeOff, Users, Shield, AlertTriangle, Coins } from 'lucide-react';

interface CourseVisibilityModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseId: string, settings: any) => void;
}

const subscriptionTypes = [
  { id: 'basic', name: 'Basic', description: 'Abonnement de base' },
  { id: 'premium', name: 'Premium', description: 'Abonnement premium' },
  { id: 'enterprise', name: 'Enterprise', description: 'Abonnement entreprise' },
  { id: 'education', name: 'Éducation', description: 'Abonnement éducation' }
];

export const CourseVisibilityModal = ({ course, isOpen, onClose, onSave }: CourseVisibilityModalProps) => {
  const [settings, setSettings] = useState({
    isVisible: true,
    isOpenSource: false,
    tokenPrice: 0,
    minorsAllowed: false,
    organisationAccess: 'all', // 'all', 'restricted', 'none'
    subscriptionRestrictions: [] as string[],
    specificOrganisations: [] as string[]
  });

  useEffect(() => {
    if (course) {
      setSettings({
        isVisible: course.isVisible || false,
        isOpenSource: course.isOpenSource || false,
        tokenPrice: course.tokenPrice || 0,
        minorsAllowed: course.minorsAllowed || false,
        organisationAccess: course.organisationAccess || 'all',
        subscriptionRestrictions: course.subscriptionRestrictions || [],
        specificOrganisations: course.specificOrganisations || []
      });
    }
  }, [course]);

  if (!course) return null;

  const handleSave = () => {
    onSave(course.id, settings);
    onClose();
  };

  const handleSubscriptionChange = (subscriptionId: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      subscriptionRestrictions: checked 
        ? [...prev.subscriptionRestrictions, subscriptionId]
        : prev.subscriptionRestrictions.filter(id => id !== subscriptionId)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Gestion de la visibilité - {course.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Paramètres généraux */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Cours visible</Label>
                  <div className="text-sm text-gray-500">
                    Activer/désactiver la visibilité du cours
                  </div>
                </div>
                <Switch
                  checked={settings.isVisible}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, isVisible: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Open Source</Label>
                  <div className="text-sm text-gray-500">
                    Permettre aux OF d'ajouter ce cours gratuitement à leur catalogue
                  </div>
                </div>
                <Switch
                  checked={settings.isOpenSource}
                  onCheckedChange={(checked) => {
                    setSettings(prev => ({ 
                      ...prev, 
                      isOpenSource: checked,
                      tokenPrice: checked ? 0 : prev.tokenPrice
                    }));
                  }}
                />
              </div>

              {!settings.isOpenSource && (
                <div className="space-y-2">
                  <Label className="text-base flex items-center">
                    <Coins className="h-4 w-4 mr-1" />
                    Prix en tokens
                  </Label>
                  <Input
                    type="number"
                    placeholder="Nombre de tokens requis"
                    value={settings.tokenPrice}
                    onChange={(e) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        tokenPrice: parseInt(e.target.value) || 0 
                      }))
                    }
                    min="0"
                  />
                  <div className="text-sm text-gray-500">
                    Nombre de tokens nécessaires pour accéder au cours
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Autorisé aux moins de 18 ans</Label>
                  <div className="text-sm text-gray-500">
                    Permettre l'accès aux mineurs
                  </div>
                </div>
                <Switch
                  checked={settings.minorsAllowed}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, minorsAllowed: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Accès pour les organisations</Label>
                <Select 
                  value={settings.organisationAccess} 
                  onValueChange={(value) => {
                    setSettings(prev => ({ 
                      ...prev, 
                      organisationAccess: value,
                      subscriptionRestrictions: value === 'restricted' ? prev.subscriptionRestrictions : []
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Toutes les organisations
                      </div>
                    </SelectItem>
                    <SelectItem value="restricted">
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Organisations restreintes
                      </div>
                    </SelectItem>
                    <SelectItem value="none">
                      <div className="flex items-center">
                        <EyeOff className="h-4 w-4 mr-2" />
                        Aucune organisation
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Restrictions d'abonnement - Affiché seulement si "restricted" */}
          {settings.organisationAccess === 'restricted' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Types d'abonnement autorisés</CardTitle>
                <p className="text-sm text-gray-500">
                  Sélectionnez les types d'abonnement qui auront accès au cours
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptionTypes.map((subscription) => (
                    <div key={subscription.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={subscription.id}
                        checked={settings.subscriptionRestrictions.includes(subscription.id)}
                        onCheckedChange={(checked) => 
                          handleSubscriptionChange(subscription.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <Label htmlFor={subscription.id} className="font-medium">
                          {subscription.name}
                        </Label>
                        <p className="text-sm text-gray-500">{subscription.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {settings.subscriptionRestrictions.length === 0 && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                      <span className="text-sm text-amber-800">
                        Aucun type d'abonnement sélectionné - Le cours sera inaccessible
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Message informatif si pas de restrictions */}
          {settings.organisationAccess !== 'restricted' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accès aux abonnements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      {settings.organisationAccess === 'all' 
                        ? 'Accessible à tous les types d\'abonnement'
                        : 'Aucune organisation n\'aura accès au cours'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Aperçu des paramètres */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Aperçu de la configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  {settings.isVisible ? (
                    <Eye className="h-6 w-6 text-green-600 mb-2" />
                  ) : (
                    <EyeOff className="h-6 w-6 text-red-600 mb-2" />
                  )}
                  <span className="text-sm font-medium">
                    {settings.isVisible ? 'Visible' : 'Masqué'}
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Globe className={`h-6 w-6 mb-2 ${settings.isOpenSource ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">
                    {settings.isOpenSource ? 'Open Source' : 'Payant'}
                  </span>
                </div>

                {!settings.isOpenSource && (
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Coins className="h-6 w-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium">
                      {settings.tokenPrice} tokens
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Users className={`h-6 w-6 mb-2 ${settings.minorsAllowed ? 'text-green-600' : 'text-orange-600'}`} />
                  <span className="text-sm font-medium">
                    {settings.minorsAllowed ? 'Tout âge' : '+18 ans'}
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">
                    {settings.organisationAccess === 'restricted' && settings.subscriptionRestrictions.length > 0 
                      ? 'Restreint' 
                      : settings.organisationAccess === 'all' 
                        ? 'Libre' 
                        : 'Aucun accès'
                    }
                  </span>
                </div>
              </div>

              {settings.organisationAccess === 'restricted' && settings.subscriptionRestrictions.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Types d'abonnement autorisés :</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.subscriptionRestrictions.map(subId => {
                      const sub = subscriptionTypes.find(s => s.id === subId);
                      return (
                        <Badge key={subId} variant="outline">
                          {sub?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder les paramètres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
