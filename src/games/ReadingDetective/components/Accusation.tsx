import { FormEvent, useState } from 'react';
import { Case, Clue } from '../data/types';

interface AccusationProps {
  caseData: Case;
  clues: Clue[];
  canKeepLooking: boolean;
  keepLookingLabel: string;
  feedback: string | null;
  onSubmit: (suspectId: string, clueIds: string[]) => void;
  onKeepLooking: () => void;
}

const Accusation: React.FC<AccusationProps> = ({
  caseData,
  clues,
  canKeepLooking,
  keepLookingLabel,
  feedback,
  onSubmit,
  onKeepLooking,
}) => {
  const [suspectId, setSuspectId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (clueId: string) => {
    setSelected((current) =>
      current.includes(clueId)
        ? current.filter((id) => id !== clueId)
        : [...current, clueId],
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!suspectId) return;
    onSubmit(suspectId, selected);
  };

  return (
    <div className="rd-overlay">
      <form className="rd-paper rd-accuse" onSubmit={submit} aria-labelledby="rd-accuse-title">
        <p className="rd-kicker">{caseData.accuseKicker ?? 'Name a suspect'}</p>
        <h2 id="rd-accuse-title">{caseData.accuseQuestion}</h2>
        <p className="rd-muted">
          Choose the person, then tick the notes that show what they did.
        </p>
        <fieldset>
          <legend>The person</legend>
          <div className="rd-suspects">
            {caseData.suspects.map((suspect) => (
              <label key={suspect.id} className={suspectId === suspect.id ? 'is-selected' : ''}>
                <input
                  type="radio"
                  name="suspect"
                  value={suspect.id}
                  checked={suspectId === suspect.id}
                  onChange={() => setSuspectId(suspect.id)}
                />
                <img src={suspect.portrait} alt="" />
                <span>
                  <strong>{suspect.name}</strong>
                  {suspect.role}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Notes that support your choice</legend>
          <ul className="rd-note-picks">
            {clues.map((clue) => (
              <li key={clue.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selected.includes(clue.id)}
                    onChange={() => toggle(clue.id)}
                  />
                  <span>{clue.finding}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        {feedback && (
          <p className="rd-feedback" role="status">
            {feedback}
          </p>
        )}
        <div className="rd-accuse__actions">
          <button type="submit" className="rd-button" disabled={!suspectId}>
            {feedback ? 'Try again' : 'This is what the notes say'}
          </button>
          {canKeepLooking && (
            <button type="button" className="rd-button rd-button--quiet" onClick={onKeepLooking}>
              {keepLookingLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Accusation;
