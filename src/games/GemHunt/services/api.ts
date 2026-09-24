import { Question } from '../types/game';
import { GAME_CONSTANTS } from '../game/config';
import {
  getLocalCorrectAnswer,
  pickLocalQuestions,
} from '../data/localQuestions';

let apiBase =
  import.meta.env.VITE_BFT_API_URL?.replace(/\/$/, '') || 'http://localhost:4000';

export type AnswerResult = {
  correct: boolean;
  correctAnswer: string;
  movesEarned: number;
};

export type GemHuntSession = {
  id: string;
  studentId: string;
  yearGroup: string;
  subject: string;
  currentLevel: number;
  totalGems: number;
  livesRemaining: number;
  movesRemaining: number;
  startedAt: string;
  lastPlayedAt: string;
  completed: boolean;
  completedAt: string | null;
};

export type SessionProgressUpdate = {
  currentLevel?: number;
  totalGems?: number;
  livesRemaining?: number;
  movesRemaining?: number;
  completed?: boolean;
};

export function setApiBaseUrl(url: string) {
  apiBase = url.replace(/\/$/, '');
}

export function getApiBaseUrl() {
  return apiBase;
}

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

export async function createSession(options: {
  yearGroup: string;
  subject: string;
  token: string;
}): Promise<GemHuntSession> {
  return apiFetch('/gem-hunt/sessions', {
    method: 'POST',
    token: options.token,
    body: JSON.stringify({
      yearGroup: options.yearGroup,
      subject: options.subject,
    }),
  }) as Promise<GemHuntSession>;
}

export async function getSession(options: {
  sessionId: string;
  token: string;
}): Promise<GemHuntSession> {
  return apiFetch(`/gem-hunt/sessions/${options.sessionId}`, {
    token: options.token,
  }) as Promise<GemHuntSession>;
}

export async function updateSession(options: {
  sessionId: string;
  token: string;
  updates: SessionProgressUpdate;
}): Promise<GemHuntSession> {
  return apiFetch(`/gem-hunt/sessions/${options.sessionId}`, {
    method: 'PATCH',
    token: options.token,
    body: JSON.stringify(options.updates),
  }) as Promise<GemHuntSession>;
}

/**
 * Fetch a batch of questions. Falls back to the local bank if the API
 * is unreachable or unauthenticated (typical in local solo play).
 */
export async function fetchQuestions(options: {
  yearGroup: string;
  subject: string;
  count?: number;
  token?: string | null;
}): Promise<Question[]> {
  const { yearGroup, subject, count = 5, token } = options;

  // Always use local questions in local mode (no token)
  if (!token) {
    console.log('[API] No token - using local questions');
    return pickLocalQuestions(yearGroup, subject, count);
  }

  try {
    const params = new URLSearchParams({
      yearGroup,
      subject,
      count: String(count),
    });
    const url = `/gem-hunt/questions?${params}`;
    console.log(`[API] Fetching questions from ${apiBase}${url}`);
    
    const data = (await apiFetch(url, {
      token,
    })) as { questions: Question[] };

    if (!data.questions?.length) {
      console.error('[API] Empty questions response from server');
      throw new Error('Empty questions response');
    }
    
    console.log(`[API] Successfully fetched ${data.questions.length} questions from database`);
    return data.questions;
  } catch (err) {
    console.error('[API] Failed to fetch from database:', err);
    console.warn(`[API] Falling back to local question bank for ${yearGroup} ${subject}`);
    return pickLocalQuestions(yearGroup, subject, count);
  }
}

/**
 * Validate an answer via API when possible; otherwise check locally.
 */
export async function validateAnswer(options: {
  sessionId: string | null;
  questionId: string;
  answer: string;
  token?: string | null;
}): Promise<AnswerResult> {
  const { sessionId, questionId, answer, token } = options;

  if (sessionId && token && !sessionId.startsWith('local-')) {
    try {
      return (await apiFetch('/gem-hunt/questions/validate', {
        method: 'POST',
        token,
        body: JSON.stringify({ sessionId, questionId, answer }),
      })) as AnswerResult;
    } catch (err) {
      console.warn('Validate API failed, checking locally:', err);
    }
  }

  const correctAnswer = getLocalCorrectAnswer(questionId);
  if (!correctAnswer) {
    return { correct: false, correctAnswer: '?', movesEarned: 0 };
  }

  const correct =
    answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  return {
    correct,
    correctAnswer,
    movesEarned: correct ? GAME_CONSTANTS.MOVES_PER_CORRECT_ANSWER : 0,
  };
}
