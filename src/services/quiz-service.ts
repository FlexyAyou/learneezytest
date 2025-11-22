import { fastAPIClient } from './fastapi-client';
import { QuizCreate, QuizUpdate, QuizResponse } from '@/types/fastapi';

/**
 * Service dédié CRUD quiz (multi-quizzes par module)
 * Implémente les endpoints REST décrits dans le playbook:
 *  POST   /api/courses/{course_id}/modules/{module_id}/quizzes
 *  PATCH  /api/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}
 *  DELETE /api/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}
 *  (Lecture via getCourse(courseId) qui renvoie les modules avec quizzes)
 */
export const quizService = {
  async createQuiz(courseId: string, moduleId: string, data: QuizCreate): Promise<QuizResponse> {
    return fastAPIClient.post<QuizResponse>(`/api/courses/${courseId}/modules/${moduleId}/quizzes`, data);
  },
  async updateQuiz(courseId: string, moduleId: string, quizId: string, data: QuizUpdate): Promise<QuizResponse> {
    return fastAPIClient.patch<QuizResponse>(`/api/courses/${courseId}/modules/${moduleId}/quizzes/${quizId}`, data);
  },
  async deleteQuiz(courseId: string, moduleId: string, quizId: string): Promise<void> {
    return fastAPIClient.delete<void>(`/api/courses/${courseId}/modules/${moduleId}/quizzes/${quizId}`);
  }
};
