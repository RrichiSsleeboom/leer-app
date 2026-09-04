export type QuestionType = "mcq" | "open";

interface QuizQuestionBase {
  id: string;
  quizId: string;
  prompt: string;
  order: number;
}

export interface McqQuestion extends QuizQuestionBase {
  type: "mcq";
  options: string[];
  correctOptionIndex: number;
}

export interface OpenQuestion extends QuizQuestionBase {
  type: "open";
  sampleAnswer: string;
}

export type QuizQuestion = McqQuestion | OpenQuestion;

export interface Quiz {
  id: string;
  subjectId: string;
  topicId?: string;
  title: string;
  createdAt: string;
}

export interface QuizAttemptAnswer {
  questionId: string;
  givenAnswer: string;
  isCorrect: boolean | null;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  subjectId: string;
  startedAt: string;
  completedAt: string;
  answers: QuizAttemptAnswer[];
  scorePercent: number;
}
