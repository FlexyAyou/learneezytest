
import React from 'react';
import { Palette, Sun, Moon, Eye, Type, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const predefinedThemes = [
  {
    id: 'learneezy',
    name: 'Learneezy',
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
      fontSize: 'medium' as const,
      contrast: 'normal' as const,
      reducedMotion: false,
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    colors: {
      primary: '221 83% 53%',
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
      fontSize: 'medium' as const,
      contrast: 'normal' as const,
      reducedMotion: false,
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    colors: {
      primary: '142 76% 36%',
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
      fontSize: 'medium' as const,
      contrast: 'normal' as const,
      reducedMotion: false,
    },
  },
];

const ThemeSelector: React.FC = () => {
  const {
    currentTheme,
    isDarkMode,
    fontSize,
    contrast,
    reducedMotion,
    toggleDarkMode,
    setFontSize,
    setContrast,
    setReducedMotion,
    applyTheme,
  } = useTheme();

  return (
    <div className="space-y-6">
      {/* Mode sombre/clair */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {isDarkMode ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
            Mode d'affichage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mode sombre</Label>
              <p className="text-sm text-muted-foreground">
                Basculer entre le mode clair et sombre
              </p>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
              aria-label="Basculer le mode sombre"
            />
          </div>
        </CardContent>
      </Card>

      {/* Thèmes prédéfinis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Thèmes prédéfinis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {predefinedThemes.map((theme) => (
              <Button
                key={theme.id}
                variant={currentTheme.id === theme.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => applyTheme(theme)}
              >
                <div className="w-full h-6 rounded flex">
                  <div 
                    className="flex-1 rounded-l" 
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                  />
                  <div 
                    className="flex-1" 
                    style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                  />
                  <div 
                    className="flex-1 rounded-r" 
                    style={{ backgroundColor: `hsl(${theme.colors.background})` }}
                  />
                </div>
                <span className="text-sm font-medium">{theme.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accessibilité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Accessibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Taille de police */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Taille de police
            </Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la taille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Petite</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Contraste */}
          <div className="space-y-2">
            <Label>Niveau de contraste</Label>
            <Select value={contrast} onValueChange={setContrast}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le contraste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">Élevé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Mouvement réduit */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Mouvement réduit
              </Label>
              <p className="text-sm text-muted-foreground">
                Réduire les animations pour moins de distraction
              </p>
            </div>
            <Switch
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
              aria-label="Activer le mouvement réduit"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSelector;
