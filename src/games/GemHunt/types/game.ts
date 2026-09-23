export interface GameState {
  // User & Session
  user: {
    id: string;
    username: string;
    email: string;
    token: string;
  } | null;
  
  session: {
    id: string;
    yearGroup: string;
    subject: string;
  } | null;
  
  // Game Progress
  progress: {
    currentLevel: number;
    lives: number;
    movesRemaining: number;
    totalGems: number;
  };
  
  // Current Phase
  phase: 'setup' | 'questions' | 'platform' | 'levelComplete' | 'gameOver';
  
  // Question Phase State
  questions: {
    current: Question[];
    answeredCount: number;
    correctCount: number;
  };
}

export interface Question {
  id: string;
  questionText: string;
  yearGroup: string;
  subject: string;
  difficultyLevel: number;
}

export interface LevelConfig {
  levelNumber: number;
  requiredMoves: number;
  gemCrates: number;
  theme: string;
  name: string;
}

export interface PlayerState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  facingRight: boolean;
  isJumping: boolean;
  isOnGround: boolean;
}

export interface GemCrate {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}
