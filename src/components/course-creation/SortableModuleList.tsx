import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableModuleItem } from './SortableModuleItem';

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  lessons: any[];
  quizzes: any[];
  assignment?: any;
  order?: Array<{ type: 'lesson' | 'quiz' | 'assignment'; id: string }>;
}

interface SortableModuleListProps {
  modules: ModuleItem[];
  onReorder: (modules: ModuleItem[]) => void;
  expandedModule: string | null;
  onExpandModule: (moduleId: string | null) => void;
  children: (module: ModuleItem, moduleIndex: number) => React.ReactNode;
  onRemoveModule: (moduleId: string) => void;
}

export const SortableModuleList: React.FC<SortableModuleListProps> = ({
  modules,
  onReorder,
  expandedModule,
  onExpandModule,
  children,
  onRemoveModule,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((module) => module.id === active.id);
      const newIndex = modules.findIndex((module) => module.id === over.id);

      const newModules = arrayMove(modules, oldIndex, newIndex);
      onReorder(newModules);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={modules.map(module => module.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {modules.map((module, moduleIndex) => (
            <SortableModuleItem
              key={module.id}
              id={module.id}
              isExpanded={expandedModule === module.id}
              onToggleExpand={() => onExpandModule(expandedModule === module.id ? null : module.id)}
              moduleIndex={moduleIndex}
              moduleCount={modules.length}
              onRemove={() => onRemoveModule(module.id)}
              module={module}
            >
              {children(module, moduleIndex)}
            </SortableModuleItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
