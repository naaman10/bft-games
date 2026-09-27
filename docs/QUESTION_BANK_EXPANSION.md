# Question Bank Expansion

## Overview

The Gem Hunt question bank has been significantly expanded to provide a richer, more diverse learning experience across all year groups and subjects.

## Expansion Summary

### Original Question Bank
- **Total Questions**: 245
- **Coverage**: Basic coverage across Years 1-6
- **Subjects**: Addition, Subtraction, Multiplication, Division, Fractions, Percentages, Decimals, Ratio

### Expanded Question Bank
- **Total Questions**: 755+ (510 new questions added)
- **Coverage**: Comprehensive coverage with multiple topics per year group
- **New Subjects Added**: Numbers, Money, Time, Area & Perimeter, Word Problems, Algebra, Statistics, Geometry

## Detailed Breakdown

### Year 1 (Total: 100 questions)
- **Original**: 30 questions (Addition: 15, Subtraction: 15)
- **Added**: 70 questions
  - Numbers: 15 questions
  - Addition: 25 questions
  - Subtraction: 30 questions

### Year 2 (Total: 120 questions)
- **Original**: 30 questions (Addition: 15, Multiplication: 15)
- **Added**: 90 questions
  - Subtraction: 25 questions
  - Division: 20 questions
  - Money: 25 questions
  - Numbers: 20 questions

### Year 3 (Total: 127 questions)
- **Original**: 42 questions (Addition: 12, Multiplication: 15, Division: 15)
- **Added**: 85 questions
  - Subtraction: 20 questions
  - Fractions: 20 questions
  - Money: 20 questions
  - Time: 25 questions

### Year 4 (Total: 129 questions)
- **Original**: 39 questions (Multiplication: 12, Division: 12, Fractions: 15)
- **Added**: 90 questions
  - Addition: 20 questions
  - Subtraction: 20 questions
  - Decimals: 20 questions
  - Area & Perimeter: 15 questions
  - Word Problems: 15 questions

### Year 5 (Total: 127 questions)
- **Original**: 42 questions (Multiplication: 12, Fractions: 15, Decimals: 15)
- **Added**: 85 questions
  - Division: 20 questions
  - Percentages: 20 questions
  - Word Problems: 20 questions
  - Algebra Basics: 25 questions

### Year 6 (Total: 152 questions)
- **Original**: 62 questions (Percentages: 20, Fractions: 15, Decimals: 15, Ratio: 12)
- **Added**: 90 questions
  - Algebra: 20 questions
  - Word Problems: 25 questions
  - Statistics & Data: 20 questions
  - Geometry: 15 questions
  - Advanced Fractions: 10 questions

## New Subject Areas

### Numbers (Year 1-2)
Foundation topics including:
- Number recognition and ordering
- Place value
- Doubling and halving
- Number patterns

### Money (Year 2-3)
Practical money skills:
- Coin recognition and values
- Addition and subtraction with money
- Making amounts
- Calculating change

### Time (Year 3)
Time-related problems:
- Reading clocks
- Converting units (hours, minutes, seconds)
- Time calculations
- Duration problems

### Area & Perimeter (Year 4)
Measurement concepts:
- Calculating area of rectangles and squares
- Finding perimeter
- Problem-solving with measurements

### Word Problems (Year 4-6)
Real-world application problems across all operations

### Algebra (Year 5-6)
Introduction to algebraic thinking:
- Simple equations (x + a = b)
- Solving for unknowns
- Two-step equations

### Statistics (Year 6)
Data handling:
- Mean, median, mode
- Range
- Interpreting data

### Geometry (Year 6)
Shape and angle properties:
- Angles in shapes
- Lines of symmetry
- Triangle types
- Angle calculations

## Question Design Principles

All questions follow these principles:

1. **Age-Appropriate**: Questions match the UK National Curriculum expectations for each year group
2. **Progressive Difficulty**: Each subject has difficulty levels 1-3
3. **Clear Language**: Questions use simple, direct language
4. **Helpful Hints**: Most questions include hints to guide student thinking
5. **Detailed Explanations**: All questions have explanations to support learning
6. **Alternative Answers**: Where appropriate, questions accept multiple correct formats (e.g., "20" and "twenty")

## Implementation Files

### Database
- **Original**: `/database/populate_questions.sql`
- **Expansion**: `/database/additional_questions_500.sql`

To populate the full question bank:
```sql
-- Run the original questions
\i database/populate_questions.sql

-- Run the additional questions
\i database/additional_questions_500.sql
```

### Local Fallback Questions
The local question TypeScript file has also been expanded to include samples from all year groups and subjects:
- **File**: `/src/games/GemHunt/data/localQuestions.ts`
- **Questions**: 32 diverse questions for offline fallback

## Benefits of Expansion

1. **More Variety**: Students encounter different question types and topics
2. **Better Coverage**: All UK curriculum areas are now represented
3. **Reduced Repetition**: With 755+ questions, students are less likely to see repeated questions
4. **Progressive Learning**: Questions build skills across year groups
5. **Engagement**: Greater diversity keeps the game fresh and interesting
6. **Flexibility**: Teachers can target specific topics or mix across subjects

## Next Steps

Potential future enhancements:
- Add more word problems with real-world contexts
- Include questions with images/diagrams
- Add multi-step problems for higher year groups
- Create themed question sets (sports, animals, space, etc.)
- Add questions for Year 7+ (secondary school)

## Usage

The expanded question bank is automatically used when:
1. Running the game with database access (API mode)
2. The game will randomly select questions based on:
   - Selected year group
   - Selected subject
   - Appropriate difficulty level

For offline use, the local questions file provides fallback questions across all year groups and subjects.
