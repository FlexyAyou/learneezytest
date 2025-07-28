
import React, { useState } from 'react';
import { Palette, Settings, Building, Eye, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSelector from '@/components/theme/ThemeSelector';
import OrganismeThemeCustomizer from '@/components/theme/OrganismeThemeCustomizer';
import AccessibilityIndicators from '@/components/theme/AccessibilityIndicators';

const AdminThemeSettings: React.FC = () => {
  const [selectedOrganisme, setSelectedOrganisme] = useState<string>('');

  // Données d'exemple pour les organismes
  const organismes = [
    { id: '1', nom: 'Institut Formation Pro' },
    { id: '2', nom: 'Centre Apprentissage Digital' },
    { id: '3', nom: 'Académie des Compétences' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Thèmes
          </h1>
          <p className="text-gray-600">
            Personnalisation et accessibilité de la plateforme
          </p>
        </div>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Thème Global
          </TabsTrigger>
          <TabsTrigger value="organismes" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Thèmes Organismes
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Accessibilité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Configuration du thème global
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ThemeSelector />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organismes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Personnalisation par organisme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {organismes.map((organisme) => (
                    <Card
                      key={organisme.id}
                      className={`cursor-pointer transition-all ${
                        selectedOrganisme === organisme.id 
                          ? 'ring-2 ring-primary' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedOrganisme(organisme.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{organisme.nom}</h3>
                            <p className="text-sm text-muted-foreground">
                              ID: {organisme.id}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedOrganisme && (
                  <div className="mt-6">
                    <OrganismeThemeCustomizer
                      organismeId={selectedOrganisme}
                      organismeNom={organismes.find(o => o.id === selectedOrganisme)?.nom || ''}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccessibilityIndicators />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Statistiques d'utilisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mode sombre</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Police grande</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contraste élevé</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mouvement réduit</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminThemeSettings;
