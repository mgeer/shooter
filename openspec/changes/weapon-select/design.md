## Context

当前游戏射击参数（伤害、射速）硬编码在 `config.ts` 的 `PLAYER` 和 `BULLET` 常量中，所有玩家共用同一套数值。`GameScene` 的 `firePlayerBullet()` 只发射单颗子弹。需要引入武器配置层，让射击行为由玩家所选武器驱动。

## Goals / Non-Goals

**Goals:**
- MenuScene 新增武器选择 UI（三选一，展示关键属性）
- 武器配置驱动射击参数（射速、伤害、弹夹、换弹时间、子弹数量）
- 弹夹状态机：idle ↔ reloading，换弹期间锁定射击
- 霰弹枪扇形多弹支持
- HUD 弹药显示 + 换弹进度条

**Non-Goals:**
- 游戏中途换枪
- 有限总弹药 / 弹药拾取
- 武器升级或解锁系统

## Decisions

### 1. 武器配置结构

在 `config.ts` 新增 `WEAPONS` 数组，每个武器为一个对象：

```ts
interface WeaponConfig {
  id: 'pistol' | 'shotgun' | 'smg'
  name: string
  magazineSize: number    // 弹夹容量
  reloadTime: number      // 换弹时间 ms
  fireCooldown: number    // 射速 ms
  damage: number          // 单颗子弹伤害
  bulletCount: number     // 每次射击子弹数量（霰弹枪=5）
  spreadAngle: number     // 散射角度 rad（手枪/SMG=0）
  bulletColor: number     // 子弹颜色（各枪不同）
}
```

选择数组而非对象 map，方便 MenuScene 遍历渲染选项。

### 2. 武器状态放在 GameScene

选定武器后通过 `scene.start('GameScene', { level, score, weapon })` 传入。`GameScene` 维护：
- `currentAmmo: number` — 当前弹夹剩余
- `isReloading: boolean`
- `reloadTimer: number`

不抽成单独 WeaponSystem 类——当前规模不值得，GameScene 直接管理足够清晰。

### 3. 换弹状态机

```
        射击(ammo>0)         弹夹空 / 按R
idle ─────────────▶ idle    ────────────▶ reloading
                             reloadTime后
                            ◀────────────
                                idle (ammo=magazineSize)
```

换弹时 `isReloading=true`，`firePlayerBullet` 直接 return。

### 4. 霰弹枪多弹实现

`firePlayerBullet` 根据 `weapon.bulletCount` 循环发射，`spreadAngle` 决定各颗子弹偏角：

```
angle_i = baseAngle + (i - floor(count/2)) * spreadAngle
```

复用现有 `bulletPool` 和 `Bullet` 类，无需新增类型。

### 5. HUD 弹药显示

在 HUD 右下角新增两行：
- `弹药: 6 / 6`（文字）
- 换弹进度条（`isReloading` 时显示，从 0→满）

进度条宽度 = `(reloadTimer / weapon.reloadTime) * barWidth`，在 `GameScene.update()` 中每帧调用 `hud.updateAmmo(currentAmmo, weapon.magazineSize, reloadProgress)`。

## Risks / Trade-offs

- **bulletPool 容量**：霰弹枪每次 5 发，高射速下（700ms 冷却不算高）pool size 40 足够，无需调整。
- **换弹被打断**：当前设计换弹不可被打断（不支持取消），玩家需承担换弹风险，符合"有策略代价"的设计意图。
- **SMG 弹夹体验**：30 发 × 80ms = 2.4s 打完，换弹 2.5s，节奏偏紧张——这是有意为之的设计张力。
