import { useEffect, useId, useRef } from 'react';

export type NotebookGroup = {
  title: string;
  findings: string[];
};

interface NotebookProps {
  groups: NotebookGroup[];
  onClose: () => void;
}

const Notebook: React.FC<NotebookProps> = ({ groups, onClose }) => {
  const titleId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const total = groups.reduce((sum, group) => sum + group.findings.length, 0);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="rd-overlay">
      <aside className="rd-paper rd-notebook" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button type="button" className="rd-text-button rd-paper__close" onClick={onClose}>
          Close
        </button>
        <p className="rd-kicker">Case notes</p>
        <h2 id={titleId} ref={headingRef} tabIndex={-1}>
          Notebook
        </h2>
        {total === 0 ? (
          <p className="rd-muted">Clues you read correctly will be written here.</p>
        ) : (
          groups.map((group) =>
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
          )
        )}
      </aside>
    </div>
  );
};

export default Notebook;
