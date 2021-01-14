/** Tile width to use in the grid drawing. */
export const TILE_WIDTH = 16;

/** Tile height to use in the grid drawing. */
export const TILE_HEIGHT = 16;

/** The cost for orthogonals directions in A*. */
export const D = 1;

/** The cost for diagonals directions in A*. */
export const D2 = Math.sqrt(2);

export const DIRECTIONS = {
    ORTHOG: [[0, -1], [0, 1], [-1, 0], [1, 0]],
    DIAG: [[-1, -1], [1, -1], [-1, 1], [1, 1]]
}
