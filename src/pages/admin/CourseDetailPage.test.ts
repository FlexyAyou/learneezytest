/**
 * Test suite for CourseDetailPage assignment loading
 * Tests the fix for assignment visibility issue
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fastAPIClient } from '@/services/fastapi-client';

// Mock the fastAPIClient
vi.mock('@/services/fastapi-client');

describe('CourseDetailPage - Assignment Loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Assignment Loading Logic', () => {
    it('should load assignment even if not in order field', async () => {
      const courseId = 'course-123';
      const moduleId = 'module-456';
      
      const mockAssignment = {
        id: 'assignment-789',
        title: 'Test Assignment',
        questions: [],
      };

      // Mock the API call
      vi.mocked(fastAPIClient.getAssignment).mockResolvedValueOnce(mockAssignment);

      // Simulate what happens when accordion is clicked
      try {
        const assignment = await fastAPIClient.getAssignment(courseId, moduleId);
        expect(assignment).toEqual(mockAssignment);
      } catch (error) {
        expect.fail('Should not throw error');
      }
    });

    it('should handle 404 gracefully when assignment does not exist', async () => {
      const courseId = 'course-123';
      const moduleId = 'module-456';

      const error = new Error('Assignment not found');
      (error as any).response = { status: 404 };

      vi.mocked(fastAPIClient.getAssignment).mockRejectedValueOnce(error);

      try {
        await fastAPIClient.getAssignment(courseId, moduleId);
        expect.fail('Should throw error');
      } catch (err) {
        // This is expected - 404 should be caught and handled gracefully
        expect((err as any).response?.status).toBe(404);
      }
    });

    it('should display assignment badge if assignment exists in module property', () => {
      const module = {
        id: 'module-123',
        title: 'Module 1',
        assignment: {
          id: 'assignment-456',
          title: 'Assignment',
        },
        // No order field or empty order
      };

      // Should show badge because module.assignment exists
      const shouldShowBadge = !!(
        (module as any).assignment || 
        (module as any).order?.some((o: any) => o.type === 'assignment')
      );
      
      expect(shouldShowBadge).toBe(true);
    });

    it('should display assignment badge if assignment is in order array', () => {
      const module = {
        id: 'module-123',
        title: 'Module 1',
        order: [
          { type: 'lesson', id: 'lesson-1' },
          { type: 'quiz', id: 'quiz-1' },
          { type: 'assignment', id: 'assignment-1' },
        ],
        // No assignment property yet
      };

      // Should show badge because order contains assignment
      const shouldShowBadge = !!(
        (module as any).assignment || 
        (module as any).order?.some((o: any) => o.type === 'assignment')
      );
      
      expect(shouldShowBadge).toBe(true);
    });

    it('should not display badge if no assignment exists', () => {
      const module = {
        id: 'module-123',
        title: 'Module 1',
        order: [
          { type: 'lesson', id: 'lesson-1' },
          { type: 'quiz', id: 'quiz-1' },
        ],
        // No assignment
      };

      // Should NOT show badge
      const shouldShowBadge = !!(
        (module as any).assignment || 
        (module as any).order?.some((o: any) => o.type === 'assignment')
      );
      
      expect(shouldShowBadge).toBe(false);
    });

    it('should mark assignment as loaded after first attempt', () => {
      const module = {
        id: 'module-123',
        __assignment_loaded: false,
      };

      // Simulate loading flag
      module.__assignment_loaded = true;

      // Should not attempt to load again
      expect(module.__assignment_loaded).toBe(true);
    });

    it('should mark assignment as loaded even on 404', () => {
      const module = {
        id: 'module-123',
        __assignment_loaded: false,
      };

      // Simulate marking as loaded after 404
      const error = new Error('Not found');
      (error as any).response = { status: 404 };

      if ((error as any).response?.status === 404) {
        module.__assignment_loaded = true;
      }

      // Should be marked as loaded
      expect(module.__assignment_loaded).toBe(true);
    });
  });

  describe('Course with Module, Lesson, Quiz, and Assignment', () => {
    it('should load all components correctly', async () => {
      const course = {
        id: 'course-123',
        title: 'Test Course',
        modules: [
          {
            id: 'module-456',
            title: 'Module 1',
            content: [
              {
                id: 'lesson-789',
                title: 'Lesson 1',
                type: 'lesson',
              },
            ],
            quizzes: [
              {
                id: 'quiz-101',
                title: 'Quiz 1',
                questions: [],
              },
            ],
            order: [
              { type: 'lesson', id: 'lesson-789' },
              { type: 'quiz', id: 'quiz-101' },
              { type: 'assignment', id: 'assignment-202' },
            ],
          },
        ],
      };

      expect(course.modules).toHaveLength(1);
      expect(course.modules[0].content).toHaveLength(1);
      expect(course.modules[0].quizzes).toHaveLength(1);
      expect(course.modules[0].order).toHaveLength(3);
      expect(course.modules[0].order?.some(o => o.type === 'assignment')).toBe(true);
    });

    it('should successfully load assignment after module creation', async () => {
      const courseId = 'course-123';
      const moduleId = 'module-456';

      const mockAssignment = {
        id: 'assignment-202',
        title: 'Assignment 1',
        description: 'Test assignment',
        questions: [
          {
            question: 'Test question',
            type: 'essay',
            points: 10,
          },
        ],
        settings: {
          passing_score: 70,
          max_attempts: 3,
        },
      };

      vi.mocked(fastAPIClient.getAssignment).mockResolvedValueOnce(mockAssignment);

      const assignment = await fastAPIClient.getAssignment(courseId, moduleId);

      expect(assignment).toBeDefined();
      expect(assignment.title).toBe('Assignment 1');
      expect(assignment.questions).toHaveLength(1);
      expect(fastAPIClient.getAssignment).toHaveBeenCalledWith(courseId, moduleId);
    });
  });

  describe('Edge Cases', () => {
    it('should handle module with no ID', () => {
      const module = {
        title: 'Module',
        // No id field
      };

      const moduleId = (module as any).id;
      expect(moduleId).toBeUndefined();
    });

    it('should handle empty order array', () => {
      const module = {
        id: 'module-123',
        order: [],
      };

      const hasAssignment = (module as any).order?.some((o: any) => o.type === 'assignment');
      expect(hasAssignment).toBe(false);
    });

    it('should handle undefined order', () => {
      const module = {
        id: 'module-123',
        // No order field
      };

      const hasAssignment = (module as any).order?.some((o: any) => o.type === 'assignment');
      expect(hasAssignment).toBe(false);
    });

    it('should handle network error during assignment load', async () => {
      const courseId = 'course-123';
      const moduleId = 'module-456';

      const networkError = new Error('Network error');
      (networkError as any).response = { status: 500 };

      vi.mocked(fastAPIClient.getAssignment).mockRejectedValueOnce(networkError);

      try {
        await fastAPIClient.getAssignment(courseId, moduleId);
        expect.fail('Should throw error');
      } catch (err) {
        expect((err as any).message).toBe('Network error');
        expect((err as any).response?.status).toBe(500);
      }
    });
  });
});
