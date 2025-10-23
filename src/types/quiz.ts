// Types pour le système de quiz, devoirs et certification

export type QuestionType = 
  | 'single-choice'    // QCM à choix unique
  | 'multiple-choice'  // QCM à choix multiples
  | 'true-false'       // Vrai/Faux
  | 'short-answer'     // Réponse courte
  | 'long-answer'      // Réponse longue (dissertation)
  | 'fill-blank'       // Texte à trous
  | 'matching'         // Appariement
  | 'ordering';        // Mise en ordre

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type EvaluationType = 'quiz' | 'assignment' | 'certification';

// Question de base
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  difficulty?: DifficultyLevel;
  explanation?: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
  tags?: string[];
}

// QCM à choix unique
export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single-choice';
  options: string[];
  correctAnswer: number; // Index de la bonne réponse
}

// QCM à choix multiples
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswers: number[]; // Indices des bonnes réponses
}

// Vrai/Faux
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

// Réponse courte
export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
  correctAnswers: string[]; // Plusieurs réponses possibles acceptées
  caseSensitive?: boolean;
}

// Réponse longue (pour devoirs et certification)
export interface LongAnswerQuestion extends BaseQuestion {
  type: 'long-answer';
  minWords?: number;
  maxWords?: number;
  rubric?: string[]; // Critères d'évaluation
}

// Texte à trous
export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  text: string; // Texte avec [blank] pour les trous
  correctAnswers: string[]; // Réponses pour chaque trou
}

// Appariement
export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  leftItems: string[];
  rightItems: string[];
  correctMatches: { left: number; right: number }[]; // Paires correctes
}

// Mise en ordre
export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  items: string[];
  correctOrder: number[]; // Ordre correct des indices
}

export type Question = 
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ShortAnswerQuestion
  | LongAnswerQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | OrderingQuestion;

// Configuration de quiz (pour les leçons)
export interface QuizConfig {
  id: string;
  type: 'quiz';
  title: string;
  description?: string;
  questions: Question[];
  settings: {
    showFeedback: 'immediate' | 'after-submit' | 'never';
    allowRetry: boolean;
    maxAttempts?: number;
    randomizeQuestions?: boolean;
    randomizeOptions?: boolean;
    timeLimit?: number; // en minutes
    passingScore: number; // pourcentage
  };
}

// Configuration de devoir (pour les modules)
export interface AssignmentConfig {
  id: string;
  type: 'assignment';
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  settings: {
    dueDate?: Date;
    allowLateSubmission: boolean;
    maxAttempts: number;
    timeLimit?: number; // en minutes
    passingScore: number;
    requiresManualGrading: boolean; // Pour les réponses longues
    rubric?: string[]; // Grille d'évaluation
  };
  resources?: {
    name: string;
    url: string;
  }[];
}

// Configuration de certification (pour le cours entier)
export interface CertificationConfig {
  id: string;
  type: 'certification';
  title: string;
  description: string;
  questions: Question[];
  settings: {
    examMode: boolean; // Désactive copier/coller, etc.
    timeLimit: number; // obligatoire en minutes
    passingScore: number;
    maxAttempts: number;
    randomizeQuestions: boolean;
    showResultsImmediately: boolean;
    certificateTemplate?: string;
    prerequisites?: string[]; // IDs des modules/devoirs à valider avant
  };
}

export type Evaluation = QuizConfig | AssignmentConfig | CertificationConfig;

// Réponse de l'utilisateur
export interface UserAnswer {
  questionId: string;
  answer: any; // Type dépend du type de question
  isCorrect?: boolean;
  pointsEarned?: number;
  timeSpent?: number; // en secondes
  submittedAt: Date;
}

// Résultat d'une évaluation
export interface EvaluationResult {
  evaluationId: string;
  evaluationType: EvaluationType;
  userId: string;
  answers: UserAnswer[];
  score: number; // pourcentage
  pointsEarned: number;
  totalPoints: number;
  isPassing: boolean;
  attemptNumber: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // en secondes
  feedback?: string; // Pour les devoirs notés manuellement
  gradedBy?: string; // ID du formateur
  gradedAt?: Date;
}

// Stats pour le formateur
export interface EvaluationStats {
  evaluationId: string;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  passingRate: number;
  averageTimeSpent: number;
  questionStats: {
    questionId: string;
    correctRate: number;
    averageTimeSpent: number;
  }[];
}
