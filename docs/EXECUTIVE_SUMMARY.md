# Gem Hunt - Executive Summary

## Quick Overview

**Gem Hunt** is an educational math game that combines question-answer mechanics with engaging Mario-style platformer gameplay. Students answer math questions to earn moves, which they then use to navigate through colorful platform levels collecting gems.

## Target Audience

- **Age Range**: 5-11 years (Year 1 through Year 6)
- **Subjects**: Math (Addition, Subtraction, Multiplication, Division, Fractions, Decimals, Percentages, etc.)
- **Platform**: Web-based, embedded in BFT Learn app via iframe

## Game Loop (Simple)

1. **Select** → Student chooses year group and subject
2. **Answer** → Answer 5 math questions (earn 5 moves per correct answer)
3. **Play** → Use moves to navigate platform level and collect gems
4. **Repeat** → Out of moves? Answer 5 more questions
5. **Progress** → Complete level, advance to next, compete on leaderboard

## Key Features

### Educational
- ✅ Curriculum-aligned questions for Years 1-6
- ✅ Multiple math subjects covered
- ✅ Immediate feedback on answers
- ✅ Progress tracking and analytics
- ✅ Adaptive difficulty (coming soon)

### Gameplay
- ✅ Mario-style platformer controls
- ✅ Gem collection from special crates
- ✅ Multiple levels with increasing challenge
- ✅ Lives system (5 lives, lose 1 per wrong answer)
- ✅ Move economy (earn through correct answers)

### Competition
- ✅ Global leaderboard by year/subject
- ✅ Gem collection scoring
- ✅ Level progression tracking
- ✅ Achievement system (future)

### Technical
- ✅ Seamless iframe integration with BFT Learn
- ✅ Real-time progress sync
- ✅ Persistent save states
- ✅ Works on desktop and tablets
- ✅ Fast loading and smooth gameplay

## How It Works

### For Students

```
1. Open BFT Learn app
2. Click "Play Gem Hunt"
3. Choose Year 6 & Percentages
4. Answer: "What is 25% of 80?" → 20 ✅
5. Answer 4 more questions → Earn 25 moves total
6. Platform game starts!
7. Use arrow keys to navigate
8. Jump to reach gem crates
9. Collect 5 gems in Level 1
10. Reach the flag to complete level
11. Progress to Level 2!
```

### For Teachers

- Track student progress through BFT Learn dashboard
- See which subjects students practice most
- View accuracy and completion rates
- Monitor leaderboard participation
- Identify areas where students struggle

## Technical Architecture

### Frontend
- **React 18** + **TypeScript** for UI
- **Phaser 3** for game engine (platform phase)
- **Vite** for fast development
- **PostMessage API** for iframe communication

### Backend
- **Node.js/Express** REST API
- **Neon PostgreSQL** database
- **JWT** authentication
- **Rate limiting** and security

### Database
- 8 tables for users, sessions, progress, questions, leaderboard
- Optimized queries with indexes
- Auto-save every 30 seconds
- 300+ questions at launch

### Integration
- Embedded in BFT Learn via iframe
- Bidirectional communication with parent app
- User authentication passed from parent
- Progress synced in real-time

## Development Timeline

### 8-Week Plan

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1 | Core Setup | Working Phaser + React with player movement |
| 2 | Question System | Question UI with answer validation and move generation |
| 3 | Platform Game | Playable Level 1 with gem collection |
| 4 | Database & API | Full persistence and API integration |
| 5 | iframe Comm | Working integration with parent app |
| 6-7 | Content & Polish | 3 levels, 300+ questions, animations |
| 8 | Testing & Deploy | Production-ready, tested, deployed |

### Milestones

- ✅ **Week 0**: Planning complete (current)
- 🔲 **Week 1**: Prototype playable
- 🔲 **Week 3**: MVP ready
- 🔲 **Week 5**: Beta version
- 🔲 **Week 8**: Production launch

## Content Plan

### Questions
- **Launch**: 50 questions per subject per year group (300+ total)
- **Month 2**: 100 questions per subject (600+ total)
- **Month 3**: 200+ questions per subject (1200+ total)
- **Long-term**: User-generated content from teachers

### Levels
- **Launch**: 3 levels
  - Level 1: Sunny Hills (50 moves, 5 gems)
  - Level 2: Forest Path (100 moves, 10 gems)
  - Level 3: Mountain Climb (150 moves, 15 gems)
