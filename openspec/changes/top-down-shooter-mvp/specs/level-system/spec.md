## ADDED Requirements

### Requirement: Wave-based spawning
Each level SHALL consist of multiple waves of enemies. The next wave SHALL begin after all enemies in the current wave are defeated. A brief pause SHALL occur between waves.

#### Scenario: Wave starts
- **WHEN** a wave begins
- **THEN** enemies spawn at intervals according to the wave configuration

#### Scenario: Wave complete
- **WHEN** all enemies in the current wave are defeated
- **THEN** a brief pause occurs before the next wave starts

#### Scenario: All waves complete
- **WHEN** the final wave of a non-boss level is cleared
- **THEN** a "Level Complete" message appears and the game transitions to the next level

### Requirement: Level progression
The game SHALL have 3 levels with increasing difficulty. Level 1 and 2 are normal levels with waves of basic enemies. Level 3 is the Boss level.

#### Scenario: Level 1
- **WHEN** Level 1 starts
- **THEN** 3 waves of basic enemies spawn with moderate count and speed

#### Scenario: Level 2
- **WHEN** Level 2 starts
- **THEN** 3 waves of basic enemies spawn with higher count and faster speed than Level 1

#### Scenario: Level 3 (Boss)
- **WHEN** Level 3 starts
- **THEN** the Boss spawns along with periodic basic enemy reinforcements

### Requirement: Level configuration
Level parameters (enemy count, speed, HP, spawn delay) SHALL be defined in configuration data, not hardcoded in game logic.

#### Scenario: Config-driven difficulty
- **WHEN** a level loads
- **THEN** enemy parameters are read from the level configuration data
