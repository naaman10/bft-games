# Quiz Generator API Endpoints

These endpoints support the Maths Quiz Generator game and can be used by other quiz-based games.

## Base Path
All endpoints are prefixed with `/api`

## Endpoints

### 1. Get Available Year Groups
```
GET /quiz/year-groups
```

**Description**: Returns list of all available year groups that have questions.

**Authentication**: Optional (works in guest mode)

**Response**:
```json
{
  "yearGroups": ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"]
}
```

---

### 2. Get Available Subjects for Year Group
```
GET /quiz/subjects?yearGroup={yearGroup}
```

**Description**: Returns list of subjects available for a specific year group.

**Authentication**: Optional (works in guest mode)

**Query Parameters**:
- `yearGroup` (required): e.g., "Year 6"

**Response**:
```json
{
  "subjects": [
    "Addition",
    "Subtraction",
    "Multiplication",
    "Division",
    "Fractions",
    "Decimals",
    "Percentages",
    "Ratio"
  ]
}
```

---

### 3. Generate Quiz Questions
```
POST /quiz/generate
```

**Description**: Generate a quiz with random questions based on criteria.

**Authentication**: Optional (works in guest mode)

**Request Body**:
```json
{
  "yearGroup": "Year 6",
  "subject": "Percentages",  // Optional: null or omit for "All Subjects"
  "questionCount": 10        // Max 20
}
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

**Note**: The `quizId` returned is temporary and only used for submitting results if authenticated.

---

### 4. Validate Quiz Answer
```
POST /quiz/validate-answer
```

**Description**: Check if an answer is correct and get the correct answer.

**Authentication**: Optional (works in guest mode)

**Request Body**:
```json
{
  "questionId": "question-uuid",
  "answer": "20"
}
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

### 5. Submit Quiz Results
```
POST /quiz/submit
```

**Description**: Submit completed quiz results for analysis (requires authentication).

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "yearGroup": "Year 6",
  "subject": "Percentages",  // null for "All Subjects"
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

**Response**:
```json
{
  "id": "quiz-result-uuid",
  "scorePercentage": 80.0,
  "message": "Quiz results saved successfully"
}
```

---

### 6. Get Student Quiz History
```
GET /quiz/history?studentId={studentId}&limit={limit}
```

**Description**: Get quiz completion history for a student.

**Authentication**: Required (Bearer token)

**Query Parameters**:
- `studentId` (optional): Defaults to authenticated user
- `limit` (optional): Number of results (default: 20)
- `gameType` (optional): Filter by game type (e.g., "quiz_generator")

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

### 7. Get Quiz Analytics
```
GET /quiz/analytics?studentId={studentId}
```

**Description**: Get aggregated performance analytics for a student.

**Authentication**: Required (Bearer token)

**Query Parameters**:
- `studentId` (optional): Defaults to authenticated user
- `yearGroup` (optional): Filter by year group
- `subject` (optional): Filter by subject

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
  "bySubject": [
    {
      "subject": "Percentages",
      "quizCount": 5,
      "avgScore": 82.0
    }
  ],
  "recentTrend": "improving"
}
```

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

**Common Status Codes**:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing/invalid token)
- `404`: Not Found
- `500`: Internal Server Error

---

## Guest Mode

The Quiz Generator works in **guest mode** (no authentication):
- Questions can be fetched and validated
- Results are NOT saved to database
- No history or analytics available

To save results, users must be authenticated with a valid Bearer token.
