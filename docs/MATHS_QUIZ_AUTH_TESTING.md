# Maths Quiz Authentication Testing Guide

This document provides instructions for testing the new authentication and postMessage integration in the maths-quiz game.

## Overview

The maths-quiz game now supports receiving authentication from a parent frame (bft-learn) via postMessage and sending quiz completion results back.

## Files Changed

- ✅ `src/games/MathsQuiz/hooks/useQuizAuth.ts` (NEW)
- ✅ `src/games/MathsQuiz/services/postMessage.ts` (NEW)
- ✅ `src/games/MathsQuiz/MathsQuiz.tsx` (MODIFIED)
- ✅ `src/games/MathsQuiz/components/QuizSetup.tsx` (MODIFIED)
- ✅ `src/games/MathsQuiz/components/QuizResults.tsx` (MODIFIED)

## Message Flow

### 1. Game → Parent: GAME_READY (on mount)
Sent automatically when the game component mounts.

```javascript
{
  type: "GAME_READY"
}
```

### 2. Parent → Game: INIT_GAME (authentication)
Parent sends this with user credentials.

```javascript
{
  type: "INIT_GAME",
  payload: {
    token: "eyJhbGciOiJSUzI1NiIs...",
    apiBaseUrl: "https://bft-api.onrender.com",
    username: "John Doe",
    yearGroup: "Year 6",
    subject: "Percentages"
  }
}
```

### 3. Game → Parent: QUIZ_COMPLETE (on completion)
Sent when user finishes the quiz.

```javascript
{
  type: "QUIZ_COMPLETE",
  payload: {
    score: 100,
    totalQuestions: 10,
    correctAnswers: 10,
    timeElapsed: 120,
    yearGroup: "Year 6",
    subject: "Percentages",
    difficulty: "medium",
    answers: [
      {
        questionId: "q1",
        userAnswer: "50",
        correct: true,
        timeSpent: 12
      }
      // ... more answers
    ]
  }
}
```

## Manual Testing

### Test 1: Standalone Mode (No Parent Frame)

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3001/maths-quiz` (or whatever port)

3. Expected behavior:
   - Game loads after 3 seconds (waiting for INIT_GAME)
   - No authentication → "Sign in to save results" banner shows
   - Quiz works normally
   - Console shows: `[MathsQuiz] No INIT_GAME received from parent; starting in guest mode`

### Test 2: Authentication via Browser Console

1. Open the game standalone
2. Open browser console
3. Run this command:
   ```javascript
   window.postMessage({
     type: 'INIT_GAME',
     payload: {
       token: 'test-token-12345',
       apiBaseUrl: 'http://localhost:4000',
       username: 'Test User',
       yearGroup: 'Year 6',
       subject: 'Fractions'
     }
   }, '*');
   ```

4. Expected console output:
   ```
   [MathsQuiz] Received postMessage: { type: 'INIT_GAME', ... }
   [MathsQuiz] INIT_GAME received with token! Applying auth payload
   [MathsQuiz] Received INIT_GAME: { token: 'test-token-12345', ... }
   [MathsQuiz] Authentication configured: { hasToken: true, ... }
   ```

5. Expected behavior:
   - Welcome message shows: "👤 Welcome, Test User!"
   - "Sign in" banner does NOT show at the end
   - Quiz completion sends QUIZ_COMPLETE message

### Test 3: Integration with bft-learn

1. Run bft-games: `npm run dev` (port 3001)
2. Run bft-learn: `npm run dev` (port 3000)
3. Sign in to bft-learn
4. Navigate to `/games/quiz-generator` in bft-learn

5. Expected console output:
   ```
   [QuizGeneratorFrame] INIT_GAME sent successfully
   [MathsQuiz] Component mounted
   [MathsQuiz] Sending GAME_READY to parent
   [MathsQuiz] Received postMessage: { type: 'INIT_GAME', ... }
   [MathsQuiz] INIT_GAME received with token!
   [MathsQuiz] Authentication configured: { hasToken: true }
   ```

6. Complete the quiz

7. Expected console output:
   ```
   [MathsQuiz] Quiz completed, preparing to send results
   [MathsQuiz] Sending QUIZ_COMPLETE to parent: { score: 80, ... }
   [QuizGeneratorFrame] QUIZ_COMPLETE message received!
   ```

### Test 4: Authentication via URL Query Params

1. Navigate to: `http://localhost:3001/maths-quiz?token=test123&username=URLUser&yearGroup=Year+5&subject=Division`

