export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export interface WeaponConfig {
  id: 'pistol' | 'shotgun' | 'smg';
  name: string;
  magazineSize: number;
  reloadTime: number;   // ms
  fireCooldown: number; // ms
  damage: number;
  bulletCount: number;
  spreadAngle: number;  // radians between bullets
  bulletColor: number;
}

export const WEAPONS: WeaponConfig[] = [
  {
    id: 'pistol',
    name: '手枪',
    magazineSize: 12,
    reloadTime: 1200,
    fireCooldown: 200,
    damage: 20,
    bulletCount: 1,
    spreadAngle: 0,
    bulletColor: 0xffff00,
  },
  {
    id: 'shotgun',
    name: '霰弹枪',
    magazineSize: 6,
    reloadTime: 2000,
    fireCooldown: 700,
    damage: 12,
    bulletCount: 5,
    spreadAngle: 0.25,
    bulletColor: 0xff8844,
  },
  {
    id: 'smg',
    name: '冲锋枪',
    magazineSize: 30,
    reloadTime: 2500,
    fireCooldown: 80,
    damage: 8,
    bulletCount: 1,
    spreadAngle: 0,
    bulletColor: 0x44ffff,
  },
];

export const PLAYER = {
  SPEED: 200,
  MAX_HP: 100,
  RADIUS: 16,
  COLOR: 0x44ff44,
  AIM_LINE_LENGTH: 30,
  FIRE_COOLDOWN: 200, // ms
  INVINCIBLE_DURATION: 500, // ms after taking damage
};

export const BULLET = {
  SPEED: 500,
  DAMAGE: 20,
  RADIUS: 5,
  COLOR: 0xffff00,
  MAX_POOL: 40,
};

export const ENEMY = {
  SPEED: 90,
  MAX_HP: 40,
  RADIUS: 14,
  COLOR: 0xff4444,
  DAMAGE: 10,
  SCORE: 10,
  MAX_POOL: 40,
};

export const BOSS = {
  SPEED_PHASE1: 60,
  SPEED_PHASE2: 130,
  MAX_HP: 600,
  RADIUS: 36,
  COLOR: 0xcc0000,
  PHASE2_THRESHOLD: 0.5, // 50% HP
  BULLET_SPEED: 240,
  BULLET_DAMAGE: 15,
  BULLET_RADIUS: 7,
  BULLET_COLOR: 0xff8800,
  SHOOT_INTERVAL_PHASE1: 2000, // ms
  SHOOT_INTERVAL_PHASE2: 1200, // ms
  DASH_COOLDOWN: 3500,
  DASH_DURATION: 400,
  DASH_SPEED: 500,
  SUMMON_INTERVAL: 5000,
  MAX_BULLET_POOL: 60,
};

export const GRID = {
  SIZE: 40,
  COLOR: 0x222233,
  ALPHA: 0.6,
};
