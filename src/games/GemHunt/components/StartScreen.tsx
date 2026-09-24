import './StartScreen.css';

interface StartScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  hasSavedSession: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNewGame, onContinue, hasSavedSession }) => {
  return (
    <div className="start-screen">
      <div className="start-screen-container">
        <div className="start-screen-header">
          <img 
            src="/assets/Characters/Foxy/idle/spritesheet.png" 
            alt="Foxy"
            className="start-screen-character"
          />
          <h1 className="start-screen-title">Gem Hunt</h1>
          <p className="start-screen-tagline">
            Answer math questions to earn moves and collect gems!
          </p>
        </div>

        <div className="start-screen-menu">
          <button 
            type="button"
            className="start-screen-button primary"
            onClick={onNewGame}
          >
            <span className="button-icon">🎮</span>
            <span className="button-text">
              <span className="button-title">New Game</span>
              <span className="button-subtitle">Choose your year and subject</span>
            </span>
          </button>

          {hasSavedSession && (
            <button 
              type="button"
              className="start-screen-button secondary"
              onClick={onContinue}
            >
              <span className="button-icon">▶️</span>
              <span className="button-text">
                <span className="button-title">Continue</span>
                <span className="button-subtitle">Resume your last session</span>
              </span>
            </button>
          )}
        </div>

        <div className="start-screen-footer">
          <div className="game-info">
            <div className="info-item">
              <span className="info-icon">📚</span>
              <span className="info-text">Multiple subjects</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <span className="info-text">5 levels to complete</span>
            </div>
            <div className="info-item">
              <span className="info-icon">💎</span>
              <span className="info-text">Collect gems</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
