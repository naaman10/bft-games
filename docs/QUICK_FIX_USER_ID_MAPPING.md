# Quick Fix: User ID Mapping in Game Sessions API

Copy and paste this into Cursor:

---

## Problem
`/api/games/sessions` returns 500 error: `violates foreign key constraint "game_sessions_user_id_fkey"`

**Cause:** JWT token has `neon_user_id` (Neon Auth ID), but we need internal `user_id` (database ID).

## Fix: Update Auth Middleware

Add user ID resolution to your authentication middleware:

```typescript
// middleware/auth.ts (or wherever you verify JWT)

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = await verifyToken(token);
    
    // Extract neon_user_id from token
    const neonUserId = decoded.sub || decoded.user_id;
    
    // Look up internal user_id in database
    const result = await db.query(
      'SELECT id, email, username FROM users WHERE neon_user_id = $1',
      [neonUserId]
    );

    if (!result.rows[0]) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach internal user_id to request
    req.user = {
      id: result.rows[0].id,        // Use THIS for game_sessions.user_id
      neonUserId: neonUserId,
      email: result.rows[0].email,
      username: result.rows[0].username,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}
```

## Database Check

Make sure `users` table has `neon_user_id`:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS neon_user_id VARCHAR(255) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_neon_user_id ON users(neon_user_id);
```

## Test

After fix, should see:

```
✅ POST /api/games/sessions → 201 Created
[MathsQuiz] Saved to API: { id: '...', scorePercentage: 100 }
```

See `docs/CURSOR_PROMPT_FIX_USER_ID_MAPPING.md` for detailed explanation.
