## Why

游戏目前依赖键盘（WASD/R）和鼠标（瞄准/点击），无法在手机上正常游玩。将其适配为横屏手机浏览器游戏，让玩家无需安装 App，用手机浏览器打开链接即可体验。

## What Changes

- 画布尺寸改为 960×540（16:9 横屏），Phaser Scale Manager 以 FIT 模式自适应不同手机屏幕
- 新增虚拟左摇杆（屏幕左下角）：替换 WASD 键盘移动
- 新增虚拟右摇杆（屏幕右下角）：替换鼠标瞄准，拨动时按武器射速自动开火，松开停止
- 新增换弹触摸按钮（右摇杆旁）：替换 R 键
- 菜单选枪 UI 触摸适配：卡片和按钮放大，触摸目标 ≥ 60px
- HUD 字体和血条尺寸放大，适合手机屏幕阅读
- **BREAKING**: 移除对键盘（WASD、R）和鼠标点击射击的依赖，改为纯触摸输入

## Capabilities

### New Capabilities

- `virtual-joystick`: 左右双虚拟摇杆，自实现触摸跟踪逻辑，不依赖第三方插件
- `touch-ui`: 换弹按钮、菜单触摸适配、HUD 手机尺寸适配

### Modified Capabilities

（无现有 spec，不适用）

## Impact

- `src/main.ts` — 新增 Scale Manager 配置，画布尺寸改为 960×540
- `src/config.ts` — 更新 GAME_WIDTH/GAME_HEIGHT
- `src/scenes/GameScene.ts` — 移除键盘/鼠标输入，接入虚拟摇杆数据，自动开火逻辑
- `src/scenes/MenuScene.ts` — 触摸适配，卡片/按钮放大
- `src/ui/HUD.ts` — 字体和元素尺寸放大
- `src/entities/Player.ts` — 移除 GAME_WIDTH/GAME_HEIGHT 硬编码 clamp（Scale Manager 接管）
- 新增 `src/ui/VirtualJoystick.ts` — 虚拟摇杆组件
