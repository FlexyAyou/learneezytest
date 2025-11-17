import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableModuleItemProps {
  id: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  moduleIndex: number;
  moduleCount: number;
  onRemove: () => void;
  module: {
    title: string;
    lessons: any[];
    assignment?: any;
  };
  children: React.ReactNode;
}

export const SortableModuleItem: React.FC<SortableModuleItemProps> = ({
  id,
  isExpanded,
  onToggleExpand,
  moduleIndex,
  moduleCount,
  onRemove,
  module,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg overflow-hidden">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing hover:bg-white/50 rounded p-1 transition-colors"
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>

            {/* Module Badge and Info */}
            <Badge className="bg-gradient-to-r from-pink-600 to-purple-600">
              Module {moduleIndex + 1}
            </Badge>
            <div className="text-left flex-1">
              <div className="font-semibold text-lg">{module.title || 'Sans titre'}</div>
              <div className="text-sm text-gray-600 font-normal">
                {module.lessons.length} leçon{module.lessons.length !== 1 ? 's' : ''}
                {module.assignment && ' • 1 devoir'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {moduleCount > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="hover:bg-red-50"
                type="button"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            
            {/* Expand/Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="hover:bg-white/50"
              type="button"
            >
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isExpanded && "transform rotate-180"
                )}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Module Content (expanded) */}
      {isExpanded && (
        <div className="px-6 py-6 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};
