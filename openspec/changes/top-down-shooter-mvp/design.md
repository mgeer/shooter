## Context

全新项目，从零开始构建一个 2D 俯视角射击游戏。无现有代码或架构约束。目标是快速出一个可玩的 MVP，同时保持代码结构清晰以支持后续迭代。

## Goals / Non-Goals

**Goals:**
- 快速交付可玩的 MVP（3 关卡 + Boss 战）
- 代码结构清晰，各系统解耦，便于后续扩展
- 流畅的 60fps 游戏体验

**Non-Goals:**
- 精美美术资源（MVP 使用几何图形）
- 音效/BGM
- 多种武器/道具系统
- 存档/排行榜
- 多人联机
- 移动端适配

## Decisions

### 1. 游戏框架：Phaser 3

**选择**: Phaser 3
**替代方案**: 纯 Canvas API、PixiJS、Kaboom.js
**理由**: Phaser 3 提供完整的游戏开发工具链（物理引擎、精灵管理、场景系统、输入管理、粒子效果），社区活跃文档丰富。相比纯 Canvas 大幅减少基础设施代码量；相比 PixiJS 更专注游戏场景；相比 Kaboom.js 更成熟稳定。

### 2. 构建工具：Vite

**选择**: Vite
**替代方案**: Webpack、Parcel
**理由**: 开发服务器启动快、HMR 热更新即时、配置简单、对 TypeScript 开箱支持。

### 3. 物理引擎：Arcade Physics

**选择**: Phaser Arcade Physics
**替代方案**: Matter.js（Phaser 内置）
**理由**: Arcade Physics 轻量高效，AABB 碰撞检测足够满足射击游戏需求。Matter.js 虽然支持多边形碰撞，但对本项目过重。

### 4. 场景架构

```
┌──────────────┐
│  BootScene   │  资源预加载
└──────┬───────┘
       ▼
┌──────────────┐
│  MenuScene   │  开始菜单
└──────┬───────┘
       ▼
┌──────────────┐
│  GameScene   │  核心游戏场景（接收 level 参数）
└──────┬───────┘
       │
       ├──▶ GameOverScene（失败）
       └──▶ VictoryScene（通关）
```

**决策**: 使用单一 GameScene 通过参数切换关卡，而非每个关卡一个 Scene。
**理由**: 关卡之间逻辑高度相似（只有怪物配置不同），单 Scene 减少重复代码。关卡配置通过数据驱动。

### 5. 项目结构

```
src/
├── main.ts              # 入口，创建 Phaser.Game
├── config.ts            # 游戏常量配置
├── scenes/
│   ├── BootScene.ts     # 预加载
│   ├── MenuScene.ts     # 主菜单
│   ├── GameScene.ts     # 核心游戏逻辑
│   ├── GameOverScene.ts # Game Over
│   └── VictoryScene.ts  # 胜利
├── entities/
│   ├── Player.ts        # 玩家类
│   ├── Bullet.ts        # 子弹类
│   ├── Enemy.ts         # 基础怪物类
│   └── Boss.ts          # Boss 类
├── ui/
│   ├── HealthBar.ts     # 血条组件
│   └── HUD.ts           # 抬头显示（分数、关卡）
├── levels/
│   └── LevelConfig.ts   # 关卡配置数据
└── utils/
    └── math.ts          # 数学工具函数
```

### 6. 怪物 AI 设计

**基础小怪**: 简单追踪 — 每帧计算朝向玩家的方向向量，以固定速度移动。碰到玩家造成伤害。
**Boss 阶段切换**:
- 阶段1（HP 100%~50%）：缓慢追踪 + 定时发射直线弹幕（3发一组）
- 阶段2（HP < 50%）：快速冲刺 + 扇形弹幕（5发扇形）+ 定时召唤 2 只小怪

### 7. 关卡配置数据驱动

```typescript
interface WaveConfig {
  enemyCount: number;
  enemySpeed: number;
  enemyHP: number;
  spawnDelay: number; // ms between spawns
}

interface LevelConfig {
  waves: WaveConfig[];
  isBossLevel: boolean;
  bossConfig?: BossConfig;
}
```

关卡难度通过配置数据调整，无需修改逻辑代码。

### 8. 渲染方案：Graphics API 绘制几何图形

**选择**: 使用 Phaser Graphics 对象绘制圆形、线条等
**替代方案**: 预制 PNG 精灵图
**理由**: MVP 阶段用几何图形最快，且后续替换为贴图时只需修改渲染层，游戏逻辑不受影响。

## Risks / Trade-offs

- **[性能]** 大量子弹和怪物同屏可能影响帧率 → 使用对象池（Object Pool）复用子弹和怪物实例，限制同屏最大数量
- **[手感]** 纯几何图形可能让射击缺乏打击感 → 添加简单的粒子效果（击中闪光、怪物死亡爆炸）和屏幕震动
- **[平衡]** 关卡难度难以一次调好 → 所有数值放入配置文件，方便快速调整
- **[扩展性]** 单一 GameScene 在后续添加复杂关卡机制时可能变臃肿 → MVP 阶段可接受，后续可拆分为子系统
