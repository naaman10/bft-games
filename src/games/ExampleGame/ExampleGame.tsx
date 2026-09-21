import { useState } from 'react';
import { GameProps } from '../../types/game';
import './ExampleGame.css';

const ExampleGame: React.FC<GameProps> = ({ onComplete, onScore }) => {
  const [score, setScore] = useState(0);
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    const newClicks = clicks + 1;
    const newScore = score + 10;
    
    setClicks(newClicks);
    setScore(newScore);
    
    if (onScore) {
      onScore(newScore);
    }

    if (newClicks >= 10 && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="example-game">
      <div className="game-header">
        <h1>Example Game</h1>
        <p>Click the button to earn points!</p>
      </div>
      
      <div className="game-content">
        <div className="score-display">
          <h2>Score: {score}</h2>
          <p>Clicks: {clicks}/10</p>
        </div>
        
        <button 
          className="game-button" 
          onClick={handleClick}
          disabled={clicks >= 10}
        >
          {clicks >= 10 ? 'Game Complete!' : 'Click Me!'}
        </button>
        
        {clicks >= 10 && (
          <div className="completion-message">
            <p>Great job! You completed the game!</p>
            <p>Final Score: {score}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExampleGame;
