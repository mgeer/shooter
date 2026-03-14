import Phaser from 'phaser';
import { PLAYER } from '../config';
import { HealthBar } from './HealthBar';

export class HUD {
  private playerHpBar: HealthBar;
  private bossHpBar: HealthBar;
  private scoreText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private hpLabel: Phaser.GameObjects.Text;
  private bossLabel: Phaser.GameObjects.Text;
  private bossHpText: Phaser.GameObjects.Text;
  private bossMaxHp = 600;
  private bossHpVisible = false;

  // Ammo
  private ammoText: Phaser.GameObjects.Text;
  private reloadBg: Phaser.GameObjects.Rectangle;
  private reloadBar: Phaser.GameObjects.Rectangle;
  private readonly RELOAD_BAR_W = 120;

  constructor(scene: Phaser.Scene, level: number, W: number, H: number) {
    // Player HP bar (bottom-left) — above joystick area
    this.hpLabel = scene.add.text(10, H - 44, 'HP', {
      fontSize: '18px', color: '#aaaaaa', fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(10);

    this.playerHpBar = new HealthBar(scene, 38, H - 36, 180, 14, PLAYER.MAX_HP, 0x44ff44, 0xff4444);

    // Score (top-right)
    this.scoreText = scene.add.text(W - 12, 10, 'SCORE: 0', {
      fontSize: '22px', color: '#ffcc44', fontFamily: 'monospace',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(10);

    // Level (top-left)
    this.levelText = scene.add.text(12, 10, `LEVEL ${level}`, {
      fontSize: '22px', color: '#aaaaff', fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(10);

    // Boss HP bar (top-center, hidden by default)
    this.bossLabel = scene.add.text(W / 2, 14, 'BOSS', {
      fontSize: '18px', color: '#ff8800', fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(10).setVisible(false);

    this.bossHpBar = new HealthBar(scene, W / 2 - 180, 32, 360, 22, 600, 0xff4400, 0xcc0000);
    this.bossHpBar.setVisible(false);

    this.bossHpText = scene.add.text(W / 2, 32, '', {
      fontSize: '14px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(12).setVisible(false);

    // Ammo display (bottom-center-right) — leave right corner for reload button
    this.ammoText = scene.add.text(W - 120, H - 44, '12 / 12', {
      fontSize: '20px', color: '#ffdd88', fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(10);

    // Reload progress bar (above ammo text)
    const rx = W - 120 - this.RELOAD_BAR_W / 2;
    this.reloadBg = scene.add.rectangle(rx, H - 18, this.RELOAD_BAR_W, 10, 0x333333)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(10).setVisible(false);
    this.reloadBar = scene.add.rectangle(rx, H - 18, 0, 10, 0xffaa00)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(11).setVisible(false);
  }

  updatePlayerHp(hp: number) {
    this.playerHpBar.update(hp);
  }

  updateScore(score: number) {
    this.scoreText.setText(`SCORE: ${score}`);
  }

  updateLevel(level: number) {
    this.levelText.setText(`LEVEL ${level}`);
  }

  showBossBar(maxHp: number) {
    this.bossMaxHp = maxHp;
    this.bossHpVisible = true;
    this.bossLabel.setVisible(true);
    this.bossHpBar.setVisible(true);
    this.bossHpText.setVisible(true);
    this.bossHpBar.update(maxHp);
    this.bossHpText.setText(`${maxHp} / ${maxHp}`);
  }

  updateBossHp(hp: number) {
    if (!this.bossHpVisible) return;
    const clamped = Math.max(0, hp);
    this.bossHpBar.update(clamped);
    this.bossHpText.setText(`${clamped} / ${this.bossMaxHp}`);
  }

  updateAmmo(current: number, max: number) {
    this.ammoText.setText(`${current} / ${max}`);
  }

  /** progress: 0~1 = reloading, -1 = hide */
  updateReload(progress: number) {
    if (progress < 0) {
      this.reloadBg.setVisible(false);
      this.reloadBar.setVisible(false);
    } else {
      this.reloadBg.setVisible(true);
      this.reloadBar.setVisible(true);
      this.reloadBar.width = Math.max(1, this.RELOAD_BAR_W * progress);
    }
  }

  hideBossBar() {
    this.bossHpVisible = false;
    this.bossLabel.setVisible(false);
    this.bossHpBar.setVisible(false);
    this.bossHpText.setVisible(false);
  }

  destroy() {
    this.playerHpBar.destroy();
    this.bossHpBar.destroy();
    this.scoreText.destroy();
    this.levelText.destroy();
    this.hpLabel.destroy();
    this.bossLabel.destroy();
    this.bossHpText.destroy();
    this.ammoText.destroy();
    this.reloadBg.destroy();
    this.reloadBar.destroy();
  }
}
