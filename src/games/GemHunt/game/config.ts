import Phaser from 'phaser';
import { LevelScene } from './scenes/LevelScene';

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-game-container',
  backgroundColor: '#87CEEB',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800, x: 0 },
      debug: false,
    },
  },
  scene: [LevelScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

/** Foxy is 33×32; rendered at 2× for readability. */
export const PLAYER_CONFIG = {
  SPEED: 200,
  // Peak height ≈ v²/(2g) ≈ 189px with gravity 800
  JUMP_VELOCITY: -550,
  WIDTH: 66,
  HEIGHT: 64,
  SCALE: 2,
};

export const GAME_CONSTANTS = {
  TILE_SIZE: 16,
  PLATFORM_SCALE: 2,
  MOVES_PER_CORRECT_ANSWER: 5,
  STARTING_LIVES: 5,
  GRAVITY: 800,
};
