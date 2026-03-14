import Phaser from 'phaser';
import { normalize } from '../utils/math';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  scoreValue: number;
  private hpBar!: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.hp = 40;
    this.maxHp = 40;
    this.speed = 90;
    this.damage = 10;
    this.scoreValue = 10;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(14);

    this.setDepth(3);

    this.hpBar = scene.add.graphics();
    this.hpBar.setDepth(4);
  }

  init(hp: number, speed: number, damage: number, scoreValue: number) {
    this.hp = hp;
    this.maxHp = hp;
    this.speed = speed;
    this.damage = damage;
    this.scoreValue = scoreValue;
  }

  activate(x: number, y: number) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.hpBar.setVisible(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.reset(x, y);
  }

  deactivate() {
    this.setActive(false);
    this.setVisible(false);
    this.hpBar.setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.reset(-200, -200);
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;
    return this.hp <= 0;
  }

  chasePlayer(playerX: number, playerY: number) {
    const dir = normalize(playerX - this.x, playerY - this.y);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(dir.x * this.speed, dir.y * this.speed);
  }

  updateHpBar() {
    this.hpBar.clear();
    const pct = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
    const barW = 24;
    const barH = 4;
    const bx = this.x - barW / 2;
    const by = this.y - 20;
    // Background
    this.hpBar.fillStyle(0x333333);
    this.hpBar.fillRect(bx, by, barW, barH);
    // Health
    this.hpBar.fillStyle(pct > 0.4 ? 0x44ff44 : 0xff4444);
    this.hpBar.fillRect(bx, by, barW * pct, barH);
  }

  destroy(fromScene?: boolean) {
    this.hpBar.destroy();
    super.destroy(fromScene);
  }
}
