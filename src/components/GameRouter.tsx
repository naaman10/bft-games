import { useParams, Navigate } from 'react-router-dom';
import { getGameById } from '../games';

const GameRouter = () => {
  const { gameId } = useParams<{ gameId: string }>();

  if (!gameId) {
    return <Navigate to="/" replace />;
  }

  const game = getGameById(gameId);

  if (!game) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Game Not Found</h1>
        <p>The game "{gameId}" does not exist.</p>
        <a href="/">Return to Games List</a>
      </div>
    );
  }

  const GameComponent = game.component;

  return (
    <GameComponent
      onComplete={() => console.log('Game completed!')}
      onScore={(score) => console.log('Score:', score)}
    />
  );
};

export default GameRouter;
