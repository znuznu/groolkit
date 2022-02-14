import Position from '../position';
import { CallbackBlock } from '../callbacks';

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
        const h = this.grid.length;
        const w = this.grid[0].length;

        const startCheck = start.x >= 0 && start.x < h && start.y >= 0 && start.y < w;
        const endCheck = end.x >= 0 && end.x < h && end.y >= 0 && end.y < w;

        if (!(startCheck && endCheck)) {
            return { status: 'Failed' };
        }
    }
}

export default Line;
