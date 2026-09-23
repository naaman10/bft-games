import Phaser from 'phaser';
import { PLAYER_CONFIG, GAME_CONSTANTS } from '../config';
import { ASSETS, FRAME_SIZES } from '../assets';

export class TestScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private gems!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private movesRemaining = 25;
  private gemsCollected = 0;
  private movesText!: Phaser.GameObjects.Text;
  private gemsText!: Phaser.GameObjects.Text;
  private wasMoving = false;

  constructor() {
    super({ key: 'TestScene' });
  }

  preload() {
    this.load.image('bg-back', ASSETS.background.back);
    this.load.image('bft-sun', ASSETS.ui.sun);
    this.load.image('platform-long', ASSETS.props.platformLong);
    this.load.image('crate', ASSETS.props.crate);
    this.load.image('bush', ASSETS.props.bush);
    this.load.image('tree', ASSETS.props.tree);

    this.load.spritesheet('foxy-idle', ASSETS.foxy.idle, {
      frameWidth: FRAME_SIZES.foxy.width,
      frameHeight: FRAME_SIZES.foxy.height,
    });
    this.load.spritesheet('foxy-run', ASSETS.foxy.run, {
      frameWidth: FRAME_SIZES.foxy.width,
      frameHeight: FRAME_SIZES.foxy.height,
    });
    this.load.spritesheet('foxy-jump', ASSETS.foxy.jump, {
      frameWidth: FRAME_SIZES.foxy.width,
      frameHeight: FRAME_SIZES.foxy.height,
    });
    this.load.spritesheet('item-feedback', ASSETS.items.feedback, {
      frameWidth: FRAME_SIZES.feedback.width,
      frameHeight: FRAME_SIZES.feedback.height,
    });
  }

  create() {
    this.createBackground();
    this.createAnimations();
    this.createPlatforms();
    this.createDecor();
    this.createPlayer();
    this.createGems();
    this.createUI();

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.jumpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.gems,
      this.collectGem as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    console.log('TestScene created — Sunny Land sprites loaded');
  }

  update() {
    if (this.movesRemaining <= 0) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setVelocityX(0);
      this.player.anims.play('foxy-idle', true);
      return;
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const isOnGround = body.blocked.down || body.touching.down || body.onFloor();
    const movingLeft = this.cursors.left.isDown;
    const movingRight = this.cursors.right.isDown;
    const isMoving = movingLeft || movingRight;

    if (movingLeft) {
      if (!this.wasMoving) this.deductMove();
      body.setVelocityX(-PLAYER_CONFIG.SPEED);
      this.player.setFlipX(true);
    } else if (movingRight) {
      if (!this.wasMoving) this.deductMove();
      body.setVelocityX(PLAYER_CONFIG.SPEED);
      this.player.setFlipX(false);
    } else {
      body.setVelocityX(0);
    }
    this.wasMoving = isMoving;

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up!) ||
      Phaser.Input.Keyboard.JustDown(this.jumpKey);

    if (jumpPressed && isOnGround) {
      this.deductMove();
      body.setVelocityY(PLAYER_CONFIG.JUMP_VELOCITY);
    }

    if (!isOnGround) {
      this.player.anims.play('foxy-jump', true);
    } else if (isMoving) {
      this.player.anims.play('foxy-run', true);
    } else {
      this.player.anims.play('foxy-idle', true);
    }
  }

  private createBackground() {
    // back.png already includes distant hills; middle.png has an opaque black
    // matte in this pack, so we skip it to avoid grey columns.
    const bg = this.add
      .tileSprite(0, 0, 800, 600, 'bg-back')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-2);

    bg.setTileScale(800 / 384, 600 / 240);
  }

  private createAnimations() {
    this.anims.create({
      key: 'foxy-idle',
      frames: this.anims.generateFrameNumbers('foxy-idle', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'foxy-run',
      frames: this.anims.generateFrameNumbers('foxy-run', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'foxy-jump',
      frames: this.anims.generateFrameNumbers('foxy-jump', { start: 0, end: 1 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'item-pop',
      frames: this.anims.generateFrameNumbers('item-feedback', { start: 0, end: 3 }),
      frameRate: 12,
      hideOnComplete: true,
    });
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    const scale = GAME_CONSTANTS.PLATFORM_SCALE;

    // Ground strip across the bottom (surface ≈ y 568)
    for (let x = 16; x <= 784; x += 64) {
      this.addPlatform(x, 584, scale);
    }

    // Stepped platforms — short rises (~45–55px); jump reaches ~189px
    // Low ledge from ground (easy hop)
    this.addPlatform(220, 535, scale);
    this.addPlatform(284, 535, scale);
    this.addPlatform(348, 535, scale);

    // Mid step from the low ledge
    this.addPlatform(480, 480, scale);
    this.addPlatform(544, 480, scale);
    this.addPlatform(608, 480, scale);

    // High step from the mid ledge
    this.addPlatform(120, 425, scale);
    this.addPlatform(184, 425, scale);
  }

  private addPlatform(x: number, y: number, scale: number) {
    const platform = this.platforms.create(x, y, 'platform-long') as Phaser.Physics.Arcade.Sprite;
    platform.setScale(scale).refreshBody();
    return platform;
  }

  private createDecor() {
    this.add.image(80, 560, 'tree').setOrigin(0.5, 1).setScale(1.5).setDepth(0);
    this.add.image(720, 560, 'bush').setOrigin(0.5, 1).setScale(2).setDepth(0);
    this.add.image(400, 560, 'bush').setOrigin(0.5, 1).setScale(2).setDepth(0);
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(80, 520, 'foxy-idle');
    this.player.setScale(PLAYER_CONFIG.SCALE);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play('foxy-idle');

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    // Tighter hitbox than full sprite bounds
    body.setSize(18, 26);
    body.setOffset(8, 6);
  }

  private createGems() {
    this.gems = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    const sunSpots = [
      { x: 284, y: 495 },
      { x: 544, y: 440 },
      { x: 152, y: 385 },
      { x: 700, y: 540 },
    ];

    sunSpots.forEach(({ x, y }, index) => {
      this.add.image(x, y + 12, 'crate').setScale(2).setDepth(1);

      const sun = this.gems.create(x, y - 8, 'bft-sun') as Phaser.Physics.Arcade.Sprite;
      const baseScale = 0.09;
      sun.setScale(baseScale).setDepth(2);

      // Hitbox in texture pixels (scaled down with the sprite)
      const body = sun.body as Phaser.Physics.Arcade.Body;
      body.setSize(220, 160);
      body.setOffset(138, 60);

      this.addSunShimmer(sun, baseScale, index * 120);
    });
  }

  /** Soft pulse + glow so the sun collectibles shimmer in place. */
  private addSunShimmer(
    sun: Phaser.Physics.Arcade.Sprite,
    baseScale: number,
    delayMs: number
  ) {
    this.tweens.add({
      targets: sun,
      scaleX: baseScale * 1.12,
      scaleY: baseScale * 1.12,
      alpha: { from: 0.82, to: 1 },
      angle: { from: -4, to: 4 },
      duration: 900,
      delay: delayMs,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: sun,
      y: sun.y - 4,
      duration: 1100,
      delay: delayMs,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createUI() {
    this.movesText = this.add
      .text(16, 16, `Moves: ${this.movesRemaining}`, {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.gemsText = this.add
      .text(16, 52, `Suns: ${this.gemsCollected}`, {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.add
      .text(16, 88, 'Arrow Keys / Space to Move & Jump', {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(10);
  }

  private collectGem: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    gemObj
  ) => {
    const sun = gemObj as Phaser.Physics.Arcade.Sprite;
    const x = sun.x;
    const y = sun.y;
    this.tweens.killTweensOf(sun);
    sun.destroy();

    this.gemsCollected += 1;
    this.gemsText.setText(`Suns: ${this.gemsCollected}`);

    const fx = this.add.sprite(x, y, 'item-feedback').setScale(1.5).setDepth(5);
    fx.play('item-pop');
  };

  private deductMove() {
    if (this.movesRemaining <= 0) return;

    this.movesRemaining -= 1;
    this.movesText.setText(`Moves: ${this.movesRemaining}`);

    if (this.movesRemaining === 0) {
      this.add
        .text(400, 300, 'Out of Moves!\n\nAnswer questions to continue', {
          fontSize: '28px',
          color: '#ff5555',
          backgroundColor: '#000000',
          padding: { x: 20, y: 10 },
          align: 'center',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(20);
    }
  }
}
