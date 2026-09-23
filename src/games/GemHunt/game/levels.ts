/** Level layouts for Gem Hunt — each environment grows longer and harder. */

export type ThemeId = 'forest' | 'ice' | 'volcanic' | 'desert';

export type EnemyKind = 'frog' | 'opossum' | 'eagle';

export type GroundSegment = {
  /** Left edge in world pixels */
  from: number;
  /** Right edge in world pixels */
  to: number;
};

export type PlatformSpec = {
  x: number;
  y: number;
  /** Number of platform-long tiles (each 64px wide at scale 2) */
  tiles?: number;
};

export type MovingPlatformSpec = {
  x: number;
  y: number;
  /** Travel distance in pixels */
  range: number;
  axis: 'x' | 'y';
  durationMs: number;
  /** If true, touching kills instead of standing */
  deadly?: boolean;
};

export type EnemySpec = {
  kind: EnemyKind;
  x: number;
  y: number;
  /** Horizontal patrol distance from spawn */
  patrol: number;
};

export type HazardSpec = {
  x: number;
  y: number;
};

export type CollectibleSpec = {
  x: number;
  y: number;
};

export type LevelTheme = {
  id: ThemeId;
  name: string;
  /** Phaser tint as 0xRRGGBB applied to background */
  bgTint: number;
  /** Tint for platforms / ground */
  platformTint: number;
  skyColor: string;
  decor: 'tree' | 'pine' | 'palm' | 'rock';
  /** House style used as the level end “castle” */
  castle: 'house' | 'wooden-house' | 'tree-house' | 'plant-house';
};

export type LevelDefinition = {
  id: number;
  theme: LevelTheme;
  /** Total world width in pixels */
  width: number;
  groundY: number;
  ground: GroundSegment[];
  platforms: PlatformSpec[];
  movingPlatforms: MovingPlatformSpec[];
  enemies: EnemySpec[];
  spikes: HazardSpec[];
  suns: CollectibleSpec[];
  /** Castle / end goal position (origin bottom-center of house) */
  end: { x: number; y: number };
  spawn: { x: number; y: number };
};

const FOREST: LevelTheme = {
  id: 'forest',
  name: 'Sunny Forest',
  bgTint: 0xffffff,
  platformTint: 0xffffff,
  skyColor: '#87CEEB',
  decor: 'tree',
  castle: 'house',
};

const ICE: LevelTheme = {
  id: 'ice',
  name: 'Frost Peak',
  bgTint: 0x9ad4ff,
  platformTint: 0xc8e8ff,
  skyColor: '#cfefff',
  decor: 'pine',
  castle: 'wooden-house',
};

const VOLCANIC: LevelTheme = {
  id: 'volcanic',
  name: 'Ember Crags',
  bgTint: 0xff6a3d,
  platformTint: 0xff8866,
  skyColor: '#3a1810',
  decor: 'rock',
  castle: 'plant-house',
};

const DESERT: LevelTheme = {
  id: 'desert',
  name: 'Sunscar Dunes',
  bgTint: 0xffd27a,
  platformTint: 0xf0c060,
  skyColor: '#f2c14e',
  decor: 'palm',
  castle: 'tree-house',
};

/** Level 1 — short intro, one easy gap, no enemies */
const LEVEL_1: LevelDefinition = {
  id: 1,
  theme: FOREST,
  width: 1800,
  groundY: 584,
  spawn: { x: 80, y: 520 },
  end: { x: 1680, y: 560 },
  ground: [
    { from: 0, to: 520 },
    { from: 620, to: 1800 },
  ],
  platforms: [
    { x: 220, y: 520, tiles: 2 },
    { x: 400, y: 460, tiles: 2 },
    { x: 900, y: 500, tiles: 3 },
    { x: 1200, y: 450, tiles: 2 },
  ],
  movingPlatforms: [],
  enemies: [],
  spikes: [],
  suns: [
    { x: 250, y: 480 },
    { x: 430, y: 420 },
    { x: 960, y: 460 },
    { x: 1240, y: 410 },
    { x: 1500, y: 540 },
  ],
};

/** Level 2 — longer, gaps + spikes + slow moving platform + frogs */
const LEVEL_2: LevelDefinition = {
  id: 2,
  theme: ICE,
  width: 2600,
  groundY: 584,
  spawn: { x: 80, y: 520 },
  end: { x: 2460, y: 560 },
  ground: [
    { from: 0, to: 420 },
    { from: 540, to: 900 },
    { from: 1040, to: 1500 },
    { from: 1680, to: 2600 },
  ],
  platforms: [
    { x: 480, y: 500, tiles: 1 },
    { x: 720, y: 440, tiles: 2 },
    { x: 980, y: 480, tiles: 1 },
    { x: 1300, y: 420, tiles: 2 },
    { x: 1580, y: 460, tiles: 1 },
    { x: 1900, y: 500, tiles: 3 },
    { x: 2200, y: 440, tiles: 2 },
  ],
  movingPlatforms: [
    { x: 1120, y: 380, range: 100, axis: 'x', durationMs: 2200 },
  ],
  enemies: [
    { kind: 'frog', x: 700, y: 540, patrol: 80 },
    { kind: 'frog', x: 1350, y: 540, patrol: 100 },
  ],
  spikes: [
    { x: 800, y: 568 },
    { x: 1420, y: 568 },
    { x: 2000, y: 568 },
  ],
  suns: [
    { x: 480, y: 460 },
    { x: 760, y: 400 },
    { x: 1120, y: 340 },
    { x: 1340, y: 380 },
    { x: 1920, y: 460 },
    { x: 2240, y: 400 },
  ],
};

