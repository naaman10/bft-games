# Game Sessions API Architecture Proposal

## Problem

Currently, each game has its own endpoint pattern:
- Gem Hunt: `/gem-hunt/sessions` (creates session at start, updates during play)
- Maths Quiz: `/quiz-generator/sessions` (404 - not implemented)

This leads to:
- API endpoint proliferation
- Inconsistent patterns across games
- Backend changes required for each new game

## Proposed Solution: General Games Session Endpoint

### Single Endpoint for All Games

**Base URL:** `/api/games/sessions`

All games use the same endpoint with a `gameType` discriminator.

### API Schema

#### POST `/api/games/sessions` - Create/Complete Session

```typescript
{
  gameType: string;              // 'maths-quiz' | 'gem-hunt' | 'word-search' | ...
  score: number;                 // Actual score achieved
  maxScore: number;              // Maximum possible score
  timeElapsed: number;           // Seconds
  startedAt: string;             // ISO 8601 timestamp
  completedAt?: string;          // ISO 8601 timestamp (null if in-progress)
  
  // Flexible storage for game-specific data
  gameData: {
    // Structure varies by gameType
    // Backend validates based on gameType
    [key: string]: any;
  }
}
```

#### GET `/api/games/sessions` - List Sessions

```typescript
Query params:
  ?gameType=maths-quiz          // Filter by game
  ?userId=<uuid>                // Filter by user (admin only)
  ?limit=20                     // Pagination
  ?offset=0                     // Pagination
  ?startDate=2026-09-01         // Date range
  ?endDate=2026-09-30           // Date range

Response:
{
  sessions: GameSession[];
  total: number;
  hasMore: boolean;
}
```

#### GET `/api/games/sessions/:id` - Get Single Session

```typescript
Response: GameSession (full details)
```

### Database Schema

```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Game identification
  game_type VARCHAR(50) NOT NULL,  -- 'maths-quiz', 'gem-hunt', etc.
  
  -- Universal scoring
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  score_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score::decimal / max_score::decimal) * 100) STORED,
  
  -- Timing
  time_elapsed_seconds INTEGER,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  
  -- Flexible storage for game-specific data
  game_data JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_type ON game_sessions(game_type);
CREATE INDEX idx_game_sessions_user_type ON game_sessions(user_id, game_type);
CREATE INDEX idx_game_sessions_completed ON game_sessions(completed_at DESC) WHERE completed_at IS NOT NULL;
CREATE INDEX idx_game_data ON game_sessions USING gin(game_data);

-- Check constraint for valid game types
ALTER TABLE game_sessions 
ADD CONSTRAINT valid_game_type 
CHECK (game_type IN ('maths-quiz', 'gem-hunt', 'word-search', 'spelling-bee'));
```

### Game-Specific Data Structures

#### Maths Quiz

```typescript
{
  gameType: 'maths-quiz',
  score: 80,
  maxScore: 100,
  timeElapsed: 120,
  gameData: {
    totalQuestions: 10,
    correctAnswers: 8,
    yearGroup: 'Year 6',
    subject: 'Percentages',
    difficulty: 'medium',
    answers: [
      {
        questionId: 'q123',
        userAnswer: '50',
        correct: true,
        correctAnswer: '50',
        timeSpent: 12
      },
      // ... more answers
    ]
  }
}
```

#### Gem Hunt

```typescript
{
  gameType: 'gem-hunt',
  score: 45,              // Total gems collected
  maxScore: 50,           // Maximum gems in level
  timeElapsed: 300,
  gameData: {
    level: 5,
    lives: 2,
    moves: 15,
    yearGroup: 'Year 5',
    subject: 'Fractions',
    levelProgress: [
      { level: 1, gems: 10, time: 60 },
      { level: 2, gems: 10, time: 55 },
      // ... more levels
    ]
  }
}
```

#### Word Search (Future)

```typescript
{
  gameType: 'word-search',
  score: 12,              // Words found
  maxScore: 15,           // Total words
  timeElapsed: 180,
  gameData: {
    gridSize: '10x10',
    wordsFound: ['apple', 'banana', 'cherry'],
    wordsMissed: ['grape', 'orange', 'mango'],
    difficulty: 'hard'
  }
}
```

## Benefits

### 1. Single Endpoint
- All games use `/api/games/sessions`
- Consistent API pattern
- Easier to document and maintain

### 2. Easy Analytics
Query all game activity in one place:
```sql
-- Total games played by type
SELECT game_type, COUNT(*) 
FROM game_sessions 
GROUP BY game_type;

-- Average scores by game
SELECT game_type, AVG(score_percentage) 
FROM game_sessions 
WHERE completed_at IS NOT NULL
GROUP BY game_type;

-- Student progress across all games
SELECT game_type, completed_at, score_percentage
FROM game_sessions
WHERE user_id = '<uuid>'
ORDER BY completed_at DESC;
```

