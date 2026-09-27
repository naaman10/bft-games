import React, { useState, useEffect } from 'react';
import { QuizAnswer, QuizResult, QuizConfig } from '../types/quiz';
import * as quizApi from '../services/api';
import './QuizResults.css';

type QuizResultsProps = {
  config: QuizConfig;
  answers: QuizAnswer[];
  timeTaken: number;
  startTime: Date;
  onPlayAgain: () => void;
  token?: string | null;
};

export const QuizResults: React.FC<QuizResultsProps> = ({
  config,
  answers,
  timeTaken,
  startTime,
  onPlayAgain,
  token,
}) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = answers.length - correctCount;
  const scorePercentage = Math.round((correctCount / answers.length) * 100);

  const getGrade = (score: number) => {
    if (score >= 90) return { letter: 'A+', color: '#28a745', message: 'Outstanding!' };
    if (score >= 80) return { letter: 'A', color: '#5cb85c', message: 'Excellent!' };
    if (score >= 70) return { letter: 'B', color: '#5bc0de', message: 'Good job!' };
    if (score >= 60) return { letter: 'C', color: '#f0ad4e', message: 'Not bad!' };
    if (score >= 50) return { letter: 'D', color: '#f0ad4e', message: 'Keep practicing!' };
    return { letter: 'F', color: '#d9534f', message: 'Try again!' };
  };

  const grade = getGrade(scorePercentage);

  useEffect(() => {
    if (token && !saved) {
      saveResults();
    }
  }, []);

  const saveResults = async () => {
    if (!token) return;

    setSaving(true);
    try {
      const result: QuizResult = {
        yearGroup: config.yearGroup,
        subject: config.subject,
        totalQuestions: answers.length,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        scorePercentage,
        timeTakenSeconds: timeTaken,
        startedAt: startTime,
      };

      await quizApi.submitQuizResults(result, answers, token);
      setSaved(true);
    } catch (error) {
      console.error('Failed to save results:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="quiz-results">
      <div className="quiz-results-container">
        <div className="results-header">
          <h1 className="results-title">Quiz Complete!</h1>
          <div className="grade-circle" style={{ borderColor: grade.color }}>
            <div className="grade-letter" style={{ color: grade.color }}>
              {grade.letter}
            </div>
            <div className="grade-percentage">{scorePercentage}%</div>
          </div>
          <p className="grade-message" style={{ color: grade.color }}>
            {grade.message}
          </p>
        </div>

        <div className="results-stats">
          <div className="stat-card">
            <div className="stat-icon correct">✓</div>
            <div className="stat-value">{correctCount}</div>
            <div className="stat-label">Correct</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon incorrect">✗</div>
            <div className="stat-value">{incorrectCount}</div>
            <div className="stat-label">Incorrect</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{formatTime(timeTaken)}</div>
            <div className="stat-label">Time Taken</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{answers.length}</div>
            <div className="stat-label">Total Questions</div>
          </div>
        </div>

        <div className="results-details">
          <h3>Question Review</h3>
          <div className="answers-list">
            {answers.map((answer, index) => (
              <div
                key={answer.questionId}
                className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="answer-number">Q{index + 1}</div>
                <div className="answer-content">
                  <div className="answer-status">
                    {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </div>
                  {!answer.isCorrect && (
                    <div className="answer-correction">
                      <span className="your-answer">Your answer: {answer.userAnswer}</span>
                      <span className="correct-answer">
                        Correct answer: {answer.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
                <div className="answer-time">{answer.timeTakenSeconds}s</div>
              </div>
            ))}
          </div>
        </div>

        {token && (
          <div className="save-status">
            {saving && <p className="saving">Saving results...</p>}
            {saved && <p className="saved">✓ Results saved to your account!</p>}
            {!saving && !saved && <p className="not-saved">Failed to save results</p>}
          </div>
        )}

        {!token && (
          <div className="guest-notice">
            <p>💡 Sign in to save your results and track your progress over time!</p>
          </div>
        )}

        <div className="results-actions">
          <button onClick={onPlayAgain} className="btn-play-again">
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
