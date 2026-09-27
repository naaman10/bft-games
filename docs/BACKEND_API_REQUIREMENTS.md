# Backend API Implementation Requirements

## Overview

The Maths Quiz Generator requires 7 new API endpoints to be implemented. This document outlines the requirements for the backend team.

## Database Prerequisites

Before implementing the API endpoints, run these migrations in order:

```sql
\i gem-hunt-api-files/migrations/009_gem_hunt_tables.sql
\i gem-hunt-api-files/migrations/010_generalize_questions_and_quiz_results.sql
\i database/populate_questions.sql
\i database/additional_questions_500.sql
```

This will:
1. Create the base tables
2. Rename `gem_hunt_questions` to `questions`
3. Create `quiz_results` and `quiz_question_responses` tables
4. Populate 755+ questions

## Required API Endpoints

### 1. GET `/api/quiz/year-groups`

**Purpose**: Return available year groups that have questions

**Authentication**: Optional (public endpoint)

**Implementation**:
```javascript
// Use the database function
const result = await db.query('SELECT * FROM get_available_year_groups()');
return { yearGroups: result.rows.map(r => r.year_group) };
```

**Response**:
```json
{
  "yearGroups": ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"]
}
```

---

### 2. GET `/api/quiz/subjects`

**Purpose**: Return available subjects for a year group

**Authentication**: Optional (public endpoint)

**Query Parameters**:
- `yearGroup` (required): e.g., "Year 6"

**Implementation**:
```javascript
const { yearGroup } = req.query;
const result = await db.query(
  'SELECT * FROM get_available_subjects($1)',
  [yearGroup]
);
return { subjects: result.rows.map(r => r.subject) };
```

**Response**:
```json
{
  "subjects": ["Addition", "Subtraction", "Multiplication", "Division", "Fractions", "Decimals", "Percentages", "Ratio"]
}
```

---

### 3. POST `/api/quiz/generate`

**Purpose**: Generate random quiz questions based on criteria

**Authentication**: Optional (public endpoint)

**Request Body**:
```json
{
  "yearGroup": "Year 6",
  "subject": "Percentages",  // or null for all subjects
  "questionCount": 10        // 5-20
}
```

**Implementation**:
```javascript
const { yearGroup, subject, questionCount } = req.body;

// Validate questionCount (5-20)
if (questionCount < 5 || questionCount > 20) {
  return res.status(400).json({ error: 'Question count must be between 5 and 20' });
}

// Fetch random questions using the database function
const result = await db.query(
  'SELECT * FROM get_random_questions($1, $2, $3)',
  [yearGroup, subject, questionCount]
);

// Generate a temporary quiz ID
const quizId = `temp-quiz-${uuidv4()}`;

return {
  quizId,
  questions: result.rows
};
```

**Response**:
```json
{
  "quizId": "temp-quiz-uuid",
  "questions": [
    {
      "id": "question-uuid",
      "questionText": "What is 25% of 80?",
      "yearGroup": "Year 6",
      "subject": "Percentages",
      "difficultyLevel": 2
    }
  ]
}
```

**Notes**:
- Do NOT include `correct_answer` in the response
- `quizId` is temporary and only used for submitting authenticated results

---

### 4. POST `/api/quiz/validate-answer`

**Purpose**: Validate a single answer and return correct answer

**Authentication**: Optional (public endpoint)

**Request Body**:
```json
{
  "questionId": "question-uuid",
  "answer": "20"
}
```

**Implementation**:
```javascript
const { questionId, answer } = req.body;

// Fetch question from database
const result = await db.query(
  `SELECT correct_answer, alternative_answers, explanation 
   FROM questions WHERE id = $1`,
  [questionId]
);

if (result.rows.length === 0) {
  return res.status(404).json({ error: 'Question not found' });
}

const question = result.rows[0];
const userAnswer = answer.trim().toLowerCase();
const correctAnswer = question.correct_answer.toLowerCase();

// Check if answer matches (including alternatives)
let isCorrect = userAnswer === correctAnswer;

if (!isCorrect && question.alternative_answers) {
  isCorrect = question.alternative_answers
    .map(a => a.toLowerCase())
    .includes(userAnswer);
}

return {
  correct: isCorrect,
  correctAnswer: question.correct_answer,
  explanation: question.explanation
};
```

**Response**:
```json
{
  "correct": true,
  "correctAnswer": "20",
  "explanation": "25% is a quarter, and a quarter of 80 is 20"
}
```

---

### 5. POST `/api/quiz/submit`

