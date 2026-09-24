# Gem Hunt Question Bank

## Overview

The question bank contains **245 questions** across **6 year groups** and **multiple subjects**, designed to support the educational gameplay of Gem Hunt.

## Question Distribution

| Year Group | Subjects | Questions | Total |
|------------|----------|-----------|-------|
| **Year 1** | Addition (15), Subtraction (15) | | **30** |
| **Year 2** | Addition (15), Multiplication (15) | | **30** |
| **Year 3** | Addition (12), Multiplication (15), Division (15) | | **42** |
| **Year 4** | Multiplication (12), Division (12), Fractions (15) | | **39** |
| **Year 5** | Multiplication (12), Fractions (15), Decimals (15) | | **42** |
| **Year 6** | Percentages (20), Fractions (15), Decimals (15), Ratio (12) | | **62** |
| | | **TOTAL:** | **245** |

## Installation

### Step 1: Run Main Migration (if not already done)

```bash
cd bft-api
npm run migrate
```

This creates the `gem_hunt_questions` table and other required tables.

### Step 2: Populate Questions

Run the question population script:

```bash
psql $DATABASE_URL -f path/to/populate_questions.sql
```

Or if using the Neon CLI:

```bash
neon sql < populate_questions.sql --database-name your-db-name
```

Or via Node.js:

```javascript
import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const sql = neon(process.env.DATABASE_URL);
const questionSQL = fs.readFileSync('./populate_questions.sql', 'utf8');
await sql(questionSQL);
```

### Step 3: Verify Installation

Check that questions were inserted:

```sql
SELECT year_group, subject, COUNT(*) as count
FROM gem_hunt_questions
WHERE active = true
GROUP BY year_group, subject
ORDER BY year_group, subject;
```

Expected output:

```
 year_group |    subject     | count
------------+----------------+-------
 Year 1     | Addition       |    15
 Year 1     | Subtraction    |    15
 Year 2     | Addition       |    15
 Year 2     | Multiplication |    15
 Year 3     | Addition       |    12
 Year 3     | Division       |    15
 Year 3     | Multiplication |    15
 Year 4     | Division       |    12
 Year 4     | Fractions      |    15
 Year 4     | Multiplication |    12
 Year 5     | Decimals       |    15
 Year 5     | Fractions      |    15
 Year 5     | Multiplication |    12
 Year 6     | Decimals       |    15
 Year 6     | Fractions      |    15
 Year 6     | Percentages    |    20
 Year 6     | Ratio          |    12
(17 rows)
```

## Question Structure

Each question in the database has:

### Required Fields
- `year_group` - e.g., "Year 1", "Year 2", etc.
- `subject` - e.g., "Addition", "Percentages", "Fractions"
- `question_text` - The question displayed to students
- `correct_answer` - The primary correct answer
- `difficulty_level` - 1 (Easy), 2 (Medium), or 3 (Hard)

### Optional Fields
- `alternative_answers` - Array of alternative correct answers (e.g., ["5", "five"])
- `hint` - A helpful hint shown if the student struggles
- `explanation` - Explanation shown after answering
- `active` - Boolean flag (default: true)

### Auto-tracked Fields
- `times_asked` - How many times this question has been shown
- `times_correct` - How many times it was answered correctly
- `created_at`, `updated_at` - Timestamps

## Difficulty Levels

### Level 1 (Easy)
- Basic operations
- Small numbers
- Simple concepts
- Suitable for introducing new topics

**Examples:**
- Year 1: "What is 2 + 3?" → "5"
- Year 2: "What is 2 × 2?" → "4"
- Year 6: "What is 50% of 120?" → "60"

### Level 2 (Medium)
- Multi-step problems
- Larger numbers
- Mixed operations
- Standard curriculum difficulty

**Examples:**
- Year 3: "What is 6 × 7?" → "42"
- Year 5: "What is 3/4 - 1/2?" → "1/4"
- Year 6: "What is 25% of 80?" → "20"

### Level 3 (Hard)
- Complex problems
- Multiple steps required
- Advanced concepts
- Challenge questions

**Examples:**
- Year 4: "What is 12 × 12?" → "144"
- Year 5: "What is 2/3 + 2/3?" → "4/3"
- Year 6: "What is 3/4 - 1/3?" → "5/12"

## Answer Validation

The API's `validateAnswer()` function checks:

1. **Exact match** with `correct_answer`
2. **Alternative answers** (case-insensitive)
3. **Numeric equivalence** (e.g., "5" = "5.0")
4. **Fraction equivalence** (future: "1/2" = "2/4")

### Accepted Answer Formats

- **Integers**: "5", "42", "100"
- **Decimals**: "3.14", "5.2", "0.5"
- **Fractions**: "1/2", "3/4", "5/6"
- **Ratios**: "2:3", "1:4"
- **Words**: "five", "ten" (if in alternative_answers)
- **With units**: "25%", "50%" (for percentages)

## Adding More Questions

### Manual Addition (SQL)

