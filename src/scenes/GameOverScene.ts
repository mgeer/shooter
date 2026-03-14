import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: { score: number }) {
    const score = data?.score ?? 0;

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x110000);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, 'GAME OVER', {
      fontSize: '52px',
      color: '#ff4444',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, `最终得分: ${score}`, {
      fontSize: '24px',
      color: '#ffcc44',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    const restartBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, '[ RESTART ]', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartBtn.on('pointerover', () => restartBtn.setStyle({ color: '#ff4444' }));
    restartBtn.on('pointerout', () => restartBtn.setStyle({ color: '#ffffff' }));
    restartBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });

    const menuBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 110, '[ MAIN MENU ]', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setStyle({ color: '#ffffff' }));
    menuBtn.on('pointerout', () => menuBtn.setStyle({ color: '#888888' }));
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
