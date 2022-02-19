import {
    isPositionWithinGrid,
    positionToString,
    stringToPosition
} from '../helpers/position';
import { Position } from '../helpers/types';
import { LightCallbackFn, FOV, FOVOptions, FOVResult } from './fov';

const OCTANTS = [
    [1, 0, 0, 1],
    [1, 0, 0, -1],
    [-1, 0, 0, -1],
    [-1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, -1, 1, 0],
    [0, -1, -1, 0],
    [0, 1, -1, 0]
];

/**
 * @class
 * Recursive Shadow Casting based on Björn Bergström's algorithm.
 *
 * You can find an idea of how it works here:
 * http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 */
export class RecursiveShadowCasting<T> extends FOV<T> {
    /**
     * @constructor
     * @param grid - The grid for which to compute the FOV.
     * @param lightCallbackFn - A callback function used to determine if a cell doesn't let the "light" passes through.
     * @param options - The options related to the computation.
     *
     * @template T - Any type of data.
     */
    constructor(
        grid: T[][],
        lightCallbackFn: LightCallbackFn<T>,
        options?: Partial<FOVOptions>
    ) {
        super(grid, lightCallbackFn, options);
    }

    /**
     * Computes the FOV on the given position, using the Recursive Shadow Casting strategy.
     *
     * @param start - The Position on which to start the computation.
     * @returns The FOV computation result.
     */
    compute(start: Position): FOVResult {
        if (!isPositionWithinGrid(this.grid, start)) {
            return {
                status: 'Failed'
            };
        }

        const visiblesSet: Set<string> = new Set();

        visiblesSet.add(positionToString(start));

        let i = OCTANTS.length;

        while (i--) {
            this.processOctants(start, 1, 1.0, 0.0, OCTANTS[i], visiblesSet);
        }

        const positions = Array.from(visiblesSet).map((p: string) => stringToPosition(p));

        return {
            status: 'Success',
            positions
        };
    }

    /**
     * Compute each tile of the given octant.
     *
     * @param start - The Position of the cell on which to start the computation.
     * @param row - The current row.
     * @param startSlope - The slope to start.
     * @param endSlope - The slope to end.
     * @param octant - The current octant.
     * @param visiblesSet - A Set containing the visibles tile positions (as a string).
     */
    private processOctants(
        start: Position,
        row: number,
        startSlope: number,
        endSlope: number,
        octant: number[],
        visiblesSet: Set<string>
    ) {
        if (startSlope < endSlope) {
            return;
        }

        const xx = octant[0];
        const xy = octant[1];
        const yx = octant[2];
        const yy = octant[3];

        for (let i = row; i <= this.radius; i++) {
            let dx = -i - 1;
            const dy = -i;

            let newStart = 0;
            let blocked = false;

            while (dx <= 0) {
                dx += 1;

                // Map coordinates.
                const mx = start.x + dx * xx + dy * xy;
                const my = start.y + dx * yx + dy * yy;

                const h = this.grid.length;
                const w = this.grid[0].length;

                if (!(mx >= 0 && mx < h && my >= 0 && my < w)) {
                    break;
                }

                const leftSlope = (dx - 0.5) / (dy + 0.5);
                const rightSlope = (dx + 0.5) / (dy - 0.5);

                if (startSlope < rightSlope) {
                    continue;
                }

                if (endSlope > leftSlope) {
                    break;
                }

                // Circle around the starting position.
                if (dx * dx + dy * dy < this.radius * this.radius) {
                    visiblesSet.add(mx + ',' + my);
                }

                if (blocked) {
                    if (!this.lightCallbackFn(this.grid[mx][my])) {
                        newStart = rightSlope;
                        continue;
                    } else {
                        blocked = false;
                        startSlope = newStart;
                    }
                } else {
                    if (!this.lightCallbackFn(this.grid[mx][my]) && i < this.radius) {
                        blocked = true;
                        this.processOctants(
                            start,
                            i + 1,
                            startSlope,
                            leftSlope,
                            octant,
                            visiblesSet
                        );
                        newStart = rightSlope;
                    }
                }
            }

            if (blocked) {
                break;
            }
        }
    }
}
