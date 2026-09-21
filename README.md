# BFT Games

Individual games platform for Brighter Futures Learn (bft-learn). This project hosts React-based games that can be launched and played via the Brighter Futures Learn web app.

## Overview

Each game is a self-contained React component that can be iframed into the bft-learn application. Games are designed to be educational, engaging, and appropriate for various age groups.

## Project Structure

```
bft-games/
├── src/
│   ├── games/              # Individual game components
│   │   ├── ExampleGame/    # Example game implementation
│   │   └── index.ts        # Games registry
│   ├── components/         # Shared components
│   │   ├── GameRouter.tsx  # Routes to individual games
│   │   └── GamesList.tsx   # Lists all available games
│   ├── types/              # TypeScript type definitions
│   │   └── game.ts         # Game-related types
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
└── package.json            # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Creating a New Game

1. Create a new directory under `src/games/` with your game name (e.g., `MemoryGame`)

2. Create your game component (e.g., `MemoryGame.tsx`):

```tsx
import { GameProps } from '../../types/game';
import './MemoryGame.css';

const MemoryGame: React.FC<GameProps> = ({ onComplete, onScore }) => {
  // Your game logic here
  
  return (
    <div className="memory-game">
      {/* Your game UI */}
    </div>
  );
};

export default MemoryGame;
```

3. Register your game in `src/games/index.ts`:

```tsx
import MemoryGame from './MemoryGame/MemoryGame';

export const GAMES: GameConfig[] = [
  // ... existing games
  {
    id: 'memory-game',
    title: 'Memory Game',
    description: 'Test your memory skills!',
    component: MemoryGame,
    category: 'Cognitive',
    minAge: 6,
    maxAge: 10,
  },
];
```

## Game Component API

Each game component receives the following props:

- `onComplete?: () => void` - Callback when the game is completed
- `onScore?: (score: number) => void` - Callback to report score updates
- `config?: Record<string, unknown>` - Optional configuration object

## iframe Integration

Games can be embedded in the bft-learn app using iframes:

```html
<iframe 
  src="https://your-domain.com/game/example-game"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **ESLint** - Code linting

## License

Private - Brighter Futures Learn
