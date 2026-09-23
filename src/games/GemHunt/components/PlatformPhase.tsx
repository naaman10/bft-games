import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GAME_CONFIG } from '../game/config';
import './PlatformPhase.css';

interface PlatformPhaseProps {
  movesRemaining: number;
  onMovesExhausted: () => void;
  onSunsCollected?: (count: number) => void;
}

const PlatformPhase: React.FC<PlatformPhaseProps> = ({
  movesRemaining,
  onMovesExhausted,
  onSunsCollected,
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const exhaustedRef = useRef(onMovesExhausted);
  const sunsRef = useRef(onSunsCollected);

  useEffect(() => {
    exhaustedRef.current = onMovesExhausted;
  }, [onMovesExhausted]);

  useEffect(() => {
    sunsRef.current = onSunsCollected;
  }, [onSunsCollected]);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Phaser.Game({
      ...GAME_CONFIG,
      parent: containerRef.current,
    });
    gameRef.current = game;

    game.registry.set('movesRemaining', movesRemaining);

    const onExhausted = () => exhaustedRef.current();
    const onSuns = (count: number) => sunsRef.current?.(count);

    game.events.on('moves-exhausted', onExhausted);
    game.events.on('suns-collected', onSuns);

    return () => {
      game.events.off('moves-exhausted', onExhausted);
      game.events.off('suns-collected', onSuns);
      game.destroy(true);
      gameRef.current = null;
    };
    // Remount when move budget changes so a fresh scene starts with new moves
  }, [movesRemaining]);

  return (
    <div className="platform-phase">
      <div className="game-container" ref={containerRef} id="phaser-game-container" />
    </div>
  );
};

export default PlatformPhase;
