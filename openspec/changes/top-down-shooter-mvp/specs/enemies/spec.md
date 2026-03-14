## ADDED Requirements

### Requirement: Basic enemy behavior
Basic enemies SHALL spawn at random positions along the edges of the game world and move directly toward the player at a constant speed. Upon contacting the player, they SHALL deal damage.

#### Scenario: Enemy spawns
- **WHEN** a wave triggers enemy spawning
- **THEN** enemies appear at random edge positions of the game world

#### Scenario: Enemy chases player
- **WHEN** an enemy is alive
- **THEN** it moves directly toward the player's current position each frame

#### Scenario: Enemy contacts player
- **WHEN** an enemy collides with the player
- **THEN** the player takes damage and the enemy is destroyed

### Requirement: Enemy health
Each enemy SHALL have a health pool. When enemy HP reaches 0, the enemy SHALL be destroyed and the player gains score points.

#### Scenario: Enemy takes damage
- **WHEN** a bullet hits an enemy
- **THEN** enemy HP decreases by bullet damage value

#### Scenario: Enemy dies
- **WHEN** enemy HP reaches 0
- **THEN** enemy is destroyed with a visual effect and player gains score points

### Requirement: Boss behavior
The Boss SHALL appear in the final level. The Boss SHALL have two phases based on remaining HP.

#### Scenario: Boss phase 1
- **WHEN** Boss HP is between 100% and 50%
- **THEN** Boss slowly tracks toward the player and periodically fires a burst of 3 bullets in a straight line toward the player

#### Scenario: Boss phase 2
- **WHEN** Boss HP drops below 50%
- **THEN** Boss increases speed, fires 5-bullet fan-shaped spreads, periodically dashes toward the player, and summons 2 basic enemies every few seconds

#### Scenario: Boss defeated
- **WHEN** Boss HP reaches 0
- **THEN** Boss is destroyed with a large visual effect and game transitions to Victory scene

### Requirement: Boss health bar
The Boss SHALL display a prominent health bar at the top of the screen showing current HP percentage.

#### Scenario: Boss HP display
- **WHEN** Boss is alive
- **THEN** a health bar at the top of the screen shows Boss remaining HP as a percentage bar
