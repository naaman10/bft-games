# Gem Hunt Game

An educational math game that combines question-answer mechanics with Mario-style platformer gameplay.

## Game Overview

Players answer math questions to earn moves, which they use to navigate through platform levels collecting gems. The game adapts to different year groups and subjects, making it suitable for students from Year 1 to Year 6.

## How to Play

1. **Select Your Settings**
   - Choose your Year Group (Year 1 - Year 6)
   - Choose your Subject (Addition, Multiplication, Percentages, etc.)

2. **Answer Questions**
   - Answer 5 math questions
   - Each correct answer = 5 moves
   - Each wrong answer = lose 1 life
   - Start with 5 lives total

3. **Play the Platform Game**
   - Use your earned moves to navigate the level
   - Collect gems from special crates
   - Reach the end of the level to progress

4. **Continue Playing**
   - Run out of moves? Answer 5 more questions!
   - Complete levels to unlock harder challenges
   - Compete on the leaderboard with total gem count

## Game Mechanics

### Movement System
- **Walk/Run**: Arrow keys or WASD
- **Jump**: Space bar or Up arrow
- **Each action costs 1 move**

### Lives System
- Start with 5 lives per game
- Lose 1 life for each wrong answer
- Game over when all lives are lost

### Level Progression
- **Level 1**: ~50 moves to complete (5 gem crates)
- **Level 2**: ~100 moves to complete (10 gem crates)
- **Level 3**: ~150 moves to complete (15 gem crates)
- **Level 4+**: Increasing difficulty and length

### Scoring
- Each gem = 1 point (or configurable)
- Total gems tracked across all games
- Leaderboard ranked by total gems collected

## Development

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```

Navigate to `http://localhost:3000/game/gem-hunt`

### Building
```bash
npm run build
```

### Testing
```bash
npm run test        # Run tests
npm run lint        # Lint code
npm run type-check  # TypeScript checks
```

## File Structure

```
src/games/GemHunt/
├── GemHunt.tsx                 # Main game component
├── GemHunt.css                 # Main styles
├── README.md                   # This file
│
├── components/                 # React components
│   ├── GameSetup.tsx           # Year/subject selection
│   ├── QuestionPhase.tsx       # Question answering UI
│   ├── PlatformPhase.tsx       # Phaser game wrapper
│   ├── GameHUD.tsx             # Lives, moves, gems display
│   ├── LevelComplete.tsx       # Level completion screen
│   └── GameOver.tsx            # Game over screen
│
├── game/                       # Phaser game logic
│   ├── config.ts               # Phaser configuration
│   ├── scenes/                 # Game scenes
│   │   ├── Level1Scene.ts
│   │   ├── Level2Scene.ts
│   │   └── Level3Scene.ts
│   └── entities/               # Game entities
│       ├── Player.ts
│       ├── Crate.ts
│       └── Gem.ts
│
├── hooks/                      # React hooks
│   ├── useGameSession.ts       # Session management
│   ├── useQuestions.ts         # Question fetching
│   ├── useProgress.ts          # Progress saving
│   └── useIframeComm.ts        # iframe communication
│
├── services/                   # Services
│   ├── api.ts                  # API client
│   ├── storage.ts              # Local storage
│   └── postMessage.ts          # PostMessage handlers
│
├── types/                      # TypeScript types
│   ├── game.ts                 # Game types
│   ├── questions.ts            # Question types
│   └── api.ts                  # API types
│
├── context/                    # React Context
│   ├── GameContext.tsx         # Game state context
│   └── GameReducer.ts          # State reducer
│
├── data/                       # Static data
│   ├── questionBank.ts         # Fallback questions
│   └── levelConfigs.ts         # Level configurations
│
└── assets/                     # Game assets
    ├── sprites/                # Character sprites
    ├── tiles/                  # Platform tiles
    ├── items/                  # Gem, crate sprites
    └── ui/                     # UI elements
```

## API Integration

The game communicates with the backend API for:
- Creating/resuming game sessions
- Fetching questions
- Validating answers
- Saving progress
- Updating leaderboard

See [API_SPECIFICATION.md](../../docs/API_SPECIFICATION.md) for full API documentation.

## iframe Integration

The game is designed to be embedded in the BFT Learn app via iframe.

### Parent App Integration

```html
<iframe 
  src="https://games.bftlearn.com/game/gem-hunt"
  width="100%"
  height="600px"
  frameborder="0"
  id="gem-hunt-frame"
></iframe>
```

```javascript
// Initialize game with user data
const frame = document.getElementById('gem-hunt-frame');
frame.contentWindow.postMessage({
  type: 'INIT_GAME',
  payload: {
    userId: 'user-uuid',
    username: 'student123',
    token: 'auth-token',
    apiBaseUrl: 'https://api.bftlearn.com'
  }
}, 'https://games.bftlearn.com');

// Listen for progress updates
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://games.bftlearn.com') return;
  
  if (event.data.type === 'PROGRESS_UPDATE') {
    console.log('Game progress:', event.data.payload);
    // Update parent app UI
  }
});
```

## Database Schema

The game uses the following main tables:
- `users` - User accounts
- `game_sessions` - Active game sessions
- `level_progress` - Level completion records
- `leaderboard` - Aggregated rankings
- `question_bank` - Math questions
- `question_responses` - Answer records

See [schema.sql](../../database/schema.sql) for complete schema.

## Question Bank

Questions are organized by:
- **Year Group**: Year 1 through Year 6
- **Subject**: Addition, Subtraction, Multiplication, etc.
- **Difficulty**: 1 (Easy), 2 (Medium), 3 (Hard)

See [QUESTION_BANK_SAMPLES.md](../../docs/QUESTION_BANK_SAMPLES.md) for sample questions.

## Adding New Subjects

1. Add questions to the database:
```sql
INSERT INTO question_bank (year_group, subject, question_text, correct_answer, difficulty_level)
VALUES ('Year 5', 'Algebra', 'Solve for x: 2x + 3 = 11', '4', 2);
```

2. Update the subject selection UI in `GameSetup.tsx`

3. (Optional) Add subject-specific validation in `QuestionPhase.tsx`

## Adding New Levels

1. Create new scene file: `src/games/GemHunt/game/scenes/Level4Scene.ts`

2. Define level configuration:
```typescript
export const LEVEL_4_CONFIG = {
  levelNumber: 4,
  requiredMoves: 200,
  gemCrates: 20,
  theme: 'desert',
  // ... more config
};
```

3. Register scene in Phaser config

4. Add level data to database (if needed)

## Performance Notes

- Phaser 3 is lazy-loaded to reduce initial bundle size
- Questions are cached locally to reduce API calls
- Progress is auto-saved every 30 seconds
- Assets are loaded on-demand per level

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast mode
- Adjustable text size

## Future Enhancements

- [ ] Power-ups (extra lives, double gems)
- [ ] Multiplayer race mode
- [ ] Custom level creator
- [ ] Voice narration for questions
- [ ] Mobile touch controls
- [ ] Achievements system
- [ ] Daily challenges
- [ ] Teacher dashboard

## Credits

- Game Design: Brighter Futures Team
- Development: [Your Team]
- Assets: [Asset Sources]

## License

Private - Brighter Futures Learn
