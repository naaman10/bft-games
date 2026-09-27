# Cursor Prompt: Fix User ID Mapping Issue in Game Sessions API

## Problem

The `/api/games/sessions` endpoint is returning a 500 error:

```
error: 'insert or update on table "game_sessions" violates 
       foreign key constraint "game_sessions_user_id_fkey"'
```

**Root Cause:** The JWT token contains `neon_user_id` (from Neon Auth), but we're trying to insert it directly into `game_sessions.user_id` which expects the internal database `user_id`.

**Current Flow (BROKEN):**
```
JWT Token → neon_user_id (e.g., "auth_abc123")
                ↓ (inserted directly)
game_sessions.user_id ❌ (violates FK constraint - user doesn't exist)
```

**Required Flow (FIXED):**
```
JWT Token → neon_user_id (e.g., "auth_abc123")
                ↓ (look up in users table)
users.neon_user_id → users.id (e.g., UUID "550e8400...")
                ↓ (use this)
game_sessions.user_id ✅ (FK constraint satisfied)
```

## Task

Add user ID resolution to the authentication middleware or game sessions controller so that:
1. We extract `neon_user_id` from the JWT token
2. We look up the corresponding internal `user_id` from the `users` table
3. We use the internal `user_id` for database operations

## Solution: Update Authentication Middleware

### Option A: Resolve in Auth Middleware (Recommended)

Update your authentication middleware (e.g., `middleware/auth.ts` or similar) to resolve the mapping:

```typescript
import { verifyToken } from './neon-auth'; // Your JWT verification
import db from './db'; // Your database connection

export async function authenticate(req, res, next) {
  try {
    // 1. Extract and verify JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // 2. Decode token - this contains neon_user_id
    const decoded = await verifyToken(token);
    
    // The neon_user_id might be in different fields depending on your JWT structure:
    const neonUserId = decoded.sub || decoded.user_id || decoded.userId;
    
    if (!neonUserId) {
      console.error('[Auth] No user ID found in token:', decoded);
      return res.status(401).json({ error: 'Invalid token: missing user ID' });
    }

    console.log('[Auth] Neon Auth user ID from token:', neonUserId);

    // 3. Look up internal user_id from database
    const result = await db.query(
      'SELECT id, email, username, neon_user_id FROM users WHERE neon_user_id = $1',
      [neonUserId]
    );

    if (!result.rows || result.rows.length === 0) {
      console.error('[Auth] No user found for neon_user_id:', neonUserId);
      return res.status(401).json({ 
        error: 'User not found',
        neonUserId 
      });
    }

    const user = result.rows[0];

    // 4. Attach resolved user data to request
    req.user = {
      id: user.id,                    // ⭐ Internal user_id - use this for DB operations
      neonUserId: user.neon_user_id,  // External Neon Auth ID
      email: user.email,
      username: user.username,
    };

    console.log('[Auth] Resolved to internal user_id:', req.user.id);
    
    next();
  } catch (error) {
    console.error('[Auth] Authentication failed:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
```

### Option B: Resolve in Game Sessions Controller

If you don't want to modify the auth middleware, add the resolution in the game sessions controller:

```typescript
// controllers/gameSessionController.ts

export async function createSession(req, res) {
  try {
    const { gameType, score, maxScore, timeElapsed, startedAt, completedAt, gameData } = req.body;
    
    // 1. Get neon_user_id from authenticated user (from JWT)
    const neonUserId = req.user.id || req.user.sub; // Adjust based on your auth setup
    
    console.log('[GameSessions] Creating session for neon_user_id:', neonUserId);
    
    // 2. Resolve to internal user_id
    const userResult = await db.query(
      'SELECT id FROM users WHERE neon_user_id = $1',
      [neonUserId]
    );

    if (!userResult.rows || userResult.rows.length === 0) {
      console.error('[GameSessions] User not found for neon_user_id:', neonUserId);
      return res.status(400).json({ 
        error: 'User not found',
        neonUserId 
      });
    }

    const internalUserId = userResult.rows[0].id;
    console.log('[GameSessions] Resolved to internal user_id:', internalUserId);

    // 3. Insert with internal user_id
    const result = await db.query(
      `INSERT INTO game_sessions (
        user_id, game_type, score, max_score, 
        time_elapsed_seconds, started_at, completed_at, game_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        internalUserId,  // ⭐ Use internal user_id here
        gameType,
        score,
        maxScore,
        timeElapsed,
        startedAt,
        completedAt,
        JSON.stringify(gameData)
      ]
    );

    console.log('[GameSessions] Session created successfully:', result.rows[0].id);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('[GameSessions] Error creating session:', error);
    res.status(500).json({ error: error.message });
  }
}
```

## Database Schema Verification

Make sure your `users` table has the `neon_user_id` column:

```sql
-- Check if column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'neon_user_id';

