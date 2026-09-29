import Phaser from 'phaser';
import { PLAYER_CONFIG, GAME_CONSTANTS } from '../config';
import { ASSETS, FRAME_SIZES } from '../assets';
import { getLevel, type LevelDefinition, type EnemyKind } from '../levels';

type PatrolEnemy = Phaser.Physics.Arcade.Sprite & {
  patrolMin?: number;
  patrolMax?: number;
  patrolSpeed?: number;
  enemyKind?: EnemyKind;
};

export class LevelScene extends Phaser.Scene {
  private level!: LevelDefinition;
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms!: Phaser.Physics.Arcade.Group;
  private deadlyMovers!: Phaser.Physics.Arcade.Group;
  private gems!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private hazards!: Phaser.Physics.Arcade.StaticGroup;
  private goal!: Phaser.Physics.Arcade.Sprite;
  private finishLabel!: Phaser.GameObjects.Text;
  private duneFar?: Phaser.GameObjects.TileSprite;
  private duneNear?: Phaser.GameObjects.TileSprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private movesRemaining = 25;
  private gemsCollected = 0;
  private movesText!: Phaser.GameObjects.Text;
  private gemsText!: Phaser.GameObjects.Text;
  private wasMoving = false;
  private exhaustedEmitted = false;
  private levelComplete = false;
  private unlimited = false;
  private invulnerableUntil = 0;
  private checkpoint = { x: 80, y: 520 };
  private bg!: Phaser.GameObjects.TileSprite | Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'LevelScene' });
  }

  preload() {
    this.load.image('bg-back', ASSETS.background.back);
    this.load.image('bg-volcanic', ASSETS.background.volcanic);
    this.load.image('bft-sun', ASSETS.ui.sun);
    this.load.image('platform-long', ASSETS.props.platformLong);
    this.load.image('crate', ASSETS.props.crate);
    this.load.image('bush', ASSETS.props.bush);
    this.load.image('tree', ASSETS.props.tree);
    this.load.image('pine', ASSETS.props.pine);
    this.load.image('palm', ASSETS.props.palm);
    this.load.image('rock', ASSETS.props.rock);
    this.load.image('spikes', ASSETS.props.spikes);
    this.load.image('spike-skull', ASSETS.props.spikeSkull);
    this.load.image('house', ASSETS.props.house);
    this.load.image('wooden-house', ASSETS.props.woodenHouse);
    this.load.image('tree-house', ASSETS.props.treeHouse);
    this.load.image('plant-house', ASSETS.props.plantHouse);

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
    this.load.spritesheet('frog-idle', ASSETS.enemies.frogIdle, {
      frameWidth: FRAME_SIZES.frog.width,
      frameHeight: FRAME_SIZES.frog.height,
    });
    this.load.spritesheet('eagle', ASSETS.enemies.eagle, {
      frameWidth: FRAME_SIZES.eagle.width,
      frameHeight: FRAME_SIZES.eagle.height,
    });
    this.load.spritesheet('enemy-death', ASSETS.enemies.death, {
      frameWidth: FRAME_SIZES.enemyDeath.width,
      frameHeight: FRAME_SIZES.enemyDeath.height,
    });

    ASSETS.enemies.opossum.forEach((path, i) => {
      this.load.image(`opossum-${i}`, path);
    });
  }

  create() {
    const levelNumber = (this.registry.get('levelNumber') as number) || 1;
    this.level = getLevel(levelNumber);

    const registryMoves = this.registry.get('movesRemaining');
    this.movesRemaining =
      typeof registryMoves === 'number' ? registryMoves : 25;
    this.unlimited = this.registry.get('unlimitedResources') === true;
    this.gemsCollected = 0;
    this.exhaustedEmitted = false;
    this.levelComplete = false;
    this.invulnerableUntil = 0;
    this.checkpoint = { ...this.level.spawn };

    this.cameras.main.setBackgroundColor(this.level.theme.skyColor);
    this.physics.world.setBounds(0, 0, this.level.width, 700);
    this.cameras.main.setBounds(0, 0, this.level.width, 600);

    this.createBackground();
    this.createAnimations();
    this.createPlatforms();
    this.createMovingPlatforms();
    this.createDecor();
    this.createHazards();
    this.createEnemies();
    this.createPlayer();
    this.createGems();
    this.createGoal();
    this.createUI();

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(120, 80);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.jumpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);
    this.physics.add.collider(this.enemies, this.platforms);

    this.physics.add.overlap(
      this.player,
      this.gems,
      this.collectGem as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.hazards,
      this.hitHazard as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.deadlyMovers,
      this.hitHazard as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.goal,
      this.reachGoal as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    if (!this.unlimited && this.movesRemaining <= 0) {
      this.emitMovesExhausted();
    }
  }

  update(_time: number, _delta: number) {
    if (this.levelComplete) return;

    const scrollX = this.cameras.main.scrollX;
    if (this.bg instanceof Phaser.GameObjects.TileSprite) {
      this.bg.tilePositionX = scrollX * 0.3;
    }
    if (this.duneFar) this.duneFar.tilePositionX = scrollX * 0.08;
    if (this.duneNear) this.duneNear.tilePositionX = scrollX * 0.16;

    this.updateEnemies();

    if (this.player.y > 640) {
      this.takeDamage('fall');
      return;
    }

    if (!this.unlimited && this.movesRemaining <= 0) {
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

    if (isOnGround) {
      this.checkpoint = { x: this.player.x, y: this.player.y };
    }

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

    // Invulnerability flash
    if (this.time.now < this.invulnerableUntil) {
      this.player.setAlpha(Math.sin(this.time.now / 50) > 0 ? 1 : 0.35);
    } else {
      this.player.setAlpha(1);
    }
  }

  private createBackground() {
    if (this.level.theme.id === 'volcanic') {
      this.bg = this.createVolcanicBackground();
      return;
    }

    const sky = this.add
      .tileSprite(0, 0, 800, 600, 'bg-back')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-2)
      .setTint(this.level.theme.bgTint);
    sky.setTileScale(800 / 384, 600 / 240);
    this.bg = sky;

    if (this.level.theme.id === 'desert') {
      this.createDuneBackdrop();
    }
  }

  /** Fixed landscape. It does not scroll with the camera. */
  private createVolcanicBackground() {
    const cropX = 14;
    const cropY = 45;
    const cropW = 692;
    const cropH = 390;
    const key = 'bg-volcanic-scene';

    if (!this.textures.exists(key)) {
      const source = this.textures.get('bg-volcanic').getSourceImage() as CanvasImageSource;
      const canvas = this.textures.createCanvas(key, cropW, cropH);
      canvas?.context.drawImage(source, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      canvas?.refresh();
    }

    const viewW = 800;
    const viewH = 600;
    const scale = Math.max(viewW / cropW, viewH / cropH);

    return this.add
      .image(viewW / 2, viewH / 2, key)
      .setScrollFactor(0)
      .setDepth(-2)
      .setScale(scale);
  }

  /** Visual top of a ground platform tile. */
  private groundSurfaceY() {
    const displayHeight = 16 * GAME_CONSTANTS.PLATFORM_SCALE;
    return this.level.groundY - displayHeight / 2;
  }

  private createDuneBackdrop() {
    const paintDunes = (key: string, color: number, baseline: number, amplitude: number) => {
      if (this.textures.exists(key)) return;
      const w = 256;
      const h = 72;
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(color, 1);
      g.beginPath();
      g.moveTo(0, h);
      for (let x = 0; x <= w; x += 8) {
        const wave =
          Math.sin((x / w) * Math.PI * 2) * amplitude +
          Math.sin((x / w) * Math.PI * 4 + 1) * amplitude * 0.45;
        g.lineTo(x, baseline - wave);
      }
      g.lineTo(w, h);
      g.closePath();
      g.fillPath();
      g.generateTexture(key, w, h);
      g.destroy();
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    };

    paintDunes('bg-dunes-far', 0xc9843a, 28, 14);
    paintDunes('bg-dunes-near', 0xf6d48a, 34, 16);

    this.duneFar = this.add
      .tileSprite(0, 145, 800, 150, 'bg-dunes-far')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-1.7)
      .setTileScale(2, 150 / 72);

    this.duneNear = this.add
      .tileSprite(0, 200, 800, 160, 'bg-dunes-near')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-1.6)
      .setTileScale(2, 160 / 72);
  }

  private createAnimations() {
    if (!this.anims.exists('foxy-idle')) {
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
      this.anims.create({
        key: 'frog-idle',
        frames: this.anims.generateFrameNumbers('frog-idle', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
      });
      this.anims.create({
        key: 'eagle-fly',
        frames: this.anims.generateFrameNumbers('eagle', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: 'opossum-run',
        frames: [
          { key: 'opossum-0' },
          { key: 'opossum-1' },
          { key: 'opossum-2' },
          { key: 'opossum-3' },
          { key: 'opossum-4' },
          { key: 'opossum-5' },
        ],
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: 'enemy-death',
        frames: this.anims.generateFrameNumbers('enemy-death', { start: 0, end: 5 }),
        frameRate: 14,
        hideOnComplete: true,
      });
    }
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    const scale = GAME_CONSTANTS.PLATFORM_SCALE;
    const y = this.level.groundY;

    for (const segment of this.level.ground) {
      for (let x = segment.from + 32; x <= segment.to - 32; x += 64) {
        this.addPlatform(x, y, scale);
      }
    }

    for (const platform of this.level.platforms) {
      const tiles = platform.tiles ?? 1;
      const startX = platform.x - ((tiles - 1) * 64) / 2;
      for (let i = 0; i < tiles; i += 1) {
        this.addPlatform(startX + i * 64, platform.y, scale);
      }
    }
  }

  private addPlatform(x: number, y: number, scale: number) {
    const platform = this.platforms.create(x, y, 'platform-long') as Phaser.Physics.Arcade.Sprite;
    platform.setScale(scale).setTint(this.level.theme.platformTint).refreshBody();
    return platform;
  }

  private createMovingPlatforms() {
    this.movingPlatforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.deadlyMovers = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    for (const spec of this.level.movingPlatforms) {
      const key = spec.deadly ? 'spike-skull' : 'platform-long';
      const group = spec.deadly ? this.deadlyMovers : this.movingPlatforms;
      const sprite = group.create(spec.x, spec.y, key) as Phaser.Physics.Arcade.Sprite;
      sprite.setScale(spec.deadly ? 2 : GAME_CONSTANTS.PLATFORM_SCALE);
      if (!spec.deadly) {
        sprite.setTint(this.level.theme.platformTint);
      }
      const body = sprite.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
      body.setImmovable(true);

      const tweenProps =
        spec.axis === 'x'
          ? { x: spec.x + spec.range }
          : { y: spec.y + spec.range };

      this.tweens.add({
        targets: sprite,
        ...tweenProps,
        duration: spec.durationMs,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private createDecor() {
    const key = this.level.theme.decor;
    // Tuck the trunk a few pixels into the tile so the sprite sits on it.
    const plantY = this.groundSurfaceY() + 4;
    const spacing = 280;
    for (let x = 120; x < this.level.width - 200; x += spacing) {
      if (!this.isOverGround(x)) continue;
      if (Math.abs(x - this.level.end.x) < 120) continue;
      const scale = key === 'palm' ? 1.1 : key === 'pine' ? 1.3 : 1.5;
      this.add
        .image(x, plantY, key)
        .setOrigin(0.5, 1)
        .setScale(scale)
        .setDepth(-1)
        .setTint(this.level.theme.platformTint);
    }
  }

  private isOverGround(x: number): boolean {
    return this.level.ground.some((g) => x >= g.from && x <= g.to);
  }

  private createHazards() {
    this.hazards = this.physics.add.staticGroup();
    for (const spike of this.level.spikes) {
      const s = this.hazards.create(spike.x, spike.y, 'spikes') as Phaser.Physics.Arcade.Sprite;
      s.setScale(2).refreshBody();
      const body = s.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(s.displayWidth * 0.8, s.displayHeight * 0.6);
      body.setOffset(s.displayWidth * 0.1, s.displayHeight * 0.4);
    }
  }

  private createEnemies() {
    this.enemies = this.physics.add.group();

    for (const spec of this.level.enemies) {
      let enemy: PatrolEnemy;
      if (spec.kind === 'frog') {
        enemy = this.enemies.create(spec.x, spec.y, 'frog-idle') as PatrolEnemy;
        enemy.setScale(2);
        enemy.anims.play('frog-idle');
        enemy.patrolSpeed = 40;
      } else if (spec.kind === 'eagle') {
        enemy = this.enemies.create(spec.x, spec.y, 'eagle') as PatrolEnemy;
        enemy.setScale(2);
        enemy.anims.play('eagle-fly');
        enemy.patrolSpeed = 70;
        const body = enemy.body as Phaser.Physics.Arcade.Body;
        body.setAllowGravity(false);
      } else {
        enemy = this.enemies.create(spec.x, spec.y, 'opossum-0') as PatrolEnemy;
        enemy.setScale(2);
        enemy.anims.play('opossum-run');
        enemy.patrolSpeed = 55;
      }

      enemy.enemyKind = spec.kind;
      enemy.patrolMin = spec.x - spec.patrol;
      enemy.patrolMax = spec.x + spec.patrol;
      enemy.setFlipX(true);
      enemy.setVelocityX(-(enemy.patrolSpeed ?? 40));

      const body = enemy.body as Phaser.Physics.Arcade.Body;
      body.setSize(20, 20);
      body.setOffset(8, 8);
    }
  }

  private updateEnemies() {
    const children = this.enemies.getChildren() as PatrolEnemy[];
    for (const enemy of children) {
      if (!enemy.active) continue;
      const min = enemy.patrolMin ?? enemy.x;
      const max = enemy.patrolMax ?? enemy.x;
      const speed = enemy.patrolSpeed ?? 40;
      const body = enemy.body as Phaser.Physics.Arcade.Body;

      if (enemy.x <= min) {
        body.setVelocityX(speed);
        enemy.setFlipX(false);
      } else if (enemy.x >= max) {
        body.setVelocityX(-speed);
        enemy.setFlipX(true);
      }

      if (enemy.enemyKind === 'eagle') {
        body.setVelocityY(0);
      }
    }
  }

  private createPlayer() {
    const { x, y } = this.level.spawn;
    this.player = this.physics.add.sprite(x, y, 'foxy-idle');
    this.player.setScale(PLAYER_CONFIG.SCALE);
    this.player.setDepth(6);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play('foxy-idle');

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(18, 26);
    body.setOffset(8, 6);
  }

  private createGems() {
    this.gems = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.level.suns.forEach(({ x, y }, index) => {
      this.add.image(x, y + 12, 'crate').setScale(2).setDepth(1);

      const sun = this.gems.create(x, y - 8, 'bft-sun') as Phaser.Physics.Arcade.Sprite;
      const baseScale = 0.09;
      sun.setScale(baseScale).setDepth(2);

      const body = sun.body as Phaser.Physics.Arcade.Body;
      body.setSize(220, 160);
      body.setOffset(138, 60);

      this.addSunShimmer(sun, baseScale, index * 120);
    });
  }

  private createGoal() {
    const castleKey = this.level.theme.castle;
    const surfaceY = this.groundSurfaceY() + 2;
    this.goal = this.physics.add.sprite(this.level.end.x, surfaceY, castleKey);
    this.goal.setOrigin(0.5, 1).setScale(1.4).setDepth(2);
    const body = this.goal.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    body.setImmovable(true);
    body.setSize(this.goal.width * 0.45, this.goal.height * 0.35);
    body.setOffset(this.goal.width * 0.28, this.goal.height * 0.55);

    this.finishLabel = this.add
      .text(this.level.end.x, surfaceY - this.goal.displayHeight - 12, 'FINISH', {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(3);
  }

  private celebrateHouse() {
    const house = this.goal;
    const body = house.body as Phaser.Physics.Arcade.Body;
    body.enable = false;

    const restY = house.y;
    const labelRest = this.finishLabel.y;
    const scaleX = house.scaleX;
    const scaleY = house.scaleY;

    this.tweens.add({
      targets: house,
      y: restY - 16,
      duration: 220,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeOut',
    });
    this.tweens.add({
      targets: this.finishLabel,
      y: labelRest - 16,
      duration: 220,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeOut',
    });
    this.tweens.add({
      targets: house,
      scaleX: scaleX * 1.08,
      scaleY: scaleY * 0.9,
      duration: 220,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut',
    });

    const roofY = restY - house.displayHeight * 0.72;
    for (let i = 0; i < 7; i += 1) {
      const spark = this.add
        .image(house.x, roofY, 'bft-sun')
        .setScale(0.035)
        .setDepth(5);
      const angle = -Math.PI / 2 + (i - 3) * 0.35;
      this.tweens.add({
        targets: spark,
        x: house.x + Math.cos(angle) * 56,
        y: roofY + Math.sin(angle) * 48,
        alpha: 0,
        scale: 0.015,
        duration: 700,
        delay: 60,
        ease: 'Quad.easeOut',
        onComplete: () => spark.destroy(),
      });
    }
  }

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
    this.add
      .text(16, 16, `Level ${this.level.id}: ${this.level.theme.name}`, {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.movesText = this.add
      .text(16, 50, this.unlimited ? 'Moves: ∞' : `Moves: ${this.movesRemaining}`, {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.gemsText = this.add
      .text(16, 84, `Suns: ${this.gemsCollected}`, {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0)
      .setDepth(10);

    this.add
      .text(16, 118, 'Arrows / Space · Reach the castle!', {
        fontSize: '13px',
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
    this.game.events.emit('suns-collected', this.gemsCollected);

    const fx = this.add.sprite(x, y, 'item-feedback').setScale(1.5).setDepth(5);
    fx.play('item-pop');
  };

  private hitHazard: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = () => {
    this.takeDamage('hazard');
  };

  private hitEnemy: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    enemyObj
  ) => {
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;

    // Stomp from above defeats the enemy
    if (playerBody.velocity.y > 0 && this.player.y < enemy.y - 8) {
      const x = enemy.x;
      const y = enemy.y;
      enemy.destroy();
      const fx = this.add.sprite(x, y, 'enemy-death').setScale(2).setDepth(5);
      fx.play('enemy-death');
      playerBody.setVelocityY(PLAYER_CONFIG.JUMP_VELOCITY * 0.55);
      return;
    }

    this.takeDamage('enemy');
  };

  private reachGoal: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = () => {
    if (this.levelComplete) return;
    this.levelComplete = true;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    this.player.anims.play('foxy-idle', true);
    this.celebrateHouse();

    const banner = this.add
      .text(400, 260, `${this.level.theme.name}\nComplete!`, {
        fontSize: '36px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 24, y: 16 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(30);

    this.tweens.add({
      targets: banner,
      scale: { from: 0.8, to: 1 },
      duration: 400,
      ease: 'Back.easeOut',
    });

    this.time.delayedCall(1400, () => {
      this.game.events.emit('level-complete', {
        level: this.level.id,
        suns: this.gemsCollected,
      });
    });
  };

  private takeDamage(_reason: 'hazard' | 'enemy' | 'fall') {
    if (this.levelComplete) return;
    if (this.time.now < this.invulnerableUntil) return;

    this.invulnerableUntil = this.time.now + 1500;
    if (!this.unlimited) {
      this.game.events.emit('life-lost');
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(this.player.flipX ? 120 : -120, -280);

    // Respawn after brief knockback if fell
    if (_reason === 'fall') {
      this.player.setPosition(this.checkpoint.x, this.checkpoint.y - 20);
      body.setVelocity(0, 0);
    }

    this.cameras.main.shake(180, 0.01);
  }

  private deductMove() {
    if (this.unlimited || this.movesRemaining <= 0 || this.levelComplete) return;

    this.movesRemaining -= 1;
    this.movesText.setText(`Moves: ${this.movesRemaining}`);

    if (this.movesRemaining === 0) {
      this.add
        .text(400, 300, 'Out of Moves!\n\nAnswer questions to continue', {
          fontSize: '26px',
          color: '#ff5555',
          backgroundColor: '#000000',
          padding: { x: 20, y: 10 },
          align: 'center',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(20);

      this.time.delayedCall(900, () => this.emitMovesExhausted());
    }
  }

  private emitMovesExhausted() {
    if (this.exhaustedEmitted || this.levelComplete) return;
    this.exhaustedEmitted = true;
    this.game.events.emit('moves-exhausted');
  }
}
