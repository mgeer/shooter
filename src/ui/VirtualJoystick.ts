import Phaser from 'phaser';

export class VirtualJoystick {
  /** Normalized direction, -1 to 1 */
  dx = 0;
  dy = 0;
  /** Whether the joystick is currently held */
  active = false;

  private scene: Phaser.Scene;
  private baseX = 0;
  private baseY = 0;
  private readonly baseRadius: number;
  private readonly thumbRadius: number;
  private readonly zoneMinX: number;
  private readonly zoneMaxX: number;

  private baseGfx: Phaser.GameObjects.Graphics;
  private thumbGfx: Phaser.GameObjects.Graphics;

  private pointerId: number | null = null;

  constructor(
    scene: Phaser.Scene,
    zoneMinX: number,
    zoneMaxX: number,
    baseRadius = 55,
    thumbRadius = 26,
  ) {
    this.scene = scene;
    this.zoneMinX = zoneMinX;
    this.zoneMaxX = zoneMaxX;
    this.baseRadius = baseRadius;
    this.thumbRadius = thumbRadius;

    this.baseGfx = scene.add.graphics().setDepth(50).setScrollFactor(0);
    this.thumbGfx = scene.add.graphics().setDepth(51).setScrollFactor(0);

    this.setVisible(false);
    this.bindEvents();
  }

  private bindEvents() {
    this.scene.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      if (this.pointerId !== null) return;
      if (ptr.x < this.zoneMinX || ptr.x > this.zoneMaxX) return;
      this.pointerId = ptr.id;
      this.baseX = ptr.x;
      this.baseY = ptr.y;
      this.active = true;
      this.setVisible(true);
      this.updateThumb(ptr.x, ptr.y);
    });

    this.scene.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
      if (ptr.id !== this.pointerId) return;
      this.updateThumb(ptr.x, ptr.y);
    });

    this.scene.input.on('pointerup', (ptr: Phaser.Input.Pointer) => {
      if (ptr.id !== this.pointerId) return;
      this.reset();
    });

    this.scene.input.on('pointerupoutside', (ptr: Phaser.Input.Pointer) => {
      if (ptr.id !== this.pointerId) return;
      this.reset();
    });
  }

  private updateThumb(px: number, py: number) {
    const rawDx = px - this.baseX;
    const rawDy = py - this.baseY;
    const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
    const clamped = Math.min(dist, this.baseRadius);
    const angle = Math.atan2(rawDy, rawDx);

    const tx = this.baseX + Math.cos(angle) * clamped;
    const ty = this.baseY + Math.sin(angle) * clamped;

    this.dx = dist > 4 ? Math.cos(angle) * (clamped / this.baseRadius) : 0;
    this.dy = dist > 4 ? Math.sin(angle) * (clamped / this.baseRadius) : 0;

    this.drawBase();
    this.drawThumb(tx, ty);
  }

  private drawBase() {
    this.baseGfx.clear();
    this.baseGfx.lineStyle(2, 0xffffff, 0.25);
    this.baseGfx.strokeCircle(this.baseX, this.baseY, this.baseRadius);
    this.baseGfx.fillStyle(0xffffff, 0.08);
    this.baseGfx.fillCircle(this.baseX, this.baseY, this.baseRadius);
  }

  private drawThumb(tx: number, ty: number) {
    this.thumbGfx.clear();
    this.thumbGfx.fillStyle(0xffffff, 0.45);
    this.thumbGfx.fillCircle(tx, ty, this.thumbRadius);
  }

  private reset() {
    this.pointerId = null;
    this.active = false;
    this.dx = 0;
    this.dy = 0;
    this.setVisible(false);
  }

  private setVisible(v: boolean) {
    this.baseGfx.setVisible(v);
    this.thumbGfx.setVisible(v);
  }

  destroy() {
    this.baseGfx.destroy();
    this.thumbGfx.destroy();
  }
}
