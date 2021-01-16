import { CallbackLight } from '../callbacks';
import Position, { gridContainsPosition } from '../position';
import { ResultFov } from '../result';

export interface Options {
    radius: number;
}

/**
 * A class used to compute the Field Of View in a grid.
 */
abstract class FOV {
    protected grid: any[][];
    protected radius: number;
    protected visibles: Position[];
    protected callbackLight: CallbackLight;

    /**
     * @constructor
     * @param grid          - The original grid
     * @param callbackLight - A function to indicate which tile the light doesn't passes through
     * @param options       - The options related to the computation
     */
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

    /**
     * Compute the FOV on the given position.
     *
     * @param start - The position to start the computation
     */
    abstract compute(start: Position): ResultFov;

    /**
     * Check that the given position isn't out of bound.
     * It is acceptable to compute lights for a blocking tile,
     * for example if a torch is on a wall of a dungeon.
     *
     * @param start - The position to start
     */
    protected isValidStart(start: Position): boolean {
        return gridContainsPosition(this.grid, start);
    }
}

export default FOV;
