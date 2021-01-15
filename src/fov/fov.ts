import { CallbackLight } from '../callbacks';
import Position from '../position';
import { ResultFov } from '../result';

export interface Options {
    radius: number;
}

abstract class FOV {
    grid: any[][];
    radius: number;
    visibles: Position[];
    callbackLight: CallbackLight;

    constructor(
        grid: any[][],
        callbackLight: CallbackLight,
        options: Partial<Options> = {}
    ) {
        this.grid = grid;
        this.radius = options.radius || 6;
        this.visibles = [];
        this.callbackLight = callbackLight;
    }

    abstract compute(start: Position): ResultFov;

    /**
     * Check that the given position isn't out of bound.
     * It is acceptable to compute lights for a blocking tile,
     * for example if a torch is on a wall of a dungeon.
     *
     * @param start - The position to start at
     */
    protected isValidStart(start: Position): boolean {
        let h = this.grid.length;
        let w = this.grid[0].length;

        return start.x >= 0 && start.x < h && start.y >= 0 && start.y < w;
    }
}

export default FOV;
