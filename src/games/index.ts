import { GameConfig } from '../types/game';
import ExampleGame from './ExampleGame/ExampleGame';
import GemHunt from './GemHunt/GemHunt';

export const GAMES: GameConfig[] = [
  {
    id: 'gem-hunt',
    title: 'Gem Hunt',
    description: 'Answer math questions to earn moves and collect gems in this platformer adventure!',
    component: GemHunt,
    category: 'Educational Math',
    minAge: 5,
    maxAge: 11,
  },
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
