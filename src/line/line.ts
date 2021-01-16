import Position from '../position';
import { CallbackBlock } from '../callbacks';
import { ResultLine } from '../result';

/**
 * A class used to get a line between two cells of a grid.
 */
abstract class Line {
    protected grid: any[][];
    protected callbackBlock: CallbackBlock;

    /**
     * @constructor
     * @param grid          - The original grid
     * @param callbackBlock - A function to test if an element of the grid is a block
     */
    constructor(grid: any[][], callbackBlock: CallbackBlock) {
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
        let h = this.grid.length;
        let w = this.grid[0].length;

        let startCheck = start.x >= 0 && start.x < h && start.y >= 0 && start.y < w;
        let endCheck = end.x >= 0 && end.x < h && end.y >= 0 && end.y < w;

        if (!(startCheck && endCheck)) {
            return { status: 'Incomplete', positions: [] };
        }
    }
}

export default Line;
