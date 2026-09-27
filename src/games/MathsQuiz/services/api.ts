import { QuizQuestion, QuizAnswer, QuizConfig, QuizResult, StudentQuizHistory } from '../types/quiz';

let apiBase =
  import.meta.env.VITE_BFT_API_URL?.replace(/\/$/, '') || 'http://localhost:4000';

function authHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function apiFetch(
  path: string,
  options: RequestInit & { token?: string | null } = {}
) {
  const { token, ...init } = options;
  const res = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      ...authHeaders(token),
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${init.method || 'GET'} ${path} → ${res.status} ${body}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

/**
 * Get available year groups
 */
export async function getYearGroups(token?: string | null): Promise<string[]> {
  try {
    const data = await apiFetch('/quiz/year-groups', { token }) as { yearGroups: string[] };
    return data.yearGroups;
  } catch (error) {
    console.warn('[Quiz API] Failed to fetch year groups, using defaults:', error);
    return ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];
  }
}

/**
 * Get available subjects for a year group
 */
export async function getSubjects(yearGroup: string, token?: string | null): Promise<string[]> {
  try {
    const params = new URLSearchParams({ yearGroup });
    const data = await apiFetch(`/quiz/subjects?${params}`, { token }) as { subjects: string[] };
    return data.subjects;
  } catch (error) {
    console.warn('[Quiz API] Failed to fetch subjects, using defaults:', error);
    return ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Decimals', 'Percentages'];
  }
}

/**
 * Generate quiz questions
 */
export async function generateQuiz(
  config: QuizConfig,
  token?: string | null
): Promise<{ quizId: string; questions: QuizQuestion[] }> {
  try {
    const data = await apiFetch('/quiz/generate', {
      method: 'POST',
      token,
      body: JSON.stringify(config),
    }) as { quizId: string; questions: QuizQuestion[] };
    
    return data;
  } catch (error) {
    console.error('[Quiz API] Failed to generate quiz:', error);
    throw new Error('Failed to generate quiz. Please try again.');
  }
}

/**
 * Validate a single answer
 */
export async function validateAnswer(
  questionId: string,
  answer: string,
  token?: string | null
): Promise<{ correct: boolean; correctAnswer: string; explanation?: string }> {
  try {
    const data = await apiFetch('/quiz/validate-answer', {
      method: 'POST',
      token,
      body: JSON.stringify({ questionId, answer }),
    }) as { correct: boolean; correctAnswer: string; explanation?: string };
    
    return data;
  } catch (error) {
    console.error('[Quiz API] Failed to validate answer:', error);
    throw new Error('Failed to validate answer');
  }
}

/**
 * Submit quiz results (requires authentication)
 */
export async function submitQuizResults(
  result: QuizResult,
  responses: QuizAnswer[],
  token: string
): Promise<{ id: string; scorePercentage: number; message: string }> {
  try {
    const data = await apiFetch('/quiz/submit', {
      method: 'POST',
      token,
      body: JSON.stringify({
        yearGroup: result.yearGroup,
        subject: result.subject,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.incorrectAnswers,
        timeTakenSeconds: result.timeTakenSeconds,
        startedAt: result.startedAt.toISOString(),
        responses: responses.map(r => ({
          questionId: r.questionId,
          userAnswer: r.userAnswer,
          isCorrect: r.isCorrect,
          timeTakenSeconds: r.timeTakenSeconds,
        })),
      }),
    }) as { id: string; scorePercentage: number; message: string };
    
    return data;
  } catch (error) {
    console.error('[Quiz API] Failed to submit results:', error);
    throw new Error('Failed to submit quiz results');
  }
}

/**
 * Get student quiz history
 */
export async function getQuizHistory(
  token: string,
  limit: number = 20
): Promise<StudentQuizHistory[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    const data = await apiFetch(`/quiz/history?${params}`, { token }) as { results: StudentQuizHistory[] };
    return data.results;
  } catch (error) {
    console.error('[Quiz API] Failed to fetch quiz history:', error);
    return [];
  }
}
