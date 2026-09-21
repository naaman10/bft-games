# Gem Hunt - BFT System Integration Guide

## Overview

This guide explains how to integrate Gem Hunt with the existing BFT Learn ecosystem, including authentication, database structure, and asset creation.

## Existing BFT System Architecture

### Current Database Tables (from bft-api)

The existing system has these tables:

#### 1. `students`
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  neon_user_id UUID UNIQUE,           -- Links to Neon Auth user
  invited_at TIMESTAMPTZ,
  target_points INTEGER,               -- Points goal
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### 2. `enrollments`
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  content_id TEXT NOT NULL,           -- Contentful entry ID
  status TEXT NOT NULL DEFAULT 'enrolled',
  progress_status TEXT NOT NULL DEFAULT 'not_started',
  progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, content_id)
);
```

#### 3. `points`
```sql
CREATE TABLE points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  content_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  points_earned INTEGER NOT NULL CHECK (points_earned > 0),
  points_available INTEGER NOT NULL CHECK (points_available > 0),
  source TEXT NOT NULL CHECK (source IN ('automatic', 'assessment')),
  awarded_by TEXT,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, question_id)
);
```

#### 4. `schema_migrations`
```sql
CREATE TABLE schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Authentication System

- **Neon Auth**: JWT-based authentication
- **JWT Verification**: Tokens validated against Neon Auth JWKS endpoint
- **User Linking**: `students.neon_user_id` links to Neon Auth user ID
- **API Endpoint**: `GET /learn/user` returns authenticated user details

## Database Integration Strategy

### ✅ Safe Approach: Separate Gem Hunt Tables

**DO NOT modify existing tables**. Create new tables specifically for Gem Hunt that reference existing student records.

### New Tables for Gem Hunt

We'll create these tables as a **separate migration** (numbered after existing ones):

#### Migration: `007_gem_hunt_tables.sql`

