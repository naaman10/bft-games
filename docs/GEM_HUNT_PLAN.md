# Gem Hunt - Game Design & Technical Plan

## Overview

Gem Hunt is an educational math game that combines question-answer mechanics with Mario-style platformer gameplay. Players answer math questions to earn moves, which they use to navigate through platform levels collecting gems.

## Game Flow

```
Start Game
  ↓
Select Year Group & Subject (e.g., Year 6 > Percentages)
  ↓
Answer 5 Math Questions (earn 5 moves per correct answer = 25 moves total)
  ↓
Platform Game Phase (use moves to collect gems from crates)
  ↓
Run out of moves → Answer 5 more questions
  ↓
Complete Level → Progress to next level
  ↓
Game Over (5 lives lost) → Save progress & score
```

## Core Mechanics

### 1. Question-Answer System
- **Answer Format**: Simple answers (numbers, single words)
- **Per Question**: 1 correct answer = 5 moves
- **Batch Size**: 5 questions per batch
- **Wrong Answer Penalty**: Lose 1 life
- **Total Lives**: 5 per game session

### 2. Movement System
- **Move Currency**: Each movement action costs 1 move
- **Actions that cost moves**:
  - Walk left/right
  - Jump
  - Climb (if applicable)
- **Move Display**: Show remaining moves counter
- **Zero Moves**: Player frozen, must answer questions

### 3. Gem Collection
- **Location**: Special crates throughout levels
- **Collection**: Player must reach and interact with crate
- **Value**: Each gem = 1 point (or configurable)
- **Persistence**: Total gems tracked across all games

### 4. Level Progression
- **Level 1**: Short (50 moves to complete)
- **Level 2**: Medium (100 moves to complete)
- **Level 3**: Long (150 moves to complete)
- **Level 4+**: Increasing difficulty and length
- **Completion**: Reach end flag/portal
- **Save Point**: Progress saved after each level

## Database Schema (Neon PostgreSQL)

### Table: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `game_sessions`
```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  year_group VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  current_level INT DEFAULT 1,
  total_gems INT DEFAULT 0,
  lives_remaining INT DEFAULT 5,
  moves_remaining INT DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  last_played_at TIMESTAMP DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Table: `level_progress`
```sql
CREATE TABLE level_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  year_group VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  level_number INT NOT NULL,
  gems_collected INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  time_taken_seconds INT,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, year_group, subject, level_number)
);
```

### Table: `leaderboard`
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  year_group VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  total_gems INT DEFAULT 0,
  highest_level INT DEFAULT 1,
  total_games_played INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, year_group, subject)
);
```

### Table: `question_bank`
```sql
CREATE TABLE question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_group VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  question_text TEXT NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  difficulty_level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_questions_year_subject ON question_bank(year_group, subject, active);
```

### Table: `question_responses`
```sql
CREATE TABLE question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id),
  question_id UUID NOT NULL REFERENCES question_bank(id),
  user_answer VARCHAR(255),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES question_bank(id) ON DELETE CASCADE
);
```

## Question Bank Structure

### Year Groups
- Year 1, Year 2, Year 3, Year 4, Year 5, Year 6

### Subject Categories (Examples)
- Addition
- Subtraction
- Multiplication
- Division
- Fractions
- Decimals
- Percentages
- Shapes & Geometry
- Time
- Money
- Measurement

### Sample Questions by Year Group

#### Year 3 - Addition
```json
{
  "question": "What is 12 + 8?",
  "answer": "20"
}
```

#### Year 4 - Multiplication
```json
{
  "question": "What is 7 × 6?",
  "answer": "42"
}
```

#### Year 5 - Fractions
```json
{
  "question": "What is 1/2 + 1/4?",
  "answer": "3/4"
}
```

#### Year 6 - Percentages
```json
{
  "question": "What is 25% of 80?",
  "answer": "20"
}
```

## Game Architecture

### Technology Stack
- **Frontend**: React + TypeScript
- **Game Engine**: Phaser 3 (battle-tested 2D game framework)
- **State Management**: React Context + useReducer
- **Database**: Neon PostgreSQL
- **API Layer**: REST API or tRPC for type-safety
- **Styling**: CSS Modules or Styled Components

