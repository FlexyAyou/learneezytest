
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrganismeFormData } from '@/types/organisme';
import { Building, User, Globe } from 'lucide-react';

interface OrganismeFormStep1Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
}

export const OrganismeFormStep1: React.FC<OrganismeFormStep1Props> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Nom de l'organisme *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Ex: Centre de Formation Digital"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalRepresentative" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            Représentant légal *
          </Label>
          <Input
            id="legalRepresentative"
            value={formData.legalRepresentative}
            onChange={(e) => updateFormData({ legalRepresentative: e.target.value })}
            placeholder="Ex: Jean Dupont"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug" className="flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          Sous domaine *
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="slug"
            type="text"
            value={formData.website.replace('.learneezy.com', '')}
            onChange={(e) => {
              const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
              updateFormData({ website: slug + '.learneezy.com' });
            }}
            placeholder="mon-organisme"
            className="flex-1"
            required
          />
          <Input
            type="text"
            value=".learneezy.com"
            disabled
            className="w-40 bg-muted cursor-not-allowed"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description de l'organisme *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Décrivez l'activité et la spécialité de votre organisme de formation..."
          rows={4}
          required
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Information</h4>
        <p className="text-sm text-blue-700">
          Ces informations seront visibles sur votre profil public et permettront aux apprenants de mieux connaître votre organisme.
        </p>
      </div>
    </div>
  );
};
