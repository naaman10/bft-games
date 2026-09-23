export type InitGamePayload = {
  userId?: string;
  username?: string;
  token: string;
  apiBaseUrl?: string;
  yearGroup?: string;
  subject?: string;
  sessionId?: string;
};

export type ParentToGameMessage =
  | { type: 'INIT_GAME'; payload: InitGamePayload }
  | { type: 'RESUME_SESSION'; payload: { sessionId: string } };

export type GameToParentMessage =
  | { type: 'GAME_READY'; payload?: Record<string, never> }
  | {
      type: 'PROGRESS_UPDATE';
      payload: {
        sessionId: string;
        level: number;
        gems: number;
        lives: number;
        moves: number;
      };
    }
  | {
      type: 'GAME_COMPLETE';
      payload: {
        sessionId: string;
        totalGems: number;
        lives: number;
      };
    };

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://learn.brighterfuturestutoring.com',
];

function allowedOrigins(): string[] {
  const fromEnv = import.meta.env.VITE_PARENT_ORIGINS?.split(',')
    .map((o: string) => o.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_ALLOWED_ORIGINS;
}

export function isAllowedParentOrigin(origin: string): boolean {
  if (import.meta.env.DEV && origin === window.location.origin) {
    return true;
  }
  return allowedOrigins().includes(origin);
}

export function postToParent(message: GameToParentMessage) {
  if (window.parent === window) return;

  const origins = allowedOrigins();
  // Prefer a configured Learn origin; fall back to wildcard only in local iframe tests
  const target = origins.find((o) => o.includes('brighterfutures')) || '*';
  window.parent.postMessage(message, target);
}

export function notifyGameReady() {
  postToParent({ type: 'GAME_READY', payload: {} });
}

export function notifyProgress(payload: {
  sessionId: string;
  level: number;
  gems: number;
  lives: number;
  moves: number;
}) {
  postToParent({ type: 'PROGRESS_UPDATE', payload });
}

export function notifyGameComplete(payload: {
  sessionId: string;
  totalGems: number;
  lives: number;
}) {
  postToParent({ type: 'GAME_COMPLETE', payload });
}
