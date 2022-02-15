import { CallbackBlock } from '../helpers/callbacks';
import { isPositionWithinGrid } from '../helpers/position';
import { Position } from '../helpers/types';

export interface ResultLine {
    status: 'Complete' | 'Incomplete' | 'Failed';
    positions?: Position[];
}

/**
 * A class used to get a line between two cells of a grid.
 */
abstract class Line<T> {
    protected grid: T[][];
    protected callbackBlock: CallbackBlock<T>;

    /**
     * @constructor
     * @param grid          - The original grid
     * @param callbackBlock - A function to test if an element of the grid is a block
     */
    constructor(grid: T[][], callbackBlock: CallbackBlock<T>) {
        this.grid = grid;
        this.callbackBlock = callbackBlock;
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

export default Line;