- **Future**: 10+ levels with varied themes

### Subjects (Initial)
- Addition
- Subtraction
- Multiplication
- Division
- Fractions
- Decimals
- Percentages

## Success Metrics

### Engagement
- **Target**: 80%+ completion rate for started games
- **Target**: Average session 10+ minutes
- **Target**: 60%+ return rate within 7 days

### Educational
- **Target**: 75%+ answer accuracy
- **Target**: Improvement over time in accuracy
- **Target**: Students complete all levels in chosen subject

### Technical
- **Target**: <3 second page load
- **Target**: 60 FPS gameplay
- **Target**: <200ms API response time
- **Target**: 99.9% uptime

## Budget & Resources

### Development
- 8 weeks development time (1 developer full-time)
- Backend API development (in parallel)
- Database setup (Neon free tier initially)

### Assets
- Game sprites (player, crates, gems)
- Platform tiles and backgrounds
- UI elements
- Sound effects (optional)
- Background music (optional)

### Infrastructure
- Frontend hosting: Vercel/Netlify (free tier)
- Backend hosting: Railway/Render (~$10-20/mo)
- Database: Neon (free tier → $20/mo at scale)
- CDN: Cloudflare (free)

**Total Monthly Cost (at scale)**: ~$30-50/month

## Risk Assessment

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Phaser-React integration issues | Medium | High | Early prototype in Week 1 |
| Performance on older devices | Medium | Medium | Test on low-end hardware |
| Database scaling | Low | High | Proper indexing, caching |

### Content Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Question quality/accuracy | Medium | High | Teacher review process |
| Difficulty balancing | Medium | Medium | User feedback, adjustable levels |
| Limited content at launch | High | Medium | Prioritize core subjects |

### Timeline Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Phaser learning curve | Medium | Medium | Allocate extra time in Week 1 |
| Asset creation delays | Medium | Medium | Use placeholder assets initially |
| API development delays | Low | High | Parallel development |

## Next Steps

### Immediate (This Week)
1. ✅ Complete planning documentation
2. 🔲 Stakeholder review and approval
3. 🔲 Set up development environment
4. 🔲 Install Phaser 3 and dependencies
5. 🔲 Create basic Phaser-React prototype

### Week 1
1. 🔲 Working player movement in Phaser
2. 🔲 Move counter system
3. 🔲 Simple test level

### Week 2
1. 🔲 Question UI component
2. 🔲 Answer validation
3. 🔲 Lives system
4. 🔲 Integration with move generation

### Backend (Parallel)
1. 🔲 Set up Neon database
2. 🔲 Deploy schema
3. 🔲 Create API endpoints
4. 🔲 Implement authentication

## Questions for Stakeholders

### Priority
1. Which subjects should we prioritize for launch?
2. What's the target launch date?
3. Do we have budget for professional game assets?
4. Is there an existing authentication system we should use?

### Content
1. Should we have sound effects and music?
2. Do we want power-ups or special abilities?
3. Should there be a time limit per level?
4. Do we want a practice mode (no lives lost)?

### Technical
1. What's the preferred backend hosting platform?
2. Are there specific browsers we need to support?
3. Should the game work on mobile phones or just tablets/desktop?
4. Do we want analytics tracking (Google Analytics, Mixpanel)?

## Conclusion

Gem Hunt is a well-planned, technically feasible educational game that combines learning with fun gameplay. With clear documentation, a detailed roadmap, and manageable risks, the project is ready to move into development.

**Recommendation**: Proceed with Phase 1 implementation immediately.

---

## Documentation Index

For detailed information, see:

- **Game Design**: [`GEM_HUNT_PLAN.md`](GEM_HUNT_PLAN.md)
- **Technical Architecture**: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **API Reference**: [`API_SPECIFICATION.md`](API_SPECIFICATION.md)
- **Implementation Plan**: [`IMPLEMENTATION_ROADMAP.md`](IMPLEMENTATION_ROADMAP.md)
- **Sample Questions**: [`QUESTION_BANK_SAMPLES.md`](QUESTION_BANK_SAMPLES.md)
- **Game Documentation**: [`GEM_HUNT_README.md`](GEM_HUNT_README.md)
- **Database Schema**: [`../database/schema.sql`](../database/schema.sql)
