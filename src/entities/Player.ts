import Phaser from 'phaser';
import { PLAYER } from '../config';

export class Player extends Phaser.Physics.Arcade.Sprite {
  hp: number;
  maxHp: number;
  private aimLine!: Phaser.GameObjects.Graphics;
  private isInvincible = false;
  private invincibleTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp = PLAYER.MAX_HP;
    this.maxHp = PLAYER.MAX_HP;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(PLAYER.RADIUS);
    body.setCollideWorldBounds(true);

    this.setDepth(5);

    // Aim direction line
    this.aimLine = scene.add.graphics();
    this.aimLine.setDepth(6);
  }

  takeDamage(amount: number): boolean {
    if (this.isInvincible) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.isInvincible = true;
    this.invincibleTimer = PLAYER.INVINCIBLE_DURATION;

    // Flash effect
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 80,
      yoyo: true,
      repeat: 2,
      onComplete: () => this.setAlpha(1),
    });

    return true; // damage was applied
  }

  isDead(): boolean {
    return this.hp <= 0;
  }

  clearAimLine() {
    this.aimLine.clear();
  }

  updateAimLine(targetX: number, targetY: number) {
    this.aimLine.clear();

    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    const endX = this.x + Math.cos(angle) * PLAYER.AIM_LINE_LENGTH;
    const endY = this.y + Math.sin(angle) * PLAYER.AIM_LINE_LENGTH;

    this.aimLine.lineStyle(2, 0xffffff, 0.8);
    this.aimLine.beginPath();
    this.aimLine.moveTo(this.x, this.y);
    this.aimLine.lineTo(endX, endY);
    this.aimLine.strokePath();

    // Arrow tip
    this.aimLine.fillStyle(0xffffff, 0.8);
    this.aimLine.fillCircle(endX, endY, 3);
  }

  move(cursors: { up: boolean; down: boolean; left: boolean; right: boolean }) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    let vx = 0;
    let vy = 0;

    if (cursors.left) vx -= 1;
    if (cursors.right) vx += 1;
    if (cursors.up) vy -= 1;
    if (cursors.down) vy += 1;

    // Normalize diagonal
    if (vx !== 0 && vy !== 0) {
      const inv = 1 / Math.sqrt(2);
      vx *= inv;
      vy *= inv;
    }

    body.setVelocity(vx * PLAYER.SPEED, vy * PLAYER.SPEED);
  }

  update(delta: number) {
    if (this.isInvincible) {
      this.invincibleTimer -= delta;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
        this.setAlpha(1);
      }
    }

    // Clamp to world bounds (extra safety)
    const { width, height } = this.scene.scale;
    this.x = Phaser.Math.Clamp(this.x, PLAYER.RADIUS, width - PLAYER.RADIUS);
    this.y = Phaser.Math.Clamp(this.y, PLAYER.RADIUS, height - PLAYER.RADIUS);
  }

  destroy(fromScene?: boolean) {
    this.aimLine.destroy();
    super.destroy(fromScene);
  }
}
