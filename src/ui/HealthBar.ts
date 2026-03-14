import Phaser from 'phaser';

export class HealthBar {
  private background: Phaser.GameObjects.Rectangle;
  private bar: Phaser.GameObjects.Rectangle;
  private width: number;
  private maxHp: number;
  private colorFull: number;
  private colorLow: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    maxHp: number,
    colorFull = 0x44ff44,
    colorLow = 0xff4444
  ) {
    this.width = width;
    this.maxHp = maxHp;
    this.colorFull = colorFull;
    this.colorLow = colorLow;

    this.background = scene.add
      .rectangle(x, y, width + 2, height + 2, 0x000000)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(10);

    this.bar = scene.add
      .rectangle(x + 1, y, width, height, colorFull)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(11);
  }

  update(currentHp: number) {
    const pct = Phaser.Math.Clamp(currentHp / this.maxHp, 0, 1);
    this.bar.width = Math.max(0, this.width * pct);

    // Color shifts from green to red as HP drops
    const color = pct > 0.4 ? this.colorFull : this.colorLow;
    this.bar.fillColor = color;
  }

  setVisible(visible: boolean) {
    this.background.setVisible(visible);
    this.bar.setVisible(visible);
  }

  destroy() {
    this.background.destroy();
    this.bar.destroy();
  }

  setPosition(x: number, y: number) {
    this.background.setPosition(x, y);
    this.bar.setPosition(x + 1, y);
  }
}
