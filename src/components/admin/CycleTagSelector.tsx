import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type Cycle = 'primaire' | 'college' | 'lycee' | 'formation_pro' | '';

interface CycleTagSelectorProps {
  selectedCycle: Cycle;
  selectedTags: string[];
  onCycleChange: (cycle: Cycle) => void;
  onTagsChange: (tags: string[]) => void;
}

const cycleOptions = [
  { value: 'primaire', label: 'Primaire' },
  { value: 'college', label: 'Collège' },
  { value: 'lycee', label: 'Lycée' },
  { value: 'formation_pro', label: 'Formation professionnelle' },
];

const cycleTagsMap: Record<Exclude<Cycle, ''>, string[]> = {
  primaire: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
  college: ['6e', '5e', '4e', '3e'],
  lycee: ['Seconde', 'Première', 'Terminale'],
  formation_pro: [
    'CAP',
    'BEP',
    'Bac Pro',
    'Bac Pro Commerce',
    'Bac Pro Gestion-Administration',
    'Bac Pro Cuisine',
    'Bac Pro Maintenance des Véhicules',
    'Bac Pro Systèmes Numériques',
    'Bac Pro Esthétique',
    'Bac Pro Hôtellerie-Restauration',
    'BTS',
    'BUT',
    'Licence Professionnelle',
    'Titre Professionnel',
    'Formation en apprentissage',
    'CQP',
    'Formation éligible CPF',
  ],
};

export const CycleTagSelector: React.FC<CycleTagSelectorProps> = ({
  selectedCycle,
  selectedTags,
  onCycleChange,
  onTagsChange,
}) => {
  const handleCycleChange = (value: string) => {
    onCycleChange(value as Cycle);
    onTagsChange([]); // Reset tags when cycle changes
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const availableTags = selectedCycle ? cycleTagsMap[selectedCycle as Exclude<Cycle, ''>] || [] : [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cycle">Cycle d'apprentissage</Label>
        <Select value={selectedCycle} onValueChange={handleCycleChange}>
          <SelectTrigger id="cycle">
            <SelectValue placeholder="Sélectionner un cycle" />
          </SelectTrigger>
          <SelectContent>
            {cycleOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCycle && (
        <div className="space-y-3">
          <Label>Niveaux disponibles</Label>
          
          {/* Selected tags display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border border-border">
              {selectedTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="default" 
                  className="px-3 py-1.5 text-sm flex items-center gap-2"
                >
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Available tags to select */}
          <div className="flex flex-wrap gap-2 p-3 bg-background rounded-lg border border-border">
            {availableTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className={`px-3 py-1.5 text-sm cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-primary/10 hover:border-primary'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
