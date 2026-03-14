## 1. 武器配置

- [x] 1.1 在 `config.ts` 新增 `WeaponConfig` 接口和 `WEAPONS` 数组（手枪、霰弹枪、冲锋枪完整参数）
- [x] 1.2 从 `PLAYER.FIRE_COOLDOWN` 和 `BULLET.DAMAGE` 解耦，改为运行时由武器配置决定

## 2. 武器选择 UI（MenuScene）

- [x] 2.1 MenuScene 新增武器选择区域，渲染三张武器卡片（名称 + 关键属性）
- [x] 2.2 实现卡片选中高亮逻辑，默认选中手枪
- [x] 2.3 Start Game 按钮将所选武器 id 随关卡数据一起传入 GameScene

## 3. GameScene 射击逻辑改造

- [x] 3.1 `GameScene.init()` 接收武器配置，初始化 `currentAmmo`、`isReloading`、`reloadTimer`
- [x] 3.2 `firePlayerBullet()` 根据武器 `bulletCount` 和 `spreadAngle` 发射单颗或扇形多颗子弹
- [x] 3.3 射击时检查 `isReloading` 和 `currentAmmo`，弹夹为空时自动触发换弹
- [x] 3.4 `update()` 中处理换弹计时：`reloadTimer` 倒计时，归零后恢复满弹、退出换弹状态
- [x] 3.5 监听 R 键，按下时若不在换弹中且弹数未满则触发换弹

## 4. HUD 弹药显示

- [x] 4.1 HUD 新增弹药文字显示（右下角），`updateAmmo(current, max)` 方法
- [x] 4.2 HUD 新增换弹进度条，`updateReload(progress: 0~1)` 控制显示/隐藏和宽度
- [x] 4.3 GameScene 每帧调用 `hud.updateAmmo` 和 `hud.updateReload`
