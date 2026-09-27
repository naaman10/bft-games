export type QuizQuestion = {
  id: string;
  questionText: string;
  yearGroup: string;
  subject: string;
  difficultyLevel: number;
};

export type QuizAnswer = {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  timeTakenSeconds: number;
  explanation?: string;
};

export type QuizConfig = {
  yearGroup: string;
  subject: string | null; // null means "All Subjects"
  questionCount: number; // max 20
};

export type QuizResult = {
  id?: string;
  yearGroup: string;
  subject: string | null;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  startedAt: Date;
  completedAt?: Date;
};

export type QuizState = 'setup' | 'playing' | 'completed';

export type StudentQuizHistory = {
  id: string;
  gameType: string;
  yearGroup: string;
  subject: string | null;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  completedAt: string;
};