```sql
-- Game sessions for Gem Hunt
CREATE TABLE IF NOT EXISTS gem_hunt_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year_group VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  current_level INT DEFAULT 1,
  total_gems INT DEFAULT 0,
  lives_remaining INT DEFAULT 5,
  moves_remaining INT DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_gem_hunt_sessions_student ON gem_hunt_sessions(student_id);
CREATE INDEX idx_gem_hunt_sessions_active ON gem_hunt_sessions(student_id, completed) 
  WHERE completed = FALSE;
CREATE INDEX idx_gem_hunt_sessions_year_subject ON gem_hunt_sessions(year_group, subject);

-- Level progress for Gem Hunt
CREATE TABLE IF NOT EXISTS gem_hunt_level_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_id UUID REFERENCES gem_hunt_sessions(id) ON DELETE SET NULL,
  year_group VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  level_number INT NOT NULL,
  gems_collected INT DEFAULT 0,
  moves_used INT DEFAULT 0,
  questions_answered INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  time_taken_seconds INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, year_group, subject, level_number, session_id)
);

CREATE INDEX idx_gem_hunt_progress_student ON gem_hunt_level_progress(student_id);
CREATE INDEX idx_gem_hunt_progress_year_subject ON gem_hunt_level_progress(
  student_id, year_group, subject
);
CREATE INDEX idx_gem_hunt_progress_completed ON gem_hunt_level_progress(
  completed, completed_at
);

-- Leaderboard for Gem Hunt
CREATE TABLE IF NOT EXISTS gem_hunt_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year_group VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  total_gems INT DEFAULT 0,
  highest_level INT DEFAULT 1,
  total_games_played INT DEFAULT 0,
  total_time_played_seconds INT DEFAULT 0,
  average_accuracy DECIMAL(5, 2) DEFAULT 0.0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, year_group, subject)
);

CREATE INDEX idx_gem_hunt_leaderboard_ranking ON gem_hunt_leaderboard(
  year_group, subject, total_gems DESC
);
CREATE INDEX idx_gem_hunt_leaderboard_student ON gem_hunt_leaderboard(student_id);

-- Question bank for Gem Hunt
CREATE TABLE IF NOT EXISTS gem_hunt_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_group VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  question_text TEXT NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  alternative_answers TEXT[],
  hint TEXT,
  explanation TEXT,
  difficulty_level INT DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 3),
  times_asked INT DEFAULT 0,
  times_correct INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_gem_hunt_questions_year_subject ON gem_hunt_questions(
  year_group, subject, active
);
CREATE INDEX idx_gem_hunt_questions_difficulty ON gem_hunt_questions(difficulty_level);
CREATE INDEX idx_gem_hunt_questions_active ON gem_hunt_questions(active) WHERE active = TRUE;

-- Question responses for Gem Hunt
CREATE TABLE IF NOT EXISTS gem_hunt_question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES gem_hunt_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES gem_hunt_questions(id) ON DELETE CASCADE,
  user_answer VARCHAR(255),
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INT,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gem_hunt_responses_session ON gem_hunt_question_responses(session_id);
CREATE INDEX idx_gem_hunt_responses_question ON gem_hunt_question_responses(question_id);
CREATE INDEX idx_gem_hunt_responses_correctness ON gem_hunt_question_responses(is_correct);

-- Function to update question statistics
CREATE OR REPLACE FUNCTION update_gem_hunt_question_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE gem_hunt_questions
    SET 
        times_asked = times_asked + 1,
        times_correct = times_correct + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END
    WHERE id = NEW.question_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gem_hunt_question_statistics
    AFTER INSERT ON gem_hunt_question_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_gem_hunt_question_stats();

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_gem_hunt_leaderboard_entry(
    p_student_id UUID,
    p_year_group VARCHAR,
    p_subject VARCHAR,
    p_gems INT,
    p_level INT,
    p_time_seconds INT,
    p_accuracy DECIMAL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO gem_hunt_leaderboard (
        student_id, 
        year_group, 
        subject, 
        total_gems, 
        highest_level,
        total_games_played,
        total_time_played_seconds,
        average_accuracy,
        last_updated
    )
    VALUES (
        p_student_id,
        p_year_group,
        p_subject,
        p_gems,
        p_level,
        1,
        p_time_seconds,
        p_accuracy,
        NOW()
    )
    ON CONFLICT (student_id, year_group, subject)
    DO UPDATE SET
        total_gems = gem_hunt_leaderboard.total_gems + p_gems,
        highest_level = GREATEST(gem_hunt_leaderboard.highest_level, p_level),
        total_games_played = gem_hunt_leaderboard.total_games_played + 1,
        total_time_played_seconds = gem_hunt_leaderboard.total_time_played_seconds + p_time_seconds,
        average_accuracy = (
          gem_hunt_leaderboard.average_accuracy * gem_hunt_leaderboard.total_games_played + p_accuracy
        ) / (gem_hunt_leaderboard.total_games_played + 1),
        last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- View: Leaderboard with student details
CREATE OR REPLACE VIEW gem_hunt_leaderboard_with_students AS
SELECT 
    l.id,
    l.student_id,
    s.name as student_name,
    s.email,
    l.year_group,
    l.subject,
    l.total_gems,
    l.highest_level,
    l.total_games_played,
    l.total_time_played_seconds,
    l.average_accuracy,
    l.last_updated,
    RANK() OVER (
      PARTITION BY l.year_group, l.subject 
      ORDER BY l.total_gems DESC
    ) as rank
FROM gem_hunt_leaderboard l
JOIN students s ON l.student_id = s.id;

-- Sample questions for Year 6 Percentages
INSERT INTO gem_hunt_questions (year_group, subject, question_text, correct_answer, difficulty_level)
VALUES
  ('Year 6', 'Percentages', 'What is 25% of 80?', '20', 1),
  ('Year 6', 'Percentages', 'What is 50% of 120?', '60', 1),
  ('Year 6', 'Percentages', 'What is 10% of 200?', '20', 1),
  ('Year 6', 'Percentages', 'What is 75% of 40?', '30', 2),
  ('Year 6', 'Percentages', 'What is 20% of 150?', '30', 1),
  ('Year 6', 'Percentages', 'What is 30% of 100?', '30', 1),
  ('Year 6', 'Percentages', 'What is 15% of 80?', '12', 2),
  ('Year 6', 'Percentages', 'What is 60% of 50?', '30', 2),
  ('Year 6', 'Percentages', 'What is 5% of 200?', '10', 1),
  ('Year 6', 'Percentages', 'What is 40% of 75?', '30', 2)
ON CONFLICT DO NOTHING;
```

