import { CallbackFill } from '../callbacks';
import { ResultFill } from '../result';
import Position, { gridContainsPosition } from '../position';

export interface ColorCell {
    position: Position;
    color: string;
}

/**
 * A class used to fill a part of a grid like the bucket tool of any raster graphics editor does.
 */
abstract class Fill<T> {
    protected grid: T[][];
    protected colorGrid: ColorCell[][];
    protected callbackFill: CallbackFill<T>;
    protected width: number;
    protected height: number;

    /**
     * @constructor
     * @param grid         - The original grid
     * @param callbackFill - A function to test if a cell of the grid is a target
     */
    constructor(grid: T[][], callbackFill: CallbackFill<T>) {
        this.grid = grid;
        this.height = this.grid.length;
        this.width = this.grid[0].length;
        this.callbackFill = callbackFill;
        this.colorGrid = [];
    }

    /**
     * Process the filling
     *
     * @param startPosition - The position to start the computation with
     */
    abstract process(startPosition: Position): ResultFill;

    /**
     * Init the grid used to compute the flood filling.
     */
    protected createColorGrid(): void {
        for (let x = 0; x < this.height; x++) {
            this.colorGrid.push([]);
            for (let y = 0; y < this.width; y++) {
                this.colorGrid[x][y] = {
                    position: { x, y },
                    color: this.callbackFill(this.grid[x][y]) ? 'target' : 'ignore'
                };
            }
        }
    }

    protected contains(position: Position): boolean {
        return gridContainsPosition(this.grid, position);
    }
}

export default Fill;
