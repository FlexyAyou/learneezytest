
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { OrganismeFormData } from '@/types/organisme';
import { Users, Palette, Api, BarChart3 } from 'lucide-react';

interface OrganismeFormStep4Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
}

export const OrganismeFormStep4: React.FC<OrganismeFormStep4Props> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="maxUsers" className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Nombre maximum d'utilisateurs
        </Label>
        <Input
          id="maxUsers"
          type="number"
          value={formData.maxUsers}
          onChange={(e) => updateFormData({ maxUsers: parseInt(e.target.value) || 50 })}
          min="1"
          max="1000"
        />
        <p className="text-sm text-gray-500">
          Définit la limite d'utilisateurs qui peuvent être créés dans cet organisme.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Fonctionnalités avancées</h4>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Palette className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Personnalisation de la marque</p>
              <p className="text-sm text-gray-500">Logo personnalisé et couleurs de marque</p>
            </div>
          </div>
          <Switch
            checked={formData.customBranding}
            onCheckedChange={(checked) => updateFormData({ customBranding: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Api className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium">Accès API</p>
              <p className="text-sm text-gray-500">Intégration avec des systèmes externes</p>
            </div>
          </div>
          <Switch
            checked={formData.apiAccess}
            onCheckedChange={(checked) => updateFormData({ apiAccess: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium">Rapports avancés</p>
              <p className="text-sm text-gray-500">Analytics détaillés et exports de données</p>
            </div>
          </div>
          <Switch
            checked={formData.advancedReporting}
            onCheckedChange={(checked) => updateFormData({ advancedReporting: checked })}
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Configuration flexible</h4>
        <p className="text-sm text-blue-700">
          Ces paramètres peuvent être modifiés ultérieurement selon les besoins de l'organisme.
        </p>
      </div>
    </div>
  );
};