### Key Design Decisions

1. **Prefix all tables with `gem_hunt_`** - Avoids naming conflicts
2. **Reference existing `students` table** - Uses `student_id UUID REFERENCES students(id)`
3. **No modifications to existing tables** - Completely isolated
4. **CASCADE deletes** - If a student is deleted, their game data is removed
5. **Separate migration file** - Numbered `007_` to run after existing migrations

## Authentication Integration

### Option 1: Extend bft-api (Recommended)

Add Gem Hunt endpoints to the existing bft-api:

**File: `src/lib/gem-hunt.ts`**

```typescript
import { getDb } from "./db.js";
import { getStudentByNeonUserId } from "./students.js";

export async function createGemHuntSession(
  neonUserId: string,
  yearGroup: string,
  subject: string
) {
  const student = await getStudentByNeonUserId(neonUserId);
  
  if (!student) {
    throw new Error("Student not found");
  }

  const sql = getDb();
  const rows = await sql`
    INSERT INTO gem_hunt_sessions (student_id, year_group, subject)
    VALUES (${student.id}::uuid, ${yearGroup}, ${subject})
    RETURNING id, student_id, year_group, subject, current_level, 
              total_gems, lives_remaining, moves_remaining, 
              started_at, last_played_at
  `;

  return rows[0];
}

// Add more functions for questions, progress, leaderboard...
```

**File: `src/routes/gem-hunt.ts`**

```typescript
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { createGemHuntSession } from "../lib/gem-hunt.js";

const gemHunt = new Hono();

// All routes require authentication
gemHunt.use("*", authMiddleware);

// Create new game session
gemHunt.post("/sessions", async (c) => {
  const neonUserId = c.get("neonUserId");
  const { yearGroup, subject } = await c.req.json();
  
  const session = await createGemHuntSession(neonUserId, yearGroup, subject);
  
  return c.json(session, 201);
});

// Get random questions
gemHunt.get("/questions", async (c) => {
  // Implementation
});

// Validate answer
gemHunt.post("/questions/validate", async (c) => {
  // Implementation
});

// Save progress
gemHunt.patch("/sessions/:id/progress", async (c) => {
  // Implementation
});

// Get leaderboard
gemHunt.get("/leaderboard", async (c) => {
  // Implementation
});

export { gemHunt };
```

**File: `src/app.ts`** (add to existing app)

```typescript
import { gemHunt } from "./routes/gem-hunt.js";

// ... existing routes ...

app.route("/gem-hunt", gemHunt);
```

### Option 2: Separate Gem Hunt API

Create a standalone API service if you prefer isolation:

```
bft-gem-hunt-api/
├── src/
│   ├── lib/
│   │   ├── db.ts              # Reuse Neon connection
│   │   ├── auth.ts            # Verify Neon Auth JWT
│   │   └── gem-hunt.ts        # Game logic
│   ├── routes/
│   │   └── game.ts            # Game endpoints
│   └── index.ts
├── migrations/
│   └── 001_gem_hunt.sql       # Gem Hunt tables only
└── package.json
```

This approach keeps game logic separate but requires:
- Duplicate authentication code
- Separate deployment
- Cross-origin requests configuration

**Recommendation**: Use Option 1 (extend bft-api) for simplicity.

## iframe Communication

### From bft-learn → Gem Hunt Game

```typescript
// In bft-learn, after user authenticates
const session = await apiFetch("/learn/user");

const gameFrame = document.getElementById("gem-hunt-iframe");
gameFrame.contentWindow.postMessage({
  type: "INIT_GAME",
  payload: {
    neonUserId: session.user.id,
    username: session.user.name,
    email: session.user.email,
    token: accessToken, // JWT for API calls
    apiBaseUrl: "https://api.bftlearn.com"
  }
}, "https://games.bftlearn.com");
```

### From Gem Hunt → bft-learn

