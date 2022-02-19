import { Position } from '../helpers/types';
import { Flood, ColorCell, ResultFlood, FloodCallbackFn } from './flood';

type Index = [-1, 0] | [1, 0] | [0, -1] | [0, 1];

/**
 * Represents a "flood filler".
 *
 * See: https://en.wikipedia.org/wiki/Flood_fill (Span Filling section)
 *
 * @template T - Any type of data.
 */
export class FloodFill<T> extends Flood<T> {
    /**
     * @constructor
     * @param grid - The grid for which to compute the flooding.
     * @param floodCallbackFn - A callback function used to determine if a cell is a one to flood.
     */
    constructor(grid: T[][], floodCallbackFn: FloodCallbackFn<T>) {
        super(grid, floodCallbackFn);
    }

    /**
     * Computes the flooding, using a line by line strategy.
     *
     * @param startPosition - The Position on which to start the computation.
     * @returns The flooding result.
     */
    process(startPosition: Position): ResultFlood {
        if (!this.contains(startPosition)) {
            return { status: 'Failed' };
        }

        this.createColorGrid();

        const filled = this.fill(this.colorGrid[startPosition.x][startPosition.y]);

        return {
            status: filled.length ? 'Success' : 'Block',
            positions: filled
        };
    }

    /**
     * Fills the grid line by line.
     *
     * @param cell - The ColorCell to start with.
     * @returns An array containing all the filled Positions.
     */
    private fill(cell: ColorCell): Position[] {
        if (cell.color === 'ignore') {
            return [];
        }

        let filledCells: Position[] = [];

        const stack: ColorCell[] = [];
        stack.push(cell);

        while (stack.length) {
            const neighbor = stack.shift();

            if (neighbor.color === 'target') {
                const west = neighbor,
                    east = neighbor;
                filledCells = [...filledCells, ...this.processLine(west, [0, -1], stack)];
                filledCells = [...filledCells, ...this.processLine(east, [0, 1], stack)];

                this.checkVerticalNeighbors(neighbor, stack);

                neighbor.color = 'done';
                filledCells.push(neighbor.position);
            }
        }

        return filledCells;
    }

    /**
     * Fills the line of a given index.
     *
     * For each {@linkcode ColorCell} of the line, calls the {@link checkVerticalNeighbors} method.
     *
     * @param cell - The ColorCell of the line to start with.
     * @param index - Numbers to add to our ColorCell in order to find the neighbor
     * @param stack - The ColorCell stack containing cells to process
     */
    private processLine(cell: ColorCell, index: Index, stack: ColorCell[]): Position[] {
        const next1X = cell.position.x + index[0];
        const next1Y = cell.position.y + index[1];

        const filledCells: Position[] = [];

        if (!this.contains({ x: next1X, y: next1Y })) {
            return [];
        }

        let next1: ColorCell = this.colorGrid[next1X][next1Y];

        while (next1.color === 'target') {
            next1.color = 'done';
            filledCells.push(next1.position);

            this.checkVerticalNeighbors(next1, stack);

            const next2X = next1.position.x + index[0];
            const next2Y = next1.position.y + index[1];

            if (this.contains({ x: next2X, y: next2Y })) {
                next1 = this.colorGrid[next2X][next2Y];
            }
        }

        return filledCells;
    }

    /**
     * Checks vertical neighbors of a {@linkcode ColorCell} and add them to the
     * stack if they have a target color.
     *
     * @param cell - The ColorCell to start with.
     * @param targetColor - The color to find and replace.
     * @param stack - The ColorCell stack containing cells to process.
     */
    private checkVerticalNeighbors(cell: ColorCell, stack: ColorCell[]): void {
        const verticalIndexes: Index[] = [
            [-1, 0],
            [1, 0]
        ];

        verticalIndexes.forEach((v) => {
            const neighborPosition = {
                x: cell.position.x + v[0],
                y: cell.position.y + v[1]
            };

            if (this.contains(neighborPosition)) {
                const neighbor = this.colorGrid[neighborPosition.x][neighborPosition.y];
                if (neighbor.color === 'target') {
                    stack.unshift(neighbor);
                }
            }
        });
    }
}
