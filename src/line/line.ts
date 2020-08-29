import Position from '../position';
import { CallbackBlock } from '../callbacks';

abstract class Line {
    grid: any[][];
    callbackBlock: CallbackBlock;

    constructor(grid: any[][], callbackBlock: CallbackBlock) {
        this.grid = grid;
        this.callbackBlock = callbackBlock;
    }

    process(p1: Position, p2: Position): Position[] {
        let h = this.grid.length;
        let w = this.grid[0].length;
        let p1check = p1.x >= 0 && p1.x < h && p1.y >= 0 && p1.y < w;
        let p2check = p2.x >= 0 && p2.x < h && p2.y >= 0 && p2.y < w;

        if (!(p1check && p2check))
            return [];
    }
}

export default Line;