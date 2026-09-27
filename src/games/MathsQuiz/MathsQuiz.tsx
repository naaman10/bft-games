import React, { useState } from 'react';
import { GameProps } from '../../types/game';
import { QuizSetup } from './components/QuizSetup';
import { QuizPlaying } from './components/QuizPlaying';
import { QuizResults } from './components/QuizResults';
import { QuizConfig, QuizQuestion, QuizAnswer, QuizState } from './types/quiz';
import * as quizApi from './services/api';
import './MathsQuiz.css';

const MathsQuiz: React.FC<GameProps> = ({ onComplete, onScore }) => {
  const [state, setState] = useState<QuizState>('setup');
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get token from postMessage or URL params (if integrated with BFT)
  const token: string | null = null; // TODO: Get from parent app via postMessage

  const handleStartQuiz = async (quizConfig: QuizConfig) => {
    setLoading(true);
    setError(null);
    setConfig(quizConfig);

    try {
      const result = await quizApi.generateQuiz(quizConfig, token);
      
      if (!result.questions || result.questions.length === 0) {
        throw new Error('No questions available for the selected criteria');
      }

      setQuestions(result.questions);
      setStartTime(new Date());
      setState('playing');
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate quiz. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (quizAnswers: QuizAnswer[], totalTime: number) => {
    setAnswers(quizAnswers);
    setTimeTaken(totalTime);
    setState('completed');

    // Report score to parent if callback provided
    const correctCount = quizAnswers.filter((a) => a.isCorrect).length;
    const scorePercentage = Math.round(
      (correctCount / quizAnswers.length) * 100
    );
    
    if (onScore) {
      onScore(scorePercentage);
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  const handlePlayAgain = () => {
    setAnswers([]);
    setQuestions([]);
    setConfig(null);
    setTimeTaken(0);
    setError(null);
    setState('setup');
  };

  if (loading) {
    return (
      <div className="maths-quiz">
        <div className="quiz-loading">
          <div className="loading-spinner" />
          <p>Generating your quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="maths-quiz">
        <div className="quiz-error">
          <h2>Oops!</h2>
          <p>{error}</p>
          <button onClick={handlePlayAgain} className="btn-try-again">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="maths-quiz">
      {state === 'setup' && (
        <QuizSetup onStart={handleStartQuiz} token={token} />
      )}

      {state === 'playing' && questions.length > 0 && (
        <QuizPlaying
          questions={questions}
          onComplete={handleQuizComplete}
          token={token}
        />
      )}

      {state === 'completed' && config && (
        <QuizResults
          config={config}
          answers={answers}
          timeTaken={timeTaken}
          startTime={startTime}
          onPlayAgain={handlePlayAgain}
          token={token}
        />
      )}
    </div>
  );
};

export default MathsQuiz;