```typescript
// In Gem Hunt game
window.parent.postMessage({
  type: "PROGRESS_UPDATE",
  payload: {
    sessionId: gameSession.id,
    level: currentLevel,
    gems: totalGems,
    lives: livesRemaining
  }
}, "https://learn.bftlearn.com");
```

## Game Assets Guide

Since there's no budget for professional assets, here are free/open-source options:

### Option 1: Free Game Asset Libraries

#### Sprites & Characters
- **OpenGameArt.org** - https://opengameart.org/
  - Search "platformer character"
  - CC0 / CC-BY licenses (free to use)
  - Example: https://opengameart.org/content/platformer-art-complete-pack-often-updated

- **Itch.io** - https://itch.io/game-assets/free
  - Many free asset packs
  - Filter by "platformer"

- **Kenney.nl** - https://kenney.nl/assets
  - Massive library of CC0 assets
  - Platformer packs, characters, tiles
  - No attribution required

#### Recommended Packs (All Free)
1. **Kenney Platformer Pack** - https://kenney.nl/assets/platformer-art-deluxe
   - Platforms, tiles, items, characters
   - Multiple themes

2. **Pixel Adventure** - https://pixelfrog-assets.itch.io/pixel-adventure-1
   - Character sprites with animations
   - Tile sets, backgrounds

3. **Sunny Land** - https://ansimuz.itch.io/sunny-land-pixel-game-art
   - Bright, kid-friendly style
   - Perfect for educational games

### Option 2: Create Simple Assets

If you want custom assets, use these free tools:

#### Piskel (Pixel Art Editor)
- **Website**: https://www.piskelapp.com/
- Browser-based, free
- Perfect for creating simple sprites
- Export as sprite sheets

**Quick Tutorial**:
1. Create 32x32 canvas
2. Draw simple character (stick figure works!)
3. Create walk/jump animations (4-6 frames)
4. Export as sprite sheet PNG

#### Tiled Map Editor
- **Website**: https://www.mapeditor.org/
- Free, desktop app
- Create level layouts
- Export to JSON for Phaser

### Option 3: Programmer Art (Temporary)

Start with colored rectangles and circles:

```typescript
// In Phaser scene
create() {
  // Player: blue rectangle
  this.player = this.add.rectangle(100, 100, 32, 48, 0x0000ff);
  
  // Platform: brown rectangle
  this.add.rectangle(200, 400, 400, 32, 0x8b4513);
  
  // Gem crate: yellow square
  this.add.rectangle(300, 200, 32, 32, 0xffff00);
}
```

**Then replace with real assets later**.

### Asset Specifications for Gem Hunt

#### Player Character
- **Size**: 32x48 pixels (or 64x96 for high-res)
- **Animations needed**:
  - Idle (1-2 frames)
  - Walk (4-6 frames)
  - Jump (2-3 frames)
- **Style**: Friendly, cartoon-like, appropriate for ages 5-11

#### Environment
- **Tile size**: 32x32 pixels (standard for platformers)
- **Backgrounds**: 800x600 or larger
- **Parallax layers**: 2-3 layers for depth

#### Items
- **Gems**: 16x16 or 24x24 pixels
- **Crates**: 32x32 pixels
- **Flag/Portal**: 48x64 pixels

### Recommended Free Pack for Gem Hunt

**"Sunny Land" by Ansimuz** (Perfect for this project!)
- Link: https://ansimuz.itch.io/sunny-land-pixel-game-art
- License: Free for commercial use with attribution
- Includes: Character, tiles, items, backgrounds
- Style: Bright, friendly, age-appropriate

**Attribution**: Add to game credits screen:
```
"Sunny Land" assets by Ansimuz (ansimuz.itch.io)
```

## Migration Strategy

### Step 1: Add Migration to bft-api

```bash
cd /path/to/bft-api
cp /path/to/bft-games/database/schema.sql ./migrations/007_gem_hunt_tables.sql
```

### Step 2: Run Migration

```bash
npm run migrate
```

This will:
- Check existing `schema_migrations` table
- Apply `007_gem_hunt_tables.sql` if not already applied
- Track it in `schema_migrations`

### Step 3: Verify Tables Created

```bash
psql $DATABASE_URL -c "\dt gem_hunt*"
```

