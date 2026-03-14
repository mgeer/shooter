import Phaser from 'phaser';
import { PLAYER, BULLET, ENEMY, BOSS, GRID, WEAPONS, WeaponConfig } from '../config';
import { Player } from '../entities/Player';
import { Bullet, BossBullet } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { Boss } from '../entities/Boss';
import { HUD } from '../ui/HUD';
import { VirtualJoystick } from '../ui/VirtualJoystick';
import { LEVELS, LevelConfig } from '../levels/LevelConfig';
import { randomEdgePosition } from '../utils/math';

type GameSceneData = { level: number; score: number; weaponId?: string };

export class GameScene extends Phaser.Scene {
  // State
  private level!: number;
  private score!: number;
  private levelConfig!: LevelConfig;
  private currentWave = 0;
  private waveActive = false;
  private enemiesRemainingInWave = 0;
  private spawnIndex = 0;
  private spawnTimer = 0;
  private betweenWaves = false;
  private betweenWavesTimer = 0;
  private bossSpawned = false;
  private gameOver = false;

  // Entities
  private player!: Player;
  private boss!: Boss | null;
  private bulletPool!: Phaser.Physics.Arcade.Group;
  private enemyPool!: Phaser.Physics.Arcade.Group;
  private bossBulletPool!: Phaser.Physics.Arcade.Group;

  // Input — virtual joysticks
  private leftStick!: VirtualJoystick;
  private rightStick!: VirtualJoystick;
  private reloadBtn!: Phaser.GameObjects.Arc;
  private fireCooldown = 0;

  // Weapon & magazine
  private weapon!: WeaponConfig;
  private currentAmmo = 0;
  private isReloading = false;
  private reloadTimer = 0;

  // UI
  private hud!: HUD;
  private overlay!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  init(data: GameSceneData) {
    this.level = data?.level ?? 1;
    this.score = data?.score ?? 0;
    this.currentWave = 0;
    this.waveActive = false;
    this.enemiesRemainingInWave = 0;
    this.spawnIndex = 0;
    this.spawnTimer = 0;
    this.betweenWaves = false;
    this.betweenWavesTimer = 0;
    this.bossSpawned = false;
    this.gameOver = false;
    this.fireCooldown = 0;
    this.boss = null;
    this.weapon = WEAPONS.find(w => w.id === data?.weaponId) ?? WEAPONS[0];
    this.currentAmmo = this.weapon.magazineSize;
    this.isReloading = false;
    this.reloadTimer = 0;
  }

