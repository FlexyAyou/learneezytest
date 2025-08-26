
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Settings, ArrowLeft, ArrowRight, Plus, X, Users, Palette, Code, BarChart3 } from 'lucide-react';
import { OrganismeFormData } from '@/types/organisme';

interface OrganismeFormStep4Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const OrganismeFormStep4: React.FC<OrganismeFormStep4Props> = ({
  formData,
  updateFormData,
  onNext,
  onPrev
}) => {
  const [newDomain, setNewDomain] = useState('');

  const handleInputChange = (field: keyof OrganismeFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === 'maxUsers' ? parseInt(e.target.value) || 0 : e.target.value;
    updateFormData({ [field]: value });
  };

  const handleCheckboxChange = (field: keyof OrganismeFormData) => (checked: boolean) => {
    updateFormData({ [field]: checked });
  };

  const addCustomDomain = () => {
    if (newDomain.trim() && !formData.customDomains.includes(newDomain.trim())) {
      updateFormData({
        customDomains: [...formData.customDomains, newDomain.trim()]
      });
      setNewDomain('');
    }
  };

  const removeCustomDomain = (domain: string) => {
    updateFormData({
      customDomains: formData.customDomains.filter(d => d !== domain)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomDomain();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Paramètres avancés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Limitations et quotas */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Limitations et quotas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="maxUsers">Nombre maximum d'utilisateurs</Label>
              <Input
                id="maxUsers"
                type="number"
                value={formData.maxUsers}
                onChange={handleInputChange('maxUsers')}
                min="1"
                max="1000"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Limite le nombre total d'utilisateurs pouvant être créés
              </p>
            </div>
          </div>
        </div>

        {/* Fonctionnalités avancées */}
        <div>
          <h3 className="text-lg font-medium mb-4">Fonctionnalités avancées</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <Checkbox
                id="customBranding"
                checked={formData.customBranding}
                onCheckedChange={handleCheckboxChange('customBranding')}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor="customBranding" className="flex items-center cursor-pointer">
                  <Palette className="h-4 w-4 mr-2" />
                  Branding personnalisé
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Permet à l'organisme de personnaliser l'apparence de la plateforme
                </p>
              </div>
              <Badge variant={formData.customBranding ? 'default' : 'outline'}>
                {formData.customBranding ? 'Activé' : 'Désactivé'}
              </Badge>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <Checkbox
                id="apiAccess"
                checked={formData.apiAccess}
                onCheckedChange={handleCheckboxChange('apiAccess')}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor="apiAccess" className="flex items-center cursor-pointer">
                  <Code className="h-4 w-4 mr-2" />
                  Accès API
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Donne accès aux API pour intégrer avec des systèmes externes
                </p>
              </div>
              <Badge variant={formData.apiAccess ? 'default' : 'outline'}>
                {formData.apiAccess ? 'Activé' : 'Désactivé'}
              </Badge>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <Checkbox
                id="advancedReporting"
                checked={formData.advancedReporting}
                onCheckedChange={handleCheckboxChange('advancedReporting')}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor="advancedReporting" className="flex items-center cursor-pointer">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Rapports avancés
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Accès aux statistiques détaillées et exports de données
                </p>
              </div>
              <Badge variant={formData.advancedReporting ? 'default' : 'outline'}>
                {formData.advancedReporting ? 'Activé' : 'Désactivé'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Domaines personnalisés */}
        <div>
          <h3 className="text-lg font-medium mb-4">Domaines personnalisés</h3>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="formation.monorganisme.fr"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addCustomDomain}
                disabled={!newDomain.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.customDomains.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Domaines configurés :</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.customDomains.map((domain, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{domain}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomDomain(domain)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-500">
              Les domaines personnalisés permettent d'accéder à la plateforme via l'URL de l'organisme
            </p>
          </div>
        </div>

        {/* Notes administratives */}
        <div>
          <Label htmlFor="notes">Notes administratives</Label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={handleInputChange('notes')}
            placeholder="Notes internes pour l'équipe administrative..."
            className="mt-1"
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-1">
            Ces notes ne seront visibles que par l'équipe administrative
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Étape précédente
          </Button>
          <Button onClick={onNext}>
            Récapitulatif
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
