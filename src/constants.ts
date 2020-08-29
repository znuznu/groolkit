/** Tile width to use in the grid drawing. */
export const TILE_WIDTH = 16;

/** Tile height to use in the grid drawing. */
export const TILE_HEIGHT = 16;

/** The cost for orthogonals directions in A*. */
export const D = 1;

/** The cost for diagonals directions in A*. */
export const D2 = Math.sqrt(2);

/** 
 * COLOR_BLOCK - Tile block color to use in the grid drawing.
 * COLOR_PASSAGE - Tile passage color to use in the grid drawing.
 * COLOR_LINE - Line color to use in the grid drawing.
 * COLOR_BG - Background color to use in the grid drawing.
 * COLOR_START - Tile start color to use in the path drawing.
 * COLOR_END - Tile end color to use in the path drawing.
 * COLOR_PATH - Tile path color to use in the path drawing.
 * COLOR_RFF - The replacement color for Flood filling.
 * COLOR_LINE_ALGORITHM - The color for Line algorithms.
 * COLOR_FOV - The color for FOV algorithms.
 */
export const COLORS = {
    COLOR_BLOCK: 'grey',
    COLOR_PASSAGE: 'white',
    COLOR_LINE: 'black',
    COLOR_BG: 'white',
    COLOR_START: 'pink',
    COLOR_END: 'green',
    COLOR_PATH: 'yellow',
    COLOR_RFF: 'lightblue',
    COLOR_LINE_ALGORITHM: 'red',
    COLOR_FOV: 'wheat'
}

export const DIRECTIONS = {
    ORTHOG: [[0, -1], [0, 1], [-1, 0], [1, 0]],
    DIAG: [[-1, -1], [1, -1], [-1, 1], [1, 1]]
}

/**
 * LINE - The line opacity used in the grid drawing.
 * ALGORITHM - The algorithm tiles opacity used in the grid drawing.
 */
export const OPACITY = {
    OPACITY_LINE: 0.9,
    OPACITY_ALGORITHM: 0.5
}