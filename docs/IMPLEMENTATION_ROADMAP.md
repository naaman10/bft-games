# Gem Hunt - Implementation Roadmap

This document outlines the step-by-step implementation plan for the Gem Hunt game.

## Overview

The implementation is broken into 7 phases, each building on the previous one. Each phase should result in a working, testable feature increment.

---

## Phase 1: Core Setup & Foundation (Week 1)

### Goal
Get Phaser 3 working within React and create a basic playable prototype.

### Tasks

#### 1.1 Project Setup
- [x] Create planning documents
- [ ] Install Phaser 3 dependencies
- [ ] Set up TypeScript types for Phaser
- [ ] Configure Vite for Phaser assets
- [ ] Create basic folder structure

```bash
npm install phaser
npm install --save-dev @types/phaser
```

#### 1.2 Phaser Integration
- [ ] Create Phaser game config
- [ ] Build React wrapper component for Phaser
- [ ] Implement game lifecycle (init, mount, cleanup)
- [ ] Test hot module replacement

**Files to Create:**
- `src/games/GemHunt/game/config.ts`
- `src/games/GemHunt/components/PlatformPhase.tsx`

#### 1.3 Basic Player & Movement
- [ ] Create Player entity class
- [ ] Implement keyboard controls (arrow keys, WASD)
- [ ] Add basic physics (gravity, collision)
- [ ] Create simple test scene with platforms

**Files to Create:**
- `src/games/GemHunt/game/entities/Player.ts`
- `src/games/GemHunt/game/scenes/TestScene.ts`

#### 1.4 Move Counter System
- [ ] Create move counter state
- [ ] Decrement on each movement action
- [ ] Freeze player when moves = 0
- [ ] Display moves remaining

**Deliverable:** Playable demo where player can move around a test level with limited moves.

---

## Phase 2: Question System (Week 2)

### Goal
Build the question-answer UI and integrate with move generation.

### Tasks

#### 2.1 Game State Management
- [ ] Set up React Context for game state
- [ ] Create GameReducer with actions
- [ ] Implement state persistence (localStorage)

**Files to Create:**
- `src/games/GemHunt/context/GameContext.tsx`
- `src/games/GemHunt/context/GameReducer.ts`
- `src/games/GemHunt/types/game.ts`

#### 2.2 Question Data Structure
- [ ] Define Question type
- [ ] Create static question bank (fallback)
- [ ] Implement question filtering (year/subject)

**Files to Create:**
- `src/games/GemHunt/types/questions.ts`
- `src/games/GemHunt/data/questionBank.ts`

#### 2.3 Question Phase UI
- [ ] Create QuestionPhase component
- [ ] Build question display card
- [ ] Add answer input field
- [ ] Implement submit button
- [ ] Show progress (1/5, 2/5, etc.)

**Files to Create:**
- `src/games/GemHunt/components/QuestionPhase.tsx`
- `src/games/GemHunt/components/QuestionPhase.css`

#### 2.4 Answer Validation
- [ ] Create answer validation logic
- [ ] Handle correct answers (+5 moves)
- [ ] Handle wrong answers (-1 life)
- [ ] Show feedback (correct/incorrect)
- [ ] Transition after 5 questions

**Files to Create:**
- `src/games/GemHunt/services/validation.ts`

#### 2.5 Lives System
- [ ] Implement lives state (5 max)
- [ ] Create lives display UI (hearts)
- [ ] Handle game over (0 lives)

**Deliverable:** Complete question-answer flow that awards moves for correct answers.

---

## Phase 3: Platform Game Core (Week 3)

### Goal
Build Level 1 with gem collection and level completion.

### Tasks

#### 3.1 Level Design System
- [ ] Create level configuration format
- [ ] Define platform placement system
- [ ] Design Level 1 layout (on paper/Tiled)
- [ ] Implement level loading

**Files to Create:**
- `src/games/GemHunt/data/levelConfigs.ts`
- `src/games/GemHunt/game/scenes/Level1Scene.ts`

#### 3.2 Platform & Collision
- [ ] Create platform tiles
- [ ] Implement collision detection
- [ ] Add ground, platforms, walls
- [ ] Test player movement on platforms

#### 3.3 Gem Crates
- [ ] Create Crate entity
- [ ] Create Gem entity
- [ ] Implement crate interaction (collision)
- [ ] Add gem collection animation
- [ ] Update gem counter

**Files to Create:**
- `src/games/GemHunt/game/entities/Crate.ts`
- `src/games/GemHunt/game/entities/Gem.ts`

#### 3.4 Level Completion
- [ ] Add level end marker (flag/portal)
- [ ] Detect level completion
- [ ] Show level complete screen
- [ ] Calculate and display stats

