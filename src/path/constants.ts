/** The cost for orthogonals directions in A*. */
export const D = 1;

/** The cost for diagonals directions in A*. */
export const D2 = Math.sqrt(2);

/** Neighbors directions of a cell in a grid. */
export const DIRECTIONS = {
    ORTHOG: [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0]
    ],
    DIAG: [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1]
    ]
};
