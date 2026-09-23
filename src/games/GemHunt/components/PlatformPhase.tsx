import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GAME_CONFIG } from '../game/config';
import './PlatformPhase.css';

interface PlatformPhaseProps {
  levelNumber: number;
  movesRemaining: number;
  onMovesExhausted: () => void;
  onSunsCollected?: (count: number) => void;
  onLifeLost?: () => void;
  onLevelComplete?: (payload: { level: number; suns: number }) => void;
}

const PlatformPhase: React.FC<PlatformPhaseProps> = ({
  levelNumber,
  movesRemaining,
  onMovesExhausted,
  onSunsCollected,
  onLifeLost,
  onLevelComplete,
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const exhaustedRef = useRef(onMovesExhausted);
  const sunsRef = useRef(onSunsCollected);
  const lifeLostRef = useRef(onLifeLost);
  const levelCompleteRef = useRef(onLevelComplete);

  useEffect(() => {
    exhaustedRef.current = onMovesExhausted;
  }, [onMovesExhausted]);

  useEffect(() => {
    sunsRef.current = onSunsCollected;
  }, [onSunsCollected]);

  useEffect(() => {
    lifeLostRef.current = onLifeLost;
  }, [onLifeLost]);

  useEffect(() => {
    levelCompleteRef.current = onLevelComplete;
  }, [onLevelComplete]);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Phaser.Game({
      ...GAME_CONFIG,
      parent: containerRef.current,
    });
    gameRef.current = game;

    game.registry.set('movesRemaining', movesRemaining);
    game.registry.set('levelNumber', levelNumber);

    const onExhausted = () => exhaustedRef.current();
    const onSuns = (count: number) => sunsRef.current?.(count);
    const onLife = () => lifeLostRef.current?.();
    const onComplete = (payload: { level: number; suns: number }) =>
      levelCompleteRef.current?.(payload);

    game.events.on('moves-exhausted', onExhausted);
    game.events.on('suns-collected', onSuns);
    game.events.on('life-lost', onLife);
    game.events.on('level-complete', onComplete);

    return () => {
      game.events.off('moves-exhausted', onExhausted);
      game.events.off('suns-collected', onSuns);
      game.events.off('life-lost', onLife);
      game.events.off('level-complete', onComplete);
      game.destroy(true);
      gameRef.current = null;
    };
  }, [movesRemaining, levelNumber]);

  return (
    <div className="platform-phase">
      <div className="game-container" ref={containerRef} id="phaser-game-container" />
    </div>
  );
};

export default PlatformPhase;
