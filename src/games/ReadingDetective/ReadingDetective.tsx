import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameProps } from '../../types/game';
import Accusation from './components/Accusation';
import CluePage from './components/CluePage';
import LeadChoice from './components/LeadChoice';
import Notebook, { NotebookGroup } from './components/Notebook';
import SceneStage from './components/SceneStage';
import { CASES, findingsFor, findClue, findScene, firstScene, getCase } from './data/cases';
import { evaluateAccusation } from './data/evaluate';
import { Scene } from './data/types';
import { notifyGameComplete, notifyGameReady } from './services/postMessage';
import './ReadingDetective.css';

type Phase = 'choose' | 'briefing' | 'scene' | 'clue' | 'lead' | 'fork' | 'accuse' | 'ending';

type SolvedMap = Record<string, { firstTry: boolean }>;

function phaseAfterScene(scene: Scene): Phase {
  if (scene.leads.length > 0) return 'lead';
  if (scene.forkAfter) return 'fork';
  return 'accuse';
}

const ReadingDetective: React.FC<GameProps> = ({ onComplete, onScore, config }) => {
  const lockedCaseId = typeof config?.caseId === 'string' ? config.caseId : undefined;
  const canChoose = !lockedCaseId && CASES.length > 1;
  const [pickedId, setPickedId] = useState<string | undefined>(lockedCaseId);
  const caseData = getCase(pickedId);
  const opening = firstScene(caseData);
  const optionalScene = caseData.scenes.find((scene) => scene.optional);

  const [phase, setPhase] = useState<Phase>(canChoose ? 'choose' : 'briefing');
  const [sceneId, setSceneId] = useState(opening.id);
  const [activeClueId, setActiveClueId] = useState<string | null>(null);
  const [solved, setSolved] = useState<SolvedMap>({});
  const [missedClues, setMissedClues] = useState<string[]>([]);
  const [clueFeedback, setClueFeedback] = useState<string | null>(null);
  const [rejectedChoices, setRejectedChoices] = useState<string[]>([]);
  const [clueJustSolved, setClueJustSolved] = useState(false);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [leadFeedback, setLeadFeedback] = useState<string | null>(null);
  const [rejectedLeads, setRejectedLeads] = useState<string[]>([]);
  const [missedLeads, setMissedLeads] = useState<string[]>([]);
  const [leadResults, setLeadResults] = useState<Record<string, boolean>>({});
  const [seenScenes, setSeenScenes] = useState<string[]>([]);
  const [accusationFeedback, setAccusationFeedback] = useState<string | null>(null);
  const [accusationMissed, setAccusationMissed] = useState(false);
  const [accusationFirstTry, setAccusationFirstTry] = useState<boolean | null>(null);
  const [playId, setPlayId] = useState(0);

  const scene = findScene(caseData, sceneId) ?? opening;
  const activeClue = activeClueId ? findClue(caseData, activeClueId) : undefined;

  const scoreSummary = useMemo(() => {
    const parts = [
      ...Object.values(solved).map((item) => item.firstTry),
      ...Object.values(leadResults),
      ...(accusationFirstTry === null ? [] : [accusationFirstTry]),
    ];
    const correct = parts.filter(Boolean).length;
    const score = parts.length === 0 ? 0 : Math.round((correct / parts.length) * 100);
    return { score, correct, total: parts.length };
  }, [solved, leadResults, accusationFirstTry]);
  const score = scoreSummary.score;

  const onScoreRef = useRef(onScore);
  onScoreRef.current = onScore;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedPlay = useRef<number | null>(null);

  useEffect(() => {
    notifyGameReady();
  }, []);

  useEffect(() => {
    onScoreRef.current?.(score);
  }, [score]);

  useEffect(() => {
    if (phase !== 'ending') return;
    if (completedPlay.current === playId) return;
    completedPlay.current = playId;
    onCompleteRef.current?.();
    notifyGameComplete({ caseId: caseData.id, score });
  }, [phase, playId, caseData.id, score]);

  const groups: NotebookGroup[] = useMemo(() => {
    const rows = findingsFor(caseData, Object.keys(solved));
    return caseData.scenes.map((item) => ({
      title: item.title,
      findings: rows.filter((row) => row.scene.id === item.id).map((row) => row.clue.finding),
    }));
  }, [caseData, solved]);

  const mainScenes = caseData.scenes.filter((item) => !item.optional);
  const sceneIndex = mainScenes.findIndex((item) => item.id === scene.id);
  const sceneLabel = scene.optional
    ? 'One more place'
    : `Scene ${sceneIndex + 1} of ${mainScenes.length}`;
  const foundInScene = scene.clues.filter((clue) => solved[clue.id]).length;
  const showSearch = phase !== 'choose' && phase !== 'briefing' && phase !== 'ending';
  const canKeepLooking = Boolean(optionalScene && !seenScenes.includes(optionalScene.id));

  const openClue = (clueId: string) => {
    setActiveClueId(clueId);
    setClueFeedback(null);
    setRejectedChoices([]);
    setClueJustSolved(false);
    setNotebookOpen(false);
    setPhase('clue');
  };

  const closeClue = useCallback(() => {
    setPhase('scene');
    setClueJustSolved(false);
    setActiveClueId(null);
  }, []);

  const submitClue = (choiceId: string) => {
    if (!activeClue) return;
    if (choiceId !== activeClue.correctChoiceId) {
      setMissedClues((current) =>
        current.includes(activeClue.id) ? current : [...current, activeClue.id],
      );
      setRejectedChoices((current) =>
        current.includes(choiceId) ? current : [...current, choiceId],
      );
      setClueFeedback(activeClue.explanation);
      return;
    }

    const firstTry = !missedClues.includes(activeClue.id);
    setSolved((current) => ({ ...current, [activeClue.id]: { firstTry } }));
    setClueJustSolved(true);
    setClueFeedback(null);
  };

  const continueFromClue = () => {
    const sceneComplete = scene.clues.every((clue) => solved[clue.id]);
    setClueJustSolved(false);
    setActiveClueId(null);
    if (!sceneComplete) {
      setPhase('scene');
      return;
    }
    setSeenScenes((current) => (current.includes(scene.id) ? current : [...current, scene.id]));
    setLeadFeedback(null);
    setRejectedLeads([]);
    setPhase(phaseAfterScene(scene));
  };

  const chooseLead = (leadId: string) => {
    const lead = scene.leads.find((item) => item.id === leadId);
    if (!lead) return;
    if (!lead.isCorrect) {
      setMissedLeads((current) =>
        current.includes(scene.id) ? current : [...current, scene.id],
      );
      setRejectedLeads((current) => (current.includes(lead.id) ? current : [...current, lead.id]));
      setLeadFeedback(lead.feedbackIfWrong);
      return;
    }
    setLeadResults((current) => ({
      ...current,
      [scene.id]: !missedLeads.includes(scene.id),
    }));
    setLeadFeedback(null);
    setRejectedLeads([]);
    setSceneId(lead.nextSceneId);
    setPhase('scene');
  };

  const openAccusation = () => {
    setAccusationFeedback(null);
    setNotebookOpen(false);
    setPhase('accuse');
  };

  const keepLooking = () => {
    if (!optionalScene) return;
    setAccusationFeedback(null);
    setNotebookOpen(false);
    setSceneId(optionalScene.id);
    setPhase('scene');
  };

  const submitAccusation = (suspectId: string, clueIds: string[]) => {
    const result = evaluateAccusation(caseData, suspectId, clueIds);
    if (!result.ok) {
      setAccusationMissed(true);
      setAccusationFeedback(result.message);
      return;
    }
    setAccusationFirstTry(!accusationMissed);
    setPhase('ending');
  };

  const clearProgress = () => {
    setActiveClueId(null);
    setSolved({});
    setMissedClues([]);
    setClueFeedback(null);
    setRejectedChoices([]);
    setClueJustSolved(false);
    setNotebookOpen(false);
    setLeadFeedback(null);
    setRejectedLeads([]);
    setMissedLeads([]);
    setLeadResults({});
    setSeenScenes([]);
    setAccusationFeedback(null);
    setAccusationMissed(false);
    setAccusationFirstTry(null);
    setPlayId((current) => current + 1);
  };

  const playAgain = () => {
    setPhase('briefing');
    setSceneId(opening.id);
    clearProgress();
  };

  const startCase = (id: string) => {
    const next = getCase(id);
    setPickedId(id);
    setSceneId(firstScene(next).id);
    setPhase('briefing');
    clearProgress();
  };

  const closeNotebook = useCallback(() => setNotebookOpen(false), []);
  const remainingAfterThis = scene.clues.filter(
    (clue) => !solved[clue.id] && clue.id !== activeClue?.id,
  ).length;
  return (
    <div className="rd">
      {phase === 'choose' && (
        <section className="rd-title-page">
          <p className="rd-kicker">Reading Detective</p>
          <h1>Choose a case</h1>
          <p className="rd-briefing">Pick a case, then follow the notes.</p>
          <div className="rd-case-list">
            {CASES.map((item) => (
              <button key={item.id} type="button" className="rd-case-card" onClick={() => startCase(item.id)}>
                <img src={item.titleArt} alt="" />
                <span>
                  <strong>{item.title}</strong>
                  {item.summary ?? item.briefing}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {phase === 'briefing' && (
        <section className="rd-title-page">
          <img src={caseData.titleArt} alt="" className="rd-title-page__art" />
          <p className="rd-kicker">Reading Detective</p>
          <h1>{caseData.title}</h1>
          <p className="rd-briefing">{caseData.briefing}</p>
          <button type="button" className="rd-button" onClick={() => setPhase('scene')}>
            Begin the case
          </button>
        </section>
      )}

      {phase === 'ending' && (
        <section className="rd-title-page">
          <img src={caseData.titleArt} alt="" className="rd-title-page__art" />
          <p className="rd-kicker">Case closed</p>
          <h1>{caseData.title}</h1>
          <p className="rd-briefing">{caseData.solution.explanation}</p>
          <p className="rd-score">
            First-try score: {scoreSummary.score}%. {scoreSummary.correct} of {scoreSummary.total}{' '}
            questions were right the first time.
          </p>
          <div className="rd-title-page__actions">
            <button type="button" className="rd-button" onClick={playAgain}>
              Read the case again
            </button>
            {canChoose && (
              <button type="button" className="rd-button rd-button--quiet" onClick={() => setPhase('choose')}>
                Choose another case
              </button>
            )}
          </div>
        </section>
      )}

      {showSearch && (
        <>
          <header className="rd-header">
            <div>
              <p className="rd-kicker">Reading Detective</p>
              <h1>{scene.title}</h1>
            </div>
            <p className="rd-header__count">
              {foundInScene} of {scene.clues.length} clues
            </p>
            {phase === 'scene' && (
              <button type="button" className="rd-button rd-button--quiet" onClick={() => setNotebookOpen(true)}>
                Notebook
              </button>
            )}
          </header>
          <SceneStage
            scene={scene}
            foundIds={scene.clues.filter((clue) => solved[clue.id]).map((clue) => clue.id)}
            interactive={phase === 'scene' && !notebookOpen}
            sceneLabel={sceneLabel}
            onOpenClue={openClue}
          />
        </>
      )}

      {phase === 'clue' && activeClue && (
        <CluePage
          clue={activeClue}
          feedback={clueFeedback}
          rejectedChoiceIds={rejectedChoices}
          solved={clueJustSolved}
          continueLabel={remainingAfterThis === 0 ? 'See what the notes say' : 'Keep looking'}
          onClose={closeClue}
          onSubmit={submitClue}
          onContinue={continueFromClue}
        />
      )}

      {phase === 'lead' && (
        <LeadChoice
          groups={groups}
          leads={scene.leads}
          feedback={leadFeedback}
          rejectedIds={rejectedLeads}
          onChoose={chooseLead}
        />
      )}

      {phase === 'fork' && (
        <div className="rd-overlay">
          <section className="rd-paper rd-choice" aria-labelledby="rd-fork-title">
            <p className="rd-kicker">Three places read</p>
            <h2 id="rd-fork-title">You can name someone, or look once more.</h2>
            <p className="rd-muted">{scene.forkNote}</p>
            <div className="rd-choice__actions">
              <button type="button" className="rd-choice-button" onClick={openAccusation}>
                {caseData.decideLabel ?? 'Name a suspect'}
              </button>
              {optionalScene && (
                <button type="button" className="rd-choice-button" onClick={keepLooking}>
                  Look in the {optionalScene.title.toLowerCase()}
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {phase === 'accuse' && (
        <Accusation
          caseData={caseData}
          clues={findingsFor(caseData, Object.keys(solved)).map((row) => row.clue)}
          canKeepLooking={canKeepLooking}
          keepLookingLabel={
            optionalScene ? `Not sure yet? Look in the ${optionalScene.title.toLowerCase()}` : ''
          }
          feedback={accusationFeedback}
          onSubmit={submitAccusation}
          onKeepLooking={keepLooking}
        />
      )}

      {notebookOpen && <Notebook groups={groups} onClose={closeNotebook} />}
    </div>
  );
};

export default ReadingDetective;
