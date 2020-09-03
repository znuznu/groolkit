import Position from '../position';
import { CallbackBlock } from '../callbacks';

export interface Result {
    status: 'Complete' | 'Incomplete',
    positions: Position[]
}

abstract class Line {
    grid: any[][];
    callbackBlock: CallbackBlock;

    constructor(grid: any[][], callbackBlock: CallbackBlock) {
        this.grid = grid;
        this.callbackBlock = callbackBlock;
    }

    process(start: Position, end: Position): Result {
        let h = this.grid.length;
        let w = this.grid[0].length;

        let startCheck = start.x >= 0 && start.x < h && start.y >= 0 && start.y < w;
        let endCheck = end.x >= 0 && end.x < h && end.y >= 0 && end.y < w;

        if (!(startCheck && endCheck))
            return { status: 'Incomplete', positions: [] }
    }
}

export default Line;