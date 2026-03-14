## Context

当前游戏完全依赖键盘和鼠标输入，画布固定 800×600。手机浏览器没有物理键盘，鼠标事件在触摸屏上行为不一致。需要替换输入系统并让画布自适应手机屏幕，同时保持现有游戏逻辑（碰撞、波次、Boss）不变。

## Goals / Non-Goals

**Goals:**
- 960×540 横屏画布，Scale Manager FIT 模式自适应手机
- 自实现虚拟摇杆，无第三方依赖
- 左摇杆移动，右摇杆瞄准+自动开火
- 换弹触摸按钮
- 菜单和 HUD 触摸友好

**Non-Goals:**
- 原生 App 打包
- 竖屏支持
- 多点触控以外的手势（捏合缩放等）
- 保留键盘支持（完全移除）

## Decisions

### 1. Scale Manager 配置

```ts
scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 960,
  height: 540,
}
```

FIT 模式：等比缩放，保持 16:9，两侧可能有黑边。无需修改任何游戏内坐标——Phaser 自动处理触摸坐标转换。

### 2. 虚拟摇杆自实现

不用 phaser3-rex-plugins（引入额外 bundle 体积），自实现 `VirtualJoystick` 类：

```
状态机:
  idle ──── pointerdown (在摇杆区域内) ──▶ active
  active ── pointermove ──▶ 更新 dx/dy（限制在 radius 内）
  active ── pointerup / pointerout ──▶ idle，dx/dy 归零

输出:
  joystick.dx, joystick.dy  (-1 ~ 1 归一化向量)
  joystick.active           (是否被按住)
```

摇杆基座固定显示，拇指圆跟随触摸点，不超出基座半径。

### 3. 自动开火逻辑

右摇杆 active 时，GameScene.update() 每帧检查：
```
if (rightJoystick.active && fireCooldown <= 0 && !isReloading && currentAmmo > 0) {
  firePlayerBullet(aimAngle)  // 朝右摇杆方向
  currentAmmo--
  fireCooldown = weapon.fireCooldown
}
```

松开右摇杆 → active=false → 停止开火。弹夹空时自动换弹（与原逻辑一致）。

### 4. 摇杆区域划分

```
┌─────────────────────────────────────────┐
│                                         │
│           游 戏 区 域                    │
│                                         │
│  ┌──────────────┐    ┌──────────────┐   │
│  │  左摇杆区    │    │  右摇杆区    │   │
│  │  (任意位置   │    │  (任意位置   │   │
│  │   触摸启动)  │    │   触摸启动)  │   │
│  └──────────────┘    └──────────────┘   │
└─────────────────────────────────────────┘

左半屏 → 左摇杆 pointer 绑定
右半屏 → 右摇杆 pointer 绑定（换弹按钮单独处理）
```

动态摇杆：手指按下的位置就是摇杆基座，不固定位置，更符合手机游戏直觉。

### 5. 换弹按钮

右下角固定位置圆形按钮（半径 36px），`pointerdown` 触发换弹。不使用 Phaser interactive（避免与摇杆 pointer 冲突），用自定义触摸区域检测。

### 6. HUD 和菜单尺寸

960×540 比 800×600 更宽，HUD 元素位置需重新布局：
- 字体从 12-16px 升至 18-22px
- 血条高度从 10px 升至 14px
- Boss 血条加高至 20px
- 菜单武器卡片从 190×190 升至 240×220，间距加大

## Risks / Trade-offs

- **双指触摸冲突**：左右摇杆各自绑定独立 pointerId，Phaser multitouch 默认支持，无需额外处理。
- **黑边**：FIT 模式在非 16:9 屏幕会有黑边，可接受。
- **换弹按钮与右摇杆重叠**：换弹按钮在右摇杆区域内，需优先检测按钮 hit，再处理摇杆。
