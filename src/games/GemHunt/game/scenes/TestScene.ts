import Phaser from 'phaser';
import { PLAYER_CONFIG } from '../config';

export class TestScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private movesRemaining: number = 25;
  private movesText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'TestScene' });
  }

  create() {
    // Add background
    this.add.rectangle(400, 300, 800, 600, 0x87ceeb);

    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    
    // Ground
    const ground = this.add.rectangle(400, 580, 800, 40, 0x8b4513);
    this.platforms.add(ground);
    
    // Platform 1
    const platform1 = this.add.rectangle(200, 450, 200, 20, 0x8b4513);
    this.platforms.add(platform1);
    
    // Platform 2
    const platform2 = this.add.rectangle(600, 350, 200, 20, 0x8b4513);
    this.platforms.add(platform2);

    // Create player (blue rectangle for now)
    this.player = this.add.rectangle(100, 500, PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT, 0x0000ff);
    this.physics.add.existing(this.player);
    
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setCollideWorldBounds(true);

    // Add collision between player and platforms
    this.physics.add.collider(this.player, this.platforms);

    // Create gem crates (yellow squares)
    const crate1 = this.add.rectangle(200, 400, 32, 32, 0xffff00);
    const crate2 = this.add.rectangle(600, 300, 32, 32, 0xffff00);
    const crate3 = this.add.rectangle(700, 540, 32, 32, 0xffff00);

    // Setup keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Add UI text
    this.movesText = this.add.text(16, 16, `Moves: ${this.movesRemaining}`, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.movesText.setScrollFactor(0);

    // Instructions
    this.add.text(16, 60, 'Arrow Keys to Move & Jump', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    }).setScrollFactor(0);

    this.add.text(16, 90, 'Each move costs 1 point', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    }).setScrollFactor(0);

    console.log('TestScene created - Basic platformer ready!');
  }

  update() {
    if (this.movesRemaining <= 0) {
      // Freeze player when out of moves
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      playerBody.setVelocityX(0);
      return;
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    const isOnGround = playerBody.touching.down;

    // Left/Right movement
    if (this.cursors.left.isDown) {
      if (playerBody.velocity.x === 0 || Math.abs(playerBody.velocity.x) < 10) {
        // Only deduct move when starting to move
        this.deductMove();
      }
      playerBody.setVelocityX(-PLAYER_CONFIG.SPEED);
    } else if (this.cursors.right.isDown) {
      if (playerBody.velocity.x === 0 || Math.abs(playerBody.velocity.x) < 10) {
        // Only deduct move when starting to move
        this.deductMove();
      }
      playerBody.setVelocityX(PLAYER_CONFIG.SPEED);
    } else {
      playerBody.setVelocityX(0);
    }

    // Jump
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up!) && isOnGround) {
      this.deductMove();
      playerBody.setVelocityY(PLAYER_CONFIG.JUMP_VELOCITY);
    }
  }

  private deductMove() {
    if (this.movesRemaining > 0) {
      this.movesRemaining--;
      this.movesText.setText(`Moves: ${this.movesRemaining}`);
      
      if (this.movesRemaining === 0) {
        this.add.text(400, 300, 'Out of Moves!\n\nAnswer questions to continue', {
          fontSize: '32px',
          color: '#ff0000',
          backgroundColor: '#000000',
          padding: { x: 20, y: 10 },
          align: 'center',
        }).setOrigin(0.5).setScrollFactor(0);
      }
    }
  }
}
