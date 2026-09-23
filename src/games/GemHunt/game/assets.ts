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
  },
  foxy: {
    idle: '/assets/Characters/Foxy/idle/spritesheet.png',
    run: '/assets/Characters/Foxy/run/spritesheet.png',
    jump: '/assets/Characters/Foxy/jump/spritesheet.png',
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
  gem: { width: 15, height: 13 },
  feedback: { width: 32, height: 32 },
} as const;
