import { useEffect, useState } from 'react';
import { Scene } from '../data/types';

interface SceneStageProps {
  scene: Scene;
  foundIds: string[];
  interactive: boolean;
  sceneLabel: string;
  onOpenClue: (clueId: string) => void;
}

const SceneStage: React.FC<SceneStageProps> = ({
  scene,
  foundIds,
  interactive,
  sceneLabel,
  onOpenClue,
}) => {
  const [hintId, setHintId] = useState<string | null>(null);
  const found = new Set(foundIds);
  const hintTargetId = scene.clues.find((clue) => !found.has(clue.id))?.id ?? null;

  useEffect(() => {
    if (!interactive || !hintTargetId) {
      setHintId(null);
      return;
    }

    let timer = window.setTimeout(() => setHintId(hintTargetId), 7000);

    const reset = () => {
      setHintId(null);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHintId(hintTargetId), 7000);
    };

    window.addEventListener('pointerdown', reset);
    window.addEventListener('keydown', reset);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', reset);
      window.removeEventListener('keydown', reset);
    };
  }, [interactive, hintTargetId]);

  return (
    <div className="rd-stage-wrap">
      <div className={`rd-frame ${interactive ? '' : 'is-dimmed'}`}>
        <div className="rd-frame__art">
          <img src={scene.background} alt="" />
        </div>
        {scene.clues.map((clue) => {
          const isFound = found.has(clue.id);
          return (
            <button
              key={clue.id}
              type="button"
              className={[
                'rd-hotspot',
                isFound ? 'is-found' : '',
                hintId === clue.id ? 'is-hint' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                left: `${clue.hotspot.x}%`,
                top: `${clue.hotspot.y}%`,
                width: `${clue.hotspot.width}%`,
                height: `${clue.hotspot.height}%`,
              }}
              aria-label={isFound ? `${clue.label}, already in your notebook` : clue.label}
              disabled={!interactive || isFound}
              onClick={() => onOpenClue(clue.id)}
            >
              <span className="rd-hotspot__label">{clue.label}</span>
            </button>
          );
        })}
      </div>
      <p className="rd-scene-caption">
        <span>{sceneLabel}</span>
        {scene.intro}
      </p>
    </div>
  );
};

export default SceneStage;
