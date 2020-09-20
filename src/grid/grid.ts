import Position from '../position';
import { CallbackFill } from '../callbacks';

export interface Cell {
    position: Position;
    type: number;
}

interface CellDirection {
    cell: Cell;
    direction: string;
}

/**
 * A Grid object used to create different kind of maps.
 * 
 * A map could be a maze, a dungeon, an empty one... 
 * A Cell of the grid can either be a passage (0) or a block (1). 
 * 
 * We avoid ugly things (like using a string x+y as a Map key for example) 
 * with the help of a grid called Cells in order to generate the actual datas. 
 */
abstract class Grid {
    width: number;
    height: number;
    data: number[][];
    cells: Cell[][];

    /**
     * @constructor
     * @param width - The number of columns
     * @param height - The number of rows
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = [];
        this.cells = [];
    }

    abstract process(x?: number, y?: number): void;

    /**
     * Fill the data with a custom callback.
     * 0 for passage and 1 for block.
     * 
     * @param callback - The function returning 0 or 1 depending on x,y
     */
    protected fill(callback: CallbackFill): void {
        for (let x = 0; x < this.height; x++) {
            this.data.push([]);
            for (let y = 0; y < this.width; y++) {
                this.data[x][y] = callback({ x: x, y: y });
            }
        }
    }

    /**
     * Generate the cells array based on the grid.
     */
    protected createCells(): void {
        for (let x = 0; x < this.height; x++) {
            this.cells.push([]);
            for (let y = 0; y < this.width; y++) {
                this.cells[x][y] = {
                    position: { x: x, y: y },
                    type: this.data[x][y]
                };
            }
        }
    }

    /**
     * Get all Cells at `n` index around the given cell (orthogonals). 
     * 
     * @param cell - The Cell in the center
     * @param n - The number of indexes in between
     */
    protected validOnAllSides(cell: Cell, n: number): CellDirection[] {
        let validNeighbors: CellDirection[] = [];
        const directions = ['n', 's', 'w', 'e'];

        directions.forEach(direction => {
            let cellInDirection = this.getCellInDirection(
                cell,
                direction,
                n
            );

            if (cellInDirection && cellInDirection.type === 0) {
                validNeighbors.push({
                    cell: cellInDirection,
                    direction: direction
                });
            }
        });

        return validNeighbors;
    }

    /**
     * Get the Cell at `n` cells in the given direction or undefined if there isn't any.
     * 
     * @param cell - The starting Cell
     * @param direction - The direction of the Cell to search
     * @param n - The number of indexes in between
     */
    protected getCellInDirection(cell: Cell, direction: string, n: number): Cell {
        let cellInDirection: Cell | undefined = undefined;
        let x = -1, y = -1;

        switch (direction) {
            case 'n':
                x = cell.position.x - n;
                y = cell.position.y;
                break;
            case 's':
                x = cell.position.x + n;
                y = cell.position.y;
                break;
            case 'w':
                x = cell.position.x;
                y = cell.position.y - n;
                break;
            case 'e':
                x = cell.position.x;
                y = cell.position.y + n;
                break;
        }

        if (x >= 0 && x < this.height && y >= 0 && y < this.width)
            cellInDirection = this.cells[x][y];

        return cellInDirection;
    }

    /**
     * Check if the Cell exists in the grid.
     * 
     * @param x - x coordinates of the Cell to check
     * @param y - y coordinates of the Cell to check
     * @returns True if the Cell exists
     */
    protected contains(x: number, y: number): boolean {
        let h = this.height;
        let w = this.width;
        return x >= 0 && x < h && y >= 0 && y < w;
    }
}

export default Grid;