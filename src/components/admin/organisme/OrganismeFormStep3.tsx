
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrganismeFormData } from '@/types/organisme';
import { FileText, Award, Hash, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateSiret } from '@/utils/fiscalValidation';

interface OrganismeFormStep3Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
}

export const OrganismeFormStep3: React.FC<OrganismeFormStep3Props> = ({
  formData,
  updateFormData
}) => {
  const [siretError, setSiretError] = useState<string>('');
  const [siretValid, setSiretValid] = useState<boolean>(false);

  useEffect(() => {
    if (formData.siret) {
      const isValid = validateSiret(formData.siret);
      setSiretValid(isValid);
      if (!isValid && formData.siret.length > 0) {
        setSiretError('Le SIRET doit contenir exactement 14 chiffres');
      } else {
        setSiretError('');
      }
    } else {
      setSiretValid(false);
      setSiretError('');
    }
  }, [formData.siret]);

  const handleSiretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Ne garder que les chiffres
    updateFormData({ siret: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="siret" className="flex items-center">
            <Hash className="w-4 h-4 mr-2" />
            Numéro SIRET *
          </Label>
          <div className="relative">
            <Input
              id="siret"
              value={formData.siret}
              onChange={handleSiretChange}
              placeholder="12345678901234"
              maxLength={14}
              required
              className={`pr-10 ${siretError ? 'border-red-500' : siretValid ? 'border-green-500' : ''}`}
            />
            {formData.siret && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {siretValid ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {siretError && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {siretError}
            </p>
          )}
          {siretValid && (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              SIRET valide
            </p>
          )}
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
        <Label htmlFor="agrement" className="flex items-center">
          <Award className="w-4 h-4 mr-2" />
          Agrément / Certification qualité
        </Label>
        <Select 
          value={formData.agrement} 
          onValueChange={(value) => updateFormData({ agrement: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un agrément" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun agrément</SelectItem>
            <SelectItem value="Qualiopi">Qualiopi</SelectItem>
            <SelectItem value="OPCO">OPCO</SelectItem>
            <SelectItem value="Datadock">Datadock</SelectItem>
            <SelectItem value="ISQ">ISQ</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
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
