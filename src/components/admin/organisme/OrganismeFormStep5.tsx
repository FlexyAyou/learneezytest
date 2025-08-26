
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, ArrowLeft, Save, 
  Building, FileText, CreditCard, Settings,
  MapPin, Phone, Mail, Globe, User, 
  Calendar, Coins, Users, Palette, Code, BarChart3
} from 'lucide-react';
import { OrganismeFormData } from '@/types/organisme';
import { subscriptionPlans } from '@/data/mockSubscriptionPlans';

interface OrganismeFormStep5Props {
  formData: OrganismeFormData;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export const OrganismeFormStep5: React.FC<OrganismeFormStep5Props> = ({
  formData,
  onSubmit,
  onPrev,
  isSubmitting
}) => {
  const selectedPlan = subscriptionPlans.find(plan => plan.type === formData.subscriptionType);
  const uploadedDocuments = formData.documents.filter(doc => doc.uploaded);
  const requiredDocuments = formData.documents.filter(doc => doc.required);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Récapitulatif et validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations générales */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Informations générales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Nom de l'organisme:</span>
              <div className="font-medium">{formData.name}</div>
            </div>
            <div>
              <span className="text-gray-600">Représentant légal:</span>
              <div className="font-medium">{formData.legalRepresentative}</div>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Adresse:
              </span>
              <div className="font-medium">{formData.address}</div>
            </div>
            <div>
              <span className="text-gray-600 flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                Téléphone:
              </span>
              <div className="font-medium">{formData.phone}</div>
            </div>
            <div>
              <span className="text-gray-600 flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                Email:
              </span>
              <div className="font-medium">{formData.email}</div>
            </div>
            {formData.website && (
              <div>
                <span className="text-gray-600 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Site web:
                </span>
                <div className="font-medium">{formData.website}</div>
              </div>
            )}
            {formData.description && (
              <div className="md:col-span-2">
                <span className="text-gray-600">Description:</span>
                <div className="font-medium">{formData.description}</div>
              </div>
            )}
            {formData.logo && (
              <div>
                <span className="text-gray-600">Logo:</span>
                <div className="font-medium text-green-600">✓ Téléchargé</div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Informations légales */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Informations légales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">SIRET:</span>
              <div className="font-medium font-mono">{formData.siret}</div>
            </div>
            <div>
              <span className="text-gray-600">Numéro de déclaration:</span>
              <div className="font-medium font-mono">{formData.numeroDeclaration}</div>
            </div>
            <div>
              <span className="text-gray-600">Certification Qualiopi:</span>
              <div className="flex items-center">
                <Badge variant={formData.hasQualiopi ? 'default' : 'outline'}>
                  {formData.hasQualiopi ? 'Oui' : 'Non'}
                </Badge>
                {formData.hasQualiopi && formData.qualiopiNumber && (
                  <span className="ml-2 font-mono text-xs">({formData.qualiopiNumber})</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Documents:</span>
              <div className="font-medium">
                {uploadedDocuments.length}/{requiredDocuments.length} documents requis téléchargés
              </div>
            </div>
          </div>
          
          {uploadedDocuments.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-600 text-sm">Documents téléchargés:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {uploadedDocuments.map((doc) => (
                  <Badge key={doc.id} variant="outline" className="text-xs">
                    {doc.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Configuration d'abonnement */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Abonnement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Plan sélectionné:</span>
              <div className="font-medium">{selectedPlan?.name}</div>
            </div>
            <div>
              <span className="text-gray-600 flex items-center">
                <Coins className="h-3 w-3 mr-1" />
                Tokens alloués:
              </span>
              <div className="font-medium">{formData.tokensTotal.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-gray-600 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Période:
              </span>
              <div className="font-medium">
                {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Renouvellement:</span>
              <div className="font-medium">
                {formData.autoRenewal ? 'Automatique' : 'Manuel'}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Paramètres avancés */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Paramètres avancés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                Limite d'utilisateurs:
              </span>
              <div className="font-medium">{formData.maxUsers}</div>
            </div>
            <div>
              <span className="text-gray-600">Fonctionnalités activées:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.customBranding && (
                  <Badge variant="outline" className="text-xs flex items-center">
                    <Palette className="h-3 w-3 mr-1" />
                    Branding
                  </Badge>
                )}
                {formData.apiAccess && (
                  <Badge variant="outline" className="text-xs flex items-center">
                    <Code className="h-3 w-3 mr-1" />
                    API
                  </Badge>
                )}
                {formData.advancedReporting && (
                  <Badge variant="outline" className="text-xs flex items-center">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Rapports
                  </Badge>
                )}
              </div>
            </div>
            {formData.customDomains.length > 0 && (
              <div className="md:col-span-2">
                <span className="text-gray-600">Domaines personnalisés:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.customDomains.map((domain, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {formData.notes && (
              <div className="md:col-span-2">
                <span className="text-gray-600">Notes administratives:</span>
                <div className="font-medium text-xs bg-gray-50 p-2 rounded mt-1">
                  {formData.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Étape précédente
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Création en cours...' : 'Créer l\'organisme'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
