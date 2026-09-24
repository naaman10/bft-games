# Testing Gem Hunt API Integration

## Problem: Authenticated Mode Not Using Database Questions

If the authenticated frontend is falling back to local questions instead of using the database, follow these steps to diagnose:

---

## Step 1: Verify bft-api is Running

```bash
cd path/to/bft-api
npm run dev
```

Expected output:
```
Server listening on port 4000
```

Test the API is accessible:
```bash
curl http://localhost:4000/health
```

---

## Step 2: Verify Questions Are in Database

Connect to your database and check:

```sql
-- Check if questions table exists
SELECT COUNT(*) FROM gem_hunt_questions;

-- Should return 245 (or more)

-- Check questions for specific year/subject
SELECT COUNT(*) 
FROM gem_hunt_questions 
WHERE year_group = 'Year 6' 
  AND subject = 'Percentages'
  AND active = true;

-- Should return 20
```

If count is 0, you need to run the population script:

```bash
cd bft-api
psql $DATABASE_URL -f path/to/populate_questions.sql
```

---

## Step 3: Test the API Endpoint Directly

### Get a JWT Token

From bft-api, generate a test token or use an existing one:

```bash
# Replace with your actual student ID
export TEST_TOKEN="your-jwt-token-here"
```

### Test Questions Endpoint

```bash
curl "http://localhost:4000/gem-hunt/questions?yearGroup=Year%206&subject=Percentages&count=5" \
  -H "Authorization: Bearer $TEST_TOKEN"
```

**Expected Response:**
```json
{
  "questions": [
    {
      "id": "uuid-here",
      "yearGroup": "Year 6",
      "subject": "Percentages",
      "questionText": "What is 25% of 80?",
      "difficultyLevel": 2
    },
    ...
  ]
}
```

**If you get an error:**
- 401 Unauthorized → Token is invalid or expired
- 404 Not Found → Route not registered in bft-api
- 500 Server Error → Check bft-api logs for database errors

---

## Step 4: Check Frontend Configuration

### Verify API URL

Check `.env` file in bft-games:

```bash
cat .env
```

Should contain:
```
VITE_BFT_API_URL=http://localhost:4000
```

If missing, create it:
```bash
echo "VITE_BFT_API_URL=http://localhost:4000" > .env
```

### Restart Dev Server

After changing `.env`, restart:

```bash
npm run dev
```

---

## Step 5: Test with Browser Console

1. Open the game: http://localhost:3000/game/gem-hunt
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Look for these log messages:

### In Local Mode (No Token):
```
[API] No token - using local questions
```

### In Authenticated Mode (With Token):
```
[API] Fetching questions from http://localhost:4000/gem-hunt/questions?yearGroup=Year+6&subject=Percentages&count=5
[API] Successfully fetched 5 questions from database
```

### If API Fails:
```
[API] Failed to fetch from database: Error: GET /gem-hunt/questions → 404
[API] Falling back to local question bank for Year 6 Percentages
```

---

## Step 6: Test with Query Parameters

To test authenticated mode without the parent app:

```
http://localhost:3000/game/gem-hunt?token=YOUR_JWT_TOKEN&yearGroup=Year+5&subject=Fractions
```

Replace `YOUR_JWT_TOKEN` with a valid token from bft-api.

---

## Common Issues & Solutions

### Issue: "Using local question bank"

**Causes:**
1. bft-api not running
2. Wrong API URL in .env
3. CORS blocking the request
4. Questions not in database

**Solution:**
```bash
# 1. Start bft-api
cd bft-api && npm run dev

# 2. Check .env
cat .env  # Should show VITE_BFT_API_URL=http://localhost:4000

# 3. Check database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM gem_hunt_questions;"

# 4. Restart frontend
npm run dev
```

### Issue: "401 Unauthorized"

**Cause:** Invalid or expired JWT token

**Solution:**
Generate a fresh token from bft-api or use the parent app (bft-learn) to launch the game.

### Issue: "Empty questions response"

**Cause:** No questions for that year/subject combination

**Solution:**
Check what's in the database:
```sql
SELECT DISTINCT year_group, subject 
FROM gem_hunt_questions 
WHERE active = true 
ORDER BY year_group, subject;
```

### Issue: "Network request failed"

**Causes:**
1. bft-api not running on port 4000
2. Firewall blocking localhost:4000
3. Port already in use

**Solution:**
```bash
# Check if port 4000 is in use
lsof -i :4000

# Kill any process using it
kill -9 <PID>

# Restart bft-api
cd bft-api && npm run dev
```

---

## Debugging Checklist

Use this checklist to verify everything:

- [ ] bft-api server is running on port 4000
- [ ] Database migration `009_gem_hunt_tables.sql` applied
- [ ] Questions populated (245 total)
- [ ] Can query questions via SQL
- [ ] Can curl the `/gem-hunt/questions` endpoint
- [ ] `.env` file exists with `VITE_BFT_API_URL`
- [ ] Frontend dev server restarted after `.env` change
- [ ] Browser console shows API logs
- [ ] No CORS errors in browser console
- [ ] Valid JWT token being used

---

## Quick Test Script

Create a file `test-api.sh`:

```bash
#!/bin/bash

echo "=== Gem Hunt API Test ==="

echo "1. Testing bft-api health..."
curl -s http://localhost:4000/health && echo "✅ API is running" || echo "❌ API not responding"

echo -e "\n2. Checking database questions..."
psql $DATABASE_URL -tAc "SELECT COUNT(*) FROM gem_hunt_questions;" && echo "✅ Questions table exists" || echo "❌ Table not found"

echo -e "\n3. Testing questions endpoint (without auth)..."
curl -s http://localhost:4000/gem-hunt/questions?yearGroup=Year+6&subject=Percentages | jq '.questions | length' && echo "✅ Endpoint works" || echo "❌ Endpoint failed"

echo -e "\n4. Checking .env file..."
grep -q "VITE_BFT_API_URL" .env && echo "✅ .env configured" || echo "❌ .env missing"

echo -e "\nDone!"
```

Run it:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Need More Help?

If you're still seeing local questions in authenticated mode:

1. Share the browser console logs (F12 → Console)
2. Share the bft-api server logs
3. Confirm the JWT token is valid
4. Verify the questions are in the database with the exact year_group/subject strings

The logs will show exactly where the failure is happening!
