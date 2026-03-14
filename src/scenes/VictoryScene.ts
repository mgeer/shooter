import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create(data: { score: number }) {
    const score = data?.score ?? 0;

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x001100);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, 'VICTORY!', {
      fontSize: '60px',
      color: '#44ff44',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, `最终得分: ${score}`, {
      fontSize: '24px',
      color: '#ffcc44',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, '🎉 恭喜通关！', {
      fontSize: '20px',
      color: '#aaffaa',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    const playAgainBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 90, '[ PLAY AGAIN ]', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playAgainBtn.on('pointerover', () => playAgainBtn.setStyle({ color: '#44ff44' }));
    playAgainBtn.on('pointerout', () => playAgainBtn.setStyle({ color: '#ffffff' }));
    playAgainBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });

    const menuBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 140, '[ MAIN MENU ]', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setStyle({ color: '#ffffff' }));
    menuBtn.on('pointerout', () => menuBtn.setStyle({ color: '#888888' }));
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
