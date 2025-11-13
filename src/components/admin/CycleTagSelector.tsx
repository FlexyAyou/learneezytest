import React, { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { useLevels, useCreateProLevel } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

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
  const [customTag, setCustomTag] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]); // pour cycles non pro (si jamais activé plus tard)
  const { toast } = useToast();

  // Charger dynamiquement les niveaux pour formation professionnelle
  const { data: dynamicProLevels = [], isLoading: loadingProLevels } = useLevels(
    selectedCycle === 'formation_pro' ? 'formation_pro' : ''
  );
  const createProLevelMutation = useCreateProLevel();

  const handleCycleChange = (value: string) => {
    onCycleChange(value as Cycle);
    onTagsChange([]); // Reset tags when cycle changes
    setCustomTags([]); // Reset custom tags when cycle changes
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

  const addCustomTag = async () => {
    const trimmed = customTag.trim();
    if (!trimmed) return;
    if (selectedTags.includes(trimmed)) {
      setCustomTag('');
      return;
    }

    if (selectedCycle === 'formation_pro') {
      try {
        await createProLevelMutation.mutateAsync({ name: trimmed });
        // Le hook invalide la query; l’élément reviendra dans dynamicProLevels automatiquement
        onTagsChange([...selectedTags, trimmed]);
        toast({
          title: 'Niveau ajouté',
          description: `"${trimmed}" a été créé.`,
        });
        setCustomTag('');
      } catch (e: any) {
        toast({
          title: 'Erreur',
          description: e?.response?.data?.detail || 'Impossible de créer ce niveau.',
          variant: 'destructive'
        });
      }
    } else {
      // Comportement local (actuellement non affiché pour autres cycles)
      setCustomTags([...customTags, trimmed]);
      onTagsChange([...selectedTags, trimmed]);
      setCustomTag('');
    }
  };

  const availableTags = useMemo(() => {
    if (!selectedCycle) return [] as string[];
    if (selectedCycle === 'formation_pro') {
      // Fusion des tags statiques + dynamiques, sans doublons
      const base = cycleTagsMap.formation_pro;
      const merged = [...base, ...dynamicProLevels];
      return Array.from(new Set(merged)).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
    }
    return cycleTagsMap[selectedCycle as Exclude<Cycle, ''>] || [];
  }, [selectedCycle, dynamicProLevels]);

  const allAvailableTags = [...availableTags, ...(selectedCycle === 'formation_pro' ? [] : customTags)];

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
            {allAvailableTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className={`px-3 py-1.5 text-sm cursor-pointer transition-all ${isSelected
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

          {/* Add custom tag for formation_pro */}
          {selectedCycle === 'formation_pro' && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
              <Label className="text-sm font-medium mb-2 block">Ajouter un tag personnalisé</Label>
              <div className="flex gap-2">
                <Input
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Ex: Master, Doctorat..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomTag();
                    }
                  }}
                  disabled={createProLevelMutation.isPending}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomTag}
                  disabled={!customTag.trim() || createProLevelMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {createProLevelMutation.isPending ? 'Ajout...' : 'Ajouter'}
                </Button>
              </div>
              {loadingProLevels && (
                <p className="text-xs text-muted-foreground mt-2">Chargement des niveaux...</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