  create() {
    this.levelConfig = LEVELS[this.level - 1];
    const W = this.scale.width;
    const H = this.scale.height;
    this.physics.world.setBounds(0, 0, W, H);

    // Background grid
    this.drawGrid(W, H);

    // Object pools
    this.bulletPool = this.physics.add.group({
      classType: Bullet,
      maxSize: BULLET.MAX_POOL,
      runChildUpdate: true,
    });

    this.enemyPool = this.physics.add.group({
      classType: Enemy,
      maxSize: ENEMY.MAX_POOL,
      runChildUpdate: false,
    });

    this.bossBulletPool = this.physics.add.group({
      classType: BossBullet,
      maxSize: BOSS.MAX_BULLET_POOL,
      runChildUpdate: true,
    });

    // Player
    this.player = new Player(this, W / 2, H / 2);

    // Virtual joysticks (enable multitouch)
    this.input.addPointer(2);
    const halfW = W / 2;
    this.leftStick = new VirtualJoystick(this, 0, halfW);
    this.rightStick = new VirtualJoystick(this, halfW, W);

    // Reload button (right side, bottom-right corner)
    const btnX = W - 60;
    const btnY = H - 55;
    const btnR = 36;
    this.reloadBtn = this.add.circle(btnX, btnY, btnR, 0x334466, 0.85)
      .setDepth(52).setScrollFactor(0).setInteractive();
    this.add.text(btnX, btnY, '↺', {
      fontSize: '28px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(53).setScrollFactor(0);

    this.reloadBtn.on('pointerdown', () => {
      if (!this.gameOver) this.startReload();
    });

    // Colliders
    this.physics.add.overlap(
      this.bulletPool,
      this.enemyPool,
      this.onBulletHitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.bossBulletPool,
      this.player,
      this.onBossBulletHitPlayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.enemyPool,
      this.player,
      this.onEnemyHitPlayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // HUD
    this.hud = new HUD(this, this.level, W, H);
    this.hud.updateScore(this.score);

    // Overlay text (wave/level messages)
    this.overlay = this.add
      .text(W / 2, H / 2 - 60, '', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(20)
      .setAlpha(0);

    // Start first wave
    this.startNextWave();
  }

  // ─── Drawing ────────────────────────────────────────────

  private drawGrid(W: number, H: number) {
    const gfx = this.add.graphics();
    gfx.lineStyle(1, GRID.COLOR, GRID.ALPHA);

    for (let x = 0; x <= W; x += GRID.SIZE) {
      gfx.beginPath();
      gfx.moveTo(x, 0);
      gfx.lineTo(x, H);
      gfx.strokePath();
    }
    for (let y = 0; y <= H; y += GRID.SIZE) {
      gfx.beginPath();
      gfx.moveTo(0, y);
      gfx.lineTo(W, y);
      gfx.strokePath();
    }
    gfx.setDepth(0);
  }

  // ─── Wave / Level logic ───────────────────────────────────

  private startNextWave() {
    if (this.levelConfig.isBossLevel && !this.bossSpawned) {
      this.spawnBoss();
    }

    if (this.currentWave >= this.levelConfig.waves.length) {
      if (!this.levelConfig.isBossLevel) {
        this.onLevelComplete();
      }
      return;
    }

    this.waveActive = true;
    this.betweenWaves = false;
    this.spawnIndex = 0;
    this.spawnTimer = 0;

    const waveCfg = this.levelConfig.waves[this.currentWave];
    this.enemiesRemainingInWave = waveCfg.enemyCount;

    this.showOverlay(`WAVE ${this.currentWave + 1}`);
  }

  private spawnEnemy() {
    const waveCfg = this.levelConfig.waves[this.currentWave];
    const pos = randomEdgePosition(this.scale.width, this.scale.height);

    let enemy = this.enemyPool.get(pos.x, pos.y) as Enemy | null;
    if (!enemy) {
      enemy = new Enemy(this, pos.x, pos.y);
      this.enemyPool.add(enemy, true);
    }
    enemy.init(waveCfg.enemyHP, waveCfg.enemySpeed, waveCfg.enemyDamage, ENEMY.SCORE);
    enemy.activate(pos.x, pos.y);
  }

  private spawnBoss() {
    if (this.bossSpawned) return;
    this.bossSpawned = true;

    this.boss = new Boss(this, this.scale.width / 2, 80);
    this.boss.setBulletPool(this.bossBulletPool);
    this.boss.setSummonCallback(() => this.spawnEnemyForBoss());

    // Boss bullet overlap
    this.physics.add.overlap(
      this.bossBulletPool,
      this.player,
      this.onBossBulletHitPlayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Player bullets vs boss
    this.physics.add.overlap(
      this.bulletPool,
      this.boss,
      this.onBulletHitBoss as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Boss body vs player
    this.physics.add.overlap(
      this.boss,
      this.player,
      this.onBossBodyHitPlayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.hud.showBossBar(BOSS.MAX_HP);
    this.showOverlay('BOSS FIGHT!');
  }

  private spawnEnemyForBoss() {
    const pos = randomEdgePosition(this.scale.width, this.scale.height);
    let enemy = this.enemyPool.get(pos.x, pos.y) as Enemy | null;
    if (!enemy) {
      enemy = new Enemy(this, pos.x, pos.y);
      this.enemyPool.add(enemy, true);
    }
    enemy.init(50, 110, 15, ENEMY.SCORE);
    enemy.activate(pos.x, pos.y);
  }

  private onWaveCleared() {
    this.currentWave++;
    if (this.currentWave >= this.levelConfig.waves.length) {
      if (!this.levelConfig.isBossLevel) {
        this.onLevelComplete();
      }
      return;
    }
    this.betweenWaves = true;
    this.betweenWavesTimer = 2000;
    this.showOverlay('WAVE CLEAR!');
  }

  private onLevelComplete() {
    const nextLevel = this.level + 1;
    if (nextLevel > LEVELS.length) {
      // Shouldn't happen but fallback
      this.triggerVictory();
      return;
    }
    this.showOverlay(`LEVEL ${this.level} CLEAR!`, 2000, () => {
      this.scene.start('GameScene', { level: nextLevel, score: this.score });
    });
  }

  private triggerGameOver() {
    this.gameOver = true;
    this.time.delayedCall(1200, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  private triggerVictory() {
    this.gameOver = true;
    this.hud.hideBossBar();
    this.time.delayedCall(1200, () => {
      this.scene.start('VictoryScene', { score: this.score });
    });
  }

  // ─── Shooting ─────────────────────────────────────────────

  private firePlayerBulletByAngle(baseAngle: number) {
    const { bulletCount, spreadAngle, damage, bulletColor } = this.weapon;
    for (let i = 0; i < bulletCount; i++) {
      const angle = baseAngle + (i - Math.floor(bulletCount / 2)) * spreadAngle;
      const bullet = this.bulletPool.get(this.player.x, this.player.y) as Bullet | null;
      if (!bullet) continue;
      bullet.fire(this.player.x, this.player.y, Math.cos(angle), Math.sin(angle), damage, bulletColor);
    }
  }

  private startReload() {
    if (this.isReloading || this.currentAmmo === this.weapon.magazineSize) return;
    this.isReloading = true;
    this.reloadTimer = this.weapon.reloadTime;
    this.showOverlay('换弹中...', this.weapon.reloadTime);
  }

  // ─── Collision Handlers ────────────────────────────────────

  private onBulletHitEnemy(
    bulletObj: Phaser.GameObjects.GameObject,
    enemyObj: Phaser.GameObjects.GameObject
  ) {
    const bullet = bulletObj as Bullet;
    const enemy = enemyObj as Enemy;
    if (!bullet.active || !enemy.active) return;

    bullet.deactivate();
    this.spawnHitParticle(enemy.x, enemy.y, 0xffff44);

    const died = enemy.takeDamage(bullet.damage);
    if (died) {
      this.spawnDeathParticle(enemy.x, enemy.y, 0xff4444);
      enemy.deactivate();
      this.score += enemy.scoreValue;
      this.hud.updateScore(this.score);
      this.enemiesRemainingInWave--;
    }
  }

  private onBulletHitBoss(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    // Phaser swaps args when overlap(Group, Sprite): callback receives (Sprite, GroupMember)
    const boss = obj1 instanceof Boss ? (obj1 as Boss) : (obj2 as Boss);
    const bullet = obj1 instanceof Boss ? (obj2 as Bullet) : (obj1 as Bullet);
    if (!bullet.active || !boss.active) return;

    bullet.deactivate();
    this.spawnHitParticle(boss.x, boss.y, 0xff8800);

    const died = boss.takeDamage(bullet.damage);
    this.hud.updateBossHp(boss.hp);

    if (died) {
      this.spawnDeathParticle(boss.x, boss.y, 0xff4444, 30);
      boss.setActive(false).setVisible(false);
      this.score += 500;
      this.hud.updateScore(this.score);
      this.triggerVictory();
    }
  }

  private onBossBulletHitPlayer(
    _playerObj: Phaser.GameObjects.GameObject,
    bulletObj: Phaser.GameObjects.GameObject
  ) {
    const bossBullet = bulletObj as BossBullet;
    if (!bossBullet.active || !this.player.active) return;
    bossBullet.deactivate();

    const damaged = this.player.takeDamage(bossBullet.damage);
    if (damaged) {
      this.cameras.main.shake(150, 0.008);
      this.hud.updatePlayerHp(this.player.hp);
      if (this.player.isDead()) this.triggerGameOver();
    }
  }

  private onEnemyHitPlayer(
    _playerObj: Phaser.GameObjects.GameObject,
    enemyObj: Phaser.GameObjects.GameObject
  ) {
    const enemy = enemyObj as Enemy;
    if (!enemy.active || !this.player.active) return;

    const damaged = this.player.takeDamage(enemy.damage);
    if (damaged) {
      this.cameras.main.shake(100, 0.006);
      this.hud.updatePlayerHp(this.player.hp);
      enemy.deactivate();
      this.enemiesRemainingInWave--;
      if (this.player.isDead()) this.triggerGameOver();
    }
  }

  private onBossBodyHitPlayer(
    _obj1: Phaser.GameObjects.GameObject,
    _obj2: Phaser.GameObjects.GameObject
  ) {
    if (!this.boss || !this.boss.active || !this.player.active) return;

    const damaged = this.player.takeDamage(BOSS.BULLET_DAMAGE);
    if (damaged) {
      this.cameras.main.shake(200, 0.012);
      this.hud.updatePlayerHp(this.player.hp);
      if (this.player.isDead()) this.triggerGameOver();
    }
  }

  // ─── Particles ─────────────────────────────────────────────

  private spawnHitParticle(x: number, y: number, tint: number) {
    const ps = this.add.particles(x, y, 'particle', {
      speed: { min: 40, max: 120 },
      scale: { start: 0.6, end: 0 },
      lifespan: 250,
      quantity: 5,
      tint,
    });
    this.time.delayedCall(300, () => ps.destroy());
  }

  private spawnDeathParticle(x: number, y: number, tint: number, quantity = 12) {
    const ps = this.add.particles(x, y, 'particle', {
      speed: { min: 60, max: 200 },
      scale: { start: 0.8, end: 0 },
      lifespan: 400,
      quantity,
      tint,
    });
    this.time.delayedCall(500, () => ps.destroy());
  }

  // ─── Overlay helper ────────────────────────────────────────

  private showOverlay(msg: string, duration = 1500, onComplete?: () => void) {
    this.overlay.setText(msg).setAlpha(1);
    this.tweens.add({
      targets: this.overlay,
      alpha: 0,
      delay: duration - 400,
      duration: 400,
      onComplete: () => { if (onComplete) onComplete(); },
    });
  }

  // ─── Main update ───────────────────────────────────────────

  update(_time: number, delta: number) {
    if (this.gameOver) return;

    // Left joystick → player movement
    this.player.move({
      up: this.leftStick.dy < -0.15,
      down: this.leftStick.dy > 0.15,
      left: this.leftStick.dx < -0.15,
      right: this.leftStick.dx > 0.15,
    });
    // Pass fractional velocity for smooth diagonal movement
    if (this.leftStick.active) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(this.leftStick.dx * PLAYER.SPEED, this.leftStick.dy * PLAYER.SPEED);
    }
    this.player.update(delta);

    // Right joystick → aim line + auto-fire
    if (this.rightStick.active) {
      const aimX = this.player.x + this.rightStick.dx * 100;
      const aimY = this.player.y + this.rightStick.dy * 100;
      this.player.updateAimLine(aimX, aimY);

      // Auto-fire
      if (this.fireCooldown <= 0 && !this.isReloading && !this.gameOver) {
        if (this.currentAmmo <= 0) {
          this.startReload();
        } else {
          this.firePlayerBulletByAngle(Math.atan2(this.rightStick.dy, this.rightStick.dx));
          this.currentAmmo--;
          this.fireCooldown = this.weapon.fireCooldown;
          if (this.currentAmmo <= 0) this.startReload();
        }
      }
    } else {
      this.player.clearAimLine();
    }

    // Fire cooldown
    if (this.fireCooldown > 0) this.fireCooldown -= delta;

    // Reload countdown
    if (this.isReloading) {
      this.reloadTimer -= delta;
      this.hud.updateReload(1 - this.reloadTimer / this.weapon.reloadTime);
      this.reloadBtn.setFillStyle(0x222233, 0.5);
      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        this.currentAmmo = this.weapon.magazineSize;
        this.hud.updateReload(-1);
        this.reloadBtn.setFillStyle(0x334466, 0.85);
      }
    }

    // Ammo HUD
    this.hud.updateAmmo(this.currentAmmo, this.weapon.magazineSize);

    // Wave spawning
    if (this.waveActive && !this.betweenWaves) {
      const waveCfg = this.levelConfig.waves[this.currentWave];
      if (this.spawnIndex < waveCfg.enemyCount) {
        this.spawnTimer += delta;
        if (this.spawnTimer >= waveCfg.spawnDelay) {
          this.spawnTimer = 0;
          this.spawnEnemy();
          this.spawnIndex++;
        }
      }

      // Check wave clear (all spawned + none active)
      if (
        this.spawnIndex >= waveCfg.enemyCount &&
        !this.levelConfig.isBossLevel &&
        this.countActiveEnemies() === 0
      ) {
        this.waveActive = false;
        this.onWaveCleared();
      }
    }

    // Between waves countdown
    if (this.betweenWaves) {
      this.betweenWavesTimer -= delta;
      if (this.betweenWavesTimer <= 0) {
        this.betweenWaves = false;
        this.waveActive = true;
        this.spawnIndex = 0;
        this.spawnTimer = 0;
        const waveCfg = this.levelConfig.waves[this.currentWave];
        this.enemiesRemainingInWave = waveCfg.enemyCount;
        this.showOverlay(`WAVE ${this.currentWave + 1}`);
      }
    }

    // Enemy AI update
    this.enemyPool.getChildren().forEach(obj => {
      const e = obj as Enemy;
      if (e.active) {
        e.chasePlayer(this.player.x, this.player.y);
        e.updateHpBar();
      }
    });

    // Boss update
    if (this.boss && this.boss.active) {
      this.boss.update(delta, this.player.x, this.player.y);
    }
  }

  private countActiveEnemies(): number {
    return this.enemyPool.getChildren().filter(e => e.active).length;
  }
}
