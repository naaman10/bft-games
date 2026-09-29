import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { Clue } from '../data/types';

const SKILL_LABEL: Record<Clue['skill'], string> = {
  literal: 'Find it in the text',
  inference: 'Read between the lines',
  vocabulary: 'Word meaning',
  sequence: 'Order of events',
};

interface CluePageProps {
  clue: Clue;
  feedback: string | null;
  rejectedChoiceIds: string[];
  solved: boolean;
  continueLabel: string;
  onClose: () => void;
  onSubmit: (choiceId: string) => void;
  onContinue: () => void;
}

const CluePage: React.FC<CluePageProps> = ({
  clue,
  feedback,
  rejectedChoiceIds,
  solved,
  continueLabel,
  onClose,
  onSubmit,
  onContinue,
}) => {
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const rejected = new Set(rejectedChoiceIds);

  useEffect(() => {
    setChoiceId(null);
    headingRef.current?.focus();
  }, [clue.id]);

  const dismiss = solved ? onContinue : onClose;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismiss]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!choiceId || rejected.has(choiceId)) return;
    onSubmit(choiceId);
  };

  return (
    <div className="rd-overlay">
      <article
        className="rd-paper rd-clue"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button type="button" className="rd-text-button rd-paper__close" onClick={dismiss}>
          Close
        </button>
        <p className="rd-kicker">{SKILL_LABEL[clue.skill]}</p>
        <h2 id={titleId} ref={headingRef} tabIndex={-1}>
          {clue.passageTitle}
        </h2>
        <div className="rd-passage">{clue.passage}</div>
        {solved ? (
          <div className="rd-feedback is-right" role="status">
            <p>{clue.explanation}</p>
            <p>Saved in your notebook.</p>
            <button type="button" className="rd-button" onClick={onContinue}>
              {continueLabel}
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <fieldset>
              <legend>{clue.question}</legend>
              {clue.choices.map((choice) => {
                const isRejected = rejected.has(choice.id);
                return (
                  <label key={choice.id} className={isRejected ? 'is-rejected' : ''}>
                    <input
                      type="radio"
                      name={`clue-${clue.id}`}
                      value={choice.id}
                      checked={choiceId === choice.id}
                      disabled={isRejected}
                      onChange={() => setChoiceId(choice.id)}
                    />
                    <span>{choice.text}</span>
                  </label>
                );
              })}
            </fieldset>
            {feedback && (
              <p className="rd-feedback" role="status">
                {feedback}
              </p>
            )}
            <button type="submit" className="rd-button" disabled={!choiceId || rejected.has(choiceId)}>
              {feedback ? 'Try again' : 'Check reading'}
            </button>
          </form>
        )}
      </article>
    </div>
  );
};

export default CluePage;
