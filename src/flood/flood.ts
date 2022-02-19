import { isPositionWithinGrid } from '../helpers/position';
import { Position } from '../helpers/types';

export interface ColorCell {
    position: Position;
    color: 'target' | 'ignore' | 'done';
}

export interface ResultFlood {
    status: 'Success' | 'Block' | 'Failed';
    positions?: Position[];
}

/** Returns `true` if the given cell is a target to flood. */
export type FloodCallbackFn<T> = (cell: T) => boolean;

/**
 * @abstract
 * Represents a "flooder" than can flood a part of a grid like
 * the bucket tool of any raster graphics editor does.
 *
 * @param T - Any type of data.
 */
export abstract class Flood<T> {
    /** The grid for which to compute the flooding. */
    protected grid: T[][];

    /** A grid containing the state of all cells during the computation. */
    protected colorGrid: ColorCell[][];

    /** The callback function used to determine if a cell is a one to flood. */
    protected floodCallbackFn: FloodCallbackFn<T>;

    private width: number;

    private height: number;

    /**
     * @constructor
     * @param grid - The grid for which to compute the flooding.
     * @param floodCallbackFn - A callback function used to determine if a cell is a one to flood.
     */
    constructor(grid: T[][], floodCallbackFn: FloodCallbackFn<T>) {
        this.grid = grid;
        this.height = this.grid.length;
        this.width = this.grid[0].length;
        this.floodCallbackFn = floodCallbackFn;
        this.colorGrid = [];
    }

    /**
     * Computes the flooding.
     *
     * @param startPosition - The Position on which to start the computation.
     * @returns The flooding result.
     */
    abstract process(startPosition: Position): ResultFlood;

    /**
     * Initializes the color grid used to compute the flooding.
     *
     * Based on the result of the {@linkcode floodCallbackFn}, the cell is either
     * in `target` or `ignore` state.
     */
    protected createColorGrid(): void {
        for (let x = 0; x < this.height; x++) {
            this.colorGrid.push([]);
            for (let y = 0; y < this.width; y++) {
                this.colorGrid[x][y] = {
                    position: { x, y },
                    color: this.floodCallbackFn(this.grid[x][y]) ? 'target' : 'ignore'
                };
            }
        }
    }

    protected contains(position: Position): boolean {
        return isPositionWithinGrid(this.grid, position);
    }
}
