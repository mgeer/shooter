import Phaser from 'phaser';
import { PLAYER, ENEMY, BOSS, BULLET } from '../config';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Generate player texture (green circle)
    const playerGfx = this.make.graphics({ x: 0, y: 0 });
    playerGfx.fillStyle(PLAYER.COLOR);
    playerGfx.fillCircle(PLAYER.RADIUS, PLAYER.RADIUS, PLAYER.RADIUS);
    playerGfx.generateTexture('player', PLAYER.RADIUS * 2, PLAYER.RADIUS * 2);
    playerGfx.destroy();

    // Generate bullet texture (yellow small circle)
    const bulletGfx = this.make.graphics({ x: 0, y: 0 });
    bulletGfx.fillStyle(BULLET.COLOR);
    bulletGfx.fillCircle(BULLET.RADIUS, BULLET.RADIUS, BULLET.RADIUS);
    bulletGfx.generateTexture('bullet', BULLET.RADIUS * 2, BULLET.RADIUS * 2);
    bulletGfx.destroy();

    // Generate enemy texture (red circle)
    const enemyGfx = this.make.graphics({ x: 0, y: 0 });
    enemyGfx.fillStyle(ENEMY.COLOR);
    enemyGfx.fillCircle(ENEMY.RADIUS, ENEMY.RADIUS, ENEMY.RADIUS);
    enemyGfx.generateTexture('enemy', ENEMY.RADIUS * 2, ENEMY.RADIUS * 2);
    enemyGfx.destroy();

    // Generate boss texture (large dark red circle)
    const bossGfx = this.make.graphics({ x: 0, y: 0 });
    bossGfx.fillStyle(BOSS.COLOR);
    bossGfx.fillCircle(BOSS.RADIUS, BOSS.RADIUS, BOSS.RADIUS);
    bossGfx.generateTexture('boss', BOSS.RADIUS * 2, BOSS.RADIUS * 2);
    bossGfx.destroy();

    // Generate boss bullet texture (orange circle)
    const bossBulletGfx = this.make.graphics({ x: 0, y: 0 });
    bossBulletGfx.fillStyle(BOSS.BULLET_COLOR);
    bossBulletGfx.fillCircle(BOSS.BULLET_RADIUS, BOSS.BULLET_RADIUS, BOSS.BULLET_RADIUS);
    bossBulletGfx.generateTexture('bossBullet', BOSS.BULLET_RADIUS * 2, BOSS.BULLET_RADIUS * 2);
    bossBulletGfx.destroy();

    // Generate particle texture (white circle for effects)
    const particleGfx = this.make.graphics({ x: 0, y: 0 });
    particleGfx.fillStyle(0xffffff);
    particleGfx.fillCircle(4, 4, 4);
    particleGfx.generateTexture('particle', 8, 8);
    particleGfx.destroy();

    this.scene.start('MenuScene');
  }
}
