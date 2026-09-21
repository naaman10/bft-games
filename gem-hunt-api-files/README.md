# Gem Hunt API Files - Integration Guide

These files need to be manually copied to your `bft-api` repository.

## 📁 Files to Copy

### 1. Database Migration
```bash
# Copy this file:
migrations/007_gem_hunt_tables.sql

# To your bft-api:
bft-api/migrations/007_gem_hunt_tables.sql
```

### 2. Game Logic Library
```bash
# Copy this file:
lib/gem-hunt.ts

# To your bft-api:
bft-api/src/lib/gem-hunt.ts
```

### 3. API Routes
```bash
# Copy this file:
routes/gem-hunt.ts

# To your bft-api:
bft-api/src/routes/gem-hunt.ts
```

## ⚙️ Additional Changes Needed

### Update `bft-api/src/app.ts`

Add these lines:

```typescript
// Add to imports at top:
import { gemHunt } from "./routes/gem-hunt.js";

// Add to routes section:
app.route("/gem-hunt", gemHunt);
```

Full diff:
```diff
  import { healthRoutes } from "./routes/health.js";
  import { learnRoutes } from "./routes/learn.js";
  import { adminRoutes } from "./routes/admin.js";
  import { webhookRoutes } from "./routes/webhooks.js";
+ import { gemHunt } from "./routes/gem-hunt.js";
  import type { AppEnv } from "./types.js";

  // ... rest of file ...

  app.route("/health", healthRoutes);
  app.route("/learn", learnRoutes);
  app.route("/admin", adminRoutes);
  app.route("/webhooks", webhookRoutes);
+ app.route("/gem-hunt", gemHunt);
```

## 🚀 Quick Copy Commands

If you have both repos cloned locally:

```bash
# From this directory, assuming bft-api is in the same parent folder:
cp migrations/007_gem_hunt_tables.sql ../../bft-api/migrations/
cp lib/gem-hunt.ts ../../bft-api/src/lib/
cp routes/gem-hunt.ts ../../bft-api/src/routes/

# Then edit bft-api/src/app.ts manually
```

## 📝 Or Use Git Patch

Alternatively, use the patch file in the parent directory:

```bash
cd /path/to/bft-api
git apply ../bft-games/0001-Add-Gem-Hunt-game-API-endpoints-and-database-migrati.patch
```

## ✅ After Copying

1. Commit the changes in bft-api:
```bash
cd bft-api
git add migrations/ src/
git commit -m "Add Gem Hunt API endpoints and migration"
git push
```

2. Run the migration:
```bash
npm run migrate
```

3. Test the API:
```bash
npm run dev
# API will be available at http://localhost:4000/gem-hunt/*
```

## 🔗 API Endpoints Created

- `POST /gem-hunt/sessions` - Create game session
- `GET /gem-hunt/sessions/:id` - Get session
- `PATCH /gem-hunt/sessions/:id` - Update progress
- `GET /gem-hunt/questions` - Fetch questions
- `POST /gem-hunt/questions/validate` - Validate answer
- `POST /gem-hunt/levels/complete` - Save completion
- `GET /gem-hunt/leaderboard` - Get rankings

All endpoints require Neon Auth JWT authentication.

## 🆘 Need Help?

See the full integration guide in `docs/BFT_INTEGRATION_GUIDE.md`
