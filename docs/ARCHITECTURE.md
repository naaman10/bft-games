# Gem Hunt - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     BFT Learn (Parent App)                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  User Dashboard                         │    │
│  │  - Authentication                                       │    │
│  │  - Game Selection                                       │    │
│  │  - Progress Tracking                                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                   ┌────────▼────────┐                           │
│                   │  iframe Embed   │                           │
│                   │  PostMessage    │                           │
│                   └────────┬────────┘                           │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              │ PostMessage API
                              │ (User Data, Auth Token)
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    BFT Games (This App)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Gem Hunt Game                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Game Setup Component                               │  │  │
│  │  │  - Year Group Selection                             │  │  │
│  │  │  - Subject Selection                                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                            │                              │  │
│  │  ┌────────────────────────▼────────────────────────────┐  │  │
│  │  │  Question Phase Component                            │  │  │
│  │  │  - Fetch 5 questions from API                        │  │  │
│  │  │  - Display question UI                               │  │  │
│  │  │  - Validate answers                                  │  │  │
│  │  │  - Award moves (5 per correct)                       │  │  │
│  │  │  - Deduct lives (wrong answers)                      │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                            │                              │  │
│  │  ┌────────────────────────▼────────────────────────────┐  │  │
│  │  │  Platform Phase (Phaser 3)                           │  │  │
│  │  │  ┌──────────────────────────────────────────────┐   │  │  │
│  │  │  │  Game Scene                                   │   │  │  │
│  │  │  │  - Render level                               │   │  │  │
│  │  │  │  - Player movement (costs moves)              │   │  │  │
│  │  │  │  - Gem crate interactions                     │   │  │  │
│  │  │  │  - Collision detection                        │   │  │  │
│  │  │  │  - Level completion                           │   │  │  │
│  │  │  └──────────────────────────────────────────────┘   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                            │                              │  │
│  │  ┌────────────────────────▼────────────────────────────┐  │  │
│  │  │  Game HUD                                            │  │  │
│  │  │  - Lives display (❤️ × 5)                           │  │  │
│  │  │  - Moves counter                                     │  │  │
│  │  │  - Gems counter                                      │  │  │
│  │  │  - Level indicator                                   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                   API Calls (REST/GraphQL)                      │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                         Backend API                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication Service                                   │  │
│  │  - JWT validation                                         │  │
│  │  - Session management                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Game Session Service                                     │  │
│  │  - Create/Resume session                                  │  │
│  │  - Update progress                                        │  │
│  │  - Save state                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Question Service                                         │  │
│  │  - Fetch random questions                                 │  │
│  │  - Validate answers                                       │  │
│  │  - Track question stats                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Progress Service                                         │  │
│  │  - Save level completion                                  │  │
│  │  - Track gems collected                                   │  │
│  │  - Update leaderboard                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Leaderboard Service                                      │  │
│  │  - Get rankings                                           │  │
│  │  - Update scores                                          │  │
│  │  - Filter by year/subject                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    Neon PostgreSQL Database                      │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   users      │ game_sessions│    level_    │  leaderboard │ │
│  │              │              │   progress   │              │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │  question_   │  question_   │ achievements │    user_     │ │
│  │    bank      │  responses   │              │ achievements │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### 1. Game Initialization
```
User clicks "Play Gem Hunt" in BFT Learn
    ↓
BFT Learn opens iframe with Gem Hunt URL
    ↓
Gem Hunt loads and sends GAME_READY message
    ↓
BFT Learn sends INIT_GAME with user data
    ↓
Gem Hunt stores user context and shows Setup screen
```

### 2. Game Setup Flow
```
User selects Year Group (e.g., Year 6)
    ↓
User selects Subject (e.g., Percentages)
    ↓
API: POST /game-sessions (create new session)
    ↓
Game transitions to Question Phase
```

### 3. Question Phase Flow
```
API: GET /questions?yearGroup=Year6&subject=Percentages&count=5
    ↓
Display question 1 to user
    ↓
User submits answer
    ↓
API: POST /questions/validate
    ↓
If correct: +5 moves, show next question
If wrong: -1 life, show next question
    ↓
Repeat for all 5 questions
    ↓
Total moves earned: (correct_count × 5)
    ↓
Transition to Platform Phase
```

### 4. Platform Phase Flow
```
Load Phaser scene for current level
    ↓
Render level environment
    ↓
Player presses movement key
    ↓
Check: moves_remaining > 0?
    ├─ Yes: Execute move, decrement counter
    └─ No: Block movement, prompt for more questions
    ↓
Player reaches gem crate
    ↓
Collect gem, increment counter
    ↓
Player reaches level end
    ↓
API: POST /progress/levels (save level completion)
    ↓
Show Level Complete screen
    ↓
Load next level or Game Complete
```

