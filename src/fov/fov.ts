import { Position } from '../helpers/types';

export type CallbackLight<T> = (cell: T) => boolean;

export interface Options {
    radius: number;
}

export interface ResultFov {
    status: 'Success' | 'Failed';
    positions?: Position[];
}

/**
 * A class used to compute the Field Of View in a grid.
 */
export abstract class FOV<T> {
    protected grid: T[][];
    protected radius: number;
    protected visibles: Position[];
    protected callbackLight: CallbackLight<T>;

    /**
     * @constructor
     * @param grid          - The original grid
     * @param callbackLight - A function to indicate which tile the light doesn't passes through
     * @param options       - The options related to the computation
     */
    constructor(
        grid: T[][],
        callbackLight: CallbackLight<T>,
        options: Partial<Options> = {}
    ) {
        this.grid = grid;
        this.radius = options.radius ?? 6;
        this.visibles = [];
        this.callbackLight = callbackLight;
    }

    /**
     * Compute the FOV on the given position.
     *
     * @param start - The position on which to start the computation
     */
    abstract compute(start: Position): ResultFov;
}
