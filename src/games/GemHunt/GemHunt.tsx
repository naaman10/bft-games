import { useEffect, useRef, useState } from 'react';
import { GameProps } from '../../types/game';
import PlatformPhase from './components/PlatformPhase';
import QuestionPhase from './components/QuestionPhase';
import { useGameSession } from './hooks/useGameSession';
import { notifyGameComplete } from './services/postMessage';
import { GAME_CONSTANTS } from './game/config';
import './GemHunt.css';

type Phase = 'boot' | 'questions' | 'platform' | 'gameOver';

const GemHunt: React.FC<GameProps> = ({ onComplete, onScore }) => {
  const session = useGameSession();
  const [phase, setPhase] = useState<Phase>('boot');
  const [questionKey, setQuestionKey] = useState(0);
  const [lives, setLives] = useState(GAME_CONSTANTS.STARTING_LIVES);
  const [movesRemaining, setMovesRemaining] = useState(0);
  const [totalSuns, setTotalSuns] = useState(0);
  const livesRef = useRef(lives);
  const movesRef = useRef(movesRemaining);
  const sunsRef = useRef(totalSuns);
  const enteredRef = useRef(false);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    movesRef.current = movesRemaining;
  }, [movesRemaining]);

  useEffect(() => {
    sunsRef.current = totalSuns;
  }, [totalSuns]);

  // Hydrate local play state once session bootstrap completes
  useEffect(() => {
    if (!session.ready || enteredRef.current) return;
    if (session.mode === 'error') {
      setPhase('boot');
      return;
    }

    enteredRef.current = true;
    setLives(session.lives);
    setMovesRemaining(session.movesRemaining);
    setTotalSuns(session.totalGems);
    setPhase(session.movesRemaining > 0 ? 'platform' : 'questions');
  }, [session.ready, session.mode, session.lives, session.movesRemaining, session.totalGems]);

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
    void session.syncProgress({
      movesRemaining: nextMoves,
      livesRemaining: livesRef.current,
      totalGems: sunsRef.current,
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
    });
  };

  const handleMovesExhausted = () => {
    setMovesRemaining(0);
    void session.syncProgress({
      movesRemaining: 0,
      livesRemaining: livesRef.current,
      totalGems: sunsRef.current,
    });

    if (livesRef.current <= 0) {
      endGame();
      return;
    }

    setQuestionKey((k) => k + 1);
    setPhase('questions');
  };

  const handleSunsCollected = (count: number) => {
    const next = Math.max(sunsRef.current, count);
    setTotalSuns(next);
    onScore?.(next);
    void session.syncProgress({
      totalGems: next,
      movesRemaining: movesRef.current,
      livesRemaining: livesRef.current,
    });
  };

  const handlePlayAgain = async () => {
    enteredRef.current = false;
    setLives(GAME_CONSTANTS.STARTING_LIVES);
    setMovesRemaining(0);
    setTotalSuns(0);
    await session.startFreshSession();
    enteredRef.current = true;
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
              // Fall back to offline local session
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
          movesRemaining={movesRemaining}
          onMovesExhausted={handleMovesExhausted}
          onSunsCollected={handleSunsCollected}
        />
      )}
    </div>
  );
};

export default GemHunt;
