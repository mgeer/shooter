## Why

当前游戏玩家只有一种固定射击方式，缺乏策略选择空间。增加武器选择让玩家在开局就做出有意义的决策，不同武器的弹夹限制和换弹节奏也为战斗增加了深度。

## What Changes

- 新增武器选择界面（MenuScene 中，Start 之前）：手枪、霰弹枪、冲锋枪三选一
- 新增弹夹系统：每种武器有独立弹夹容量，射完需要换弹，换弹期间无法射击
- 新增换弹操作：弹夹打空自动换弹，按 R 可提前手动换弹
- 霰弹枪新增散弹机制：单次射击发射 5 颗扇形子弹
- HUD 新增弹药显示：当前弹数 / 弹夹容量 + 换弹进度条
- **BREAKING**: `PLAYER.FIRE_COOLDOWN` 和 `BULLET.DAMAGE` 不再是全局常量，由所选武器决定

## Capabilities

### New Capabilities

- `weapon-select`: 开局武器选择界面，展示三种武器的属性对比，玩家选定后携带进入游戏
- `magazine-system`: 弹夹容量跟踪、换弹状态机（idle → reloading → idle）、换弹 HUD 显示

### Modified Capabilities

（无现有 spec，不适用）

## Impact

- `src/scenes/MenuScene.ts` — 新增武器选择 UI
- `src/scenes/GameScene.ts` — 射击逻辑改为从武器配置读取参数；霰弹枪需发射多颗子弹
- `src/config.ts` — 新增 `WEAPONS` 配置常量（三种武器的完整参数）
- `src/ui/HUD.ts` — 新增弹药显示和换弹进度条
- `src/entities/Bullet.ts` — 无需修改（参数由 GameScene 传入）
