## Why

我们需要一个可以在浏览器中直接运行的 2D 俯视角射击小游戏 MVP。目标是快速验证核心玩法（移动、瞄准、射击、打怪、Boss 战），建立可持续迭代的代码基础，后续再逐步添加武器系统、道具、音效等内容。

## What Changes

- 新建完整的 Web 游戏项目，基于 Phaser 3 + Vite + TypeScript
- 实现玩家控制系统：WASD 移动 + 鼠标瞄准 + 点击射击
- 实现子弹系统：子弹飞行、命中检测、伤害计算
- 实现怪物系统：基础小怪（冲向玩家）、Boss（多阶段攻击模式）
- 实现关卡系统：3 个关卡，波次生成，关卡切换
- 实现 UI 系统：血条、分数、关卡提示、Game Over / 胜利画面
- 几何图形美术风格：绿色圆（玩家）、红色圆（怪物）、黄色点（子弹）、深色背景 + 网格线

## Capabilities

### New Capabilities

- `player-control`: 玩家移动（WASD）、鼠标瞄准、朝向跟随鼠标
- `shooting`: 点击射击、子弹生成与飞行、命中检测与伤害
- `enemies`: 基础小怪 AI（冲向玩家）、Boss 多阶段攻击模式（直线弹幕/扇形弹幕/冲刺/召唤小怪）
- `level-system`: 3 关卡结构、波次怪物生成、关卡切换与胜利条件
- `game-ui`: 玩家血条、Boss 血条、分数显示、关卡提示、Game Over / 重新开始 / 胜利画面

### Modified Capabilities

（无，这是全新项目）

## Impact

- 新建整个项目目录结构（Vite + Phaser 3 + TypeScript）
- 依赖：phaser@3.x, vite, typescript
- 无后端依赖，纯前端静态项目
- 部署：构建后可部署到任意静态托管服务
