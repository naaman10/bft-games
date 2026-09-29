import { Lead } from '../data/types';
import { NotebookGroup } from './Notebook';

interface LeadChoiceProps {
  groups: NotebookGroup[];
  leads: Lead[];
  feedback: string | null;
  rejectedIds: string[];
  onChoose: (leadId: string) => void;
}

const LeadChoice: React.FC<LeadChoiceProps> = ({
  groups,
  leads,
  feedback,
  rejectedIds,
  onChoose,
}) => {
  const rejected = new Set(rejectedIds);

  return (
    <div className="rd-overlay">
      <section className="rd-paper rd-choice" aria-labelledby="rd-lead-title">
        <p className="rd-kicker">The notes together</p>
        <h2 id="rd-lead-title">Where should you look next?</h2>
        {groups.map((group) =>
          group.findings.length === 0 ? null : (
            <section key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.findings.map((finding) => (
                  <li key={finding}>{finding}</li>
                ))}
              </ul>
            </section>
          ),
        )}
        <div className="rd-choice__actions">
          {leads.map((lead) => (
            <button
              key={lead.id}
              type="button"
              className="rd-choice-button"
              disabled={rejected.has(lead.id)}
              onClick={() => onChoose(lead.id)}
            >
              {lead.label}
            </button>
          ))}
        </div>
        {feedback && (
          <p className="rd-feedback" role="status">
            {feedback}
          </p>
        )}
      </section>
    </div>
  );
};

export default LeadChoice;
