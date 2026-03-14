import Phaser from 'phaser';
import { BOSS } from '../config';
import { normalize } from '../utils/math';
import { BossBullet } from './Bullet';

export type BossPhase = 1 | 2;

export class Boss extends Phaser.Physics.Arcade.Sprite {
  hp: number;
  maxHp: number;
  phase: BossPhase = 1;

  private shootTimer = 0;
  private dashTimer = 0;
  private isDashing = false;
  private dashTimeLeft = 0;
  private summonTimer = 0;
  private summonCallback: (() => void) | null = null;

  private bossBullets!: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp = BOSS.MAX_HP;
    this.maxHp = BOSS.MAX_HP;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(BOSS.RADIUS);
    body.setCollideWorldBounds(true);

    this.setDepth(3);

    // Boss bullet pool
    this.bossBullets = scene.physics.add.group({
      classType: BossBullet,
      maxSize: BOSS.MAX_BULLET_POOL,
      runChildUpdate: true,
    });
  }

  setBulletPool(group: Phaser.Physics.Arcade.Group) {
    this.bossBullets = group;
  }

  getBullets(): Phaser.Physics.Arcade.Group {
    return this.bossBullets;
  }

  setSummonCallback(cb: () => void) {
    this.summonCallback = cb;
  }

  takeDamage(amount: number): boolean {
    this.hp -= amount;
    // Check phase transition
    if (this.phase === 1 && this.hp / this.maxHp < BOSS.PHASE2_THRESHOLD) {
      this.phase = 2;
      this.onPhaseChange();
    }
    return this.hp <= 0;
  }

  private onPhaseChange() {
    // Visual flash
    this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      duration: 100,
      yoyo: true,
      repeat: 4,
      onComplete: () => this.setAlpha(1),
    });
    // Reset timers for more aggressive pattern
    this.shootTimer = 0;
    this.dashTimer = BOSS.DASH_COOLDOWN * 0.5;
    this.summonTimer = 0;
  }

  update(delta: number, playerX: number, playerY: number) {
    if (!this.active) return;

    const speed = this.phase === 1 ? BOSS.SPEED_PHASE1 : BOSS.SPEED_PHASE2;

    // Movement
    if (!this.isDashing) {
      const dir = normalize(playerX - this.x, playerY - this.y);
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(dir.x * speed, dir.y * speed);
    }

    // Dash (phase 2 only)
    if (this.phase === 2) {
      this.dashTimer += delta;
      if (this.dashTimer >= BOSS.DASH_COOLDOWN && !this.isDashing) {
        this.dashTimer = 0;
        this.startDash(playerX, playerY);
      }

      if (this.isDashing) {
        this.dashTimeLeft -= delta;
        if (this.dashTimeLeft <= 0) {
          this.isDashing = false;
        }
      }
    }

    // Shooting
    const shootInterval = this.phase === 1 ? BOSS.SHOOT_INTERVAL_PHASE1 : BOSS.SHOOT_INTERVAL_PHASE2;
    this.shootTimer += delta;
    if (this.shootTimer >= shootInterval) {
      this.shootTimer = 0;
      if (this.phase === 1) {
        this.shootLinear(playerX, playerY);
      } else {
        this.shootFan(playerX, playerY);
      }
    }

    // Summon (phase 2 only)
    if (this.phase === 2) {
      this.summonTimer += delta;
      if (this.summonTimer >= BOSS.SUMMON_INTERVAL) {
        this.summonTimer = 0;
        this.summonCallback?.();
        this.summonCallback?.();
      }
    }
  }

  private startDash(playerX: number, playerY: number) {
    this.isDashing = true;
    this.dashTimeLeft = BOSS.DASH_DURATION;
    const dir = normalize(playerX - this.x, playerY - this.y);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(dir.x * BOSS.DASH_SPEED, dir.y * BOSS.DASH_SPEED);

    // Visual: tint red during dash
    this.setTint(0xff0000);
    this.scene.time.delayedCall(BOSS.DASH_DURATION, () => {
      if (this.active) this.clearTint();
    });
  }

  private shootLinear(playerX: number, playerY: number) {
    const dir = normalize(playerX - this.x, playerY - this.y);
    for (let i = 0; i < 3; i++) {
      const delay = i * 180;
      this.scene.time.delayedCall(delay, () => {
        if (!this.active) return;
        this.spawnBullet(this.x, this.y, dir.x * BOSS.BULLET_SPEED, dir.y * BOSS.BULLET_SPEED);
      });
    }
  }

  private shootFan(playerX: number, playerY: number) {
    const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);
    const spread = 0.35; // radians between bullets
    const count = 5;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (i - Math.floor(count / 2)) * spread;
      const vx = Math.cos(angle) * BOSS.BULLET_SPEED;
      const vy = Math.sin(angle) * BOSS.BULLET_SPEED;
      this.spawnBullet(this.x, this.y, vx, vy);
    }
  }

  private spawnBullet(x: number, y: number, vx: number, vy: number) {
    const bullet = this.bossBullets.get(x, y) as BossBullet | null;
    if (bullet) {
      bullet.fire(x, y, vx, vy, BOSS.BULLET_DAMAGE);
    }
  }
}
