import { getRoundedPosition } from '../helpers/position';
import { Position } from '../helpers/types';
import { BlockCallbackFn, Line, LineResult } from './line';

/**
 * Represents a line of sight finder between two cells in a two dimensional array
 * using a simple linear interpolation.
 *
 * Inspired by: https://www.redblobgames.com/grids/line-drawing.html#interpolation
 *
 *
 * ```typescript
 * const line = new LineLerp(
 *      [
 *          [0, 0, 0],
 *          [0, 0, 0],
 *          [0, 0, 0]
 *      ],
 *      (c) => c === 1
 *  );
 *
 *  const result = line.process({ x: 0, y: 0 }, { x: 2, y: 2 });
 *
 *  console.log(result);
 *
 *  {
 *      status: 'Complete',
 *      positions: [ { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 } ]
 *  }
 * ```
 *
 * @template T - Any type of data.
 */
export class LineLerp<T> extends Line<T> {
    /**
     * @constructor
     * @param grid - The grid for which to compute the line.
     * @param blockCallbackFn - A callback function used to determine if a cell is a blocking one.
     *
     * @template T - Any type of data.
     */
    constructor(grid: T[][], blockCallbackFn: BlockCallbackFn<T>) {
        super(grid, blockCallbackFn);
    }

    /**
     * Retrieves a line between a start and an end {@linkcode Position}.
     *
     * @param start - A Position
     * @param end - A Position
     * @returns The line result.
     */
    process(start: Position, end: Position): LineResult {
        const result = super.process(start, end);
        if (result) {
            return result;
        }

        return this.getLine(start, end);
    }

    private getLine(start: Position, end: Position): LineResult {
        const positions: Position[] = [];

        const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));

        for (let n = 0; n <= steps; n++) {
            const t = steps == 0 ? 0.0 : n / steps;

            const position = getRoundedPosition(this.lerpPosition(start, end, t));

            if (this.blockCallbackFn(this.grid[position.x][position.y])) {
                break;
            }

            positions.push(position);
        }

        const isEmpty = !positions.length;

        if (isEmpty) {
            return {
                status: 'Incomplete',
                positions: positions
            };
        }

        const lastPosition = positions[positions.length - 1];
        const isIncomplete = lastPosition.x !== end.x || lastPosition.y !== end.y;

        return {
            status: isIncomplete ? 'Incomplete' : 'Complete',
            positions: positions
        };
    }

    private lerp(start: number, target: number, t: number) {
        return start + t * (target - start);
    }

    private lerpPosition(p1: Position, p2: Position, t: number) {
        return {
            x: this.lerp(p1.x, p2.x, t),
            y: this.lerp(p1.y, p2.y, t)
        };
    }
}
