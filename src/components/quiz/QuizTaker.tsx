import React from 'react';
import Quiz from 'react-quiz-component';
import { SimpleQuizQuestion } from '@/types/quiz';
import { convertToReactQuizFormat } from '@/utils/quizConverter';
import { Card, CardContent } from '@/components/ui/card';

interface QuizTakerProps {
  title: string;
  description?: string;
  questions: SimpleQuizQuestion[];
  onComplete?: (result: any) => void;
}

export const QuizTaker: React.FC<QuizTakerProps> = ({
  title,
  description = '',
  questions,
  onComplete
}) => {
  const quiz = convertToReactQuizFormat(title, description, questions);

  const quizConfig = {
    showDefaultResult: true,
    showInstantFeedback: true,
    continueTillCorrect: false,
    revealAnswerOnSubmit: true,
    allowNavigation: true,
    timer: 0, // 0 = pas de timer
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Quiz
          quiz={quiz}
          shuffle={false}
          showInstantFeedback={quizConfig.showInstantFeedback}
          continueTillCorrect={quizConfig.continueTillCorrect}
          revealAnswerOnSubmit={quizConfig.revealAnswerOnSubmit}
          allowNavigation={quizConfig.allowNavigation}
          onComplete={onComplete}
        />
      </CardContent>
    </Card>
  );
};
