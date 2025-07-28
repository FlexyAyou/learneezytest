
import React, { useState } from 'react';
import { Building, Palette, Upload, Save, Eye } from 'lucide-react';
import { useTheme, OrganismeTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface OrganismeThemeCustomizerProps {
  organismeId: string;
  organismeNom: string;
}

const OrganismeThemeCustomizer: React.FC<OrganismeThemeCustomizerProps> = ({
  organismeId,
  organismeNom,
}) => {
  const { applyOrganismeTheme } = useTheme();
  const { toast } = useToast();

  const [themeData, setThemeData] = useState<OrganismeTheme>({
    id: `organisme-${organismeId}`,
    name: `Thème ${organismeNom}`,
    organismeId,
    colors: {
      primary: '330 81% 60%',
      secondary: '210 40% 96.1%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      accent: '210 40% 96.1%',
      muted: '210 40% 96.1%',
      border: '214.3 31.8% 91.4%',
    },
    darkMode: false,
    accessibility: {
      fontSize: 'medium',
      contrast: 'normal',
      reducedMotion: false,
    },
    logo: '',
    customCss: '',
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (colorKey: string, value: string) => {
    setThemeData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThemeData(prev => ({
          ...prev,
          logo: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      applyOrganismeTheme(themeData);
      toast({
        title: "Mode aperçu activé",
        description: "Le thème est appliqué temporairement pour prévisualisation",
      });
    }
  };

  const handleSave = () => {
    applyOrganismeTheme(themeData);
    // Ici, vous pourriez sauvegarder le thème dans une base de données
    toast({
      title: "Thème sauvegardé",
      description: "Le thème personnalisé a été appliqué avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Personnalisation pour {organismeNom}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Logo de l'organisme
            </Label>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="flex-1"
              />
              {themeData.logo && (
                <div className="w-16 h-16 border rounded-lg overflow-hidden">
                  <img 
                    src={themeData.logo} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Couleurs personnalisées */}
          <div className="space-y-4">
            <Label className="flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Couleurs personnalisées
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(themeData.colors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm capitalize">{key}</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      placeholder="000 0% 0%"
                      className="flex-1"
                    />
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: `hsl(${value})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CSS personnalisé */}
          <div className="space-y-2">
            <Label>CSS personnalisé (optionnel)</Label>
            <Textarea
              value={themeData.customCss}
              onChange={(e) => setThemeData(prev => ({ ...prev, customCss: e.target.value }))}
              placeholder="/* Votre CSS personnalisé ici */"
              className="min-h-[100px] font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreview}
              className="flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Arrêter l\'aperçu' : 'Aperçu'}
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder le thème
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganismeThemeCustomizer;
