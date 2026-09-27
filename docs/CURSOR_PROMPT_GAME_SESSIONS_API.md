# Cursor Prompt: Implement General Game Sessions API Endpoint

## Task
Implement a general `/api/games/sessions` endpoint in the bft-api backend that all games (Maths Quiz, Gem Hunt, future games) can use to save gameplay sessions.

## Context
The frontend games (in bft-games repo) now send game completion data via postMessage to the parent app (bft-learn), which needs to save this data to the database. Currently each game has its own endpoint pattern, but we want a single unified endpoint.

## Requirements

### 1. Create Database Table

Create a new `game_sessions` table:

```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Game identification
  game_type VARCHAR(50) NOT NULL,
  
  -- Universal scoring (works for all games)
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  score_percentage DECIMAL(5,2) GENERATED ALWAYS AS 
    ((score::decimal / NULLIF(max_score::decimal, 0)) * 100) STORED,
  
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
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_game_type ON game_sessions(game_type);
CREATE INDEX idx_game_sessions_user_type ON game_sessions(user_id, game_type);
CREATE INDEX idx_game_sessions_completed_at ON game_sessions(completed_at DESC) 
  WHERE completed_at IS NOT NULL;
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);
CREATE INDEX idx_game_data ON game_sessions USING gin(game_data);

-- Constraint for valid game types
ALTER TABLE game_sessions 
ADD CONSTRAINT valid_game_type 
CHECK (game_type IN ('maths-quiz', 'gem-hunt', 'word-search', 'spelling-bee'));

-- Constraint for valid scores
ALTER TABLE game_sessions 
ADD CONSTRAINT valid_score 
CHECK (score >= 0 AND max_score > 0 AND score <= max_score);
```

### 2. Create API Endpoint: POST `/api/games/sessions`

**Authentication:** Required (JWT token)

**Request Body:**
```typescript
{
  gameType: 'maths-quiz' | 'gem-hunt' | 'word-search' | 'spelling-bee';
  score: number;              // Points/correct answers achieved
  maxScore: number;           // Maximum possible points
  timeElapsed: number;        // Total time in seconds
  startedAt: string;          // ISO 8601 timestamp
  completedAt?: string;       // ISO 8601 timestamp (optional, for in-progress sessions)
  gameData: Record<string, any>;  // Game-specific data (flexible JSON)
}
```

