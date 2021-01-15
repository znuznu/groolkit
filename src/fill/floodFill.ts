import { CallbackFill } from '../callbacks';
import Fill, { ColorCell } from './fill';
import Position, { gridContainsPosition } from '../position';
import { ResultFill } from '../result';

type Index = [-1, 0] | [1, 0] | [0, -1] | [0, 1];

class FloodFill extends Fill {
    constructor(grid: any[][], callbackFill: CallbackFill) {
        super(grid, callbackFill);
    }

    /**
     * Compute the flood filling.
     *
     * @param x - The x coordinate of the Cell to start with
     * @param y - The y coordinate of the Cell to start with
     */
    process(startPosition: Position): ResultFill {
        if (!this.contains(startPosition)) {
            return { status: 'Failed' };
        }

        this.createColorGrid();

        const x = startPosition.x;
        const y = startPosition.y;
        const filled = this.fill(this.colorGrid[x][y]);

        return {
            status: filled.length ? 'Success' : 'Block',
            filled: filled
        };
    }

    /**
     * Fill the grid line by line.
     *
     * @param cell              - The ColorCell to start with
     * @param targetColor       - The color to replace
     * @param replacementColor  - The color used to replace the target color
     */
    private fill(cell: ColorCell): Position[] {
        if (cell.color === 'ignore') {
            return [];
        }

        let filledCells: Position[] = [];

        let stack: ColorCell[] = [];
        stack.push(cell);

        while (stack.length) {
            let neighbor = stack.shift();

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
     * Fill the line and check for each ColorCell of the line if their
     * vertical neighbours are target too.
     *
     * @param cell      - The ColorCell of the line to start with
     * @param index     - Numbers to add to our ColorCell in order to find the neighbor
     * @param stack     - The ColorCell stack containing cells to process
     */
    private processLine(cell: ColorCell, index: Index, stack: ColorCell[]): Position[] {
        let next1X = cell.position.x + index[0];
        let next1Y = cell.position.y + index[1];

        let filledCells: Position[] = [];

        if (!this.contains({ x: next1X, y: next1Y })) {
            return [];
        }

        let next1: ColorCell = this.colorGrid[next1X][next1Y];

        while (next1.color === 'target') {
            next1.color = 'done';
            filledCells.push(next1.position);

            this.checkVerticalNeighbors(next1, stack);

            let next2X = next1.position.x + index[0];
            let next2Y = next1.position.y + index[1];

            if (this.contains({ x: next2X, y: next2Y })) {
                next1 = this.colorGrid[next2X][next2Y];
            }
        }

        return filledCells;
    }

    /**
     * Check vertical neighbors and add them to the stack if they have a target color.
     *
     * @param cell          - The ColorCell to start with
     * @param targetColor   - The color to find and replace
     * @param stack         - The ColorCell stack containing cells to process
     */
    private checkVerticalNeighbors(cell: ColorCell, stack: ColorCell[]) {
        const verticals: Index[] = [
            [-1, 0],
            [1, 0]
        ];
        verticals.forEach((v) => {
            let neighborPosition = {
                x: cell.position.x + v[0],
                y: cell.position.y + v[1]
            };

            if (this.contains(neighborPosition)) {
                let neighbor = this.colorGrid[neighborPosition.x][neighborPosition.y];
                if (neighbor.color === 'target') {
                    stack.unshift(neighbor);
                }
            }
        });
    }
}

export default FloodFill;
