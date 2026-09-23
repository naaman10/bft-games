import { useState } from 'react';
import { GameProps } from '../../types/game';
import PlatformPhase from './components/PlatformPhase';
import './GemHunt.css';

const GemHunt: React.FC<GameProps> = ({ onComplete, onScore }) => {
  const [phase, setPhase] = useState<'setup' | 'questions' | 'platform' | 'complete'>('platform');
  const [movesRemaining, setMovesRemaining] = useState(25);

  const handleMovesExhausted = () => {
    console.log('Out of moves! Transitioning to questions phase...');
    setPhase('questions');
  };

  return (
    <div className="gem-hunt">
      {phase === 'platform' && (
        <PlatformPhase
          movesRemaining={movesRemaining}
          onMovesExhausted={handleMovesExhausted}
        />
      )}
      
      {phase === 'questions' && (
        <div className="questions-phase">
          <h2>Answer questions to earn moves</h2>
          <p>(Question phase coming soon...)</p>
        </div>
      )}
    </div>
  );
};

export default GemHunt;