### 3. No Backend Changes for New Games
Add a new game without modifying the backend:
1. Add game type to enum/check constraint
2. Frontend sends data with new `gameType`
3. Backend stores it in `game_data` JSON field

### 4. Flexible Schema
Each game can store whatever data it needs in `gameData`:
- Quiz: questions, answers, subjects
- Gem Hunt: levels, gems, lives
- Word Search: grids, words, hints used

### 5. Type Safety
Backend can validate based on `gameType`:
```typescript
// Zod validation example
const MathsQuizDataSchema = z.object({
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  yearGroup: z.string(),
  subject: z.string().nullable(),
  answers: z.array(z.object({
    questionId: z.string(),
    userAnswer: z.string(),
    correct: z.boolean(),
    timeSpent: z.number()
  }))
});

const GemHuntDataSchema = z.object({
  level: z.number(),
  lives: z.number(),
  moves: z.number(),
  yearGroup: z.string(),
  subject: z.string()
});

// Validate based on gameType
if (gameType === 'maths-quiz') {
  MathsQuizDataSchema.parse(gameData);
} else if (gameType === 'gem-hunt') {
  GemHuntDataSchema.parse(gameData);
}
```

## Migration Strategy

### Phase 1: Add General Endpoint (Backwards Compatible)
1. Create `game_sessions` table
2. Add `/api/games/sessions` endpoint
3. Keep existing game-specific endpoints working
4. Both systems run in parallel

### Phase 2: Update Frontend Games
1. Maths Quiz → use general endpoint immediately (no breaking change)
2. Gem Hunt → migrate when convenient (more complex, has mid-game updates)

### Phase 3: Deprecate Old Endpoints (Optional)
1. Mark `/gem-hunt/sessions` as deprecated
2. Give 3-month notice
3. Remove old endpoints

## Special Cases

### Gem Hunt: Mid-Game Updates
Gem Hunt creates a session at start and updates it during gameplay.

**Option A: Use general endpoint for everything**
```typescript
// Create session
POST /api/games/sessions
{ gameType: 'gem-hunt', score: 0, ... }

// Update session
PATCH /api/games/sessions/:id
{ score: 10, gameData: { level: 2, ... } }
```

**Option B: Hybrid approach (Recommended)**
- Keep `/gem-hunt/sessions` for mid-game updates
- Use `/api/games/sessions` for final completion
- Two separate records: progress + final result

### Leaderboards
Query top scores easily:
```sql
SELECT 
  u.username,
  gs.score,
  gs.score_percentage,
  gs.completed_at
FROM game_sessions gs
JOIN users u ON gs.user_id = u.id
WHERE gs.game_type = 'maths-quiz'
  AND gs.completed_at IS NOT NULL
ORDER BY gs.score_percentage DESC
LIMIT 10;
```

## Implementation Checklist

Backend (bft-api):
- [ ] Create `game_sessions` table
- [ ] Add `POST /api/games/sessions` endpoint
- [ ] Add `GET /api/games/sessions` endpoint (list)
- [ ] Add `GET /api/games/sessions/:id` endpoint (single)
- [ ] Add `PATCH /api/games/sessions/:id` endpoint (updates)
- [ ] Add Zod validation for each game type
- [ ] Add unit tests
- [ ] Add API documentation

Frontend (bft-games):
- [x] Update Maths Quiz to use `/api/games/sessions`
- [ ] Test Maths Quiz integration
- [ ] (Optional) Update Gem Hunt to use general endpoint
- [ ] Add TypeScript types for all game data structures
- [ ] Update documentation

## Example API Responses

### Create Session Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "gameType": "maths-quiz",
  "score": 80,
  "maxScore": 100,
  "scorePercentage": 80.00,
  "timeElapsed": 120,
  "startedAt": "2026-09-27T15:00:00Z",
  "completedAt": "2026-09-27T15:02:00Z",
  "gameData": {
    "totalQuestions": 10,
    "correctAnswers": 8,
    "yearGroup": "Year 6",
    "subject": "Percentages"
  },
  "createdAt": "2026-09-27T15:02:01Z"
}
```

### List Sessions Response
```json
{
  "sessions": [
    {
      "id": "...",
      "gameType": "maths-quiz",
      "score": 80,
      "scorePercentage": 80.00,
      "completedAt": "2026-09-27T15:02:00Z"
    },
    {
      "id": "...",
      "gameType": "gem-hunt",
      "score": 45,
      "scorePercentage": 90.00,
      "completedAt": "2026-09-27T14:30:00Z"
    }
  ],
  "total": 2,
  "hasMore": false
}
```

## Conclusion

**Recommendation:** Implement the general `/api/games/sessions` endpoint.

**Immediate benefit:** Maths Quiz can save results right away.

**Long-term benefit:** Easy to add new games without backend changes.

**Trade-off:** Slightly less type safety (JSON field vs. dedicated columns), but worth it for flexibility.
