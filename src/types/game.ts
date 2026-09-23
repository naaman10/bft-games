export interface GameConfig {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<GameProps>;
  thumbnail?: string;
  category?: string;
  minAge?: number;
  maxAge?: number;
}

export interface GameProps {
  onComplete?: () => void;
  onScore?: (score: number) => void;
  config?: Record<string, unknown>;
}
