import { useEffect, useRef, useState } from 'react';
import { GameProps } from '../../types/game';
import PlatformPhase from './components/PlatformPhase';
import QuestionPhase from './components/QuestionPhase';
import SubjectSelector from './components/SubjectSelector';
import StartScreen from './components/StartScreen';
import { useGameSession } from './hooks/useGameSession';
import { notifyGameComplete } from './services/postMessage';
import { GAME_CONSTANTS } from './game/config';
import { TOTAL_LEVELS, getLevel } from './game/levels';
import './GemHunt.css';

type Phase = 'start' | 'selectSubject' | 'boot' | 'questions' | 'platform' | 'levelComplete' | 'victory' | 'gameOver';

const GemHunt: React.FC<GameProps> = ({ onComplete, onScore }) => {
  const session = useGameSession();
  const [phase, setPhase] = useState<Phase>('start');
  const [questionKey, setQuestionKey] = useState(0);
  const [lives, setLives] = useState(GAME_CONSTANTS.STARTING_LIVES);
  const [movesRemaining, setMovesRemaining] = useState(0);
  const [totalSuns, setTotalSuns] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevelName, setCompletedLevelName] = useState('');
  const [showStartScreen, setShowStartScreen] = useState(true);
  const livesRef = useRef(lives);
  const movesRef = useRef(movesRemaining);
  const sunsRef = useRef(totalSuns);
  const levelRef = useRef(currentLevel);
  const platformSunsBaseRef = useRef(0);
  const hydratedSessionId = useRef<string | null>(null);
  
  // Check for saved session
  const hasSavedSession = Boolean(
    typeof window !== 'undefined' && localStorage.getItem('gemHunt_lastSession')
  );

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    movesRef.current = movesRemaining;
  }, [movesRemaining]);

  useEffect(() => {
    sunsRef.current = totalSuns;
  }, [totalSuns]);

  useEffect(() => {
    levelRef.current = currentLevel;
  }, [currentLevel]);

  // Check if we should skip start screen (embedded or has params)
  useEffect(() => {
    if (!session.ready) return;
    
    // Skip start screen if embedded with auth or has query params
    if (session.mode === 'authenticated' || !session.needsSelection) {
      setShowStartScreen(false);
    }
  }, [session.ready, session.mode, session.needsSelection]);

  // Hydrate once per session id (covers local start + later auth upgrade)
  useEffect(() => {
    if (!session.ready) return;
    if (session.mode === 'error') {
      setPhase('boot');
      return;
    }
    if (!session.sessionId) return;
    if (hydratedSessionId.current === session.sessionId) return;
    if (showStartScreen && phase === 'start') return; // Don't hydrate until past start screen

    hydratedSessionId.current = session.sessionId;
    setLives(session.lives);
    setTotalSuns(session.totalGems);
    platformSunsBaseRef.current = session.totalGems;
    setCurrentLevel(Math.min(Math.max(1, session.currentLevel || 1), TOTAL_LEVELS));
    setQuestionKey((k) => k + 1);

    // Save session info for "Continue" feature
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemHunt_lastSession', JSON.stringify({
        yearGroup: session.yearGroup,
        subject: session.subject,
        timestamp: Date.now(),
      }));
    }

    if (session.mode === 'local') {
      setMovesRemaining(GAME_CONSTANTS.UNLIMITED_MOVES);
      setPhase('platform');
      return;
    }

    setMovesRemaining(session.movesRemaining);
    setPhase(session.movesRemaining > 0 ? 'platform' : 'questions');
  }, [
    session.ready,
    session.mode,
    session.sessionId,
    session.lives,
    session.movesRemaining,
    session.totalGems,
    session.currentLevel,
    session.yearGroup,
    session.subject,
    showStartScreen,
    phase,
  ]);

  const endGame = () => {
    setPhase('gameOver');
    onComplete?.();
    if (session.sessionId) {
      notifyGameComplete({
        sessionId: session.sessionId,
        totalGems: sunsRef.current,
        lives: livesRef.current,
      });
      void session.syncProgress({
        livesRemaining: livesRef.current,
        movesRemaining: 0,
        totalGems: sunsRef.current,
        currentLevel: levelRef.current,
        completed: true,
      });
    }
  };

  const handleBatchComplete = (movesEarned: number) => {
    if (livesRef.current <= 0) {
      endGame();
      return;
    }

    if (movesEarned <= 0) {
      setQuestionKey((k) => k + 1);
      setPhase('questions');
      return;
    }

    const nextMoves = movesRef.current + movesEarned;
    setMovesRemaining(nextMoves);
    platformSunsBaseRef.current = sunsRef.current;
    void session.syncProgress({
      movesRemaining: nextMoves,
      livesRemaining: livesRef.current,
      totalGems: sunsRef.current,
      currentLevel: levelRef.current,
    });
    setPhase('platform');
  };

  const handleLifeLost = () => {
    if (session.mode === 'local') return;

    const next = Math.max(0, livesRef.current - 1);
    setLives(next);
    void session.syncProgress({
      livesRemaining: next,
      movesRemaining: movesRef.current,
      totalGems: sunsRef.current,
      currentLevel: levelRef.current,
    });

    if (next <= 0) {
      endGame();
    }
  };

  const handleMovesExhausted = () => {
    setMovesRemaining(0);
    void session.syncProgress({
      movesRemaining: 0,
      livesRemaining: livesRef.current,
      totalGems: sunsRef.current,
      currentLevel: levelRef.current,
    });

    if (livesRef.current <= 0) {
      endGame();
      return;
    }

    setQuestionKey((k) => k + 1);
    setPhase('questions');
  };

  const handleSunsCollected = (count: number) => {
    const next = platformSunsBaseRef.current + count;
    setTotalSuns(next);
    sunsRef.current = next;
    onScore?.(next);
    void session.syncProgress({
      totalGems: next,
      movesRemaining: movesRef.current,
      livesRemaining: livesRef.current,
      currentLevel: levelRef.current,
    });
  };

  const handleLevelComplete = (payload: { level: number; suns: number }) => {
    const levelDef = getLevel(payload.level);
    setCompletedLevelName(levelDef.theme.name);

    const nextSuns = platformSunsBaseRef.current + payload.suns;
    setTotalSuns(nextSuns);
    sunsRef.current = nextSuns;

    if (payload.level >= TOTAL_LEVELS) {
      setPhase('victory');
      onComplete?.();
      if (session.sessionId) {
        notifyGameComplete({
          sessionId: session.sessionId,
          totalGems: nextSuns,
          lives: livesRef.current,
        });
        void session.syncProgress({
          livesRemaining: livesRef.current,
          movesRemaining: movesRef.current,
          totalGems: nextSuns,
          currentLevel: TOTAL_LEVELS,
          completed: true,
        });
      }
      return;
    }

    const nextLevel = payload.level + 1;
    setCurrentLevel(nextLevel);
    levelRef.current = nextLevel;

    if (session.mode === 'local') {
      setMovesRemaining(GAME_CONSTANTS.UNLIMITED_MOVES);
      platformSunsBaseRef.current = nextSuns;
      setPhase('levelComplete');
      return;
    }

    setMovesRemaining(0);
    setPhase('levelComplete');
    void session.syncProgress({
      currentLevel: nextLevel,
      movesRemaining: 0,
      livesRemaining: livesRef.current,
      totalGems: nextSuns,
    });
  };

  const continueAfterLevel = () => {
    if (session.mode === 'local') {
      platformSunsBaseRef.current = sunsRef.current;
      setMovesRemaining(GAME_CONSTANTS.UNLIMITED_MOVES);
      setPhase('platform');
      return;
    }
    setQuestionKey((k) => k + 1);
    setPhase('questions');
  };

  const handlePlayAgain = async () => {
    hydratedSessionId.current = null;
    setLives(GAME_CONSTANTS.STARTING_LIVES);
    setTotalSuns(0);
    setCurrentLevel(1);
    await session.startFreshSession();
    if (session.mode === 'local' || !session.token) {
      setMovesRemaining(GAME_CONSTANTS.UNLIMITED_MOVES);
      platformSunsBaseRef.current = 0;
      setPhase('platform');
      return;
    }
    setMovesRemaining(0);
    setQuestionKey((k) => k + 1);
    setPhase('questions');
  };

  // Show subject selector if needed
  if (session.needsSelection) {
    return (
      <div className="gem-hunt">
        <SubjectSelector onSelect={session.startWithSelection} />
      </div>
    );
  }

  if (!session.ready || (phase === 'boot' && session.mode !== 'error')) {
    return (
      <div className="gem-hunt">
        <div className="game-boot">
          <img src="/assets/Misc/ui/bft-sun-64.png" alt="" />
          <h2>Gem Hunt</h2>
          <p>Getting your session ready…</p>
        </div>
      </div>
    );
  }

  if (session.mode === 'error') {
    return (
      <div className="gem-hunt">
        <div className="game-over">
          <h2>Couldn’t start session</h2>
          <p>{session.error || 'Please try again from Brighter Futures Learn.'}</p>
          <button
            type="button"
            className="game-over-btn"
            onClick={() => {
              window.location.href = window.location.pathname;
            }}
          >
            Try local play
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'gameOver') {
    return (
      <div className="gem-hunt">
        <div className="game-over">
          <h2>Game Over</h2>
          <p>You ran out of lives.</p>
          <p>Suns collected: {totalSuns}</p>
          <p>Reached level {currentLevel}</p>
          {session.mode === 'authenticated' && (
            <p className="game-over-meta">Session saved</p>
          )}
          <button type="button" className="game-over-btn" onClick={() => void handlePlayAgain()}>
            Play again
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'victory') {
    return (
      <div className="gem-hunt">
        <div className="game-over">
          <h2>You did it!</h2>
          <p>All {TOTAL_LEVELS} environments cleared.</p>
          <p>Suns collected: {totalSuns}</p>
          {session.mode === 'authenticated' && (
            <p className="game-over-meta">Session saved</p>
          )}
          <button type="button" className="game-over-btn" onClick={() => void handlePlayAgain()}>
            Play again
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'levelComplete') {
    const next = getLevel(currentLevel);
    const isLocal = session.mode === 'local';
    return (
      <div className="gem-hunt">
        <div className="game-over">
          <h2>{completedLevelName} cleared!</h2>
          <p>
            Next up: Level {next.id} — {next.theme.name}
          </p>
          <p>
            {isLocal
              ? 'Local test mode — unlimited lives & moves.'
              : 'Answer questions to earn moves for the longer run ahead.'}
          </p>
          <button type="button" className="game-over-btn" onClick={continueAfterLevel}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  const handleChangeSubject = () => {
    // Clear all query params and reload to show selector
    window.location.href = window.location.pathname;
  };

  const handleNewGame = () => {
    setShowStartScreen(false);
    setPhase('selectSubject');
  };

  const handleContinue = () => {
    setShowStartScreen(false);
    
    // Load last session from localStorage
    const lastSession = localStorage.getItem('gemHunt_lastSession');
    if (lastSession) {
      const { yearGroup, subject } = JSON.parse(lastSession);
      void session.startWithSelection(yearGroup, subject);
    } else {
      // No saved session, go to selector
      setPhase('selectSubject');
    }
  };

  // Show start screen first (unless embedded/authenticated)
  if (showStartScreen && phase === 'start' && session.ready) {
    return (
      <div className="gem-hunt">
        <StartScreen 
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          hasSavedSession={hasSavedSession}
        />
      </div>
    );
  }

  // Show subject selector if needed
  if (phase === 'selectSubject' || (session.needsSelection && !showStartScreen)) {
    return (
      <div className="gem-hunt">
        <SubjectSelector onSelect={session.startWithSelection} />
      </div>
    );
  }

  return (
    <div className="gem-hunt">
      {/* Always show banner with subject info and change button */}
      {(phase === 'questions' || phase === 'platform') && session.ready && (
        <div className="session-banner" role="status">
          {session.mode === 'local' && 'Local test — unlimited lives & moves • '}
          {session.yearGroup} • {session.subject}
          <button 
            onClick={handleChangeSubject}
            style={{ 
              marginLeft: '1rem', 
              padding: '0.25rem 0.75rem',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Change Subject
          </button>
        </div>
      )}

      {phase === 'questions' && (
        <QuestionPhase
          key={questionKey}
          yearGroup={session.yearGroup}
          subject={session.subject}
          lives={lives}
          sessionId={session.sessionId}
          token={session.token}
          onLifeLost={handleLifeLost}
          onBatchComplete={handleBatchComplete}
        />
      )}

      {phase === 'platform' && (
        <PlatformPhase
          levelNumber={currentLevel}
          movesRemaining={movesRemaining}
          unlimited={session.mode === 'local'}
          onMovesExhausted={handleMovesExhausted}
          onSunsCollected={handleSunsCollected}
          onLifeLost={handleLifeLost}
          onLevelComplete={handleLevelComplete}
        />
      )}
    </div>
  );
};

export default GemHunt;
