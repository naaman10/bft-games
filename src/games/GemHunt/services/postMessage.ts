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
  'https://localhost:3000',
  'https://learn.brighterfuturestutoring.com',
];

function allowedOrigins(): string[] {
  const fromEnv = import.meta.env.VITE_PARENT_ORIGINS?.split(',')
    .map((o: string) => o.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_ALLOWED_ORIGINS;
}

export function isAllowedParentOrigin(origin: string): boolean {
  if (!origin) return false;
  if (allowedOrigins().includes(origin)) return true;
  // Allow Neon/Vercel Learn preview hosts during testing
  try {
    const host = new URL(origin).hostname;
    return (
      host === 'localhost' ||
      host.endsWith('.vercel.app') ||
      host.endsWith('brighterfuturestutoring.com')
    );
  } catch {
    return false;
  }
}

export function isEmbeddedInParent(): boolean {
  try {
    return window.parent !== window;
  } catch {
    return true;
  }
}

/**
 * Notify the Learn parent. GAME_READY uses "*" so localhost / preview
 * hosts still receive it; later messages prefer a known Learn origin.
 */
export function postToParent(
  message: GameToParentMessage,
  targetOrigin?: string
) {
  if (!isEmbeddedInParent()) return;

  if (message.type === 'GAME_READY') {
    window.parent.postMessage(message, '*');
    return;
  }

  const origins = allowedOrigins();
  const preferred =
    targetOrigin ||
    origins.find((o) => o.includes('brighterfutures')) ||
    document.referrer ||
    '*';

  let target = '*';
  try {
    target = preferred.startsWith('http')
      ? new URL(preferred).origin
      : preferred;
  } catch {
    target = '*';
  }

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
