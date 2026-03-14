## 1. 画布和缩放适配

- [x] 1.1 `config.ts` 将 GAME_WIDTH/GAME_HEIGHT 改为 960/540
- [x] 1.2 `main.ts` 新增 Scale Manager 配置（FIT 模式、横屏锁定、居中）
- [x] 1.3 修复因尺寸变化导致的 HUD 和 Bullet 边界检测坐标偏移

## 2. 虚拟摇杆组件

- [x] 2.1 新建 `src/ui/VirtualJoystick.ts`：基座圆 + 拇指圆，动态摇杆（按下位置为基座）
- [x] 2.2 实现 pointerdown/pointermove/pointerup 事件绑定，维护 `dx`、`dy`（-1~1）和 `active` 状态
- [x] 2.3 支持独立 pointerId 绑定，多点触控不串扰

## 3. GameScene 输入系统替换

- [x] 3.1 移除 WASD 键盘 key 绑定和 R 键监听
- [x] 3.2 移除 `input.on('pointerdown')` 鼠标射击逻辑
- [x] 3.3 在 `create()` 中实例化左摇杆（左半屏）和右摇杆（右半屏）
- [x] 3.4 `update()` 中用左摇杆 dx/dy 驱动 `player.move()`
- [x] 3.5 `update()` 中右摇杆 active 时自动开火（朝摇杆方向），遵守 fireCooldown 和弹夹逻辑
- [x] 3.6 新增换弹触摸按钮（右下角），pointerdown 触发 `startReload()`，换弹中显示禁用样式

## 4. HUD 手机尺寸适配

- [x] 4.1 字体尺寸全部放大（12px→18px，16px→22px）
- [x] 4.2 玩家血条高度 10→14px，宽度 140→180px
- [x] 4.3 Boss 血条高度 18→22px，宽度 300→360px
- [x] 4.4 弹药文字字号放大，换弹进度条加粗
- [x] 4.5 重新布局 HUD 元素位置适配 960×540

## 5. MenuScene 触摸适配

- [x] 5.1 武器卡片尺寸放大（190×190→240×220），间距加大
- [x] 5.2 Start Game 按钮字号和点击区域放大（≥60px 高）
- [x] 5.3 移除控制提示中的 WASD/R 键说明，改为触摸操作说明
