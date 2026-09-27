import { useEffect, useRef, useState, useCallback } from 'react';
import {
  isAllowedParentOrigin,
  isEmbeddedInParent,
  notifyGameReady,
  type InitGamePayload,
  type ParentToGameMessage,
} from '../services/postMessage';

export type QuizAuth = {
  token: string | null;
  apiBaseUrl: string | null;
  username: string | null;
  yearGroup: string | null;
  subject: string | null;
  isAuthenticated: boolean;
  ready: boolean;
};

function readQueryBootstrap(): Partial<InitGamePayload> {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || undefined;
  const yearGroup = params.get('yearGroup') || undefined;
  const subject = params.get('subject') || undefined;
  const apiBaseUrl = params.get('apiBaseUrl') || undefined;
  const username = params.get('username') || undefined;
  return { token, yearGroup, subject, apiBaseUrl, username };
}

export function useQuizAuth(): QuizAuth {
  const [token, setToken] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [yearGroup, setYearGroup] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const tokenRef = useRef<string | null>(null);
  const bootstrapped = useRef(false);

  const applyAuthPayload = useCallback((payload: InitGamePayload) => {
    console.log('[MathsQuiz] Received INIT_GAME:', payload);
    
    if (payload.apiBaseUrl) {
      setApiBaseUrl(payload.apiBaseUrl);
    }

    setToken(payload.token);
    tokenRef.current = payload.token;

    if (payload.username) {
      setUsername(payload.username);
    }

    if (payload.yearGroup) {
      setYearGroup(payload.yearGroup);
    }

    if (payload.subject) {
      setSubject(payload.subject);
    }

    console.log('[MathsQuiz] Authentication configured:', {
      hasToken: !!payload.token,
      apiBaseUrl: payload.apiBaseUrl,
      username: payload.username,
    });

    setReady(true);
  }, []);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    console.log('[MathsQuiz] Component mounted');

    const handleMessage = (event: MessageEvent) => {
      console.log('[MathsQuiz] Received postMessage:', {
        type: event.data?.type,
        origin: event.origin,
        hasToken: !!event.data?.payload?.token,
      });

      if (!isAllowedParentOrigin(event.origin)) {
        console.warn('[MathsQuiz] Ignored message from origin:', event.origin);
        return;
      }

      const data = event.data as ParentToGameMessage | undefined;
      if (!data || typeof data !== 'object' || !('type' in data)) {
        console.log('[MathsQuiz] Invalid message data');
        return;
      }

      if (data.type === 'INIT_GAME' && data.payload?.token) {
        console.log('[MathsQuiz] INIT_GAME received with token! Applying auth payload');
        applyAuthPayload(data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Send GAME_READY to parent
    console.log('[MathsQuiz] Sending GAME_READY to parent');
    notifyGameReady();

    // Check for query params
    const query = readQueryBootstrap();
    if (query.token) {
      applyAuthPayload(query as InitGamePayload);
    } else if (isEmbeddedInParent()) {
      // Wait for Learn's INIT_GAME before falling back to guest mode
      console.log('[MathsQuiz] Waiting for INIT_GAME from parent...');
      window.setTimeout(() => {
        if (!tokenRef.current) {
          console.warn('[MathsQuiz] No INIT_GAME received from parent; starting in guest mode');
          setReady(true);
        }
      }, 3000);
    } else {
      // Standalone mode
      setReady(true);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [applyAuthPayload]);

  return {
    token,
    apiBaseUrl,
    username,
    yearGroup,
    subject,
    isAuthenticated: !!token,
    ready,
  };
}
