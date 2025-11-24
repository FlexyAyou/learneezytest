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
  type: 'lesson' | 'quiz' | 'assignment';
  originalIndex: number;
  data: any; // Lesson, Quiz or Assignment data
}

interface SortableContentListProps {
  items: ContentItem[];
  onReorder: (items: ContentItem[]) => void;
  onEditLesson?: (lessonId: string) => void;
  onDeleteLesson?: (lessonId: string) => void;
  onEditQuiz?: (quizIndex: number) => void;
  onDeleteQuiz?: (quizIndex: number) => void;
  onEditAssignment?: () => void;
  onDeleteAssignment?: () => void;
}

export const SortableContentList: React.FC<SortableContentListProps> = ({
  items,
  onReorder,
  onEditLesson,
  onDeleteLesson,
  onEditQuiz,
  onDeleteQuiz,
  onEditAssignment,
  onDeleteAssignment,
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
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
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
            } else if (item.type === 'quiz') {
              const quiz = item.data;
              const questionsCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
              const passing = quiz.settings?.passingScore ?? 0;
              return (
                <SortableContentItem
                  key={item.id}
                  id={item.id}
                  type="quiz"
                  title={quiz.title}
                  subtitle={`${questionsCount} questions • Note de passage: ${passing}%`}
                  onEdit={() => onEditQuiz(item.originalIndex)}
                  onDelete={() => onDeleteQuiz(item.originalIndex)}
                />
              );
            }
            return null;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
