## ADDED Requirements

### Requirement: Player health bar
A health bar SHALL be displayed in the game HUD showing the player's current HP.

#### Scenario: HP display
- **WHEN** game is running
- **THEN** player health bar is visible showing current HP as a colored bar

#### Scenario: HP changes
- **WHEN** player takes damage
- **THEN** health bar visually decreases proportionally

### Requirement: Score display
The current score SHALL be displayed in the game HUD. Score increases when enemies are defeated.

#### Scenario: Score shows
- **WHEN** game is running
- **THEN** current score is displayed on screen

#### Scenario: Score increases
- **WHEN** an enemy is defeated
- **THEN** score increases and display updates immediately

### Requirement: Level indicator
The current level number SHALL be displayed in the game HUD.

#### Scenario: Level display
- **WHEN** game is running
- **THEN** current level number is visible on screen

### Requirement: Game Over screen
When the player dies, a Game Over screen SHALL appear with the final score and a "Restart" button.

#### Scenario: Game Over
- **WHEN** player HP reaches 0
- **THEN** Game Over screen appears showing final score and a Restart button

#### Scenario: Restart
- **WHEN** user clicks Restart button
- **THEN** game resets to Level 1 with full HP and zero score

### Requirement: Victory screen
When the Boss is defeated, a Victory screen SHALL appear with the final score.

#### Scenario: Victory
- **WHEN** Boss is defeated in Level 3
- **THEN** Victory screen appears showing final score and a Play Again button

### Requirement: Main menu
A main menu SHALL be shown when the game first loads, with a "Start Game" button.

#### Scenario: Start game
- **WHEN** user clicks Start Game button
- **THEN** game begins at Level 1
