import { useState, useCallback } from 'react';

interface QuizResult {
  score: number;
  passed: boolean;
  attempts: number;
  lastAttempt: number;
}

interface LearnerProgressHook {
  completedLessons: string[];
  markLessonComplete: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  calculateProgress: (totalLessons: number) => number;
  completedQuizzes: string[];
  quizResults: Record<string, QuizResult>;
  markQuizComplete: (quizId: string, score: number, passed: boolean) => void;
  getQuizResult: (quizId: string) => QuizResult | undefined;
  isQuizCompleted: (quizId: string) => boolean;
}

export const useLearnerProgress = (courseId: string): LearnerProgressHook => {
  // Pour l'instant, on stocke la progression en local
  // À l'avenir, on pourra intégrer avec l'API via POST /api/courses/enroll
  const storageKey = `course-progress-${courseId}`;
  const quizStorageKey = `course-quiz-progress-${courseId}`;
  
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  });

  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(() => {
    const stored = localStorage.getItem(quizStorageKey);
    return stored ? JSON.parse(stored) : [];
  });

  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>(() => {
    const stored = localStorage.getItem(`${quizStorageKey}-results`);
    return stored ? JSON.parse(stored) : {};
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

  const markQuizComplete = useCallback((quizId: string, score: number, passed: boolean) => {
    setCompletedQuizzes((prev) => {
      if (prev.includes(quizId)) {
        // Update existing result
        const updated = prev;
        localStorage.setItem(quizStorageKey, JSON.stringify(updated));
        return updated;
      }
      const updated = [...prev, quizId];
      localStorage.setItem(quizStorageKey, JSON.stringify(updated));
      return updated;
    });

    setQuizResults((prev) => {
      const existingResult = prev[quizId];
      const newResult: QuizResult = {
        score,
        passed,
        attempts: existingResult ? existingResult.attempts + 1 : 1,
        lastAttempt: Date.now(),
      };
      const updated = { ...prev, [quizId]: newResult };
      localStorage.setItem(`${quizStorageKey}-results`, JSON.stringify(updated));
      return updated;
    });
  }, [quizStorageKey]);

  const getQuizResult = useCallback((quizId: string) => {
    return quizResults[quizId];
  }, [quizResults]);

  const isQuizCompleted = useCallback((quizId: string) => {
    return completedQuizzes.includes(quizId);
  }, [completedQuizzes]);

  return {
    completedLessons,
    markLessonComplete,
    isLessonCompleted,
    calculateProgress,
    completedQuizzes,
    quizResults,
    markQuizComplete,
    getQuizResult,
    isQuizCompleted,
  };
};
