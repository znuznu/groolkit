import { ORTHOG, DIAG, D, D2 } from '../constants';
import { CallbackBlock } from '../callbacks';
import { Position } from '../position';
import Cell from './cell';

export interface Result {
    status: 'Found' | 'Unreachable' | 'Invalid' | 'Block';
    path?: Position[];
}

export interface Topology {
    type: 4 | 8;
}

export interface Neighbor {
    cell: Cell;
    topology: Topology;
}

/**
 * A Path used to compute paths in a grid. 
 */
abstract class Path {
    grid: any[][];
    callbackBlock: CallbackBlock;
    topology: Topology;
    // The grid we use to compute paths.
    gridCell: Cell[][];
    // The parents from each Cell in order to reconstruct paths.
    parents: Map<Cell, Cell>;

    /**
     * 
     * @param grid - The original grid 
     * @param callbackBlock - A function to test if an element of the grid is a block
     * @param topology - Orthogonals or diagonals
     */
    constructor(grid: any[][], callbackBlock: CallbackBlock, topology: Topology) {
        this.grid = grid;
        this.gridCell = [];
        this.topology = topology;
        this.callbackBlock = callbackBlock;
        this.parents = new Map();
    }
    
    /**
     * Find a path between `start` and `end`.
     * 
     * @param start - The position from the cell to start with
     * @param end - The position from the cell to end with
     */
    abstract search(start: Position, end: Position): Result;

    /**
     * Init the Cell grid used to compute a path.
     * 
     * @remarks
     * Neighbors are not initialized.
     */
    init(): void {
        let h = this.grid.length;
        let w = this.grid[0].length;

        for (let x = 0; x < h; x++) {
            this.gridCell.push([]);
            for (let y = 0; y < w; y++) {
                this.gridCell[x].push(new Cell({x: x, y: y}, this.grid[x][y]));
            }
        }
    }
    
    /**
     * Get all neighbors from the Cell (based on the topology).
     * 
     * @param cell - Cell to get the neighbors from
     * @returns An array containing the neighbors and the topology it comes from
     */
    protected getNeighbors(cell: Cell): Neighbor[] {
        let neighbors: Neighbor[] = [];

        let createNeighbor = (directions: number[][], type: number) => {
            directions.forEach(dir => {
                let nx = cell.position.x + dir[0];
                let ny = cell.position.y + dir[1];

                if (this.isValidCell(nx, ny)) {
                    neighbors.push({
                        cell: this.gridCell[nx][ny],
                        topology: type === 4 ? { type: 4 } : {type: 8}
                    });
                }
            });
        };

        createNeighbor(ORTHOG, 4);

        if (this.topology.type === 8)
            createNeighbor(DIAG, 8);

        return neighbors;
    }

    /**
     * Initialize the neighbors from the given Cell.
     * 
     * @param cell - The Cell to initialize the neighbors
     */
    protected initNeighbors(cell: Cell): void {
        cell.neighbors = this.getNeighbors(cell);
    }

    /**
     * Check if the Cell exists in the grid and isn't a block.
     * 
     * @param x - x coordinates of the Cell to check
     * @param y - y coordinates of the Cell to check
     * @returns True if the Cell is valid
     */
    protected isValidCell(x: number, y: number): boolean {
        if (!this.contains(x, y)) return false;

        return !this.callbackBlock(this.grid[x][y]);
    }

    /**
     * Check if the Cell exists in the grid.
     * 
     * @param x - x coordinates of the Cell to check
     * @param y - y coordinates of the Cell to check
     * @returns True if the Cell exists
     */
    protected contains(x: number, y: number): boolean {
        let h = this.grid.length;
        let w = this.grid[0].length;
        return x >= 0 && x < h && y >= 0 && y < w;
    }

    /**
     * Check that start and end are valid positions.
     * They must be existing coordinates and not one from a blocking Cell.
     * 
     * @param start - The Cell position to start with
     * @param end - The Cell position to end with
     * @returns A Result or undefined if they're valid coordinates
     */
    protected isValidPath(start: Position, end: Position): Result | undefined {
        let containsStart = this.contains(start.x, start.y);
        let containsEnd = this.contains(end.x, end.y);

        if (!containsStart || !containsEnd)
            return { status: 'Invalid' };

        let startCell = this.gridCell[start.x][start.y];
        let endCell = this.gridCell[end.x][end.y];

        let startBlock = this.callbackBlock(startCell.data);
        let endBlock = this.callbackBlock(endCell.data);

        if (startBlock || endBlock)
            return { status: 'Block' };
    }
}

export default Path;