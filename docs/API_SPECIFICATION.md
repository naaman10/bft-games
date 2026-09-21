# Gem Hunt API Specification

## Base URL
```
https://api.bftlearn.com/v1
```

## Authentication
All requests require Bearer token authentication:
```
Authorization: Bearer <token>
```

## Endpoints

### Game Sessions

#### Create New Session
```http
POST /game-sessions
Content-Type: application/json

{
  "userId": "uuid",
  "yearGroup": "Year 6",
  "subject": "Percentages"
}

Response 201:
{
  "sessionId": "uuid",
  "userId": "uuid",
  "yearGroup": "Year 6",
  "subject": "Percentages",
  "currentLevel": 1,
  "totalGems": 0,
  "lives": 5,
  "movesRemaining": 0,
  "startedAt": "2026-09-21T11:00:00Z"
}
```

#### Get Session
```http
GET /game-sessions/:sessionId

Response 200:
{
  "sessionId": "uuid",
  "userId": "uuid",
  "yearGroup": "Year 6",
  "subject": "Percentages",
  "currentLevel": 2,
  "totalGems": 15,
  "lives": 3,
  "movesRemaining": 12,
  "startedAt": "2026-09-21T11:00:00Z",
  "lastPlayedAt": "2026-09-21T11:30:00Z"
}
```

#### Update Session Progress
```http
PATCH /game-sessions/:sessionId
Content-Type: application/json

{
  "currentLevel": 2,
  "totalGems": 20,
  "lives": 4,
  "movesRemaining": 8
}

Response 200:
{
  "sessionId": "uuid",
  "updated": true
}
```

#### Complete Session
```http
POST /game-sessions/:sessionId/complete

Response 200:
{
  "sessionId": "uuid",
  "completed": true,
  "finalScore": 45,
  "levelsCompleted": 3
}
```

### Questions

#### Get Questions for Quiz
```http
GET /questions?yearGroup=Year6&subject=Percentages&count=5

Response 200:
{
  "questions": [
    {
      "id": "uuid",
      "questionText": "What is 25% of 80?",
      "yearGroup": "Year 6",
      "subject": "Percentages",
      "difficultyLevel": 1
    },
    // ... 4 more questions
  ]
}
```

#### Validate Answer
```http
POST /questions/validate
Content-Type: application/json

{
  "sessionId": "uuid",
  "questionId": "uuid",
  "answer": "20"
}

Response 200:
{
  "questionId": "uuid",
  "correct": true,
  "movesEarned": 5,
  "correctAnswer": "20"
}

Response 200 (incorrect):
{
  "questionId": "uuid",
  "correct": false,
  "movesEarned": 0,
  "correctAnswer": "20",
  "livesRemaining": 4
}
```

#### Batch Validate Answers
```http
POST /questions/batch-validate
Content-Type: application/json

{
  "sessionId": "uuid",
  "answers": [
    { "questionId": "uuid1", "answer": "20" },
    { "questionId": "uuid2", "answer": "42" }
  ]
}

Response 200:
{
  "results": [
    { "questionId": "uuid1", "correct": true, "movesEarned": 5 },
    { "questionId": "uuid2", "correct": true, "movesEarned": 5 }
  ],
  "totalMovesEarned": 10,
  "correctCount": 2,
  "incorrectCount": 0,
  "livesRemaining": 5
}
```

### Progress

#### Get User Progress
```http
GET /progress/:userId?yearGroup=Year6&subject=Percentages

Response 200:
{
  "userId": "uuid",
  "yearGroup": "Year 6",
  "subject": "Percentages",
  "levels": [
    {
      "levelNumber": 1,
      "completed": true,
      "gemsCollected": 5,
      "completedAt": "2026-09-21T11:15:00Z",
      "timeTakenSeconds": 300
    },
    {
      "levelNumber": 2,
      "completed": false,
      "gemsCollected": 3,
      "completedAt": null,
      "timeTakenSeconds": null
    }
  ],
  "totalGems": 8,
  "highestLevel": 2
}
```