Should show:
```
 gem_hunt_sessions
 gem_hunt_level_progress
 gem_hunt_leaderboard
 gem_hunt_questions
 gem_hunt_question_responses
```

## Development Workflow

### Phase 1: Database & API (Week 1)
1. ✅ Add migration `007_gem_hunt_tables.sql` to bft-api
2. ✅ Run migration on development database
3. ✅ Create `src/lib/gem-hunt.ts` in bft-api
4. ✅ Add routes in `src/routes/gem-hunt.ts`
5. ✅ Test endpoints with Postman/curl

### Phase 2: Frontend Integration (Week 2-3)
1. ✅ Install Phaser 3 in bft-games
2. ✅ Create React-Phaser wrapper
3. ✅ Implement authentication flow (receive JWT from parent)
4. ✅ Call bft-api endpoints with JWT
5. ✅ Test in isolation

### Phase 3: iframe Integration (Week 4)
1. ✅ Add Gem Hunt link to bft-learn
2. ✅ Embed game in iframe
3. ✅ Implement PostMessage communication
4. ✅ Test end-to-end flow

## Security Considerations

### Database Safety
- ✅ All Gem Hunt tables isolated with `gem_hunt_` prefix
- ✅ Foreign keys use CASCADE DELETE (safe removal)
- ✅ No modifications to existing tables
- ✅ Separate migration file (can be rolled back independently)

### API Safety
- ✅ All endpoints require Neon Auth JWT
- ✅ Student ID derived from JWT (not client-provided)
- ✅ Answer validation server-side only
- ✅ Rate limiting per user

### iframe Safety
- ✅ Origin validation on PostMessage
- ✅ HTTPS only in production
- ✅ Content-Security-Policy headers
- ✅ No sensitive data in iframe messages

## Testing Checklist

### Database Testing
- [ ] Migration runs successfully
- [ ] All tables created with correct schema
- [ ] Foreign keys work correctly
- [ ] Triggers fire on question responses
- [ ] Leaderboard function works
- [ ] Views return correct data
- [ ] Existing `students` data unchanged

### API Testing
- [ ] Create session with valid JWT
- [ ] Reject requests without JWT
- [ ] Fetch questions for year/subject
- [ ] Validate correct answers
- [ ] Validate incorrect answers (life deduction)
- [ ] Save level progress
- [ ] Update leaderboard
- [ ] Get leaderboard rankings

### Integration Testing
- [ ] bft-learn can embed game iframe
- [ ] PostMessage sends user data to game
- [ ] Game receives and stores auth token
- [ ] Game makes successful API calls
- [ ] Progress updates sent to parent
- [ ] Parent app updates UI with progress

## Rollback Plan

If issues arise, rollback the Gem Hunt migration:

```sql
-- Rollback script (run manually)
DROP VIEW IF EXISTS gem_hunt_leaderboard_with_students;
DROP TRIGGER IF EXISTS update_gem_hunt_question_statistics ON gem_hunt_question_responses;
DROP FUNCTION IF EXISTS update_gem_hunt_question_stats();
DROP FUNCTION IF EXISTS update_gem_hunt_leaderboard_entry(UUID, VARCHAR, VARCHAR, INT, INT, INT, DECIMAL);
DROP TABLE IF EXISTS gem_hunt_question_responses;
DROP TABLE IF EXISTS gem_hunt_questions;
DROP TABLE IF EXISTS gem_hunt_leaderboard;
DROP TABLE IF EXISTS gem_hunt_level_progress;
DROP TABLE IF EXISTS gem_hunt_sessions;
DELETE FROM schema_migrations WHERE id = '007_gem_hunt_tables.sql';
```

This removes all Gem Hunt data **without touching existing tables**.

## Next Steps

1. Review this integration guide with the team
2. Decide: Extend bft-api OR create separate game API
3. Add migration to bft-api repository
4. Run migration on development database
5. Begin Phase 1 implementation

## Questions?

- Authentication issues? Check JWT validation in bft-api `src/lib/auth.ts`
- Database connection? Verify `DATABASE_URL` environment variable
- Migration conflicts? Ensure unique table names with `gem_hunt_` prefix
