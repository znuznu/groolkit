/** Tile width to use in the grid drawing. */
export const TILE_WIDTH = 16;

/** Tile height to use in the grid drawing. */
export const TILE_HEIGHT = 16;

/** Tile block color to use in the grid drawing. */
export const COLOR_BLOCK = 'grey';

/** Tile passage color to use in the grid drawing. */
export const COLOR_PASSAGE = 'white';

/** Line color to use in the grid drawing. */
export const COLOR_LINE = 'black';

/** Background color to use in the grid drawing. */
export const COLOR_BG = 'white';

/** Tile start color to use in the path drawing. */
export const COLOR_START = 'pink';

/** Tile end color to use in the path drawing. */
export const COLOR_END = 'green';

/** Tile path color to use in the path drawing. */
export const COLOR_PATH = 'yellow';

/** The replacement color for Flood filling. */
export const COLOR_RFF = 'lightblue';

/** The color for Line algorithms. */
export const COLOR_LINE_ALGORITHM = 'red';

/** The color for FOV algorithms. */
export const COLOR_FOV = 'wheat';

/** Orthogonal directions. */
export const ORTHOG = [[0, -1], [0, 1], [-1, 0], [1, 0]];

/** Diagonal directions. */
export const DIAG = [[-1, -1], [1, -1], [-1, 1], [1, 1]];

/** The cost for orthogonals directions in A*. */
export const D = 1;

/** The cost for diagonals directions in A*. */
export const D2 = Math.sqrt(2);

/** The line opacity used in the grid drawing. */
export const OPACITY_LINE = 0.9;

/** The algorithm tiles opacity used in the grid drawing. */
export const OPACITY_ALGORITHM = 0.5;