### File Structure
```
src/games/GemHunt/
├── GemHunt.tsx                 # Main game component
├── components/
│   ├── GameSetup.tsx           # Year group & subject selection
│   ├── QuestionPhase.tsx       # Question answering UI
│   ├── PlatformPhase.tsx       # Phaser game canvas
│   ├── GameHUD.tsx             # Lives, moves, gems display
│   ├── LevelComplete.tsx       # Level completion screen
│   └── GameOver.tsx            # Game over screen
├── game/
│   ├── scenes/
│   │   ├── Level1Scene.ts      # Level 1 game logic
│   │   ├── Level2Scene.ts      # Level 2 game logic
│   │   └── Level3Scene.ts      # Level 3 game logic
│   ├── entities/
│   │   ├── Player.ts           # Player character
│   │   ├── Crate.ts            # Gem crates
│   │   └── Gem.ts              # Collectible gems
│   └── config.ts               # Phaser configuration
├── hooks/
│   ├── useGameSession.ts       # Game session management
│   ├── useQuestions.ts         # Question fetching & validation
│   └── useProgress.ts          # Progress saving
├── services/
│   ├── api.ts                  # API client
│   └── storage.ts              # Local storage utils
├── types/
│   ├── game.ts                 # Game-specific types
│   └── questions.ts            # Question types
├── data/
│   └── questionBank.ts         # Static question bank (fallback)
└── GemHunt.css                 # Game styles
```

## iframe Communication Strategy

### Problem
Game runs in iframe, needs to communicate with parent bft-learn app for:
- User authentication/ID
- Progress saving
- Leaderboard updates
- Session management

### Solution: PostMessage API

#### Parent App (bft-learn) → Game
```typescript
// Parent sends user data on game load
iframe.contentWindow.postMessage({
  type: 'INIT_GAME',
  payload: {
    userId: 'uuid',
    username: 'student123',
    token: 'auth-token'
  }
}, 'https://games.bftlearn.com');
```

#### Game → Parent App (bft-learn)
```typescript
// Game sends progress updates
window.parent.postMessage({
  type: 'SAVE_PROGRESS',
  payload: {
    sessionId: 'session-uuid',
    level: 2,
    gems: 45,
    lives: 3
  }
}, 'https://learn.bftlearn.com');
```

### Message Types

#### From Parent to Game
- `INIT_GAME` - Initialize game with user data
- `RESUME_SESSION` - Resume existing session
- `GET_PROGRESS` - Request current progress

#### From Game to Parent
- `GAME_READY` - Game loaded and ready
- `SAVE_PROGRESS` - Save current progress
- `LEVEL_COMPLETE` - Level completed
- `GAME_COMPLETE` - All levels completed
- `UPDATE_LEADERBOARD` - Update leaderboard score
- `REQUEST_AUTH` - Request authentication refresh

### Implementation

```typescript
// In GemHunt.tsx
useEffect(() => {
  // Listen for messages from parent
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== 'https://learn.bftlearn.com') return;
    
    switch (event.data.type) {
      case 'INIT_GAME':
        setUser(event.data.payload);
        break;
      case 'RESUME_SESSION':
        loadSession(event.data.payload.sessionId);
        break;
    }
  };
  
  window.addEventListener('message', handleMessage);
  
  // Notify parent that game is ready
  window.parent.postMessage({ type: 'GAME_READY' }, '*');
  
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

## API Endpoints

### Game Session
- `POST /api/game-sessions` - Create new session
- `GET /api/game-sessions/:id` - Get session details
- `PATCH /api/game-sessions/:id` - Update session progress
- `DELETE /api/game-sessions/:id` - End session

### Questions
- `GET /api/questions?yearGroup=Year6&subject=Percentages` - Get questions
- `POST /api/questions/validate` - Validate answer
- `POST /api/questions` - Add new question (admin)

### Progress
- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress` - Save level progress
- `GET /api/progress/:userId/levels` - Get completed levels

### Leaderboard
- `GET /api/leaderboard?yearGroup=Year6&subject=Percentages` - Get leaderboard
- `POST /api/leaderboard/update` - Update user score

## Game Assets Needed

### Characters
- Player sprite (idle, walk, jump animations)
- Friendly design, suitable for ages 5-11

### Environment
- Platform tiles (grass, stone, wood)
- Background layers (sky, clouds, mountains)
- Decorative elements (trees, bushes, flowers)

### Items
- Gem sprites (different colors for variety)
- Crate/chest sprites (closed & open states)
- Question mark boxes
- Level complete flag/portal

