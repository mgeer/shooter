import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, WEAPONS, WeaponConfig } from '../config';

export class MenuScene extends Phaser.Scene {
  private selectedWeapon: WeaponConfig = WEAPONS[0];
  private cards: Phaser.GameObjects.Container[] = [];

  constructor() {
    super('MenuScene');
  }

  create() {
    this.selectedWeapon = WEAPONS[0];
    this.cards = [];

    // Background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x111122);

    // Title
    this.add.text(GAME_WIDTH / 2, 34, '🔫 TOP-DOWN SHOOTER', {
      fontSize: '30px',
      color: '#44ff44',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 72, '左摇杆移动  |  右摇杆瞄准+射击  |  ↺ 换弹', {
      fontSize: '14px',
      color: '#666688',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Weapon select label
    this.add.text(GAME_WIDTH / 2, 104, '选择武器', {
      fontSize: '18px',
      color: '#aaaaff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Weapon cards — 3 cards centered
    const cardW = 230;
    const cardH = 200;
    const cardSpacing = 250;
    const startX = GAME_WIDTH / 2 - cardSpacing;
    const cardY = 248;

    WEAPONS.forEach((weapon, i) => {
      const x = startX + i * cardSpacing;
      const card = this.buildCard(weapon, x, cardY, cardW, cardH);
      this.cards.push(card);
    });

    this.refreshCards();

    // Start button — tall enough for finger tap
    const startBtn = this.add.text(GAME_WIDTH / 2, 390, '[ START GAME ]', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      padding: { x: 20, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on('pointerover', () => startBtn.setStyle({ color: '#44ff44' }));
    startBtn.on('pointerout', () => startBtn.setStyle({ color: '#ffffff' }));
    startBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { level: 1, score: 0, weaponId: this.selectedWeapon.id });
    });

    this.tweens.add({
      targets: startBtn,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private buildCard(weapon: WeaponConfig, x: number, y: number, w: number, h: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, w, h, 0x1a1a33).setStrokeStyle(2, 0x333366);
    container.add(bg);

    const nameText = this.add.text(0, -88, weapon.name, {
      fontSize: '22px', color: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(nameText);

    const swatch = this.add.rectangle(0, -60, 24, 12, weapon.bulletColor);
    container.add(swatch);

    const attrs = [
      `弹夹  ${weapon.magazineSize} 发`,
      `伤害  ${weapon.damage}${weapon.bulletCount > 1 ? `×${weapon.bulletCount}` : ''}`,
      `射速  ${weapon.fireCooldown}ms`,
      `换弹  ${(weapon.reloadTime / 1000).toFixed(1)}s`,
    ];

    attrs.forEach((line, i) => {
      const t = this.add.text(0, -30 + i * 26, line, {
        fontSize: '16px', color: '#aaaacc', fontFamily: 'monospace',
      }).setOrigin(0.5);
      container.add(t);
    });

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', () => {
      this.selectedWeapon = weapon;
      this.refreshCards();
    });
    bg.on('pointerover', () => {
      if (this.selectedWeapon.id !== weapon.id) bg.setFillStyle(0x222244);
    });
    bg.on('pointerout', () => {
      if (this.selectedWeapon.id !== weapon.id) bg.setFillStyle(0x1a1a33);
    });

    (container as any)._bg = bg;
    (container as any)._weapon = weapon;

    return container;
  }

  private refreshCards() {
    this.cards.forEach(card => {
      const bg = (card as any)._bg as Phaser.GameObjects.Rectangle;
      const weapon = (card as any)._weapon as WeaponConfig;
      if (weapon.id === this.selectedWeapon.id) {
        bg.setFillStyle(0x112244).setStrokeStyle(2, 0x44aaff);
      } else {
        bg.setFillStyle(0x1a1a33).setStrokeStyle(2, 0x333366);
      }
    });
  }
}
