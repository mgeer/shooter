/** Normalize a 2D vector, returns {x:0, y:0} if zero-length */
export function normalize(x: number, y: number): { x: number; y: number } {
  const len = Math.sqrt(x * x + y * y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
}

/** Random float in [min, max] */
export function randBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Pick a random spawn position along the edge of the world */
export function randomEdgePosition(
  worldWidth: number,
  worldHeight: number,
  margin = 10
): { x: number; y: number } {
  const side = Math.floor(Math.random() * 4);
  switch (side) {
    case 0: return { x: randBetween(0, worldWidth), y: -margin };         // top
    case 1: return { x: randBetween(0, worldWidth), y: worldHeight + margin }; // bottom
    case 2: return { x: -margin, y: randBetween(0, worldHeight) };         // left
    default: return { x: worldWidth + margin, y: randBetween(0, worldHeight) }; // right
  }
}
