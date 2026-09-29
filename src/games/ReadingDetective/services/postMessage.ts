export type GameToParentMessage =
  | { type: 'GAME_READY'; payload?: Record<string, never> }
  | { type: 'GAME_COMPLETE'; payload: { caseId: string; score: number } };

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3000',
  'https://learn.brighterfuturestutoring.com',
];

function allowedOrigins(): string[] {
  const fromEnv = import.meta.env.VITE_PARENT_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_ALLOWED_ORIGINS;
}

function isEmbeddedInParent(): boolean {
  try {
    return window.parent !== window;
  } catch {
    return true;
  }
}

function postToParent(message: GameToParentMessage) {
  if (!isEmbeddedInParent()) return;

  if (message.type === 'GAME_READY') {
    window.parent.postMessage(message, '*');
    return;
  }

  const origins = allowedOrigins();
  const preferred =
    origins.find((origin) => origin.includes('brighterfutures')) ||
    document.referrer ||
    '*';

  let target = '*';
  try {
    target = preferred.startsWith('http') ? new URL(preferred).origin : preferred;
  } catch {
    target = '*';
  }

  window.parent.postMessage(message, target);
}

export function notifyGameReady() {
  postToParent({ type: 'GAME_READY', payload: {} });
}

export function notifyGameComplete(payload: { caseId: string; score: number }) {
  postToParent({ type: 'GAME_COMPLETE', payload });
}
