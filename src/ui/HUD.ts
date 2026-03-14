import Phaser from 'phaser';
import { GAME_WIDTH, PLAYER } from '../config';
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

  constructor(scene: Phaser.Scene, level: number) {
    // Player HP bar (bottom-left)
    this.hpLabel = scene.add.text(10, 570, 'HP', {
      fontSize: '12px', color: '#aaaaaa', fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(10);

    this.playerHpBar = new HealthBar(scene, 30, 575, 140, 10, PLAYER.MAX_HP, 0x44ff44, 0xff4444);

    // Score (top-right)
    this.scoreText = scene.add.text(GAME_WIDTH - 10, 10, 'SCORE: 0', {
      fontSize: '16px', color: '#ffcc44', fontFamily: 'monospace',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(10);

    // Level (top-left)
    this.levelText = scene.add.text(10, 10, `LEVEL ${level}`, {
      fontSize: '16px', color: '#aaaaff', fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(10);

    // Boss HP bar (top-center, hidden by default)
    this.bossLabel = scene.add.text(GAME_WIDTH / 2, 12, 'BOSS', {
      fontSize: '14px', color: '#ff8800', fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(10).setVisible(false);

    this.bossHpBar = new HealthBar(scene, GAME_WIDTH / 2 - 150, 28, 300, 18, 600, 0xff4400, 0xcc0000);
    this.bossHpBar.setVisible(false);

    this.bossHpText = scene.add.text(GAME_WIDTH / 2, 28, '', {
      fontSize: '11px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(12).setVisible(false);
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
  }
}