**Files to Create:**
- `src/games/GemHunt/components/LevelComplete.tsx`

#### 3.5 Game HUD
- [ ] Create HUD component overlay
- [ ] Display lives (hearts)
- [ ] Display moves remaining
- [ ] Display gems collected
- [ ] Display current level

**Files to Create:**
- `src/games/GemHunt/components/GameHUD.tsx`
- `src/games/GemHunt/components/GameHUD.css`

**Deliverable:** Playable Level 1 with gem collection and completion.

---

## Phase 4: Database & API Integration (Week 4)

### Goal
Connect game to backend API and database for persistence.

### Tasks

#### 4.1 Database Setup
- [ ] Set up Neon database account
- [ ] Run schema.sql to create tables
- [ ] Add sample questions to question_bank
- [ ] Test database connections

#### 4.2 Backend API Development
- [ ] Set up Node/Express backend project
- [ ] Implement authentication middleware
- [ ] Create game session endpoints
- [ ] Create question endpoints
- [ ] Create progress endpoints
- [ ] Create leaderboard endpoints

**Files to Create:**
- `backend/src/routes/sessions.ts`
- `backend/src/routes/questions.ts`
- `backend/src/routes/progress.ts`
- `backend/src/routes/leaderboard.ts`

#### 4.3 Frontend API Client
- [ ] Create API client service
- [ ] Implement HTTP request wrapper
- [ ] Add error handling
- [ ] Add request caching

**Files to Create:**
- `src/games/GemHunt/services/api.ts`
- `src/games/GemHunt/types/api.ts`

#### 4.4 Session Management
- [ ] Create session on game start
- [ ] Save session ID in state
- [ ] Auto-save progress every 30s
- [ ] Resume session on reload

**Files to Create:**
- `src/games/GemHunt/hooks/useGameSession.ts`

#### 4.5 Question Fetching
- [ ] Fetch questions from API
- [ ] Implement question caching
- [ ] Validate answers via API
- [ ] Track question responses

**Files to Create:**
- `src/games/GemHunt/hooks/useQuestions.ts`

#### 4.6 Progress Saving
- [ ] Save level completion to API
- [ ] Update session progress
- [ ] Sync local and remote state

**Files to Create:**
- `src/games/GemHunt/hooks/useProgress.ts`

**Deliverable:** Game fully connected to database with persistence.

---

## Phase 5: iframe Communication (Week 5)

### Goal
Implement PostMessage API for parent-child communication.

### Tasks

#### 5.1 PostMessage Service
- [ ] Create PostMessage wrapper
- [ ] Implement message validation
- [ ] Add origin checking
- [ ] Create type-safe message interfaces

**Files to Create:**
- `src/games/GemHunt/services/postMessage.ts`
- `src/games/GemHunt/types/messages.ts`

#### 5.2 Message Handlers
- [ ] Listen for INIT_GAME message
- [ ] Handle RESUME_SESSION message
- [ ] Handle GET_PROGRESS message
- [ ] Send GAME_READY on load
- [ ] Send PROGRESS_UPDATE on changes
- [ ] Send LEVEL_COMPLETE on completion

**Files to Create:**
- `src/games/GemHunt/hooks/useIframeComm.ts`

#### 5.3 Authentication Flow
- [ ] Receive token from parent
- [ ] Store token securely
- [ ] Include token in API requests
- [ ] Handle token refresh

#### 5.4 Testing
- [ ] Create test parent HTML page
- [ ] Test message sending/receiving
- [ ] Test authentication flow
- [ ] Test error scenarios

**Files to Create:**
- `public/test-parent.html`

**Deliverable:** Working iframe integration with BFT Learn app.

---

## Phase 6: Content & Polish (Week 6-7)

### Goal
Add more levels, questions, and polish the game experience.

### Tasks

#### 6.1 Additional Levels
- [ ] Design Level 2 layout
- [ ] Design Level 3 layout
- [ ] Implement Level 2 scene
- [ ] Implement Level 3 scene
- [ ] Add level transition animations

**Files to Create:**
- `src/games/GemHunt/game/scenes/Level2Scene.ts`
- `src/games/GemHunt/game/scenes/Level3Scene.ts`

#### 6.2 Question Bank Expansion
- [ ] Add 50+ questions per year group
- [ ] Cover all main subjects
- [ ] Test question variety
- [ ] Implement difficulty scaling

#### 6.3 Game Setup Screen
- [ ] Create year group selector
- [ ] Create subject selector
- [ ] Add game instructions
- [ ] Style setup screen

**Files to Create:**
- `src/games/GemHunt/components/GameSetup.tsx`
- `src/games/GemHunt/components/GameSetup.css`

