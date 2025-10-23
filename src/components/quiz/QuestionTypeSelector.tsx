import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare, ListChecks, ToggleLeft, Type, FileText, TextCursor, Link2, ArrowUpDown } from 'lucide-react';
import type { QuestionType } from '@/types/quiz';

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onSelectType: (type: QuestionType) => void;
  availableTypes?: QuestionType[];
}

const questionTypes: { type: QuestionType; label: string; icon: React.ElementType; description: string }[] = [
  { 
    type: 'single-choice', 
    label: 'QCM Unique', 
    icon: CheckSquare, 
    description: 'Une seule bonne réponse' 
  },
  { 
    type: 'multiple-choice', 
    label: 'QCM Multiple', 
    icon: ListChecks, 
    description: 'Plusieurs bonnes réponses' 
  },
  { 
    type: 'true-false', 
    label: 'Vrai/Faux', 
    icon: ToggleLeft, 
    description: 'Question binaire' 
  },
  { 
    type: 'short-answer', 
    label: 'Réponse Courte', 
    icon: Type, 
    description: 'Texte court libre' 
  },
  { 
    type: 'long-answer', 
    label: 'Dissertation', 
    icon: FileText, 
    description: 'Réponse développée' 
  },
  { 
    type: 'fill-blank', 
    label: 'Texte à Trous', 
    icon: TextCursor, 
    description: 'Compléter le texte' 
  },
  { 
    type: 'matching', 
    label: 'Appariement', 
    icon: Link2, 
    description: 'Associer des paires' 
  },
  { 
    type: 'ordering', 
    label: 'Ordre', 
    icon: ArrowUpDown, 
    description: 'Ordonner des éléments' 
  }
];

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  selectedType,
  onSelectType,
  availableTypes
}) => {
  const types = availableTypes 
    ? questionTypes.filter(qt => availableTypes.includes(qt.type))
    : questionTypes;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {types.map(({ type, label, icon: Icon, description }) => (
        <Card
          key={type}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedType === type 
              ? 'border-2 border-primary bg-primary/5' 
              : 'border hover:border-primary/50'
          }`}
          onClick={() => onSelectType(type)}
        >
          <CardContent className="p-4 text-center space-y-2">
            <Icon className={`h-6 w-6 mx-auto ${selectedType === type ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <div className={`font-semibold text-sm ${selectedType === type ? 'text-primary' : ''}`}>
                {label}
              </div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
