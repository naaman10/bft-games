import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GAME_CONFIG } from '../game/config';
import './PlatformPhase.css';

interface PlatformPhaseProps {
  movesRemaining: number;
  onMovesExhausted: () => void;
}

const PlatformPhase: React.FC<PlatformPhaseProps> = ({ movesRemaining, onMovesExhausted }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Phaser game
    gameRef.current = new Phaser.Game({
      ...GAME_CONFIG,
      parent: containerRef.current,
    });

    console.log('Phaser game initialized');

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="platform-phase">
      <div className="game-container" ref={containerRef} id="phaser-game-container" />
    </div>
  );
};

export default PlatformPhase;
