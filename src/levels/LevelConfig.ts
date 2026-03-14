export interface WaveConfig {
  enemyCount: number;
  enemySpeed: number;
  enemyHP: number;
  spawnDelay: number; // ms between spawns
  enemyDamage: number;
}

export interface BossConfig {
  hp: number;
  speedPhase1: number;
  speedPhase2: number;
}

export interface LevelConfig {
  levelNumber: number;
  waves: WaveConfig[];
  isBossLevel: boolean;
  bossConfig?: BossConfig;
}

export const LEVELS: LevelConfig[] = [
  // Level 1 — Introduction
  {
    levelNumber: 1,
    isBossLevel: false,
    waves: [
      { enemyCount: 4,  enemySpeed: 80,  enemyHP: 30, spawnDelay: 600, enemyDamage: 10 },
      { enemyCount: 6,  enemySpeed: 85,  enemyHP: 35, spawnDelay: 500, enemyDamage: 10 },
      { enemyCount: 8,  enemySpeed: 90,  enemyHP: 40, spawnDelay: 400, enemyDamage: 10 },
    ],
  },
  // Level 2 — Challenge
  {
    levelNumber: 2,
    isBossLevel: false,
    waves: [
      { enemyCount: 8,  enemySpeed: 110, enemyHP: 50, spawnDelay: 400, enemyDamage: 15 },
      { enemyCount: 10, enemySpeed: 120, enemyHP: 55, spawnDelay: 350, enemyDamage: 15 },
      { enemyCount: 12, enemySpeed: 130, enemyHP: 60, spawnDelay: 300, enemyDamage: 15 },
    ],
  },
  // Level 3 — Boss
  {
    levelNumber: 3,
    isBossLevel: true,
    waves: [
      { enemyCount: 3, enemySpeed: 110, enemyHP: 50, spawnDelay: 500, enemyDamage: 15 },
    ],
    bossConfig: {
      hp: 600,
      speedPhase1: 60,
      speedPhase2: 130,
    },
  },
];
