import Phaser from 'phaser';
import { BULLET, GAME_WIDTH, GAME_HEIGHT } from '../config';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  damage: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet');
    this.damage = BULLET.DAMAGE;
  }

  fire(x: number, y: number, dirX: number, dirY: number, damage?: number, color?: number) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    if (damage !== undefined) this.damage = damage;
    if (color !== undefined) this.setTint(color);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.reset(x, y);
    body.setVelocity(dirX * BULLET.SPEED, dirY * BULLET.SPEED);
    this.setDepth(4);
  }

  update() {
    // Out of world bounds — deactivate
    if (
      this.x < -20 || this.x > GAME_WIDTH + 20 ||
      this.y < -20 || this.y > GAME_HEIGHT + 20
    ) {
      this.deactivate();
    }
  }

  deactivate() {
    this.setActive(false);
    this.setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.reset(-100, -100);
  }
}

export class BossBullet extends Phaser.Physics.Arcade.Sprite {
  damage: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bossBullet');
    this.damage = 0; // set at fire time
  }

  fire(x: number, y: number, vx: number, vy: number, damage: number) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.damage = damage;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.reset(x, y);
    body.setVelocity(vx, vy);
    this.setDepth(4);
  }

  update() {
    if (
      this.x < -30 || this.x > GAME_WIDTH + 30 ||
      this.y < -30 || this.y > GAME_HEIGHT + 30
    ) {
      this.deactivate();
    }
  }

  deactivate() {
    this.setActive(false);
    this.setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.reset(-200, -200);
  }
}
