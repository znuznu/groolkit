import { isPositionWithinGrid } from '../helpers/position';
import { Position } from '../helpers/types';

export interface ResultLine {
    status: 'Complete' | 'Incomplete' | 'Failed';
    positions?: Position[];
}

/** Returns `true` if the given cell is a blocking one. */
export type BlockCallbackFn<T> = (cell: T) => boolean;

/**
 * Represents a line of sight finder between two cells in a two dimensional array.
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
    process(start: Position, end: Position): ResultLine {
        const isStartWithinGrid = isPositionWithinGrid(this.grid, start);
        const isEndWithinGrid = isPositionWithinGrid(this.grid, end);

        if (!isStartWithinGrid || !isEndWithinGrid) {
            return { status: 'Failed' };
        }
    }
}
