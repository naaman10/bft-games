import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QuizAnswer } from '../types/quiz';
import * as quizApi from '../services/api';
import './QuizPlaying.css';

type QuizPlayingProps = {
  questions: QuizQuestion[];
  onComplete: (answers: QuizAnswer[], timeTaken: number) => void;
  token?: string | null;
};

export const QuizPlaying: React.FC<QuizPlayingProps> = ({
  questions,
  onComplete,
  token,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    correct: boolean;
    message: string;
  }>({ show: false, correct: false, message: '' });
  const [isChecking, setIsChecking] = useState(false);
  const [startTime] = useState(Date.now());
  const questionStartTime = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Focus input when question changes
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Please enter an answer');
      return;
    }

    setIsChecking(true);

    try {
      const result = await quizApi.validateAnswer(
        currentQuestion.id,
        userAnswer,
        token
      );

      const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);

      const answer: QuizAnswer = {
        questionId: currentQuestion.id,
        userAnswer: userAnswer.trim(),
        isCorrect: result.correct,
        correctAnswer: result.correctAnswer,
        timeTakenSeconds: timeTaken,
        explanation: result.explanation,
      };

      setAnswers([...answers, answer]);

      // Show feedback
      setFeedback({
        show: true,
        correct: result.correct,
        message: result.correct
          ? '✓ Correct!'
          : `✗ Incorrect. The correct answer is: ${result.correctAnswer}`,
      });

      // Auto-advance after showing feedback
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setUserAnswer('');
          setFeedback({ show: false, correct: false, message: '' });
          questionStartTime.current = Date.now();
        } else {
          // Quiz complete
          const totalTime = Math.floor((Date.now() - startTime) / 1000);
          onComplete([...answers, answer], totalTime);
        }
        setIsChecking(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to validate answer:', error);
      alert('Failed to check answer. Please try again.');
      setIsChecking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isChecking) {
      handleSubmitAnswer();
    }
  };

  return (
    <div className="quiz-playing">
      <div className="quiz-playing-container">
        {/* Progress Bar */}
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Question Counter */}
        <div className="quiz-counter">
          Question {currentIndex + 1} of {questions.length}
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-meta">
            <span className="question-subject">{currentQuestion.subject}</span>
            <span className="question-difficulty">
              {'⭐'.repeat(currentQuestion.difficultyLevel)}
            </span>
          </div>

          <h2 className="question-text">{currentQuestion.questionText}</h2>

          {/* Answer Input */}
          <div className="answer-section">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here..."
              disabled={isChecking}
              className="answer-input"
              autoComplete="off"
            />

            <button
              onClick={handleSubmitAnswer}
              disabled={isChecking || !userAnswer.trim()}
              className="btn-submit-answer"
            >
              {isChecking ? 'Checking...' : 'Submit Answer'}
            </button>
          </div>

          {/* Feedback */}
          {feedback.show && (
            <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
              {feedback.message}
            </div>
          )}
        </div>

        {/* Answer Status Grid */}
        <div className="answer-status-grid">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`status-dot ${
                index < currentIndex
                  ? answers[index]?.isCorrect
                    ? 'correct'
                    : 'incorrect'
                  : index === currentIndex
                  ? 'current'
                  : 'pending'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
