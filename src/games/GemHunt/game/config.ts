import Phaser from 'phaser';
import { TestScene } from './scenes/TestScene';

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-game-container',
  backgroundColor: '#87CEEB', // Sky blue
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800, x: 0 },
      debug: false,
    },
  },
  scene: [TestScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export const PLAYER_CONFIG = {
  SPEED: 200,
  JUMP_VELOCITY: -400,
  WIDTH: 32,
  HEIGHT: 48,
};

export const GAME_CONSTANTS = {
  TILE_SIZE: 32,
  MOVES_PER_CORRECT_ANSWER: 5,
  STARTING_LIVES: 5,
  GRAVITY: 800,
};
