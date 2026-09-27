# Quick Cursor Prompt: Implement Game Sessions API

Copy and paste this into Cursor:

---

## Task
Implement `/api/games/sessions` endpoint in bft-api for saving game session data from all games (Maths Quiz, Gem Hunt, etc.).

## 1. Database Migration

```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type VARCHAR(50) NOT NULL CHECK (game_type IN ('maths-quiz', 'gem-hunt', 'word-search')),
  score INTEGER NOT NULL CHECK (score >= 0),
  max_score INTEGER NOT NULL CHECK (max_score > 0),
  score_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score::decimal / max_score::decimal) * 100) STORED,
  time_elapsed_seconds INTEGER,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  game_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_score CHECK (score <= max_score)
);

CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_game_type ON game_sessions(game_type);
CREATE INDEX idx_game_sessions_user_type ON game_sessions(user_id, game_type);
CREATE INDEX idx_game_sessions_completed_at ON game_sessions(completed_at DESC);
CREATE INDEX idx_game_data ON game_sessions USING gin(game_data);
```

## 2. API Endpoints

### POST `/api/games/sessions` (Create Session)
**Auth:** Required  
**Body:**
```typescript
{
  gameType: 'maths-quiz' | 'gem-hunt' | 'word-search',
  score: number,
  maxScore: number,
  timeElapsed?: number,
  startedAt: string,      // ISO 8601
  completedAt?: string,   // ISO 8601
  gameData: object        // Flexible JSON
}
```
**Response:** 201 Created + session object

### GET `/api/games/sessions` (List Sessions)
**Auth:** Required  
**Query:** `?gameType=maths-quiz&limit=20&offset=0&startDate=...&endDate=...`  
**Response:** 200 OK + array of sessions (filtered to current user)

### GET `/api/games/sessions/:id` (Get One Session)
**Auth:** Required  
**Response:** 200 OK + session object (403 if not user's own session)

## 3. Validation (Zod)

```typescript
const GameSessionSchema = z.object({
  gameType: z.enum(['maths-quiz', 'gem-hunt', 'word-search']),
  score: z.number().int().min(0),
  maxScore: z.number().int().min(1),
  timeElapsed: z.number().int().min(0).optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  gameData: z.record(z.any()),
}).refine(data => data.score <= data.maxScore);
```

## 4. Example Request from Frontend

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
    "answers": [...]
  }
}
```

## 5. Requirements

- ✅ Users can only see their own sessions
- ✅ Validate: score <= maxScore, valid timestamps, valid gameType
- ✅ Extract user_id from JWT token
- ✅ Return proper errors: 400 (validation), 401 (auth), 403 (forbidden), 404 (not found)
- ✅ Follow existing codebase patterns (auth middleware, error handling, DB connection)
- ✅ Add tests

## Success Check
Frontend Maths Quiz should successfully POST to `/api/games/sessions` and receive 201 response.

See `docs/CURSOR_PROMPT_GAME_SESSIONS_API.md` for full details.
