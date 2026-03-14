## ADDED Requirements

### Requirement: Player shooting
The player SHALL fire a bullet toward the mouse cursor position when the left mouse button is clicked. There SHALL be a cooldown between shots to prevent unlimited fire rate.

#### Scenario: Fire bullet
- **WHEN** user clicks left mouse button
- **THEN** a bullet spawns at the player position and travels toward the cursor position at a fixed speed

#### Scenario: Fire rate cooldown
- **WHEN** user clicks left mouse button during cooldown period
- **THEN** no bullet is fired

### Requirement: Bullet travel
Bullets SHALL travel in a straight line at constant speed. Bullets SHALL be destroyed when they leave the game world boundaries.

#### Scenario: Bullet flies straight
- **WHEN** a bullet is spawned
- **THEN** it travels in a straight line in the direction it was fired

#### Scenario: Bullet leaves screen
- **WHEN** a bullet exits the game world boundaries
- **THEN** the bullet is destroyed

### Requirement: Bullet hit detection
When a bullet collides with an enemy, the bullet SHALL be destroyed and the enemy SHALL take damage.

#### Scenario: Bullet hits enemy
- **WHEN** a bullet collides with an enemy
- **THEN** the bullet is destroyed and the enemy loses HP equal to bullet damage

#### Scenario: Bullet hits Boss
- **WHEN** a bullet collides with the Boss
- **THEN** the bullet is destroyed and the Boss loses HP equal to bullet damage

### Requirement: Bullet object pooling
Bullets SHALL be managed via an object pool to avoid excessive object creation/destruction for performance.

#### Scenario: Bullet reuse
- **WHEN** a bullet is destroyed
- **THEN** it is returned to the pool and reused for the next shot
