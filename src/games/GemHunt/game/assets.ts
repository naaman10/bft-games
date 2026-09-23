/** Sunny Land asset paths (Ansimuz). Spaces encoded for URL loading. */
export const ASSETS = {
  background: {
    back: '/assets/environment/Background/back.png',
    middle: '/assets/environment/Background/middle.png',
  },
  props: {
    platformLong: '/assets/environment/Props/platform-long.png',
    smallPlatform: '/assets/environment/Props/small-platform.png',
    crate: '/assets/environment/Props/crate.png',
    bush: '/assets/environment/Props/bush.png',
    tree: '/assets/environment/Props/tree.png',
    pine: '/assets/environment/Props/pine.png',
    palm: '/assets/environment/Props/palm.png',
    rock: '/assets/environment/Props/rock.png',
    spikes: '/assets/environment/Props/spikes.png',
    spikeSkull: '/assets/environment/Props/spike-skull.png',
    house: '/assets/environment/Props/house.png',
    woodenHouse: '/assets/environment/Props/wooden-house.png',
    treeHouse: '/assets/environment/Props/tree-house.png',
    plantHouse: '/assets/environment/Props/plant-house.png',
  },
  foxy: {
    idle: '/assets/Characters/Foxy/idle/spritesheet.png',
    run: '/assets/Characters/Foxy/run/spritesheet.png',
    jump: '/assets/Characters/Foxy/jump/spritesheet.png',
    hurt: '/assets/Characters/Foxy/hurt/spritesheet.png',
  },
  enemies: {
    frogIdle: '/assets/Characters/frog/Spritesheets/frog-idle.png',
    frogJump: '/assets/Characters/frog/Spritesheets/frog-jump.png',
    eagle: '/assets/Characters/eagle/Spritesheets/eagle-attack.png',
    opossum: [
      '/assets/Characters/Opossum/opossum/opossum-1.png',
      '/assets/Characters/Opossum/opossum/opossum-2.png',
      '/assets/Characters/Opossum/opossum/opossum-3.png',
      '/assets/Characters/Opossum/opossum/opossum-4.png',
      '/assets/Characters/Opossum/opossum/opossum-5.png',
      '/assets/Characters/Opossum/opossum/opossum-6.png',
    ],
    death: '/assets/Misc/Sunnyland%20FX/Spritesheets/enemy-deadth.png',
  },
  items: {
    gem: '/assets/Misc/Sunnyland%20items/Spritesheets/gem.png',
    feedback: '/assets/Misc/Sunnyland%20FX/Spritesheets/item-feedback.png',
  },
  ui: {
    sun: '/assets/Misc/ui/bft-sun.png',
    sun64: '/assets/Misc/ui/bft-sun-64.png',
  },
} as const;

export const FRAME_SIZES = {
  foxy: { width: 33, height: 32 },
  frog: { width: 35, height: 32 },
  eagle: { width: 40, height: 41 },
  enemyDeath: { width: 40, height: 41 },
  gem: { width: 15, height: 13 },
  feedback: { width: 32, height: 32 },
} as const;
