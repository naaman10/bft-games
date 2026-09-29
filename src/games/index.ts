import { GameConfig } from '../types/game';
import ExampleGame from './ExampleGame/ExampleGame';
import GemHunt from './GemHunt/GemHunt';
import MathsQuiz from './MathsQuiz/MathsQuiz';
import ReadingDetective from './ReadingDetective/ReadingDetective';

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
    id: 'reading-detective',
    title: 'Reading Detective',
    description:
      'Search painted scenes for written clues, answer comprehension questions, and decide where the investigation goes next.',
    component: ReadingDetective,
    category: 'English Reading',
    minAge: 7,
    maxAge: 11,
  },
  {
    id: 'maths-quiz',
    title: 'Maths Quiz Generator',
    description: 'Create custom maths quizzes with instant feedback. Choose your year group, subject, and number of questions!',
    component: MathsQuiz,
    category: 'Educational Math',
    minAge: 5,
    maxAge: 12,
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
