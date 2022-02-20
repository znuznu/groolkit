import { isPositionWithinGrid } from '../helpers/position';
import { Position } from '../helpers/types';

/** The result of a line computation. */
export interface LineResult {
    /**
     * The status of the computation.
     *
     * - `Complete` : no blocking cells were encountered between the start and the end {@linkcode Position}.
     * - `Incomplete` : a blocking cell was encountered between the start and the end {@linkcode Position}.
     * - `Failed` : the start or end {@linkcode Position} was outside the boundaries of the grid.
     */
    status: 'Complete' | 'Incomplete' | 'Failed';
    /**
     * All the positions found (in the order of discovery).
     *
     * `undefined` if in a `Failed` status.
     */
    positions?: Position[];
}

/**
 * Returns `true` if the given cell is a blocking one.
 *
 * @template T - Any type of data.
 */
export type BlockCallbackFn<T> = (cell: T) => boolean;

/**
 * @abstract
 * Represents a line of sight finder between two cells in a two dimensional array.
 *
 * @template T - Any type of data.
 */
export abstract class Line<T> {
    /** The grid for which to compute the line. */
    protected grid: T[][];

    /** The callback function used to determine if a cell is a blocking one. */
    protected blockCallbackFn: BlockCallbackFn<T>;

    /**
     * @constructor
     * @param grid - The grid for which to compute the line.
     * @param blockCallbackFn - A callback function used to determine if a cell is a blocking one.
     *
     * @template T - Any type of data.
     */
    constructor(grid: T[][], blockCallbackFn: BlockCallbackFn<T>) {
        this.grid = grid;
        this.blockCallbackFn = blockCallbackFn;
    }

    /**
     * Retrieves a line between a start and an end {@linkcode Position}.
     *
     * @param start - A Position
     * @param end - A Position
     * @returns The line result.
     */
    process(start: Position, end: Position): LineResult {
        const isStartWithinGrid = isPositionWithinGrid(this.grid, start);
        const isEndWithinGrid = isPositionWithinGrid(this.grid, end);

        if (!isStartWithinGrid || !isEndWithinGrid) {
            return { status: 'Failed' };
        }
    }
}
