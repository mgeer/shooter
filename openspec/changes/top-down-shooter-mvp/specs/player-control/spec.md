## ADDED Requirements

### Requirement: Player movement
The player character SHALL move in four directions (up, down, left, right) and diagonals using WASD keys. Movement speed SHALL be constant. Diagonal movement SHALL be normalized to prevent faster diagonal speed.

#### Scenario: Basic movement
- **WHEN** user presses W/A/S/D keys
- **THEN** player moves up/left/down/right at constant speed

#### Scenario: Diagonal movement
- **WHEN** user presses W and D simultaneously
- **THEN** player moves diagonally up-right at the same speed as cardinal movement

#### Scenario: No movement
- **WHEN** no movement keys are pressed
- **THEN** player remains stationary

### Requirement: Player aiming
The player character SHALL rotate to face the mouse cursor position at all times. A visual indicator (line or triangle) SHALL show the current aim direction.

#### Scenario: Aim follows cursor
- **WHEN** user moves the mouse
- **THEN** player rotates to face the cursor position

### Requirement: Player stays in bounds
The player character SHALL NOT move outside the game world boundaries.

#### Scenario: Boundary collision
- **WHEN** player moves toward the edge of the game world
- **THEN** player stops at the boundary and cannot move further in that direction

### Requirement: Player health
The player SHALL have a health pool (default 100 HP). When health reaches 0, the game SHALL transition to Game Over.

#### Scenario: Player takes damage
- **WHEN** an enemy or enemy projectile contacts the player
- **THEN** player loses HP equal to the damage value

#### Scenario: Player dies
- **WHEN** player HP reaches 0
- **THEN** game transitions to Game Over scene
