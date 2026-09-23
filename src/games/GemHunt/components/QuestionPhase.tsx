import { useEffect, useState, FormEvent } from 'react';
import { Question } from '../types/game';
import { fetchQuestions, validateAnswer } from '../services/api';
import { GAME_CONSTANTS } from '../game/config';
import './QuestionPhase.css';

interface QuestionPhaseProps {
  yearGroup: string;
  subject: string;
  lives: number;
  sessionId: string | null;
  token?: string | null;
  onLifeLost: () => void;
  onBatchComplete: (movesEarned: number) => void;
}

type Feedback = {
  correct: boolean;
  message: string;
} | null;

const QuestionPhase: React.FC<QuestionPhaseProps> = ({
  yearGroup,
  subject,
  lives,
  sessionId,
  token,
  onLifeLost,
  onBatchComplete,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [movesEarned, setMovesEarned] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const batch = await fetchQuestions({
          yearGroup,
          subject,
          count: 5,
          token,
        });
        if (!cancelled) {
          setQuestions(batch);
          setIndex(0);
          setMovesEarned(0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load questions');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [yearGroup, subject, token]);

  const current = questions[index];
  const progressPct = questions.length
    ? ((index + (feedback ? 1 : 0)) / questions.length) * 100
    : 0;

  const finishOrAdvance = (nextMoves: number) => {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
      onBatchComplete(nextMoves);
      return;
    }
    setIndex(nextIndex);
    setAnswer('');
    setFeedback(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!current || submitting || feedback) return;

    const trimmed = answer.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const result = await validateAnswer({
        sessionId,
        questionId: current.id,
        answer: trimmed,
        token,
      });

      if (result.correct) {
        const earned = result.movesEarned || GAME_CONSTANTS.MOVES_PER_CORRECT_ANSWER;
        const nextMoves = movesEarned + earned;
        setMovesEarned(nextMoves);
        setFeedback({
          correct: true,
          message: `You superstar! +${earned} moves`,
        });
        window.setTimeout(() => finishOrAdvance(nextMoves), 900);
      } else {
        setFeedback({
          correct: false,
          message: `Not quite — the answer is ${result.correctAnswer}`,
        });
        onLifeLost();
        window.setTimeout(() => finishOrAdvance(movesEarned), 1400);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not check answer');
    } finally {
      setSubmitting(false);
    }
  };

  const shell = (children: React.ReactNode) => (
    <div className="question-phase">
      <div className="question-shell">
        <div className="question-brand">
          <img
            className="question-brand-mark"
            src="/assets/Misc/ui/bft-sun-64.png"
            alt=""
          />
          <div className="question-brand-text">
            <span className="question-brand-title">Gem Hunt</span>
            <span className="question-brand-sub">Brighter Futures Learn</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  if (loading) {
    return shell(
      <div className="question-card">
        <p className="question-status">Loading questions…</p>
      </div>
    );
  }

  if (error || !current) {
    return shell(
      <div className="question-card">
        <p className="question-status question-status--error">
          {error || 'No questions available'}
        </p>
        <button
          type="button"
          className="question-btn"
          onClick={() => onBatchComplete(0)}
        >
          Skip to platform
        </button>
      </div>
    );
  }

  return shell(
    <div className="question-card">
      <header className="question-header">
        <p className="question-eyebrow">
          {yearGroup} · {subject}
        </p>
        <div className="question-meta">
          <div className="question-stat">
            <span className="question-stat-label">Question</span>
            <span className="question-stat-value">
              {index + 1} of {questions.length}
            </span>
          </div>
          <div className="question-stat">
            <span className="question-stat-label">Lives</span>
            <span className="question-stat-value">{lives}</span>
          </div>
          <div className="question-stat">
            <span className="question-stat-label">Moves</span>
            <span className="question-stat-value">{movesEarned}</span>
          </div>
        </div>
        <div
          className="question-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPct)}
        >
          <div
            className="question-progress-bar"
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>
      </header>

      <h2 className="question-prompt">{current.questionText}</h2>

      <form className="question-form" onSubmit={handleSubmit}>
        <label className="question-label" htmlFor="gem-hunt-answer">
          Your answer
        </label>
        <input
          id="gem-hunt-answer"
          className="question-input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoFocus
          value={answer}
          disabled={Boolean(feedback) || submitting}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type a number"
        />

        {feedback && (
          <p
            className={`question-feedback ${
              feedback.correct
                ? 'question-feedback--ok'
                : 'question-feedback--bad'
            }`}
          >
            {feedback.message}
          </p>
        )}

        <button
          type="submit"
          className="question-btn"
          disabled={!answer.trim() || submitting || Boolean(feedback)}
        >
          {submitting ? 'Checking…' : 'Check answer'}
        </button>
      </form>

      <p className="question-hint">
        Each correct answer gives {GAME_CONSTANTS.MOVES_PER_CORRECT_ANSWER}{' '}
        moves. Wrong answers cost 1 life.
      </p>
    </div>
  );
};

export default QuestionPhase;
