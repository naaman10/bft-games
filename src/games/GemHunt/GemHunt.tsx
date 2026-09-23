import { useEffect, useRef, useState } from 'react';
import { GameProps } from '../../types/game';
import PlatformPhase from './components/PlatformPhase';
import QuestionPhase from './components/QuestionPhase';
import { useGameSession } from './hooks/useGameSession';
import { notifyGameComplete } from './services/postMessage';
import { GAME_CONSTANTS } from './game/config';
import { TOTAL_LEVELS, getLevel } from './game/levels';
import './GemHunt.css';

type Phase = 'boot' | 'questions' | 'platform' | 'levelComplete' | 'victory' | 'gameOver';

const GemHunt: React.FC<GameProps> = ({ onComplete, onScore }) => {
  const session = useGameSession();
  const [phase, setPhase] = useState<Phase>('boot');
  const [questionKey, setQuestionKey] = useState(0);
  const [lives, setLives] = useState(GAME_CONSTANTS.STARTING_LIVES);
  const [movesRemaining, setMovesRemaining] = useState(0);
  const [totalSuns, setTotalSuns] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevelName, setCompletedLevelName] = useState('');
  const livesRef = useRef(lives);
  const movesRef = useRef(movesRemaining);
  const sunsRef = useRef(totalSuns);
  const levelRef = useRef(currentLevel);
  const platformSunsBaseRef = useRef(0);
  const hydratedSessionId = useRef<string | null>(null);

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

  // Hydrate once per session id (covers local start + later auth upgrade)
  useEffect(() => {
    if (!session.ready) return;
    if (session.mode === 'error') {
      setPhase('boot');
      return;
    }
    if (!session.sessionId) return;
    if (hydratedSessionId.current === session.sessionId) return;

    hydratedSessionId.current = session.sessionId;
    setLives(session.lives);
    setMovesRemaining(session.movesRemaining);
    setTotalSuns(session.totalGems);
    platformSunsBaseRef.current = session.totalGems;
    setCurrentLevel(Math.min(Math.max(1, session.currentLevel || 1), TOTAL_LEVELS));
    setQuestionKey((k) => k + 1);
    setPhase(session.movesRemaining > 0 ? 'platform' : 'questions');
  }, [
    session.ready,
    session.mode,
    session.sessionId,
    session.lives,
    session.movesRemaining,
    session.totalGems,
    session.currentLevel,
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
    setQuestionKey((k) => k + 1);
    setPhase('questions');
  };

  const handlePlayAgain = async () => {
    hydratedSessionId.current = null;
    setLives(GAME_CONSTANTS.STARTING_LIVES);
    setMovesRemaining(0);
    setTotalSuns(0);
    setCurrentLevel(1);
    await session.startFreshSession();
    setQuestionKey((k) => k + 1);
    setPhase('questions');
  };

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
    return (
      <div className="gem-hunt">
        <div className="game-over">
          <h2>{completedLevelName} cleared!</h2>
          <p>
            Next up: Level {next.id} — {next.theme.name}
          </p>
          <p>Answer questions to earn moves for the longer run ahead.</p>
          <button type="button" className="game-over-btn" onClick={continueAfterLevel}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gem-hunt">
      {session.mode === 'local' && (
        <div className="session-banner" role="status">
          Local play — progress won’t sync until signed in via Learn
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
