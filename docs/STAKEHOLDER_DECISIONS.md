# Stakeholder Decisions - Gem Hunt Implementation

## Date: September 21, 2026

This document records key decisions made by stakeholders regarding the Gem Hunt game implementation.

## Decisions Made

### 1. Subject Prioritization
**Question**: Which subjects should we prioritize first?

**Decision**: ✅ **All subjects are considered essential** - No prioritization needed

**Impact**:
- Will implement all core subjects from the start
- Initial launch will include:
  - Addition
  - Subtraction
  - Multiplication
  - Division
  - Fractions
  - Decimals
  - Percentages
- Target: 50 questions per subject per year group at launch (minimum 300 total)
- Expand to 100+ questions per subject in subsequent updates

**Timeline**: No change - subjects will be added in parallel as content is created

---

### 2. Professional Game Assets Budget
**Question**: Do we have budget for professional game assets (sprites, tiles)?

**Decision**: ✅ **No dedicated budget** - Will use free/open-source assets with guidance on creation

**Solution Provided**:

#### Recommended Free Asset Pack
**"Sunny Land" by Ansimuz**
- Perfect for educational games (bright, friendly, age-appropriate)
- Free for commercial use with attribution
- Link: https://ansimuz.itch.io/sunny-land-pixel-game-art
- Includes: Character sprites, tiles, backgrounds, items

#### Alternative Free Resources
1. **Kenney.nl** - https://kenney.nl/assets (CC0, no attribution required)
2. **OpenGameArt.org** - Community-submitted assets
3. **Itch.io free assets** - https://itch.io/game-assets/free

