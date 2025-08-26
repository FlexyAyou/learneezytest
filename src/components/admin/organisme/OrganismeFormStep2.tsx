
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { OrganismeFormData, OrganismeDocument } from '@/types/organisme';

interface OrganismeFormStep2Props {
  formData: OrganismeFormData;
  updateFormData: (updates: Partial<OrganismeFormData>) => void;
  updateDocument: (documentId: string, updates: Partial<OrganismeDocument>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const OrganismeFormStep2: React.FC<OrganismeFormStep2Props> = ({
  formData,
  updateFormData,
  updateDocument,
  onNext,
  onPrev
}) => {
  const handleInputChange = (field: keyof OrganismeFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateFormData({ [field]: e.target.value });
  };

  const handleQualiopiChange = (checked: boolean) => {
    updateFormData({ hasQualiopi: checked });
    if (!checked) {
      updateFormData({ qualiopiNumber: '' });
    }
  };

  const handleFileUpload = (documentId: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    updateDocument(documentId, { 
      file, 
      uploaded: !!file,
      name: file ? `${file.name}` : ''
    });
  };

  const validateSiret = (siret: string) => {
    // Validation basique du format SIRET (14 chiffres)
    const siretRegex = /^\d{14}$/;
    return siretRegex.test(siret.replace(/\s/g, ''));
  };

  const isStepValid = () => {
    const requiredDocuments = formData.documents.filter(doc => doc.required);
    const uploadedRequiredDocs = requiredDocuments.filter(doc => doc.uploaded);
    
    return (
      formData.siret.trim() !== '' &&
      validateSiret(formData.siret) &&
      formData.numeroDeclaration.trim() !== '' &&
      uploadedRequiredDocs.length === requiredDocuments.length
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Informations légales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SIRET */}
          <div>
            <Label htmlFor="siret">Numéro SIRET *</Label>
            <Input
              id="siret"
              value={formData.siret}
              onChange={handleInputChange('siret')}
              placeholder="12345678901234"
              className="mt-1"
            />
            {formData.siret && !validateSiret(formData.siret) && (
              <p className="text-sm text-red-600 mt-1">
                Le SIRET doit contenir exactement 14 chiffres
              </p>
            )}
          </div>

          {/* Numéro de déclaration */}
          <div>
            <Label htmlFor="numeroDeclaration">Numéro de déclaration d'activité *</Label>
            <Input
              id="numeroDeclaration"
              value={formData.numeroDeclaration}
              onChange={handleInputChange('numeroDeclaration')}
              placeholder="11-75-12345-75"
              className="mt-1"
            />
          </div>

          {/* Certification Qualiopi */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasQualiopi"
                checked={formData.hasQualiopi}
                onCheckedChange={handleQualiopiChange}
              />
              <Label htmlFor="hasQualiopi">Certification Qualiopi</Label>
            </div>
            {formData.hasQualiopi && (
              <div className="mt-3">
                <Label htmlFor="qualiopiNumber">Numéro de certification Qualiopi</Label>
                <Input
                  id="qualiopiNumber"
                  value={formData.qualiopiNumber || ''}
                  onChange={handleInputChange('qualiopiNumber')}
                  placeholder="QUA-2023-12345"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-lg font-medium mb-4">Documents requis</h3>
          <div className="space-y-4">
            {formData.documents.map((document) => (
              <div key={document.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{document.name}</span>
                    {document.required && (
                      <Badge variant="outline" className="text-xs">
                        Requis
                      </Badge>
                    )}
                  </div>
                  {document.uploaded ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Téléchargé</span>
                    </div>
                  ) : document.required ? (
                    <div className="flex items-center text-orange-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Requis</span>
                    </div>
                  ) : null}
                </div>
                
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload(document.id)}
                    className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {document.file && (
                    <div className="text-sm text-green-600 flex items-center">
                      <Upload className="h-4 w-4 mr-1" />
                      {document.file.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Étape précédente
          </Button>
          <Button
            onClick={onNext}
            disabled={!isStepValid()}
          >
            Étape suivante
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
