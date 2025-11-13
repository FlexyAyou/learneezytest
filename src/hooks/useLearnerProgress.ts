import { useState, useCallback } from 'react';

interface LearnerProgressHook {
  completedLessons: string[];
  markLessonComplete: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  calculateProgress: (totalLessons: number) => number;
}

export const useLearnerProgress = (courseId: string): LearnerProgressHook => {
  // Pour l'instant, on stocke la progression en local
  // À l'avenir, on pourra intégrer avec l'API via POST /api/courses/enroll
  const storageKey = `course-progress-${courseId}`;
  
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  });

  const markLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const updated = [...prev, lessonId];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey]);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return completedLessons.includes(lessonId);
  }, [completedLessons]);

  const calculateProgress = useCallback((totalLessons: number) => {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons.length / totalLessons) * 100);
  }, [completedLessons]);

  return {
    completedLessons,
    markLessonComplete,
    isLessonCompleted,
    calculateProgress,
  };
};
