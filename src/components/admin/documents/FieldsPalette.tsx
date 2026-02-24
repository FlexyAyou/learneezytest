import React from 'react';
import { FIELD_CONFIG, SignatureFieldType } from '@/types/document-fields';
import { GripVertical } from 'lucide-react';

interface FieldsPaletteProps {
  onAddField: (type: SignatureFieldType) => void;
}

export const FieldsPalette: React.FC<FieldsPaletteProps> = ({ onAddField }) => {
  const fieldTypes = Object.entries(FIELD_CONFIG) as [SignatureFieldType, typeof FIELD_CONFIG.signature][];

  return (
    <div className="w-64 border-l bg-muted/30 p-4 space-y-3 overflow-y-auto">
      <h3 className="font-semibold text-sm text-foreground mb-3">Champs à placer</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Cliquez sur un champ pour l'ajouter au centre de la page active
      </p>
      <div className="space-y-2">
        {fieldTypes.map(([type, config]) => (
          <button
            key={type}
            onClick={() => onAddField(type)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-accent hover:border-primary/30 transition-colors cursor-pointer text-left group"
          >
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: config.color + '20', color: config.color }}
            >
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{config.label}</p>
            </div>
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};
