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
import { SortableContentItem } from './SortableContentItem';

export interface ContentItem {
  id: string;
  type: 'lesson' | 'quiz';
  originalIndex: number;
  data: any; // Lesson or Quiz data
}

interface SortableContentListProps {
  items: ContentItem[];
  onReorder: (items: ContentItem[]) => void;
  onEditLesson: (lessonId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onEditQuiz: (quizIndex: number) => void;
  onDeleteQuiz: (quizIndex: number) => void;
}

export const SortableContentList: React.FC<SortableContentListProps> = ({
  items,
  onReorder,
  onEditLesson,
  onDeleteLesson,
  onEditQuiz,
  onDeleteQuiz,
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

    console.log('🔄 Drag end event:', { 
      activeId: active.id, 
      overId: over?.id,
      itemsCount: items.length 
    });

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      console.log('📍 Reordering:', { 
        oldIndex, 
        newIndex,
        activeType: items[oldIndex]?.type,
        overType: items[newIndex]?.type
      });

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems);
      } else {
        console.error('❌ Invalid indexes:', { oldIndex, newIndex });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((item) => {
            if (item.type === 'lesson') {
              const lesson = item.data;
              return (
                <SortableContentItem
                  key={item.id}
                  id={item.id}
                  type="lesson"
                  title={lesson.title}
                  subtitle={`${lesson.duration} minutes`}
                  fileType={lesson.fileType}
                  useMediaUrl={lesson.useMediaUrl}
                  onEdit={() => onEditLesson(item.id)}
                  onDelete={() => onDeleteLesson(item.id)}
                />
              );
            } else {
              const quiz = item.data;
              return (
                <SortableContentItem
                  key={item.id}
                  id={item.id}
                  type="quiz"
                  title={quiz.title}
                  subtitle={`${quiz.questions.length} questions • Note de passage: ${quiz.settings.passingScore}%`}
                  onEdit={() => onEditQuiz(item.originalIndex)}
                  onDelete={() => onDeleteQuiz(item.originalIndex)}
                />
              );
            }
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
