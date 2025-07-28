
import React from 'react';
import { AlertTriangle, Check, Eye, Keyboard, Volume2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AccessibilityIndicators: React.FC = () => {
  const { contrast, fontSize, reducedMotion } = useTheme();

  const getContrastScore = () => {
    return contrast === 'high' ? 'AAA' : 'AA';
  };

  const getAccessibilityStatus = () => {
    const indicators = [
      {
        label: 'Contraste',
        status: contrast === 'high' ? 'excellent' : 'good',
        score: getContrastScore(),
        icon: Eye,
        description: `Niveau de contraste ${contrast === 'high' ? 'élevé' : 'normal'}`,
      },
      {
        label: 'Taille de police',
        status: fontSize === 'large' ? 'excellent' : fontSize === 'medium' ? 'good' : 'fair',
        score: fontSize === 'large' ? 'AAA' : 'AA',
        icon: Volume2,
        description: `Police ${fontSize === 'large' ? 'grande' : fontSize === 'medium' ? 'moyenne' : 'petite'}`,
      },
      {
        label: 'Mouvement',
        status: reducedMotion ? 'excellent' : 'good',
        score: reducedMotion ? 'AAA' : 'AA',
        icon: Keyboard,
        description: reducedMotion ? 'Animations réduites' : 'Animations normales',
      },
    ];

    return indicators;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'good':
        return <Check className="h-4 w-4 text-blue-600" />;
      case 'fair':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="h-5 w-5 mr-2" />
          Indicateurs d'accessibilité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {getAccessibilityStatus().map((indicator, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <indicator.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{indicator.label}</p>
                  <p className="text-sm text-muted-foreground">{indicator.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${getStatusColor(indicator.status)} border`}>
                  {indicator.score}
                </Badge>
                {getStatusIcon(indicator.status)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>AA :</strong> Conforme aux directives d'accessibilité web<br />
            <strong>AAA :</strong> Niveau d'accessibilité optimal
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityIndicators;
