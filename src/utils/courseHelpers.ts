import type { QuizConfig, SingleChoiceQuestion, TrueFalseQuestion } from '@/types/quiz';
import type { QuizCreate } from '@/types/fastapi';

/**
 * Mapper QuizConfig (frontend) → QuizCreate (backend)
 */
export function mapQuizConfigToBackend(quizConfig: QuizConfig): QuizCreate {
  return {
    title: quizConfig.title,
    questions: quizConfig.questions.map(q => {
      if (q.type === 'single-choice') {
        const singleChoice = q as SingleChoiceQuestion;
        return {
          question: singleChoice.question,
          options: singleChoice.options,
          correct_answer: singleChoice.options[singleChoice.correctAnswer] // Backend veut la réponse en string
        };
      }
      if (q.type === 'true-false') {
        const trueFalse = q as TrueFalseQuestion;
        return {
          question: trueFalse.question,
          options: ['Vrai', 'Faux'],
          correct_answer: trueFalse.correctAnswer ? 'Vrai' : 'Faux'
        };
      }
      // Pour les autres types (multiple-choice, short-answer, long-answer)
      // Temporairement, on les traite comme des questions à choix unique
      // TODO: Adapter selon les besoins backend
      return {
        question: q.question,
        options: ['Réponse 1', 'Réponse 2'],
        correct_answer: 'Réponse 1'
      };
    })
  };
}

/**
 * Calculer la durée totale d'un module en fonction de ses leçons
 */
export function calculateModuleDuration(lessons: Array<{ duration: number }>): string {
  const totalMinutes = lessons.reduce((sum, l) => sum + l.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}min`;
  }
  
  return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
}

/**
 * Uploader un fichier vers une URL présignée (MinIO/S3)
 */
export async function uploadFileToPresignedUrl(url: string, file: File): Promise<void> {
  const response = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  if (!response.ok) {
    throw new Error(`Échec de l'upload du fichier: ${response.statusText}`);
  }
}

/**
 * Extraire le nom de fichier depuis un File
 */
export function getFileName(file: File | null): string {
  return file?.name || '';
}

/**
 * Valider les données d'un cours avant création
 */
export function validateCourseData(data: {
  title: string;
  description: string;
  level: string;
}): { valid: boolean; error?: string } {
  if (!data.title || data.title.trim().length === 0) {
    return { valid: false, error: 'Le titre du cours est requis' };
  }
  
  if (!data.description || data.description.trim().length === 0) {
    return { valid: false, error: 'La description du cours est requise' };
  }
  
  if (!data.level) {
    return { valid: false, error: 'Le niveau du cours est requis' };
  }
  
  return { valid: true };
}
