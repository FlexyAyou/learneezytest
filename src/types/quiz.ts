// Types pour le système de quiz amélioré avec react-quiz-component

export interface QuizQuestion {
  question: string;
  questionType: 'text' | 'photo';
  answerSelectionType: 'single' | 'multiple';
  answers: string[];
  correctAnswer: string | string[];
  messageForCorrectAnswer?: string;
  messageForIncorrectAnswer?: string;
  explanation?: string;
  point?: string;
}

export interface Quiz {
  quizTitle: string;
  quizSynopsis: string;
  nrOfQuestions?: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  numberOfQuestions: number;
  numberOfCorrectAnswers: number;
  numberOfIncorrectAnswers: number;
  questions: Array<{
    question: string;
    userAnswer: string[];
    correctAnswer: string | string[];
    point: string;
  }>;
  totalPoints: number;
  correctPoints: number;
}

// Types pour la création de quiz (format simplifié)
export interface SimpleQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string | string[];
  answerType: 'single' | 'multiple';
  explanation?: string;
  points?: number;
}

export interface SimpleQuiz {
  id: string;
  title: string;
  description: string;
  questions: SimpleQuizQuestion[];
}