### UI Elements
- Lives indicator (hearts)
- Moves counter
- Gem counter
- Progress bar
- Button states (hover, active, disabled)

## Game Levels Design

### Level 1: "Sunny Hills"
- **Theme**: Grassy hills with blue sky
- **Length**: ~50 moves
- **Gems**: 5 crates (1 gem each)
- **Difficulty**: Easy jumps, clear path
- **Moves Required**: ~40 moves minimum

### Level 2: "Forest Path"
- **Theme**: Forest with trees and platforms
- **Length**: ~100 moves
- **Gems**: 10 crates (1 gem each)
- **Difficulty**: Multiple paths, some backtracking
- **Moves Required**: ~80 moves minimum

### Level 3: "Mountain Climb"
- **Theme**: Rocky mountain with challenging jumps
- **Length**: ~150 moves
- **Gems**: 15 crates (1 gem each)
- **Difficulty**: Vertical sections, precise jumps
- **Moves Required**: ~120 moves minimum

### Level 4+: Progressive Challenge
- Increase length by 50 moves per level
- Add 5 more crates per level
- Introduce new mechanics (moving platforms, etc.)

## Development Phases

### Phase 1: Core Setup (Foundation)
- [ ] Set up Phaser 3 integration
- [ ] Create basic game loop
- [ ] Implement player movement (keyboard controls)
- [ ] Create simple test level
- [ ] Set up React-Phaser communication

### Phase 2: Question System
- [ ] Create question bank data structure
- [ ] Build QuestionPhase UI component
- [ ] Implement answer validation
- [ ] Connect questions to move generation
- [ ] Add lives system

### Phase 3: Platform Game
- [ ] Design Level 1 layout
- [ ] Implement gem crates
- [ ] Add collision detection
- [ ] Create move counter system
- [ ] Implement level completion logic

### Phase 4: Database Integration
- [ ] Set up Neon database connection
- [ ] Create database schema
- [ ] Build API endpoints
- [ ] Implement progress saving
- [ ] Add session management

### Phase 5: iframe Communication
- [ ] Implement PostMessage handlers
- [ ] Test parent-child communication
- [ ] Add authentication flow
- [ ] Handle session persistence

### Phase 6: Polish & Content
- [ ] Add more levels (2, 3, 4+)
- [ ] Populate question bank (100+ questions per subject)
- [ ] Create/source game assets
- [ ] Add animations and effects
- [ ] Implement leaderboard UI

### Phase 7: Testing & Optimization
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] User testing with students
- [ ] Bug fixes and refinements

## Technical Considerations

### State Management
```typescript
interface GameState {
  // Session
  sessionId: string | null;
  userId: string | null;
  
  // Game Setup
  yearGroup: string | null;
  subject: string | null;
  
  // Game Progress
  currentLevel: number;
  lives: number;
  movesRemaining: number;
  totalGems: number;
  
  // Current Phase
  phase: 'setup' | 'questions' | 'platform' | 'levelComplete' | 'gameOver';
  
  // Question State
  currentQuestions: Question[];
  answeredQuestions: number;
  
  // Platform State
  playerPosition: { x: number; y: number };
  collectedCrates: string[];
}
```

### Performance Optimization
- Lazy load Phaser and game assets
- Implement asset preloading screens
- Use sprite atlases for efficient rendering
- Debounce API calls for progress saving
- Cache questions locally to reduce API calls

### Accessibility
- Keyboard-only navigation support
- Screen reader friendly menus
- High contrast mode option
- Adjustable text size
- Clear visual feedback for all actions

### Security
- Validate all answers server-side
- Encrypt sensitive data in PostMessages
- Implement rate limiting on API
- Sanitize user inputs
- Use CORS properly for iframe communication

## Next Steps

1. **Review & Approve Plan** - Get stakeholder sign-off
2. **Create Initial Setup** - Branch and basic file structure
3. **Phase 1 Implementation** - Get Phaser working with React
4. **Iterate** - Build feature by feature, test as we go

## Questions to Resolve

- [ ] Should we support multiple difficulty levels per year group?
- [ ] How many questions should we have per subject initially?
- [ ] Should gems have different point values (bronze, silver, gold)?
- [ ] Do we want power-ups or special abilities?
- [ ] Should there be a time limit per level?
- [ ] Parent app authentication - what method (JWT, session, OAuth)?
- [ ] Where should game assets be hosted (CDN)?
- [ ] Do we need admin tools for managing questions?