### 5. Progress Saving Flow
```
Every significant event (level complete, lives lost, etc.)
    ↓
API: PATCH /game-sessions/:id (update session)
    ↓
Game sends progress update to parent via PostMessage
    ↓
Parent app updates its UI
```

### 6. Leaderboard Update Flow
```
Game session completes
    ↓
API: POST /leaderboard/update
    ↓
Database updates leaderboard entry
    ↓
Recalculate rankings
    ↓
Return new rank to game
    ↓
Display to user
```

## State Management

### React Context Structure
```typescript
interface GemHuntGameState {
  // User & Session
  user: {
    id: string;
    username: string;
    token: string;
  } | null;
  
  session: {
    id: string;
    yearGroup: string;
    subject: string;
  } | null;
  
  // Game Progress
  progress: {
    currentLevel: number;
    lives: number;
    movesRemaining: number;
    totalGems: number;
  };
  
  // Current Phase
  phase: 'setup' | 'questions' | 'platform' | 'levelComplete' | 'gameOver';
  
  // Question Phase State
  questions: {
    current: Question[];
    answeredCount: number;
    correctCount: number;
  };
  
  // Platform Phase State
  platform: {
    playerPosition: { x: number; y: number };
    collectedCrates: string[];
    levelData: LevelData | null;
  };
}
```

### Actions
```typescript
type GameAction =
  | { type: 'INIT_USER'; payload: UserData }
  | { type: 'START_SESSION'; payload: SessionData }
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'LOAD_QUESTIONS'; payload: Question[] }
  | { type: 'ANSWER_QUESTION'; payload: { correct: boolean; movesEarned: number } }
  | { type: 'USE_MOVE' }
  | { type: 'COLLECT_GEM'; payload: { crateId: string; gemValue: number } }
  | { type: 'LOSE_LIFE' }
  | { type: 'COMPLETE_LEVEL'; payload: { level: number; gems: number } }
  | { type: 'GAME_OVER' };
```

## Data Flow Diagram

```
┌──────────────┐      PostMessage      ┌──────────────┐
│  BFT Learn   │ ←──────────────────→  │  Gem Hunt    │
│  (Parent)    │    User Data, Auth    │   (iframe)   │
└──────────────┘    Progress Updates   └──────┬───────┘
                                              │
                                         REST API
                                              │
                                    ┌─────────▼─────────┐
                                    │   Backend API     │
                                    │  (Node/Express)   │
                                    └─────────┬─────────┘
                                              │
                                         SQL Queries
                                              │
                                    ┌─────────▼─────────┐
                                    │  Neon PostgreSQL  │
                                    │    Database       │
                                    └───────────────────┘
```

## Technology Stack Summary

### Frontend (Gem Hunt Game)
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Phaser 3** - Game engine for platform phase
- **React Context + useReducer** - State management
- **Vite** - Build tool
- **PostMessage API** - iframe communication

### Backend (API)
- **Node.js** - Runtime
- **Express** or **Fastify** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **PostgreSQL client** (pg or Prisma)

### Database
- **Neon PostgreSQL** - Cloud database
- **PostgreSQL 15+** - Database engine

### DevOps
- **Vercel** or **Netlify** - Frontend hosting
- **Railway** or **Render** - Backend hosting
- **GitHub Actions** - CI/CD

## Security Considerations

### 1. iframe Security
- Set appropriate `Content-Security-Policy` headers
- Validate origin in PostMessage handlers
- Use HTTPS only

### 2. API Security
- JWT token validation on all endpoints
- Rate limiting per user/IP
- Input sanitization
- SQL injection prevention (parameterized queries)

### 3. Database Security
- Row-level security policies
- Encrypted connections
- Regular backups
- Least privilege access

### 4. Answer Validation
- Always validate server-side (never trust client)
- Hash sensitive data
- Prevent answer exposure in API responses

## Performance Optimization

### 1. Frontend
- Code splitting (lazy load Phaser)
- Asset optimization (sprite sheets, compressed images)
- Memoization of expensive computations
- Virtual scrolling for leaderboards

### 2. Backend
- Database connection pooling
- Query optimization (indexes)
- Caching (Redis for leaderboards)
- CDN for static assets

### 3. Database
- Proper indexing
- Query result caching
- Batch operations where possible
- Materialized views for leaderboards

## Scaling Strategy

### Phase 1: MVP (< 1000 users)
- Single backend server
- Neon's free tier database
- Simple caching with node-cache

### Phase 2: Growth (1000-10000 users)
- Multiple backend instances
- Database connection pooling
- Redis for caching
- CDN for assets

### Phase 3: Scale (10000+ users)
- Load balancer
- Horizontal scaling
- Database read replicas
- Advanced caching strategies
- Monitoring and alerting
