import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { useCategories, useCreateCategory } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

interface CategoryTagSelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTagSelector: React.FC<CategoryTagSelectorProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [customCategory, setCustomCategory] = useState('');
  const { toast } = useToast();

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const createCategoryMutation = useCreateCategory();

  const toggleCategory = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      onCategoryChange('');
    } else {
      onCategoryChange(categoryName);
    }
  };

  const addCustomCategory = async () => {
    const trimmed = customCategory.trim();
    if (!trimmed) return;

    try {
      await createCategoryMutation.mutateAsync({ name: trimmed });
      onCategoryChange(trimmed);
      toast({
        title: 'Catégorie ajoutée',
        description: `"${trimmed}" a été créée.`,
      });
      setCustomCategory('');
    } catch (e: any) {
      toast({
        title: 'Erreur',
        description: e?.response?.data?.detail || 'Impossible de créer cette catégorie.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-base">Catégorie du cours</Label>

      {/* Categories disponibles */}
      {isLoadingCategories ? (
        <div className="text-sm text-muted-foreground">Chargement des catégories...</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.name ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors px-3 py-1.5"
              onClick={() => toggleCategory(cat.name)}
            >
              {cat.name}
              {selectedCategory === cat.name && (
                <X
                  className="ml-2 h-3 w-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryChange('');
                  }}
                />
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Ajouter une catégorie personnalisée */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Ajouter une catégorie personnalisée</Label>
        <div className="flex gap-2">
          <Input
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Ex: Marketing Digital, Data Science..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomCategory();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustomCategory}
            disabled={!customCategory.trim() || createCategoryMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};