```sql
INSERT INTO gem_hunt_questions 
  (year_group, subject, question_text, correct_answer, alternative_answers, difficulty_level, hint, explanation)
VALUES
  ('Year 3', 'Multiplication', 'What is 7 × 9?', '63', NULL, 2, 'Count in 7s', '7 times 9 equals 63');
```

### Bulk Addition (CSV Import)

1. Create a CSV file:

```csv
year_group,subject,question_text,correct_answer,difficulty_level,hint,explanation
Year 4,Division,What is 56 ÷ 7?,8,2,Use your 7 times table,56 divided by 7 equals 8
```

2. Import via psql:

```bash
psql $DATABASE_URL -c "\COPY gem_hunt_questions(year_group, subject, question_text, correct_answer, difficulty_level, hint, explanation) FROM 'questions.csv' CSV HEADER"
```

### API Addition (Future Feature)

Future admin interface could allow teachers to submit questions:

```typescript
POST /gem-hunt/admin/questions
Authorization: Bearer {admin-token}

{
  "year_group": "Year 5",
  "subject": "Fractions",
  "question_text": "What is 3/7 + 2/7?",
  "correct_answer": "5/7",
  "difficulty_level": 2,
  "hint": "Add the numerators",
  "explanation": "3/7 plus 2/7 equals 5/7"
}
```

## Question Selection Logic

The API's `getRandomQuestions()` function:

1. Filters by `year_group` and `subject`
2. Filters by `active = true`
3. Optionally filters by `difficulty_level`
4. Randomly selects N questions (default: 5)
5. Returns questions in random order

### Usage Example

```typescript
const questions = await getRandomQuestions('Year 6', 'Percentages', 5);
// Returns 5 random Year 6 Percentages questions
```

### Smart Selection (Future)

Future enhancements could include:

- **Adaptive difficulty**: Adjust based on student performance
- **Spaced repetition**: Show questions they got wrong previously
- **Least-asked first**: Prioritize questions with low `times_asked`
- **Performance-based**: Target specific difficulty levels
- **Topic mixing**: Blend multiple subjects

## Maintenance

### Deactivate a Question

If a question has errors or needs updating:

```sql
UPDATE gem_hunt_questions
SET active = false
WHERE id = 'question-uuid-here';
```

### Update a Question

```sql
UPDATE gem_hunt_questions
SET 
  question_text = 'What is 25% of 100?',
  correct_answer = '25',
  explanation = '25% of 100 equals 25'
WHERE id = 'question-uuid-here';
```

### View Question Statistics

```sql
SELECT 
  question_text,
  times_asked,
  times_correct,
  ROUND(100.0 * times_correct / NULLIF(times_asked, 0), 1) as accuracy_pct
FROM gem_hunt_questions
WHERE times_asked > 10
ORDER BY accuracy_pct ASC
LIMIT 10;
```

This shows the 10 most difficult questions (lowest accuracy).

### Clear All Questions (Careful!)

```sql
TRUNCATE TABLE gem_hunt_questions;
```

Then re-run `populate_questions.sql` to restore the default set.

## Expansion Strategy

### Phase 1 (Current): Foundation
- ✅ 245 questions
- ✅ Core subjects covered
- ✅ Basic difficulty spread

### Phase 2 (Next 1-2 months): Growth
- **Target**: 500+ questions
- Add more subjects:
  - Time (reading clocks, duration)
  - Money (calculations, change)
  - Measurement (length, weight, capacity)
  - Geometry (shapes, angles, area, perimeter)
- More questions per existing subject (50-100 per year group/subject)

### Phase 3 (3-6 months): Enhancement
- **Target**: 1,000+ questions
- Word problems for all subjects
- Multi-step problems
- Real-world context questions
- Images for visual questions (geometry)

### Phase 4 (Long-term): Advanced Features
- **Target**: 2,000+ questions
- Teacher-submitted questions (moderated)
- Student-generated questions
- Dynamic difficulty adjustment
- Curriculum alignment tracking
- Custom question sets by topic

## Curriculum Alignment

Questions are aligned with UK National Curriculum standards:

- **Year 1**: Number bonds to 10, basic addition/subtraction
- **Year 2**: 2, 5, 10 times tables, addition/subtraction to 100
- **Year 3**: 3, 4, 8 times tables, formal column methods
- **Year 4**: Times tables to 12×12, fractions
- **Year 5**: Multi-digit multiplication, fractions, decimals
- **Year 6**: All operations, percentages, ratio, algebra basics

## Quality Guidelines

When adding new questions:

1. **Clear language**: Use simple, direct wording
2. **Age-appropriate**: Match vocabulary to year group
3. **Unambiguous**: Only one correct answer (unless alternatives listed)
4. **Helpful hints**: Guide without giving away the answer
5. **Educational explanations**: Teach the concept, don't just confirm
6. **Consistent formatting**: Follow existing question patterns
7. **Test thoroughly**: Verify answers are correct!

## Support

For questions or issues with the question bank:

1. Check this README
2. Review the migration file: `009_gem_hunt_tables.sql`
3. Check the API implementation: `src/lib/gem-hunt.ts`
4. Test with the frontend: Local mode uses local questions

## License

These questions are part of the Brighter Futures Learn educational platform and are intended for educational use within that system.
