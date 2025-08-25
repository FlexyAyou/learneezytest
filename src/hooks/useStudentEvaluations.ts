
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface StudentEvaluation {
  id: string;
  type: 'positionnement' | 'final' | 'satisfaction' | 'quiz' | 'exam' | 'practical';
  courseTitle: string;
  title: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  completedAt: string;
  questions?: any;
}

export const useStudentEvaluations = () => {
  const [evaluations, setEvaluations] = useState<StudentEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      // Mock data since we're using a placeholder Supabase client
      const mockEvaluations: StudentEvaluation[] = [
        {
          id: '1',
          type: 'positionnement',
          courseTitle: 'Mathématiques CE2',
          title: 'Test de positionnement',
          score: 18,
          maxScore: 20,
          percentage: 90,
          completedAt: '2024-01-15T10:30:00Z',
          questions: {}
        },
        {
          id: '2',
          type: 'quiz',
          courseTitle: 'Français CM1',
          title: 'Quiz',
          score: 15,
          maxScore: 20,
          percentage: 75,
          completedAt: '2024-01-20T14:15:00Z',
          questions: {}
        },
        {
          id: '3',
          type: 'exam',
          courseTitle: 'Sciences 6ème',
          title: 'Examen',
          score: 16,
          maxScore: 20,
          percentage: 80,
          completedAt: '2024-02-01T09:00:00Z',
          questions: {}
        },
        {
          id: '4',
          type: 'practical',
          courseTitle: 'Histoire-Géographie 4ème',
          title: 'Exercice pratique',
          score: 17,
          maxScore: 20,
          percentage: 85,
          completedAt: '2024-02-10T11:30:00Z',
          questions: {}
        },
        {
          id: '5',
          type: 'final',
          courseTitle: 'Mathématiques CE2',
          title: 'Évaluation finale',
          score: 19,
          maxScore: 20,
          percentage: 95,
          completedAt: '2024-02-15T16:00:00Z',
          questions: {}
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvaluations(mockEvaluations);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les évaluations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { evaluations, loading, refetch: fetchEvaluations };
};
