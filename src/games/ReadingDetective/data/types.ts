export type ComprehensionSkill = 'literal' | 'inference' | 'vocabulary' | 'sequence';

export type AccusationRole = 'supports' | 'clears' | 'background';

export type Hotspot = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Choice = {
  id: string;
  text: string;
};

export type Clue = {
  id: string;
  label: string;
  hotspot: Hotspot;
  passageTitle: string;
  passage: string;
  question: string;
  choices: Choice[];
  correctChoiceId: string;
  explanation: string;
  finding: string;
  skill: ComprehensionSkill;
  /** How the finding behaves when the player names a suspect. */
  accusationRole: AccusationRole;
};

export type Lead = {
  id: string;
  label: string;
  isCorrect: boolean;
  feedbackIfWrong: string;
  nextSceneId: string;
};

export type Suspect = {
  id: string;
  name: string;
  role: string;
  blurb: string;
  portrait: string;
  wrongAccusation: string;
};

export type Scene = {
  id: string;
  title: string;
  setting: string;
  background: string;
  intro: string;
  clues: Clue[];
  leads: Lead[];
  optional?: boolean;
  /** After this scene, the player may name a suspect or open another scene. */
  forkAfter?: boolean;
  continueSceneId?: string;
  forkNote?: string;
};

export type Case = {
  id: string;
  title: string;
  /** One line for the case list. */
  summary?: string;
  briefing: string;
  titleArt: string;
  /** Shown when the player names a suspect, e.g. "Who took the emeralds?" */
  accuseQuestion: string;
  /** Small label above that question. */
  accuseKicker?: string;
  /** Button on the fork screen. */
  decideLabel?: string;
  /** Used in feedback, e.g. "the emeralds". */
  stolenItem: string;
  /** Full claim used when a clearing note is ticked, e.g. "Elena took the emeralds". */
  accusationClaim?: string;
  suspects: Suspect[];
  scenes: Scene[];
  solution: {
    suspectId: string;
    requiredClueIds: string[];
    explanation: string;
  };
};
