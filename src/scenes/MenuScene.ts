import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x111122);

    // Title
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, '🔫 TOP-DOWN SHOOTER', {
      fontSize: '36px',
      color: '#44ff44',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, '用枪打怪小游戏', {
      fontSize: '18px',
      color: '#aaaaaa',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Controls hint
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'WASD 移动  |  鼠标瞄准  |  左键射击', {
      fontSize: '14px',
      color: '#666688',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Start button
    const startBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, '[ START GAME ]', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on('pointerover', () => startBtn.setStyle({ color: '#44ff44' }));
    startBtn.on('pointerout', () => startBtn.setStyle({ color: '#ffffff' }));
    startBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });

    // Blink animation
    this.tweens.add({
      targets: startBtn,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
