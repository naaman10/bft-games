import { Question } from '../types/game';

/** Local Year 6 Percentages bank used when the API is unavailable. */
export const LOCAL_QUESTIONS: Array<Question & { correctAnswer: string }> = [
  {
    id: 'local-1',
    questionText: 'What is 25% of 80?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 1,
    correctAnswer: '20',
  },
  {
    id: 'local-2',
    questionText: 'What is 50% of 120?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 1,
    correctAnswer: '60',
  },
  {
    id: 'local-3',
    questionText: 'What is 10% of 200?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 1,
    correctAnswer: '20',
  },
  {
    id: 'local-4',
    questionText: 'What is 75% of 40?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 2,
    correctAnswer: '30',
  },
  {
    id: 'local-5',
    questionText: 'What is 20% of 150?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 1,
    correctAnswer: '30',
  },
  {
    id: 'local-6',
    questionText: 'What is 30% of 100?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 1,
    correctAnswer: '30',
  },
  {
    id: 'local-7',
    questionText: 'What is 15% of 80?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 2,
    correctAnswer: '12',
  },
  {
    id: 'local-8',
    questionText: 'What is 60% of 50?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 2,
    correctAnswer: '30',
  },
  {
    id: 'local-9',
    questionText: 'What is 5% of 200?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 1,
    correctAnswer: '10',
  },
  {
    id: 'local-10',
    questionText: 'What is 40% of 75?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 2,
    correctAnswer: '30',
  },
];

export function pickLocalQuestions(
  yearGroup: string,
  subject: string,
  count: number
): Question[] {
  const pool = LOCAL_QUESTIONS.filter(
    (q) => q.yearGroup === yearGroup && q.subject === subject
  );
  const source = pool.length > 0 ? pool : LOCAL_QUESTIONS;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(({ correctAnswer: _a, ...q }) => q);
}

export function getLocalCorrectAnswer(questionId: string): string | undefined {
  return LOCAL_QUESTIONS.find((q) => q.id === questionId)?.correctAnswer;
}
