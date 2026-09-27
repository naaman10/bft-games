# Maths Quiz Generator

## Overview

The **Maths Quiz Generator** is an interactive educational game that allows students to create customized maths quizzes and receive instant feedback on their answers. Students can choose their year group (Years 1-6), select a specific subject or mix all subjects, and decide how many questions they want (5-20).

## Features

### ✨ Core Features

1. **Customizable Quizzes**
   - Select year group (Year 1 through Year 6)
   - Choose specific subject or "All Subjects" for mixed questions
   - Variable quiz length (5, 10, 15, or 20 questions)

2. **Instant Feedback**
   - Real-time validation of answers
   - Immediate correct/incorrect feedback per question
   - Display of correct answer when wrong

3. **Comprehensive Results**
   - Detailed score breakdown
   - Letter grade (A+ to F)
   - Time tracking per question and total
   - Question-by-question review

4. **Progress Tracking** (Authenticated Mode)
   - Save quiz results to database
   - View quiz history
   - Track performance over time
   - Analytics and trends

5. **Guest Mode Support**
   - Full functionality without authentication
   - Results not saved (ephemeral)
   - Perfect for practice

## Game Flow

### 1. Setup Screen
Students configure their quiz:
- **Year Group**: Select appropriate difficulty level
- **Subject**: Choose specific topic or "All Subjects"
- **Question Count**: Use slider to select 5-20 questions

### 2. Quiz Screen
- Questions displayed one at a time
- Progress bar showing completion
- Text input for answers
- Submit button (or press Enter)
- Instant feedback (2-second display)
- Status dots showing progress

### 3. Results Screen
- Overall score percentage
- Letter grade with color coding
- Statistics breakdown:
  - Correct answers
  - Incorrect answers
  - Time taken
  - Total questions
- Detailed question review
- Save confirmation (if authenticated)
- "Play Again" button

## Technical Architecture

### Database Structure

#### questions Table (Generic)
```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY,
    year_group VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    alternative_answers TEXT[],
    hint TEXT,
    explanation TEXT,
    difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 3),
    times_asked INT DEFAULT 0,
    times_correct INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);
```

#### quiz_results Table
```sql
CREATE TABLE quiz_results (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    game_type VARCHAR(50) NOT NULL, -- 'quiz_generator'
    year_group VARCHAR(50) NOT NULL,
    subject VARCHAR(100), -- NULL for "All Subjects"
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    incorrect_answers INT NOT NULL,
    score_percentage DECIMAL(5, 2) NOT NULL,
    time_taken_seconds INT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### quiz_question_responses Table
```sql
CREATE TABLE quiz_question_responses (
    id UUID PRIMARY KEY,
    quiz_result_id UUID REFERENCES quiz_results(id),
    question_id UUID REFERENCES questions(id),
    user_answer VARCHAR(255),
    is_correct BOOLEAN NOT NULL,
    time_taken_seconds INT,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints

All endpoints under `/api/quiz`:

1. **GET /year-groups** - Get available year groups
2. **GET /subjects?yearGroup={year}** - Get subjects for year group
3. **POST /generate** - Generate quiz questions
4. **POST /validate-answer** - Validate single answer
5. **POST /submit** - Submit complete quiz results (auth required)
6. **GET /history** - Get student quiz history (auth required)
7. **GET /analytics** - Get performance analytics (auth required)

See [`QUIZ_GENERATOR_API.md`](../docs/QUIZ_GENERATOR_API.md) for complete API documentation.

### Component Structure

```
MathsQuiz/
├── MathsQuiz.tsx           # Main game component & state management
├── MathsQuiz.css           # Main styles
├── components/
│   ├── QuizSetup.tsx       # Setup/configuration screen
│   ├── QuizSetup.css
│   ├── QuizPlaying.tsx     # Question answering screen
│   ├── QuizPlaying.css
│   ├── QuizResults.tsx     # Results & review screen
│   └── QuizResults.css
├── services/
│   └── api.ts              # API service functions
└── types/
    └── quiz.ts             # TypeScript type definitions
```

## Integration

### Standalone (iframe)
```html
<iframe 
  src="https://bft-games.vercel.app/game/maths-quiz"
  width="100%"
  height="100vh"
  frameborder="0"
></iframe>
```

### React Component
```tsx
import MathsQuiz from './games/MathsQuiz/MathsQuiz';

<MathsQuiz 
  onComplete={() => console.log('Quiz completed!')}
  onScore={(score) => console.log('Score:', score)}
/>
```

### With Authentication
```tsx
// Pass token via postMessage or props
// See API documentation for authentication details
```

## Scoring System

### Letter Grades

| Score | Grade | Message |
|-------|-------|---------|
| 90-100% | A+ | Outstanding! |
| 80-89% | A | Excellent! |
| 70-79% | B | Good job! |
| 60-69% | C | Not bad! |
| 50-59% | D | Keep practicing! |
| 0-49% | F | Try again! |

## User Experience

### Visual Design
- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Feedback Colors**:
  - Correct: Green (#28a745)
  - Incorrect: Red (#dc3545)
  - Current: Purple (#667eea)
- **Typography**: Clean, modern sans-serif
- **Animations**: Smooth transitions and feedback

### Accessibility
- Large, readable text
- High contrast colors
- Keyboard navigation support (Enter to submit)
- Clear visual feedback
- Progress indicators

### Mobile Responsive
- Adapts to all screen sizes
- Touch-friendly controls
- Optimized layouts for mobile

## Analytics & Insights

For authenticated users, the game tracks:
- **Quiz History**: All completed quizzes
- **Performance Trends**: Score progression over time
- **Subject Strengths**: Best and weakest subjects
- **Time Patterns**: Average time per question
- **Accuracy Rates**: Overall and per subject

## Future Enhancements

Potential future features:
1. **Timed Mode**: Optional countdown timer
2. **Challenge Mode**: Increasing difficulty
3. **Multiplayer**: Compete with friends
4. **Achievements**: Unlock badges and rewards
5. **Question Explanations**: Detailed solutions
6. **Practice Mode**: Review incorrect answers
7. **Subject Mix**: Custom subject combinations
8. **Difficulty Selection**: Choose easy/medium/hard
9. **Streak Tracking**: Consecutive correct answers
10. **Leaderboards**: Compare with classmates

## Usage Statistics

The quiz generator uses the shared `questions` table containing:
- **755+ questions** across Years 1-6
- **15+ subjects** including:
  - Addition, Subtraction, Multiplication, Division
  - Fractions, Decimals, Percentages, Ratio
  - Algebra, Geometry, Statistics
  - Money, Time, Area & Perimeter
  - Word Problems

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Access at http://localhost:3000/game/maths-quiz
```

### Testing
```bash
# Build for production
npm run build

# Preview build
npm run preview
```

## Database Migration

To set up the database for the Quiz Generator:

```sql
-- Run in order:
\i database/009_gem_hunt_tables.sql      -- Base tables
\i database/010_generalize_questions_and_quiz_results.sql  -- Rename & create quiz tables
\i database/populate_questions.sql       -- Original 245 questions
\i database/additional_questions_500.sql -- Additional 510 questions
```

## Credits

- **Design**: Modern, engaging educational interface
- **Question Bank**: UK National Curriculum aligned
- **Database**: Shared generic questions table
- **Integration**: Compatible with BFT Learn platform

## Support

For issues, questions, or feature requests, contact the BFT development team.
