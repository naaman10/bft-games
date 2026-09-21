import { Link } from 'react-router-dom';
import { GAMES } from '../games';
import './GamesList.css';

const GamesList = () => {
  return (
    <div className="games-list">
      <header className="games-header">
        <h1>Brighter Futures Games</h1>
        <p>Choose a game to play</p>
      </header>

      <div className="games-grid">
        {GAMES.map((game) => (
          <Link
            key={game.id}
            to={`/game/${game.id}`}
            className="game-card"
          >
            <div className="game-card-content">
              <h2>{game.title}</h2>
              <p className="game-description">{game.description}</p>
              {game.category && (
                <span className="game-category">{game.category}</span>
              )}
              {(game.minAge || game.maxAge) && (
                <p className="game-age">
                  Ages: {game.minAge}-{game.maxAge}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {GAMES.length === 0 && (
        <div className="no-games">
          <p>No games available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default GamesList;
