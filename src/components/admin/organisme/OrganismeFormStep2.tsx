
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrganismeFormData } from '@/types/organisme';
import { MapPin, Phone, Mail } from 'lucide-react';

interface OrganismeFormStep2Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
}

export const OrganismeFormStep2: React.FC<OrganismeFormStep2Props> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Adresse complète *
        </Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => updateFormData({ address: e.target.value })}
          placeholder="123 Rue de la Formation, 75001 Paris"
          rows={1}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Téléphone *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="01 23 45 67 89"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Email de contact *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="contact@organisme.fr"
            required
          />
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Important</h4>
        <p className="text-sm text-yellow-700">
          Ces informations de contact seront utilisées pour toute communication officielle et doivent être exactes.
        </p>
      </div>
    </div>
  );
};