#### DIY Asset Creation Tools
If custom assets needed:
- **Piskel** (https://www.piskelapp.com/) - Free browser-based pixel art editor
- **Tiled** (https://www.mapeditor.org/) - Free level design tool

#### Programmer Art Approach
Start with simple colored shapes, replace with real assets later:
```typescript
// Temporary placeholder graphics
player = rectangle(32, 48, blue)
platform = rectangle(400, 32, brown)
gem = circle(16, yellow)
```

**Impact**:
- No additional budget required
- Must add attribution in game credits
- Slightly longer design phase to find suitable assets
- May need to adjust art style based on available assets

**Action Items**:
- [ ] Download "Sunny Land" asset pack
- [ ] Set up asset pipeline in Vite
- [ ] Create sprite sheets for Phaser
- [ ] Add attribution screen to game

---

### 3. Sound Effects and Music
**Question**: Should we include sound effects and music?

**Decision**: ✅ **Not for the first stage** - Focus on core gameplay first

**Rationale**:
- Simplifies initial implementation
- Reduces asset management complexity
- Avoids audio licensing considerations
- Can be added in Phase 2 without major refactoring

**Future Consideration**:
Sound can be added later using:
- **Phaser Sound System** (built-in audio support)
- **Free sound libraries**:
  - Freesound.org
  - Zapsplat.com
  - Kenney.nl audio assets

**Impact**:
- Faster initial development
- Smaller bundle size
- No audio-related bugs to debug
- Can test gameplay mechanics without audio distractions

**Phase 2 Enhancement**: Add optional sound effects
- Question correct/incorrect feedback
- Gem collection sound
- Level complete fanfare
- Background music (mutable)

---

### 4. Development Timeline
**Question**: What's the preferred timeline (can extend beyond 8 weeks if needed)?

**Decision**: ✅ **No strict timeline** - Progress as and when we can

**New Approach**: Milestone-based instead of time-based

#### Milestone 1: Database & API Foundation
- ✅ Planning complete
- [ ] Add migration to bft-api
- [ ] Create Gem Hunt API endpoints
- [ ] Test authentication flow
- [ ] Populate initial question bank

**Ready when**: All database tables created and API endpoints functional

#### Milestone 2: Core Game Mechanics
- [ ] Phaser 3 integrated with React
- [ ] Player movement working
- [ ] Question-answer flow complete
- [ ] Move counter system functional
- [ ] Level 1 playable

**Ready when**: Can play through one complete level answering questions

#### Milestone 3: Content & Levels
- [ ] Level 2 and 3 designed
- [ ] 300+ questions added (50 per subject)
- [ ] Gem collection working
- [ ] Level progression implemented

**Ready when**: 3 levels playable with full question coverage

#### Milestone 4: Integration
- [ ] iframe communication working
- [ ] Authentication integrated
- [ ] Progress saving to database
- [ ] Embedded in bft-learn app

**Ready when**: Game accessible from bft-learn with full persistence

#### Milestone 5: Polish & Testing
- [ ] UI polished
- [ ] Leaderboard functional
- [ ] User testing completed
- [ ] Bug fixes addressed

**Ready when**: Production-ready, tested, and approved

**Benefits of Flexible Timeline**:
- No pressure to rush and introduce bugs
- Can pause for other priorities
- Incremental progress without deadlines
- Quality over speed

**Estimated Range**: 6-12 weeks depending on availability

---

### 5. Existing Authentication System
**Question**: Is there an existing BFT Learn authentication system to integrate with?

**Decision**: ✅ **Yes - bft-api with Neon Auth** - Must integrate carefully to avoid database corruption

**Existing System Details**:

#### Authentication Method
- **Neon Auth**: JWT-based authentication
- **JWT Verification**: Tokens validated against JWKS endpoint
- **User Linking**: Students linked via `neon_user_id`

#### Existing Database Tables
1. **students** - User accounts with Neon Auth linking
2. **enrollments** - Content enrollments and progress (JSONB)
3. **points** - Earned points from completed work
4. **schema_migrations** - Migration tracking

#### Critical Constraint
**⚠️ MUST NOT corrupt or modify existing database**

**Safe Integration Strategy**:
1. ✅ All new tables prefixed with `gem_hunt_`
2. ✅ Foreign keys reference existing `students` table
3. ✅ Separate migration file (`007_gem_hunt_tables.sql`)
4. ✅ No modifications to existing tables
5. ✅ Can be rolled back independently

#### API Integration Options

**Option A: Extend bft-api (Recommended)**
- Add `src/lib/gem-hunt.ts` to existing API
- Add `src/routes/gem-hunt.ts` routes
- Reuse existing authentication middleware
- Single API endpoint for bft-learn

**Option B: Separate Game API**
- Standalone `bft-gem-hunt-api` service
- Duplicate auth code
- Separate deployment
- More isolation but more complexity

**Decision**: Use **Option A** for simplicity and code reuse

**Implementation Plan**:
1. Clone bft-api repository locally
2. Add Gem Hunt migration as `migrations/007_gem_hunt_tables.sql`
3. Create Gem Hunt library functions in `src/lib/gem-hunt.ts`
4. Add routes to existing API
5. Test with existing JWT tokens
6. Deploy alongside existing bft-api

**Security Measures**:
- All Gem Hunt endpoints require valid Neon Auth JWT
- Student ID extracted from JWT (not client-provided)
- Answer validation server-side only
- Rate limiting per authenticated user
- Comprehensive input validation

**Testing Requirements**:
- [ ] Migration runs without errors
- [ ] Existing tables unchanged after migration
- [ ] Gem Hunt endpoints accessible with valid JWT
- [ ] Existing bft-learn endpoints still functional
- [ ] No performance degradation

---

## Updated Priorities

### Phase 1: Foundation (Highest Priority)
1. **Database Integration**
   - Add migration to bft-api
   - Test on development database
   - Verify existing data intact

2. **API Development**
   - Extend bft-api with Gem Hunt endpoints
   - Reuse existing authentication
   - Test with real JWT tokens

3. **Asset Setup**
   - Download "Sunny Land" asset pack
   - Organize sprites for Phaser
   - Create basic sprite sheets

### Phase 2: Core Gameplay
4. **Phaser Integration**
   - Install Phaser 3
   - Create React wrapper
   - Implement player movement

5. **Question System**
   - Build question UI
   - Implement answer validation
   - Connect to API endpoints

6. **Platform Game**
   - Create Level 1
   - Add gem collection
   - Implement move counter

### Phase 3: Content & Integration
7. **Content Creation**
   - Add 300+ questions to database
   - Design Level 2 and 3
   - Create leaderboard UI

8. **BFT Learn Integration**
   - iframe embedding
   - PostMessage communication
   - End-to-end testing

### Phase 4: Polish & Launch
9. **Testing & Refinement**
   - User testing with students
   - Bug fixes
   - Performance optimization

10. **Deployment**
    - Production database migration
    - API deployment
    - Game deployment
    - Launch!

---

## Asset Attribution Requirements

Since we're using free assets, we must provide proper attribution:

### Credits Screen (in game)
```
GAME ASSETS

Character & Environment Art: "Sunny Land" by Ansimuz
https://ansimuz.itch.io/sunny-land-pixel-game-art

[Any other assets used will be credited here]
```

### README Attribution
Must include in project README:
- Asset name
- Creator name
- License type
- Link to source

---

## Success Criteria (Updated)

### Must Have (MVP)
- [ ] 3 playable levels
- [ ] 300+ questions (50 per subject for 6 subjects)
- [ ] Question-answer → moves system working
- [ ] Gem collection functional
- [ ] Progress saved to database
- [ ] Leaderboard rankings
- [ ] Embedded in bft-learn app
- [ ] Works with existing authentication

### Nice to Have (Future)
- [ ] 5+ levels
- [ ] 500+ questions
- [ ] Sound effects and music
- [ ] Power-ups
- [ ] Achievements system
- [ ] Daily challenges
- [ ] Multiplayer mode

### Technical Requirements
- [ ] No impact on existing bft-learn functionality
- [ ] Database migration reversible
- [ ] < 3 second load time
- [ ] 60 FPS gameplay
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Responsive design (desktop & tablet)

---

## Risk Mitigation Updates

### Original Risk: Budget for Assets
**Status**: ✅ Resolved
**Solution**: Free asset pack identified and approved

### Original Risk: Timeline Pressure
**Status**: ✅ Resolved
**Solution**: Flexible, milestone-based approach

### New Risk: Database Integration Complexity
**Status**: ⚠️ Active
**Mitigation**: 
- Isolated table design with prefix
- Separate migration file
- Comprehensive testing plan
- Rollback procedure documented

### New Risk: Asset Style Consistency
**Status**: ⚠️ Active
**Mitigation**:
- Single cohesive asset pack ("Sunny Land")
- Design guidelines for future additions
- Asset quality review process

---

## Next Immediate Actions

### This Week
1. [ ] Review and approve this decisions document
2. [ ] Set up local bft-api development environment
3. [ ] Add Gem Hunt migration to bft-api
4. [ ] Download and organize "Sunny Land" assets
5. [ ] Create initial API endpoints

### Next Week
1. [ ] Test database migration
2. [ ] Implement authentication flow
3. [ ] Begin Phaser integration
4. [ ] Create first 50 questions

### Communication Plan
- Weekly progress updates (no pressure, just status)
- Demo sessions when milestones reached
- Stakeholder review before each phase
- User testing sessions with students

---

## Document Approval

**Prepared by**: AI Agent (Cloud Agent)
**Date**: September 21, 2026
**Status**: Ready for stakeholder review

**Approved by**: _Awaiting approval_
**Date**: ___________

---

## Revision History

| Date | Changes | Author |
|------|---------|--------|
| 2026-09-21 | Initial decisions recorded | AI Agent |
|  |  |  |
