import { useState, useCallback, useMemo } from 'react';
import { Content } from '@/types/fastapi';

interface ProgressState {
  completedLessons: Set<string>;
  currentLessonId: string | null;
}

interface UseLearnerProgressReturn {
  completedLessons: Set<string>;
  currentLessonId: string | null;
  isLessonCompleted: (lessonId: string) => boolean;
  markLessonComplete: (lessonId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  calculateProgress: (totalLessons: number) => number;
}

/**
 * Hook pour gérer la progression de l'apprenant dans un cours
 * TODO: Intégrer avec l'API backend (POST /api/courses/enroll, PATCH /api/user/progress)
 */
export const useLearnerProgress = (courseId: string): UseLearnerProgressReturn => {
  // État local (temporaire, à remplacer par l'API)
  const [progress, setProgress] = useState<ProgressState>({
    completedLessons: new Set<string>(),
    currentLessonId: null,
  });

  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return progress.completedLessons.has(lessonId);
  }, [progress.completedLessons]);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const newCompleted = new Set(prev.completedLessons);
      newCompleted.add(lessonId);
      
      // TODO: Envoyer au backend
      // await fastAPIClient.updateProgress(courseId, { lessonId, completed: true });
      
      return {
        ...prev,
        completedLessons: newCompleted,
      };
    });
  }, [courseId]);

  const setCurrentLesson = useCallback((lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      currentLessonId: lessonId,
    }));
  }, []);

  const calculateProgress = useCallback((totalLessons: number): number => {
    if (totalLessons === 0) return 0;
    return Math.round((progress.completedLessons.size / totalLessons) * 100);
  }, [progress.completedLessons]);

  return {
    completedLessons: progress.completedLessons,
    currentLessonId: progress.currentLessonId,
    isLessonCompleted,
    markLessonComplete,
    setCurrentLesson,
    calculateProgress,
  };
};
