import { GameConfig } from '../types/game';
import ExampleGame from './ExampleGame/ExampleGame';

export const GAMES: GameConfig[] = [
  {
    id: 'example-game',
    title: 'Example Game',
    description: 'A simple example game to demonstrate the structure',
    component: ExampleGame,
    category: 'Educational',
    minAge: 5,
    maxAge: 12,
  },
];

export const getGameById = (gameId: string): GameConfig | undefined => {
  return GAMES.find((game) => game.id === gameId);
};