2. Expected behavior:
   - Game authenticates immediately (no 3-second wait)
   - Welcome message: "👤 Welcome, URLUser!"
   - No "Sign in" banner

## Console Logging

All major events are logged for debugging:

- `[MathsQuiz] Component mounted`
- `[MathsQuiz] Sending GAME_READY to parent`
- `[MathsQuiz] Received postMessage: {...}`
- `[MathsQuiz] INIT_GAME received with token!`
- `[MathsQuiz] Authentication configured: {...}`
- `[MathsQuiz] Quiz completed, preparing to send results`
- `[MathsQuiz] Sending QUIZ_COMPLETE to parent: {...}`
- `[MathsQuiz] Saved to API: {...}` (if API save succeeds)
- `[MathsQuiz] Failed to save to API: {...}` (if API save fails)

## Expected Behavior Checklist

- ✅ Game sends `GAME_READY` on mount
- ✅ Game receives `INIT_GAME` messages
- ✅ Authentication token is stored
- ✅ "Sign in" banner hidden when authenticated
- ✅ Welcome message shown when authenticated
- ✅ Game sends `QUIZ_COMPLETE` with full results
- ✅ Results include score, answers, time, etc.
- ✅ Falls back to guest mode after 3 seconds if no auth
- ✅ Works in standalone mode
- ✅ Works when embedded in iframe

## Security Notes

Messages are only accepted from allowed origins:
- `http://localhost:3000`
- `http://localhost:3001`
- `https://localhost:3000`
- `https://learn.brighterfuturestutoring.com`
- `*.vercel.app` (preview deployments)
- `*.brighterfuturestutoring.com` (production)

To customize allowed origins, set `VITE_PARENT_ORIGINS` environment variable:
```bash
VITE_PARENT_ORIGINS=http://localhost:3000,https://custom-domain.com
```

## Troubleshooting

### Issue: "Sign in" banner still shows when authenticated

**Check:**
1. Console shows `[MathsQuiz] Authentication configured: { hasToken: true }`
2. `isAuthenticated` prop is `true` in QuizResults component
3. Origin is allowed (check console for warnings)

### Issue: QUIZ_COMPLETE not sent

**Check:**
1. Console shows `[MathsQuiz] Sending QUIZ_COMPLETE to parent:`
2. Parent is listening for postMessage events
3. Parent origin is allowed

### Issue: Game waits 3 seconds before loading

**This is normal** when:
- Running standalone (not in iframe)
- No query params with token
- Waiting for INIT_GAME from parent

**To skip wait:**
- Add `?token=test` to URL
- Embed in parent frame and send INIT_GAME

## Next Steps

The parent frame (bft-learn) needs to:

1. **Listen for QUIZ_COMPLETE:**
   ```javascript
   window.addEventListener('message', (event) => {
     if (event.data?.type === 'QUIZ_COMPLETE') {
       const results = event.data.payload;
       // Save to database via API
       // Update UI with success message
     }
   });
   ```

2. **Save results to backend:**
   - POST to `/quiz-generator/sessions` endpoint
   - Include results payload
   - Show success/error to user

3. **Update student progress:**
   - Aggregate quiz statistics
   - Update progress tracking
   - Show in student dashboard

## Related Files in bft-learn

Look for these files in the bft-learn repository:
- `QuizGeneratorFrame.tsx` (or similar) - Parent component that embeds the quiz
- Quiz completion handler that receives QUIZ_COMPLETE messages
- API client that saves results to backend
