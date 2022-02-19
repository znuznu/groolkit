import { isPositionWithinGrid } from '../helpers/position';
import { Position } from '../helpers/types';

export interface ResultLine {
    status: 'Complete' | 'Incomplete' | 'Failed';
    positions?: Position[];
}

/** Returns `true` if the given cell is a blocking one. */
export type BlockCallbackFn<T> = (cell: T) => boolean;

/**
 * A class used to get a line between two cells of a grid.
 */
export abstract class Line<T> {
    protected grid: T[][];
    protected blockCallbackFn: BlockCallbackFn<T>;

    /**
     * @constructor
     * @param grid          - The original grid
     * @param blockCallbackFn - A function to test if an element of the grid is a block
     */
    constructor(grid: T[][], blockCallbackFn: BlockCallbackFn<T>) {
        this.grid = grid;
        this.blockCallbackFn = blockCallbackFn;
    }

    /**
     * Get a line between `start` and `end`.
     *
     * @param start - The position to start the line
     * @param end   - The position to end the line
     */
    process(start: Position, end: Position): ResultLine {
        const isStartWithinGrid = isPositionWithinGrid(this.grid, start);
        const isEndWithinGrid = isPositionWithinGrid(this.grid, end);

        if (!isStartWithinGrid || !isEndWithinGrid) {
            return { status: 'Failed' };
        }
    }
}