/** Level 3 — long volcanic run with eagles, opossums, deadly movers */
const LEVEL_3: LevelDefinition = {
  id: 3,
  theme: VOLCANIC,
  width: 3400,
  groundY: 584,
  spawn: { x: 80, y: 520 },
  end: { x: 3240, y: 560 },
  ground: [
    { from: 0, to: 360 },
    { from: 500, to: 780 },
    { from: 960, to: 1280 },
    { from: 1480, to: 1780 },
    { from: 1980, to: 2400 },
    { from: 2600, to: 3400 },
  ],
  platforms: [
    { x: 430, y: 500, tiles: 1 },
    { x: 870, y: 460, tiles: 1 },
    { x: 1380, y: 420, tiles: 1 },
    { x: 1880, y: 460, tiles: 1 },
    { x: 2200, y: 400, tiles: 2 },
    { x: 2500, y: 480, tiles: 1 },
    { x: 2800, y: 440, tiles: 2 },
    { x: 3050, y: 500, tiles: 2 },
  ],
  movingPlatforms: [
    { x: 1100, y: 360, range: 120, axis: 'x', durationMs: 1800 },
    { x: 1600, y: 340, range: 90, axis: 'y', durationMs: 1600 },
    { x: 2100, y: 300, range: 140, axis: 'x', durationMs: 1500, deadly: true },
  ],
  enemies: [
    { kind: 'opossum', x: 620, y: 548, patrol: 90 },
    { kind: 'frog', x: 1150, y: 540, patrol: 70 },
    { kind: 'eagle', x: 1500, y: 280, patrol: 160 },
    { kind: 'opossum', x: 2100, y: 548, patrol: 110 },
    { kind: 'eagle', x: 2700, y: 260, patrol: 180 },
  ],
  spikes: [
    { x: 640, y: 568 },
    { x: 1180, y: 568 },
    { x: 1700, y: 568 },
    { x: 2250, y: 568 },
    { x: 2680, y: 568 },
    { x: 2900, y: 568 },
  ],
  suns: [
    { x: 430, y: 460 },
    { x: 870, y: 420 },
    { x: 1100, y: 320 },
    { x: 1380, y: 380 },
    { x: 1600, y: 300 },
    { x: 2200, y: 360 },
    { x: 2800, y: 400 },
    { x: 3100, y: 460 },
  ],
};

/** Level 4 — longest desert gauntlet */
const LEVEL_4: LevelDefinition = {
  id: 4,
  theme: DESERT,
  width: 4200,
  groundY: 584,
  spawn: { x: 80, y: 520 },
  end: { x: 4020, y: 560 },
  ground: [
    { from: 0, to: 300 },
    { from: 460, to: 700 },
    { from: 900, to: 1100 },
    { from: 1320, to: 1580 },
    { from: 1800, to: 2050 },
    { from: 2300, to: 2550 },
    { from: 2800, to: 3100 },
    { from: 3350, to: 4200 },
  ],
  platforms: [
    { x: 380, y: 500, tiles: 1 },
    { x: 800, y: 460, tiles: 1 },
    { x: 1200, y: 420, tiles: 1 },
    { x: 1680, y: 380, tiles: 1 },
    { x: 2160, y: 420, tiles: 1 },
    { x: 2660, y: 380, tiles: 1 },
    { x: 3200, y: 440, tiles: 1 },
    { x: 3500, y: 400, tiles: 2 },
    { x: 3750, y: 480, tiles: 2 },
  ],
  movingPlatforms: [
    { x: 600, y: 360, range: 100, axis: 'y', durationMs: 1400 },
    { x: 1450, y: 320, range: 160, axis: 'x', durationMs: 1400 },
    { x: 1900, y: 280, range: 120, axis: 'x', durationMs: 1200, deadly: true },
    { x: 2450, y: 300, range: 100, axis: 'y', durationMs: 1300 },
    { x: 2950, y: 260, range: 180, axis: 'x', durationMs: 1100, deadly: true },
  ],
  enemies: [
    { kind: 'frog', x: 560, y: 540, patrol: 70 },
    { kind: 'opossum', x: 980, y: 548, patrol: 80 },
    { kind: 'eagle', x: 1250, y: 240, patrol: 200 },
    { kind: 'opossum', x: 1450, y: 548, patrol: 100 },
    { kind: 'frog', x: 1900, y: 540, patrol: 90 },
    { kind: 'eagle', x: 2200, y: 220, patrol: 220 },
    { kind: 'opossum', x: 2450, y: 548, patrol: 120 },
    { kind: 'eagle', x: 3000, y: 200, patrol: 200 },
    { kind: 'frog', x: 3600, y: 540, patrol: 80 },
  ],
  spikes: [
    { x: 520, y: 568 },
    { x: 1000, y: 568 },
    { x: 1500, y: 568 },
    { x: 1950, y: 568 },
    { x: 2400, y: 568 },
    { x: 2900, y: 568 },
    { x: 3450, y: 568 },
    { x: 3650, y: 568 },
  ],
  suns: [
    { x: 380, y: 460 },
    { x: 800, y: 420 },
    { x: 1200, y: 380 },
    { x: 1450, y: 280 },
    { x: 1680, y: 340 },
    { x: 2160, y: 380 },
    { x: 2450, y: 260 },
    { x: 2660, y: 340 },
    { x: 3200, y: 400 },
    { x: 3550, y: 360 },
  ],
};

export const LEVELS: LevelDefinition[] = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4];

export const TOTAL_LEVELS = LEVELS.length;

export function getLevel(levelNumber: number): LevelDefinition {
  const clamped = Math.min(Math.max(1, levelNumber), TOTAL_LEVELS);
  return LEVELS[clamped - 1]!;
}
