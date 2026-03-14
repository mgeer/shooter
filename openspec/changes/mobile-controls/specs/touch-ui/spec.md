## ADDED Requirements

### Requirement: 换弹触摸按钮
游戏 SHALL 在屏幕右下角显示换弹按钮，触摸触发换弹，替代 R 键。按钮在换弹中显示为禁用状态。

#### Scenario: 点击换弹按钮触发换弹
- **WHEN** 玩家点击换弹按钮且不在换弹中且弹夹未满
- **THEN** 触发换弹，按钮显示禁用样式

#### Scenario: 换弹中按钮禁用
- **WHEN** 换弹进行中
- **THEN** 换弹按钮显示为半透明禁用状态，点击无效

### Requirement: 画布横屏自适应
游戏 SHALL 以 960×540（16:9）为基准画布，使用 Phaser Scale Manager FIT 模式在不同手机屏幕上等比缩放，始终水平居中显示，锁定横屏方向。

#### Scenario: 手机横屏打开游戏
- **WHEN** 玩家横持手机在浏览器打开游戏
- **THEN** 游戏画布等比缩放填满屏幕较短边，两侧有黑边（若非16:9屏幕）

### Requirement: 菜单触摸适配
MenuScene 的武器选择卡片和开始按钮 SHALL 足够大以适合手指点击（触摸目标高度 ≥ 60px）。

#### Scenario: 触摸武器卡片选中
- **WHEN** 玩家点击武器卡片
- **THEN** 该武器选中高亮，响应区域覆盖整张卡片

### Requirement: HUD 手机尺寸适配
HUD 元素 SHALL 在 960×540 画布上清晰可读，字体不小于 18px，血条高度不小于 14px。

#### Scenario: 游戏内 HUD 清晰显示
- **WHEN** 游戏运行中
- **THEN** 玩家血条、分数、弹药数、Boss 血条在手机屏幕上清晰可读，不遮挡主要游戏区域