#### 6.4 Game Over Screen
- [ ] Display final stats
- [ ] Show total gems
- [ ] Show levels completed
- [ ] Add replay button
- [ ] Add leaderboard preview

**Files to Create:**
- `src/games/GemHunt/components/GameOver.tsx`
- `src/games/GemHunt/components/GameOver.css`

#### 6.5 Visual Polish
- [ ] Add sprite animations
- [ ] Create particle effects
- [ ] Add sound effects (optional)
- [ ] Add background music (optional)
- [ ] Improve UI styling
- [ ] Add loading screens

#### 6.6 Leaderboard UI
- [ ] Create leaderboard component
- [ ] Fetch rankings from API
- [ ] Display user rank
- [ ] Add filters (year/subject)
- [ ] Style leaderboard

**Files to Create:**
- `src/games/GemHunt/components/Leaderboard.tsx`

**Deliverable:** Polished game with 3+ levels and comprehensive content.

---

## Phase 7: Testing & Deployment (Week 8)

### Goal
Test thoroughly and deploy to production.

### Tasks

#### 7.1 Unit Testing
- [ ] Test game state reducer
- [ ] Test validation logic
- [ ] Test API client
- [ ] Test PostMessage service
- [ ] Achieve >80% coverage

**Files to Create:**
- `src/games/GemHunt/__tests__/`

#### 7.2 Integration Testing
- [ ] Test question flow end-to-end
- [ ] Test level completion flow
- [ ] Test session persistence
- [ ] Test iframe communication

#### 7.3 User Testing
- [ ] Test with real students
- [ ] Gather feedback
- [ ] Identify pain points
- [ ] Make adjustments

#### 7.4 Performance Optimization
- [ ] Profile bundle size
- [ ] Optimize asset loading
- [ ] Implement code splitting
- [ ] Add service worker (PWA)

#### 7.5 Documentation
- [ ] Update README
- [ ] Create user guide
- [ ] Document API
- [ ] Create video tutorial

#### 7.6 Deployment
- [ ] Set up production database
- [ ] Deploy backend API
- [ ] Deploy frontend
- [ ] Configure CDN
- [ ] Set up monitoring
- [ ] Configure error tracking

**Deliverable:** Production-ready game deployed and accessible.

---

## Success Metrics

### Technical
- [ ] Page load time < 3 seconds
- [ ] Game runs at 60 FPS
- [ ] API response time < 200ms
- [ ] Zero critical bugs
- [ ] 80%+ test coverage

### User Experience
- [ ] Students can complete level 1 on first try
- [ ] Average session duration > 10 minutes
- [ ] 80%+ completion rate for started games
- [ ] Positive user feedback

### Content
- [ ] 300+ questions across all year groups
- [ ] 3+ playable levels
- [ ] All core subjects covered

---

## Risk Mitigation

### Technical Risks
1. **Phaser-React integration issues**
   - Mitigation: Prototype early (Phase 1)
   - Fallback: Use canvas directly if needed

2. **Performance issues on older devices**
   - Mitigation: Test on low-end devices
   - Fallback: Reduce animation complexity

3. **Database scaling issues**
   - Mitigation: Proper indexing and caching
   - Fallback: Read replicas

### Content Risks
1. **Question quality/accuracy**
   - Mitigation: Review by teachers
   - Fallback: Beta testing with small group

2. **Difficulty balancing**
   - Mitigation: Adjustable difficulty levels
   - Fallback: User feedback and iteration

---

## Dependencies

### External
- Neon database account
- Backend hosting (Railway/Render)
- Frontend hosting (Vercel/Netlify)
- Asset creation (sprites, tiles)

### Internal
- BFT Learn authentication system
- BFT Learn user database
- iframe embedding approval

---

## Timeline Summary

- **Week 1**: Phase 1 - Core Setup
- **Week 2**: Phase 2 - Question System
- **Week 3**: Phase 3 - Platform Game
- **Week 4**: Phase 4 - Database Integration
- **Week 5**: Phase 5 - iframe Communication
- **Week 6-7**: Phase 6 - Content & Polish
- **Week 8**: Phase 7 - Testing & Deployment

**Total: 8 weeks to production**

---

## Next Immediate Steps

1. Review and approve this plan with stakeholders
2. Begin Phase 1: Install Phaser and set up basic integration
3. Create a test Phaser scene with player movement
4. Weekly progress reviews and adjustments

---

## Questions for Stakeholders

- [ ] Are there specific subjects we should prioritize?
- [ ] What's the target age/skill range for initial launch?
- [ ] Do we have budget for asset creation (sprites, tiles)?
- [ ] What's the preferred backend hosting platform?
- [ ] Are there existing authentication tokens we can use?
- [ ] Timeline flexibility if phases take longer?
