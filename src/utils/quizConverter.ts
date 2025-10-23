import { Quiz, QuizQuestion, SimpleQuizQuestion } from '@/types/quiz';

/**
 * Convertit les questions simples en format react-quiz-component
 */
export const convertToReactQuizFormat = (
  title: string,
  description: string,
  questions: SimpleQuizQuestion[]
): Quiz => {
  const convertedQuestions: QuizQuestion[] = questions.map((q) => ({
    question: q.question,
    questionType: 'text',
    answerSelectionType: q.answerType,
    answers: q.options,
    correctAnswer: q.answerType === 'single' 
      ? (q.options.indexOf(q.correctAnswer as string) + 1).toString()
      : Array.isArray(q.correctAnswer)
        ? q.correctAnswer.map(ans => (q.options.indexOf(ans) + 1).toString())
        : [(q.options.indexOf(q.correctAnswer as string) + 1).toString()],
    messageForCorrectAnswer: 'Bonne réponse !',
    messageForIncorrectAnswer: 'Mauvaise réponse.',
    explanation: q.explanation || undefined,
    point: (q.points || 1).toString(),
  }));

  return {
    quizTitle: title,
    quizSynopsis: description,
    nrOfQuestions: questions.length.toString(),
    questions: convertedQuestions,
  };
};

/**
 * Convertit les questions du format react-quiz-component vers le format simple
 */
export const convertFromReactQuizFormat = (quiz: Quiz): SimpleQuizQuestion[] => {
  return quiz.questions.map((q, index) => {
    const correctAnswerIndexes = Array.isArray(q.correctAnswer)
      ? q.correctAnswer.map(ans => parseInt(ans) - 1)
      : [parseInt(q.correctAnswer as string) - 1];

    const correctAnswer = q.answerSelectionType === 'single'
      ? q.answers[correctAnswerIndexes[0]]
      : correctAnswerIndexes.map(idx => q.answers[idx]);

    return {
      id: index.toString(),
      question: q.question,
      options: q.answers,
      correctAnswer,
      answerType: q.answerSelectionType,
      explanation: q.explanation,
      points: parseInt(q.point || '1'),
    };
  });
};
