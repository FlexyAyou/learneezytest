
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { OrganismeFormData } from '@/types/organisme';
import { FileText, Award, Hash } from 'lucide-react';

interface OrganismeFormStep3Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
}

export const OrganismeFormStep3: React.FC<OrganismeFormStep3Props> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="siret" className="flex items-center">
            <Hash className="w-4 h-4 mr-2" />
            Numéro SIRET *
          </Label>
          <Input
            id="siret"
            value={formData.siret}
            onChange={(e) => updateFormData({ siret: e.target.value })}
            placeholder="12345678901234"
            maxLength={14}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numeroDeclaration" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Numéro de déclaration d'activité *
          </Label>
          <Input
            id="numeroDeclaration"
            value={formData.numeroDeclaration}
            onChange={(e) => updateFormData({ numeroDeclaration: e.target.value })}
            placeholder="11-75-12345-75"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          <Award className="w-4 h-4 mr-2" />
          Agrément / Certification qualité
        </Label>
        <div className="space-y-3 border rounded-lg p-4">
          {['Qualiopi', 'OPCO', 'Datadock', 'ISQ', 'Autre'].map((agrement) => (
            <div key={agrement} className="flex items-center space-x-2">
              <Checkbox
                id={agrement}
                checked={formData.agrement?.includes(agrement) || false}
                onCheckedChange={(checked) => {
                  const currentAgrements = formData.agrement || [];
                  if (checked) {
                    updateFormData({ agrement: [...currentAgrements, agrement] });
                  } else {
                    updateFormData({ 
                      agrement: currentAgrements.filter(a => a !== agrement) 
                    });
                  }
                }}
              />
              <Label
                htmlFor={agrement}
                className="text-sm font-normal cursor-pointer"
              >
                {agrement}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Documents requis</h4>
        <p className="text-sm text-green-700 mb-2">
          Après la création, vous devrez fournir les documents suivants :
        </p>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Extrait K-bis de moins de 3 mois</li>
          <li>• Déclaration d'activité de formation</li>
          <li>• Attestation d'assurance responsabilité civile</li>
          <li>• Certificat de qualification (si applicable)</li>
        </ul>
      </div>
    </div>
  );
};
