import { Position } from '../helpers/types';

/** The configuration object used for FOV computation. */
export interface FOVOptions {
    /**
     * The radius of the FOV.
     *
     * @default 6
     */
    radius: number;
}

export interface ResultFOV {
    status: 'Success' | 'Failed';
    positions?: Position[];
}

/** Returns `true` if the given cell doesn't let the "light" passes through. */
export type LightCallbackFn<T> = (cell: T) => boolean;

/**
 * Represents a Field Of View in a grid.
 *
 * There's a lot of usage, a classic one is to display the visibles tiles around a player in a 2D game.
 */
export abstract class FOV<T> {
    /** The grid for which to compute the flooding. */
    protected grid: T[][];

    /** The radius of the FOV. */
    protected radius: number;

    /** An array used to contain the visibles positions during the computation. */
    protected visibles: Position[];

    /** The callback function used to determine if a cell doesn't let the "light" passes through. */
    protected lightCallbackFn: LightCallbackFn<T>;

    /**
     * @constructor
     * @param grid - The grid for which to compute the FOV.
     * @param lightCallbackFn - A callback function used to determine if a cell doesn't let the "light" passes through.
     * @param options - The options related to the computation.
     */
    constructor(
        grid: T[][],
        lightCallbackFn: LightCallbackFn<T>,
        options: Partial<FOVOptions> = { radius: 6 }
    ) {
        this.grid = grid;
        this.radius = options.radius;
        this.visibles = [];
        this.lightCallbackFn = lightCallbackFn;
    }

    /**
     * Computes the FOV on the given position.
     *
     * @param start - The position on which to start the computation.
     * @returns The FOV computation result.
     */
    abstract compute(start: Position): ResultFOV;
}