**Response (201 Created):**
```typescript
{
  id: string;
  userId: string;
  gameType: string;
  score: number;
  maxScore: number;
  scorePercentage: number;
  timeElapsed: number;
  startedAt: string;
  completedAt: string | null;
  gameData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

**Validation Rules:**
- `gameType`: Must be one of the allowed types
- `score`: Must be >= 0 and <= maxScore
- `maxScore`: Must be > 0
- `timeElapsed`: Optional, but if provided must be >= 0
- `startedAt`: Must be valid ISO 8601 timestamp
- `completedAt`: If provided, must be after startedAt
- `gameData`: Must be valid JSON object

### 3. Create API Endpoint: GET `/api/games/sessions`

**Authentication:** Required (JWT token)

**Query Parameters:**
```typescript
{
  gameType?: string;          // Filter by game type
  limit?: number;             // Default: 20, Max: 100
  offset?: number;            // Default: 0
  startDate?: string;         // ISO date (filters completedAt >= startDate)
  endDate?: string;           // ISO date (filters completedAt <= endDate)
  includeIncomplete?: boolean; // Include sessions without completedAt (default: false)
}
```

**Response (200 OK):**
```typescript
{
  sessions: GameSession[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
```

**Authorization:**
- Regular users can only see their own sessions
- Admins can query any user's sessions (but still filtered by their own userId by default)

### 4. Create API Endpoint: GET `/api/games/sessions/:id`

**Authentication:** Required (JWT token)

**Response (200 OK):** Full GameSession object

**Authorization:**
- Users can only view their own sessions
- Return 403 Forbidden if session belongs to another user
- Return 404 Not Found if session doesn't exist

### 5. Validation Schemas (Use Zod)

**Base Session Schema:**
```typescript
const GameSessionCreateSchema = z.object({
  gameType: z.enum(['maths-quiz', 'gem-hunt', 'word-search', 'spelling-bee']),
  score: z.number().int().min(0),
  maxScore: z.number().int().min(1),
  timeElapsed: z.number().int().min(0).optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  gameData: z.record(z.any()),
}).refine(
  (data) => data.score <= data.maxScore,
  { message: 'Score cannot exceed maxScore' }
).refine(
  (data) => !data.completedAt || new Date(data.completedAt) >= new Date(data.startedAt),
  { message: 'completedAt must be after startedAt' }
);
```

**Maths Quiz Game Data Schema (optional but recommended):**
```typescript
const MathsQuizDataSchema = z.object({
  totalQuestions: z.number().int().min(1),
  correctAnswers: z.number().int().min(0),
  yearGroup: z.string(),
  subject: z.string().nullable(),
  difficulty: z.string().optional(),
  answers: z.array(z.object({
    questionId: z.string(),
    userAnswer: z.string(),
    correct: z.boolean(),
    correctAnswer: z.string().optional(),
    timeSpent: z.number().int().min(0).optional(),
  })).optional(),
});
```

**Gem Hunt Game Data Schema (optional but recommended):**
```typescript
const GemHuntDataSchema = z.object({
  level: z.number().int().min(1),
  lives: z.number().int().min(0),
  moves: z.number().int().min(0),
  yearGroup: z.string(),
  subject: z.string(),
  levelProgress: z.array(z.object({
    level: z.number().int(),
    gems: z.number().int(),
    time: z.number().int(),
  })).optional(),
});
```

### 6. Error Handling

**400 Bad Request:**
- Invalid request body (validation errors)
- Missing required fields
- Invalid timestamps
- Score > maxScore

**401 Unauthorized:**
- Missing or invalid JWT token

**403 Forbidden:**
- Trying to access another user's session

**404 Not Found:**
- Session ID doesn't exist

**500 Internal Server Error:**
- Database errors
- Unexpected errors

### 7. Expected Frontend Payloads

**Maths Quiz Example:**
```json
{
  "gameType": "maths-quiz",
  "score": 80,
  "maxScore": 100,
  "timeElapsed": 120,
  "startedAt": "2026-09-27T15:00:00Z",
  "completedAt": "2026-09-27T15:02:00Z",
  "gameData": {
    "totalQuestions": 10,
    "correctAnswers": 8,
    "yearGroup": "Year 6",
    "subject": "Percentages",
    "difficulty": "medium",
    "answers": [
      {
        "questionId": "q123",
        "userAnswer": "50",
        "correct": true,
        "correctAnswer": "50",
        "timeSpent": 12
      }
    ]
  }
}
```

**Gem Hunt Example:**
```json
{
  "gameType": "gem-hunt",
  "score": 45,
  "maxScore": 50,
  "timeElapsed": 300,
  "startedAt": "2026-09-27T14:30:00Z",
  "completedAt": "2026-09-27T14:35:00Z",
  "gameData": {
    "level": 5,
    "lives": 2,
    "moves": 15,
    "yearGroup": "Year 5",
    "subject": "Fractions",
    "levelProgress": [
      { "level": 1, "gems": 10, "time": 60 },
      { "level": 2, "gems": 10, "time": 55 }
    ]
  }
}
```

## Implementation Notes

### File Structure (adjust to match your codebase)
```
src/
├── routes/
│   └── games.ts                    # New routes file
├── controllers/
│   └── gameSessionController.ts    # New controller
├── services/
│   └── gameSessionService.ts       # New service
├── models/
│   └── gameSession.ts              # New model/types
├── validators/
│   └── gameSessionValidator.ts     # Zod schemas
├── middleware/
│   └── auth.ts                     # Existing auth middleware
└── db/
    └── migrations/
        └── YYYYMMDDHHMMSS_create_game_sessions.ts  # New migration
```

### Code Pattern to Follow

**Use existing patterns from your codebase:**
- Follow the same authentication middleware used by other endpoints
- Use the same database connection/query builder (Prisma/Drizzle/raw SQL)
- Follow the same error handling pattern
- Use the same response format conventions
- Follow the same logging pattern

**Example route setup (Express):**
```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as gameSessionController from '../controllers/gameSessionController';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/games/sessions', gameSessionController.createSession);
router.get('/games/sessions', gameSessionController.listSessions);
router.get('/games/sessions/:id', gameSessionController.getSession);

export default router;
```

## Testing Requirements

### Unit Tests

**Test createSession:**
- ✅ Creates session with valid data
- ✅ Rejects invalid game type
- ✅ Rejects score > maxScore
- ✅ Rejects negative score
- ✅ Rejects invalid timestamps
- ✅ Requires authentication
- ✅ Stores gameData as JSON correctly

**Test listSessions:**
- ✅ Returns user's own sessions only
- ✅ Filters by gameType correctly
- ✅ Respects limit and offset
- ✅ Filters by date range correctly
- ✅ Excludes incomplete sessions by default
- ✅ Includes incomplete sessions when requested

**Test getSession:**
- ✅ Returns session by ID
- ✅ Returns 404 for non-existent session
- ✅ Returns 403 when accessing another user's session
- ✅ Requires authentication

### Integration Tests

**Test full flow:**
1. User authenticates and gets token
2. POST session data
3. GET session list and verify it appears
4. GET session by ID and verify data matches
5. Query with filters and verify results

## Success Criteria

- ✅ Database table created with all indexes
- ✅ POST endpoint accepts and validates data correctly
- ✅ GET endpoints return correct data with proper filtering
- ✅ All validation rules enforced
- ✅ Proper authorization (users can't see others' sessions)
- ✅ Error responses match specification
- ✅ All tests pass
- ✅ Frontend can successfully save Maths Quiz results
- ✅ Frontend can successfully save Gem Hunt results

## Example Test Cases

**Manual API Test with curl:**

```bash
# 1. Create a session
curl -X POST http://localhost:4000/api/games/sessions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gameType": "maths-quiz",
    "score": 80,
    "maxScore": 100,
    "timeElapsed": 120,
    "startedAt": "2026-09-27T15:00:00Z",
    "completedAt": "2026-09-27T15:02:00Z",
    "gameData": {
      "totalQuestions": 10,
      "correctAnswers": 8,
      "yearGroup": "Year 6",
      "subject": "Percentages"
    }
  }'

# Expected: 201 Created with session object

# 2. List sessions
curl http://localhost:4000/api/games/sessions?gameType=maths-quiz \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected: 200 OK with array of sessions

# 3. Get specific session
curl http://localhost:4000/api/games/sessions/SESSION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected: 200 OK with full session details
```

## Additional Features (Optional, but Nice to Have)

### 1. Statistics Endpoint
```typescript
GET /api/games/sessions/stats

Response:
{
  totalSessions: 45,
  byGameType: {
    'maths-quiz': 30,
    'gem-hunt': 15
  },
  averageScorePercentage: 78.5,
  totalTimePlayedSeconds: 3600,
  recentSessions: [...] // Last 5 sessions
}
```

### 2. Leaderboard Endpoint
```typescript
GET /api/games/leaderboard?gameType=maths-quiz&period=week

Response:
{
  leaderboard: [
    {
      rank: 1,
      username: "John Doe",
      averageScore: 95.5,
      totalSessions: 10
    },
    ...
  ]
}
```

### 3. PATCH Endpoint (for updating in-progress sessions)
```typescript
PATCH /api/games/sessions/:id

Body:
{
  score?: number;
  completedAt?: string;
  gameData?: Record<string, any>;
}
```

## Questions to Consider

1. **Database:** Are you using Prisma, Drizzle, TypeORM, or raw SQL?
2. **Existing patterns:** Look at how `/gem-hunt/sessions` or other endpoints are implemented
3. **User ID:** Where does `user_id` come from? (JWT token claims, usually)
4. **Error format:** What's your standard error response format?
5. **Logging:** What logging library do you use? (Winston, Pino, console.log?)
6. **Testing:** Jest, Vitest, or another framework?

## Reference Documentation

- See `docs/GAME_SESSIONS_API_PROPOSAL.md` for full architecture details
- See `src/games/MathsQuiz/MathsQuiz.tsx` for how frontend sends data
- Look at existing `/gem-hunt/sessions` endpoints for code patterns

## Commit Message Template

```
Add general game sessions API endpoint

- Create game_sessions table with indexes
- Add POST /api/games/sessions endpoint
- Add GET /api/games/sessions endpoint (list)
- Add GET /api/games/sessions/:id endpoint (single)
- Validate input with Zod schemas
- Support multiple game types (maths-quiz, gem-hunt, etc.)
- Proper authorization (users can only see own sessions)
- Comprehensive error handling and validation
- Add unit and integration tests

Enables all games to save session data to a unified endpoint
without requiring backend changes for each new game.
```

---

**Start by:**
1. Creating the database migration
2. Adding the routes and controller structure
3. Implementing validation
4. Testing with the Maths Quiz frontend
5. Verifying it works end-to-end
