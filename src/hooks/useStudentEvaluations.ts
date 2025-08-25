
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('evaluations')
        .select(`
          id,
          type,
          score,
          max_score,
          percentage,
          completed_at,
          questions,
          course_id
        `)
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      // Mock course titles for now - in real app, you'd join with courses table
      const evaluationsWithCourses = data?.map(eval => ({
        id: eval.id,
        type: eval.type as StudentEvaluation['type'],
        courseTitle: getCourseTitle(eval.course_id),
        title: getEvaluationTitle(eval.type),
        score: eval.score,
        maxScore: eval.max_score,
        percentage: eval.percentage,
        completedAt: eval.completed_at,
        questions: eval.questions
      })) || [];

      setEvaluations(evaluationsWithCourses);
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

  const getCourseTitle = (courseId: string) => {
    // Mock data - in real app, this would come from a join or separate query
    const courseTitles: Record<string, string> = {
      '1': 'Mathématiques CE2',
      '2': 'Français CM1',
      '3': 'Sciences 6ème',
      '4': 'Histoire-Géographie 4ème'
    };
    return courseTitles[courseId] || 'Formation';
  };

  const getEvaluationTitle = (type: string) => {
    const titles: Record<string, string> = {
      'positionnement': 'Test de positionnement',
      'final': 'Évaluation finale',
      'satisfaction': 'Enquête de satisfaction',
      'quiz': 'Quiz',
      'exam': 'Examen',
      'practical': 'Exercice pratique'
    };
    return titles[type] || 'Évaluation';
  };

  return { evaluations, loading, refetch: fetchEvaluations };
};
