import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createSession,
  getSession,
  setApiBaseUrl,
  updateSession,
  type GemHuntSession,
  type SessionProgressUpdate,
} from '../services/api';
import {
  isAllowedParentOrigin,
  isEmbeddedInParent,
  notifyGameReady,
  notifyProgress,
  type InitGamePayload,
  type ParentToGameMessage,
} from '../services/postMessage';
import { GAME_CONSTANTS } from '../game/config';

export type SessionMode = 'loading' | 'local' | 'authenticated' | 'error';

export type GameBootstrap = {
  mode: SessionMode;
  token: string | null;
  sessionId: string | null;
  yearGroup: string;
  subject: string;
  lives: number;
  movesRemaining: number;
  totalGems: number;
  currentLevel: number;
  error: string | null;
  ready: boolean;
  syncProgress: (updates: SessionProgressUpdate) => Promise<void>;
  startFreshSession: () => Promise<void>;
  applyAuthPayload: (payload: InitGamePayload) => Promise<void>;
};

const DEFAULT_YEAR = 'Year 6';
const DEFAULT_SUBJECT = 'Percentages';

function readQueryBootstrap(): Partial<InitGamePayload> {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || undefined;
  const sessionId = params.get('sessionId') || undefined;
  const yearGroup = params.get('yearGroup') || undefined;
  const subject = params.get('subject') || undefined;
  const apiBaseUrl = params.get('apiBaseUrl') || undefined;
  return { token, sessionId, yearGroup, subject, apiBaseUrl };
}

function toLocalSession(
  yearGroup: string,
  subject: string
): Pick<
  GemHuntSession,
  | 'id'
  | 'yearGroup'
  | 'subject'
  | 'livesRemaining'
  | 'movesRemaining'
  | 'totalGems'
  | 'currentLevel'
> {
  return {
    id: `local-${crypto.randomUUID()}`,
    yearGroup,
    subject,
    livesRemaining: GAME_CONSTANTS.STARTING_LIVES,
    movesRemaining: 0,
    totalGems: 0,
    currentLevel: 1,
  };
}