#### Save Level Progress
```http
POST /progress/levels
Content-Type: application/json

{
  "userId": "uuid",
  "sessionId": "uuid",
  "yearGroup": "Year 6",
  "subject": "Percentages",
  "levelNumber": 1,
  "gemsCollected": 5,
  "completed": true,
  "timeTakenSeconds": 300
}

Response 201:
{
  "progressId": "uuid",
  "saved": true
}
```

### Leaderboard

#### Get Leaderboard
```http
GET /leaderboard?yearGroup=Year6&subject=Percentages&limit=100

Response 200:
{
  "yearGroup": "Year 6",
  "subject": "Percentages",
  "entries": [
    {
      "rank": 1,
      "userId": "uuid",
      "username": "StudentA",
      "totalGems": 150,
      "highestLevel": 5,
      "lastUpdated": "2026-09-21T10:00:00Z"
    },
    {
      "rank": 2,
      "userId": "uuid",
      "username": "StudentB",
      "totalGems": 145,
      "highestLevel": 5,
      "lastUpdated": "2026-09-20T15:30:00Z"
    }
    // ... more entries
  ],
  "total": 1250,
  "userRank": 15
}
```

#### Update Leaderboard Entry
```http
POST /leaderboard/update
Content-Type: application/json

{
  "userId": "uuid",
  "yearGroup": "Year 6",
  "subject": "Percentages",
  "totalGems": 45,
  "highestLevel": 3,
  "gamesPlayed": 1
}

Response 200:
{
  "userId": "uuid",
  "rank": 42,
  "updated": true
}
```

### Admin Endpoints

#### Add Question
```http
POST /admin/questions
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "yearGroup": "Year 6",
  "subject": "Percentages",
  "questionText": "What is 50% of 200?",
  "correctAnswer": "100",
  "difficultyLevel": 1
}

Response 201:
{
  "questionId": "uuid",
  "created": true
}
```

#### Bulk Import Questions
```http
POST /admin/questions/bulk
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "questions": [
    {
      "yearGroup": "Year 6",
      "subject": "Percentages",
      "questionText": "What is 50% of 200?",
      "correctAnswer": "100",
      "difficultyLevel": 1
    },
    // ... more questions
  ]
}

Response 201:
{
  "imported": 50,
  "failed": 0
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid year group specified",
  "code": "INVALID_INPUT"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token",
  "code": "AUTH_REQUIRED"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Session not found",
  "code": "SESSION_NOT_FOUND"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "code": "INTERNAL_ERROR",
  "requestId": "uuid"
}
```

## Rate Limiting

- **Standard Users**: 100 requests per minute
- **Game Sessions**: 500 requests per minute (higher limit for active gameplay)
- **Admin**: 1000 requests per minute

Headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1695294000
```

## Webhooks (Optional)

For real-time leaderboard updates, the parent app can register webhooks:

```http
POST /webhooks/register
Content-Type: application/json

{
  "url": "https://learn.bftlearn.com/webhooks/leaderboard",
  "events": ["leaderboard.updated"],
  "secret": "webhook-secret"
}
```

## PostMessage Events (iframe Communication)

### Parent → Game

```typescript
// Initialize game with user data
{
  type: 'INIT_GAME',
  payload: {
    userId: string,
    username: string,
    token: string,
    apiBaseUrl: string
  }
}

// Resume existing session
{
  type: 'RESUME_SESSION',
  payload: {
    sessionId: string
  }
}
```

### Game → Parent

```typescript
// Game ready
{
  type: 'GAME_READY',
  payload: {}
}

// Progress update
{
  type: 'PROGRESS_UPDATE',
  payload: {
    sessionId: string,
    level: number,
    gems: number,
    lives: number,
    moves: number
  }
}

// Level complete
{
  type: 'LEVEL_COMPLETE',
  payload: {
    sessionId: string,
    level: number,
    gemsCollected: number,
    timeTaken: number
  }
}

// Game complete
{
  type: 'GAME_COMPLETE',
  payload: {
    sessionId: string,
    totalGems: number,
    levelsCompleted: number,
    finalScore: number
  }
}
```
