import { Question } from '../types/game';

/** Local fallback question bank used when the API is unavailable.
 * Now includes questions across multiple year groups and subjects.
 */
export const LOCAL_QUESTIONS: Array<Question & { correctAnswer: string }> = [
  // Year 1 - Addition
  {
    id: 'local-y1-add-1',
    questionText: 'What is 2 + 3?',
    yearGroup: 'Year 1',
    subject: 'Addition',
    difficultyLevel: 1,
    correctAnswer: '5',
  },
  {
    id: 'local-y1-add-2',
    questionText: 'What is 5 + 4?',
    yearGroup: 'Year 1',
    subject: 'Addition',
    difficultyLevel: 1,
    correctAnswer: '9',
  },
  {
    id: 'local-y1-add-3',
    questionText: 'What is 3 + 7?',
    yearGroup: 'Year 1',
    subject: 'Addition',
    difficultyLevel: 2,
    correctAnswer: '10',
  },
  // Year 1 - Subtraction
  {
    id: 'local-y1-sub-1',
    questionText: 'What is 5 - 2?',
    yearGroup: 'Year 1',
    subject: 'Subtraction',
    difficultyLevel: 1,
    correctAnswer: '3',
  },
  {
    id: 'local-y1-sub-2',
    questionText: 'What is 10 - 4?',
    yearGroup: 'Year 1',
    subject: 'Subtraction',
    difficultyLevel: 2,
    correctAnswer: '6',
  },
  // Year 2 - Addition
  {
    id: 'local-y2-add-1',
    questionText: 'What is 15 + 12?',
    yearGroup: 'Year 2',
    subject: 'Addition',
    difficultyLevel: 1,
    correctAnswer: '27',
  },
  {
    id: 'local-y2-add-2',
    questionText: 'What is 25 + 15?',
    yearGroup: 'Year 2',
    subject: 'Addition',
    difficultyLevel: 1,
    correctAnswer: '40',
  },
  // Year 2 - Multiplication
  {
    id: 'local-y2-mult-1',
    questionText: 'What is 2 × 5?',
    yearGroup: 'Year 2',
    subject: 'Multiplication',
    difficultyLevel: 1,
    correctAnswer: '10',
  },
  {
    id: 'local-y2-mult-2',
    questionText: 'What is 5 × 5?',
    yearGroup: 'Year 2',
    subject: 'Multiplication',
    difficultyLevel: 2,
    correctAnswer: '25',
  },
  // Year 3 - Multiplication
  {
    id: 'local-y3-mult-1',
    questionText: 'What is 6 × 4?',
    yearGroup: 'Year 3',
    subject: 'Multiplication',
    difficultyLevel: 1,
    correctAnswer: '24',
  },
  {
    id: 'local-y3-mult-2',
    questionText: 'What is 7 × 7?',
    yearGroup: 'Year 3',
    subject: 'Multiplication',
    difficultyLevel: 2,
    correctAnswer: '49',
  },
  // Year 3 - Division
  {
    id: 'local-y3-div-1',
    questionText: 'What is 12 ÷ 3?',
    yearGroup: 'Year 3',
    subject: 'Division',
    difficultyLevel: 1,
    correctAnswer: '4',
  },
  {
    id: 'local-y3-div-2',
    questionText: 'What is 24 ÷ 6?',
    yearGroup: 'Year 3',
    subject: 'Division',
    difficultyLevel: 2,
    correctAnswer: '4',
  },
  // Year 4 - Fractions
  {
    id: 'local-y4-frac-1',
    questionText: 'What is 1/2 + 1/2?',
    yearGroup: 'Year 4',
    subject: 'Fractions',
    difficultyLevel: 1,
    correctAnswer: '1',
  },
  {
    id: 'local-y4-frac-2',
    questionText: 'What is 1/4 + 1/4?',
    yearGroup: 'Year 4',
    subject: 'Fractions',
    difficultyLevel: 2,
    correctAnswer: '1/2',
  },
  // Year 4 - Multiplication
  {
    id: 'local-y4-mult-1',
    questionText: 'What is 12 × 8?',
    yearGroup: 'Year 4',
    subject: 'Multiplication',
    difficultyLevel: 2,
    correctAnswer: '96',
  },
  {
    id: 'local-y4-mult-2',
    questionText: 'What is 25 × 4?',
    yearGroup: 'Year 4',
    subject: 'Multiplication',
    difficultyLevel: 2,
    correctAnswer: '100',
  },
  // Year 5 - Decimals
  {
    id: 'local-y5-dec-1',
    questionText: 'What is 2.5 + 3.7?',
    yearGroup: 'Year 5',
    subject: 'Decimals',
    difficultyLevel: 2,
    correctAnswer: '6.2',
  },
  {
    id: 'local-y5-dec-2',
    questionText: 'What is 3.5 × 2?',
    yearGroup: 'Year 5',
    subject: 'Decimals',
    difficultyLevel: 2,
    correctAnswer: '7',
  },
  // Year 5 - Fractions
  {
    id: 'local-y5-frac-1',
    questionText: 'What is 1/3 + 1/6?',
    yearGroup: 'Year 5',
    subject: 'Fractions',
    difficultyLevel: 2,
    correctAnswer: '1/2',
  },
  {
    id: 'local-y5-frac-2',
    questionText: 'What is 2/3 × 6?',
    yearGroup: 'Year 5',
    subject: 'Fractions',
    difficultyLevel: 2,
    correctAnswer: '4',
  },
  // Year 6 - Percentages
  {
    id: 'local-y6-perc-1',
    questionText: 'What is 25% of 80?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 2,
    correctAnswer: '20',
  },
  {
    id: 'local-y6-perc-2',
    questionText: 'What is 50% of 120?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 1,
    correctAnswer: '60',
  },
  {
    id: 'local-y6-perc-3',
    questionText: 'What is 10% of 200?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 1,
    correctAnswer: '20',
  },
  {
    id: 'local-y6-perc-4',
    questionText: 'What is 75% of 40?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 2,
    correctAnswer: '30',
  },
  {
    id: 'local-y6-perc-5',
    questionText: 'What is 20% of 150?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 2,
    correctAnswer: '30',
  },
  {
    id: 'local-y6-perc-6',
    questionText: 'What is 30% of 100?',
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficultyLevel: 1,
    correctAnswer: '30',
  },
  // Year 6 - Fractions
  {
    id: 'local-y6-frac-1',
    questionText: 'What is 2/3 + 1/6?',
    yearGroup: 'Year 6',
    subject: 'Fractions',
    difficultyLevel: 2,
    correctAnswer: '5/6',
  },
  {
    id: 'local-y6-frac-2',
    questionText: 'What is 1/2 × 3/4?',
    yearGroup: 'Year 6',
    subject: 'Fractions',
    difficultyLevel: 3,
    correctAnswer: '3/8',
  },
  // Year 6 - Ratio
  {
    id: 'local-y6-ratio-1',
    questionText: 'In the ratio 2:3, if the first number is 6, what is the second?',
    yearGroup: 'Year 6',
    subject: 'Ratio',
    difficultyLevel: 2,
    correctAnswer: '9',
  },
  {
    id: 'local-y6-ratio-2',
    questionText: 'Simplify the ratio 4:8',
    yearGroup: 'Year 6',
    subject: 'Ratio',
    difficultyLevel: 2,
    correctAnswer: '1:2',
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