-- If it doesn't exist, add it:
ALTER TABLE users ADD COLUMN neon_user_id VARCHAR(255) UNIQUE;
CREATE INDEX idx_users_neon_user_id ON users(neon_user_id);
```

Expected schema:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,                      -- Internal ID (used for FKs)
  neon_user_id VARCHAR(255) UNIQUE NOT NULL, -- External Neon Auth ID
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Optional: Auto-Create Users

If users might not exist in your database yet, add auto-creation:

```typescript
// In authentication middleware after token verification

let user = await db.query(
  'SELECT id, email, username FROM users WHERE neon_user_id = $1',
  [neonUserId]
);

// Auto-create user if they don't exist
if (!user.rows || user.rows.length === 0) {
  console.log('[Auth] User not found, creating new user for neon_user_id:', neonUserId);
  
  user = await db.query(
    `INSERT INTO users (neon_user_id, email, username, created_at) 
     VALUES ($1, $2, $3, NOW()) 
     RETURNING id, email, username`,
    [
      neonUserId,
      decoded.email || 'unknown@example.com',
      decoded.username || decoded.email?.split('@')[0] || 'User'
    ]
  );
  
  console.log('[Auth] Created new user with id:', user.rows[0].id);
}

req.user = {
  id: user.rows[0].id,
  neonUserId: neonUserId,
  email: user.rows[0].email,
  username: user.rows[0].username,
};
```

## Testing

### 1. Check Token Structure

Add logging to see what's in your JWT:

```typescript
console.log('[Debug] Full JWT decoded:', JSON.stringify(decoded, null, 2));
console.log('[Debug] Available fields:', Object.keys(decoded));
```

Common JWT structures:
```json
{
  "sub": "auth_user_123",           // Standard JWT subject claim
  "user_id": "auth_user_123",       // Custom claim
  "email": "user@example.com",
  "iat": 1234567890
}
```

### 2. Test the Mapping Query

Run this manually in your database:

```sql
-- Using a sample neon_user_id from a JWT token
SELECT 
  id as internal_user_id,
  neon_user_id,
  email 
FROM users 
WHERE neon_user_id = 'YOUR_NEON_USER_ID_FROM_TOKEN';

-- If this returns nothing, the user doesn't exist yet!
```

### 3. Test End-to-End

After implementing the fix, you should see:

```
[Auth] Neon Auth user ID from token: auth_user_123
[Auth] Resolved to internal user_id: 550e8400-e29b-41d4-a716-446655440000
[GameSessions] Creating session for user_id: 550e8400-e29b-41d4-a716-446655440000
[GameSessions] Session created successfully: 660e8400-e29b-41d4-a716-446655440001
✅ 201 Created
```

## Expected Behavior

**Before Fix:**
```
POST /api/games/sessions
❌ 500 Internal Server Error
error: violates foreign key constraint "game_sessions_user_id_fkey"
```

**After Fix:**
```
POST /api/games/sessions
✅ 201 Created
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "gameType": "maths-quiz",
  "score": 100,
  "scorePercentage": 100.00,
  ...
}
```

## Error Handling Checklist

Add proper error messages for debugging:

```typescript
// If JWT verification fails
console.error('[Auth] JWT verification failed:', error);
return res.status(401).json({ error: 'Invalid token' });

// If neon_user_id not in token
console.error('[Auth] No user ID in token claims:', Object.keys(decoded));
return res.status(401).json({ error: 'Token missing user ID' });

// If user lookup fails
console.error('[Auth] User not found for neon_user_id:', neonUserId);
return res.status(401).json({ error: 'User not found', neonUserId });

// If database query fails
console.error('[Auth] Database error:', error);
return res.status(500).json({ error: 'Database error' });
```

## Files to Modify

Based on your codebase structure, update:
- `middleware/auth.ts` or `middleware/authenticate.ts` (Option A - Recommended)
- OR `controllers/gameSessionController.ts` (Option B)
- Possibly `services/authService.ts` if you have token verification there

## Success Criteria

- ✅ JWT token decoded successfully
- ✅ `neon_user_id` extracted from token
- ✅ `users` table queried with `neon_user_id`
- ✅ Internal `user_id` retrieved
- ✅ `game_sessions` insert uses internal `user_id`
- ✅ No more foreign key constraint violations
- ✅ Game sessions created successfully with 201 response
- ✅ Frontend shows: `[MathsQuiz] Saved to API: { id: '...', ... }`

## Questions for Your Codebase

1. **Where is JWT verification?** (middleware/auth.ts? middleware/authenticate.ts?)
2. **Which field has neon_user_id in JWT?** (sub? user_id? userId?)
3. **Database client?** (Prisma? pg? Drizzle? TypeORM?)
4. **Do users auto-create on first login?** (or must they be pre-created?)

Adjust the code above based on these answers.

---

**Start by:** Adding console.log to see what's in the JWT token, then implement the user ID resolution in your auth middleware.