export function useGameSession(): GameBootstrap {
  const [mode, setMode] = useState<SessionMode>('loading');
  const [token, setToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [yearGroup, setYearGroup] = useState(DEFAULT_YEAR);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [lives, setLives] = useState(GAME_CONSTANTS.STARTING_LIVES);
  const [movesRemaining, setMovesRemaining] = useState(0);
  const [totalGems, setTotalGems] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const tokenRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const syncTimer = useRef<number | null>(null);
  const bootstrapped = useRef(false);

  const applySession = useCallback((session: {
    id: string;
    yearGroup: string;
    subject: string;
    livesRemaining: number;
    movesRemaining: number;
    totalGems: number;
    currentLevel: number;
  }) => {
    setSessionId(session.id);
    sessionIdRef.current = session.id;
    setYearGroup(session.yearGroup);
    setSubject(session.subject);
    setLives(session.livesRemaining);
    setMovesRemaining(session.movesRemaining);
    setTotalGems(session.totalGems);
    setCurrentLevel(session.currentLevel);
  }, []);

  const applyAuthPayload = useCallback(
    async (payload: InitGamePayload) => {
      if (payload.apiBaseUrl) {
        setApiBaseUrl(payload.apiBaseUrl);
      }

      const nextYear = payload.yearGroup || DEFAULT_YEAR;
      const nextSubject = payload.subject || DEFAULT_SUBJECT;
      setToken(payload.token);
      tokenRef.current = payload.token;
      setYearGroup(nextYear);
      setSubject(nextSubject);
      setError(null);

      try {
        let session: GemHuntSession;
        if (payload.sessionId) {
          session = await getSession({
            sessionId: payload.sessionId,
            token: payload.token,
          });
        } else {
          session = await createSession({
            yearGroup: nextYear,
            subject: nextSubject,
            token: payload.token,
          });
        }

        applySession(session);
        setMode('authenticated');
        setReady(true);
      } catch (err) {
        console.error('Failed to bootstrap authenticated session:', err);
        setError(err instanceof Error ? err.message : 'Session bootstrap failed');
        setMode('error');
        setReady(true);
      }
    },
    [applySession]
  );

  const startLocal = useCallback(() => {
    const local = toLocalSession(DEFAULT_YEAR, DEFAULT_SUBJECT);
    applySession(local);
    setToken(null);
    tokenRef.current = null;
    setMode('local');
    setReady(true);
  }, [applySession]);

  const startFreshSession = useCallback(async () => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      const local = toLocalSession(yearGroup, subject);
      applySession(local);
      setMode('local');
      return;
    }

    try {
      const session = await createSession({
        yearGroup,
        subject,
        token: currentToken,
      });
      applySession(session);
      setMode('authenticated');
    } catch (err) {
      console.error('Failed to create fresh session:', err);
      setError(err instanceof Error ? err.message : 'Could not create session');
      setMode('error');
    }
  }, [applySession, subject, yearGroup]);

  const syncProgress = useCallback(async (updates: SessionProgressUpdate) => {
    if (updates.livesRemaining !== undefined) setLives(updates.livesRemaining);
    if (updates.movesRemaining !== undefined) setMovesRemaining(updates.movesRemaining);
    if (updates.totalGems !== undefined) setTotalGems(updates.totalGems);
    if (updates.currentLevel !== undefined) setCurrentLevel(updates.currentLevel);

    const currentToken = tokenRef.current;
    const currentSessionId = sessionIdRef.current;

    if (
      currentToken &&
      currentSessionId &&
      !currentSessionId.startsWith('local-')
    ) {
      if (syncTimer.current) {
        window.clearTimeout(syncTimer.current);
      }

      syncTimer.current = window.setTimeout(async () => {
        try {
          await updateSession({
            sessionId: currentSessionId,
            token: currentToken,
            updates,
          });
        } catch (err) {
          console.warn('Failed to sync session progress:', err);
        }
      }, 300);
    }

    if (currentSessionId) {
      notifyProgress({
        sessionId: currentSessionId,
        level: updates.currentLevel ?? currentLevel,
        gems: updates.totalGems ?? totalGems,
        lives: updates.livesRemaining ?? lives,
        moves: updates.movesRemaining ?? movesRemaining,
      });
    }
  }, [currentLevel, lives, movesRemaining, totalGems]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const handleMessage = (event: MessageEvent) => {
      if (!isAllowedParentOrigin(event.origin)) {
        console.warn('Ignored message from origin:', event.origin);
        return;
      }
      const data = event.data as ParentToGameMessage | undefined;
      if (!data || typeof data !== 'object' || !('type' in data)) return;

      if (data.type === 'INIT_GAME' && data.payload?.token) {
        void applyAuthPayload(data.payload);
      }

      if (data.type === 'RESUME_SESSION' && data.payload?.sessionId) {
        const currentToken = tokenRef.current;
        if (!currentToken) return;
        void applyAuthPayload({
          token: currentToken,
          sessionId: data.payload.sessionId,
          yearGroup,
          subject,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    notifyGameReady();

    const query = readQueryBootstrap();
    if (query.token) {
      void applyAuthPayload(query as InitGamePayload);
    } else if (isEmbeddedInParent()) {
      // Wait for Learn's INIT_GAME before falling back to local play
      window.setTimeout(() => {
        if (!tokenRef.current) {
          console.warn('No INIT_GAME received from parent; starting local play');
          startLocal();
        }
      }, 3000);
    } else {
      startLocal();
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
    };
  }, [applyAuthPayload, startLocal, subject, yearGroup]);

  return {
    mode,
    token,
    sessionId,
    yearGroup,
    subject,
    lives,
    movesRemaining,
    totalGems,
    currentLevel,
    error,
    ready,
    syncProgress,
    startFreshSession,
    applyAuthPayload,
  };
}