**Purpose**: Submit completed quiz results (authenticated users only)

**Authentication**: **Required** (Bearer token)

**Request Body**:
```json
{
  "yearGroup": "Year 6",
  "subject": "Percentages",
  "totalQuestions": 10,
  "correctAnswers": 8,
  "incorrectAnswers": 2,
  "timeTakenSeconds": 180,
  "startedAt": "2026-09-27T12:00:00Z",
  "responses": [
    {
      "questionId": "question-uuid",
      "userAnswer": "20",
      "isCorrect": true,
      "timeTakenSeconds": 15
    }
  ]
}
```

**Implementation**:
```javascript
const { 
  yearGroup, subject, totalQuestions, correctAnswers, 
  incorrectAnswers, timeTakenSeconds, startedAt, responses 
} = req.body;

const studentId = req.user.id; // from JWT token

// Calculate score percentage
const scorePercentage = (correctAnswers / totalQuestions) * 100;

// Insert quiz result
const quizResult = await db.query(
  `INSERT INTO quiz_results (
    student_id, game_type, year_group, subject,
    total_questions, correct_answers, incorrect_answers,
    score_percentage, time_taken_seconds, started_at
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING id`,
  [
    studentId, 'quiz_generator', yearGroup, subject,
    totalQuestions, correctAnswers, incorrectAnswers,
    scorePercentage, timeTakenSeconds, startedAt
  ]
);

const quizResultId = quizResult.rows[0].id;

// Insert individual question responses
for (const response of responses) {
  await db.query(
    `INSERT INTO quiz_question_responses (
      quiz_result_id, question_id, user_answer, is_correct, time_taken_seconds
    ) VALUES ($1, $2, $3, $4, $5)`,
    [
      quizResultId, response.questionId, response.userAnswer,
      response.isCorrect, response.timeTakenSeconds
    ]
  );
}

return {
  id: quizResultId,
  scorePercentage,
  message: 'Quiz results saved successfully'
};
```

**Response**:
```json
{
  "id": "quiz-result-uuid",
  "scorePercentage": 80.0,
  "message": "Quiz results saved successfully"
}
```

---

### 6. GET `/api/quiz/history`

**Purpose**: Get quiz history for a student

**Authentication**: **Required** (Bearer token)

**Query Parameters**:
- `studentId` (optional): Defaults to authenticated user
- `limit` (optional): Number of results (default: 20)
- `gameType` (optional): Filter by game type (default: 'quiz_generator')

**Implementation**:
```javascript
const studentId = req.query.studentId || req.user.id;
const limit = parseInt(req.query.limit) || 20;
const gameType = req.query.gameType || 'quiz_generator';

// Verify authorization
if (studentId !== req.user.id && !req.user.isAdmin) {
  return res.status(403).json({ error: 'Unauthorized' });
}

const result = await db.query(
  `SELECT * FROM quiz_results_summary
   WHERE student_id = $1 AND game_type = $2
   ORDER BY completed_at DESC
   LIMIT $3`,
  [studentId, gameType, limit]
);

return { results: result.rows };
```

**Response**:
```json
{
  "results": [
    {
      "id": "quiz-result-uuid",
      "gameType": "quiz_generator",
      "yearGroup": "Year 6",
      "subject": "Percentages",
      "totalQuestions": 10,
      "correctAnswers": 8,
      "scorePercentage": 80.0,
      "timeTakenSeconds": 180,
      "completedAt": "2026-09-27T12:05:00Z"
    }
  ]
}
```

---

### 7. GET `/api/quiz/analytics`

**Purpose**: Get aggregated performance analytics

**Authentication**: **Required** (Bearer token)

**Query Parameters**:
- `studentId` (optional): Defaults to authenticated user
- `yearGroup` (optional): Filter by year group
- `subject` (optional): Filter by subject

**Implementation**:
```javascript
const studentId = req.query.studentId || req.user.id;
const { yearGroup, subject } = req.query;

// Verify authorization
if (studentId !== req.user.id && !req.user.isAdmin) {
  return res.status(403).json({ error: 'Unauthorized' });
}

let query = `
  SELECT * FROM student_quiz_performance
  WHERE student_id = $1 AND game_type = 'quiz_generator'
`;

const params = [studentId];

if (yearGroup) {
  params.push(yearGroup);
  query += ` AND year_group = $${params.length}`;
}

if (subject) {
  params.push(subject);
  query += ` AND subject = $${params.length}`;
}

const result = await db.query(query, params);

if (result.rows.length === 0) {
  return {
    totalQuizzes: 0,
    avgScorePercentage: 0,
    message: 'No quiz data available'
  };
}

// Aggregate data from the view
const data = result.rows[0];

return {
  totalQuizzes: data.total_quizzes,
  avgScorePercentage: parseFloat(data.avg_score_percentage),
  bestScore: parseFloat(data.best_score_percentage),
  worstScore: parseFloat(data.worst_score_percentage),
  totalQuestionsAttempted: data.total_questions_attempted,
  totalCorrect: data.total_correct,
  totalIncorrect: data.total_incorrect,
  avgTimeSeconds: Math.round(data.avg_time_seconds),
  lastQuizDate: data.last_quiz_date
};
```

**Response**:
```json
{
  "totalQuizzes": 15,
  "avgScorePercentage": 78.5,
  "bestScore": 100.0,
  "worstScore": 60.0,
  "totalQuestionsAttempted": 150,
  "totalCorrect": 118,
  "totalIncorrect": 32,
  "avgTimeSeconds": 165,
  "lastQuizDate": "2026-09-27T12:05:00Z"
}
```

---

## Security Considerations

### Public Endpoints (No Auth Required)
1. `/quiz/year-groups` - Safe to be public
2. `/quiz/subjects` - Safe to be public
3. `/quiz/generate` - Safe, questions don't include answers
4. `/quiz/validate-answer` - Safe, returns answer after user attempts

### Protected Endpoints (Auth Required)
5. `/quiz/submit` - Requires valid JWT token
6. `/quiz/history` - Requires valid JWT token, authorize student access
7. `/quiz/analytics` - Requires valid JWT token, authorize student access

### Rate Limiting
Consider implementing rate limiting on public endpoints to prevent abuse:
- `/quiz/generate`: Max 10 requests per minute per IP
- `/quiz/validate-answer`: Max 100 requests per minute per IP

## Error Handling

All endpoints should return consistent error responses:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Testing

### Test Cases to Implement

1. **Year Groups Endpoint**
   - Returns all 6 year groups
   - Works without authentication

2. **Subjects Endpoint**
   - Returns subjects for each year group
   - Returns empty array for invalid year group

3. **Generate Quiz**
   - Validates question count (5-20)
   - Filters by subject correctly
   - Returns correct number of questions
   - Doesn't include answers in response

4. **Validate Answer**
   - Matches exact answers (case insensitive)
   - Matches alternative answers
   - Returns correct answer
   - Returns 404 for invalid question ID

5. **Submit Results**
   - Requires authentication
   - Saves quiz result correctly
   - Saves all question responses
   - Updates question statistics (via trigger)
   - Returns quiz result ID

6. **Quiz History**
   - Requires authentication
   - Returns user's own quizzes
   - Limits results correctly
   - Orders by most recent first

7. **Analytics**
   - Requires authentication
   - Calculates aggregates correctly
   - Filters by year/subject if provided
   - Returns 0 values for no data

## CORS Configuration

If the frontend is hosted on a different domain, ensure CORS is configured:

```javascript
app.use(cors({
  origin: ['https://bft-games.vercel.app', 'https://bft-learn.com'],
  credentials: true
}));
```

## Monitoring

Consider logging:
- Quiz generation requests (to monitor usage)
- Answer validation (to identify problematic questions)
- Quiz completions (for analytics)
- API errors (for debugging)

## Performance Considerations

1. **Database Indexes**: Ensure indexes exist on:
   - `questions(year_group, subject, active)`
   - `quiz_results(student_id, completed_at)`
   - `quiz_question_responses(quiz_result_id)`

2. **Caching**: Consider caching:
   - Year groups list (changes rarely)
   - Subject lists per year group (changes rarely)

3. **Connection Pooling**: Use database connection pooling for better performance

## Deployment Checklist

- [ ] Run database migrations
- [ ] Implement all 7 endpoints
- [ ] Add authentication middleware
- [ ] Configure CORS
- [ ] Add rate limiting
- [ ] Set up error logging
- [ ] Write unit tests
- [ ] Test integration with frontend
- [ ] Document API in Swagger/OpenAPI (optional)
- [ ] Deploy to staging
- [ ] Test in staging
- [ ] Deploy to production

## Support

For questions or issues during implementation, refer to:
- [Quiz Generator API Documentation](../docs/QUIZ_GENERATOR_API.md)
- [Database Schema](../database/010_generalize_questions_and_quiz_results.sql)
- [Maths Quiz Generator Documentation](../docs/MATHS_QUIZ_GENERATOR.md)
