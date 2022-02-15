import { DIRECTIONS } from './constants';
import { CallbackBlock } from '../helpers/callbacks';
import Cell from './cell';
import { Position } from '../helpers/types';
import { isPositionWithinGrid } from '../helpers/position';

export interface Topology {
    type: 4 | 8;
}

export interface Neighbor<T> {
    cell: Cell<T>;
    topology: Topology;
}

export interface ResultPath {
    status: 'Found' | 'Unreachable' | 'Invalid' | 'Block';
    positions?: Position[];
}

/**
 * A class used to compute shortest paths between two cells in a grid.
 */
abstract class Path<T> {
    protected grid: T[][];
    protected callbackBlock: CallbackBlock<T>;
    protected topology: Topology;
    // The grid we use to compute paths.
    protected gridCell: Cell<T>[][];
    // The parents of each Cell in order to reconstruct paths.
    protected parents: Map<Cell<T>, Cell<T>>;

    /**
     * @constructor
     * @param grid          - The original grid
     * @param callbackBlock - A function to test if an element of the grid is a block
     * @param topology      - Orthogonals or diagonals
     */
    constructor(grid: T[][], topology: Topology, callbackBlock: CallbackBlock<T>) {
        this.grid = grid;
        this.gridCell = [];
        this.topology = topology;
        this.callbackBlock = callbackBlock;
        this.parents = new Map();
    }

    /**
     * Find a path between `start` and `end`.
     *
     * @param start         - The position of the cell to start with
     * @param end           - The position of the cell to end with
     * @param callbackBlock - An other block testing function, might be useful
     */
    abstract search(
        start: Position,
        end: Position,
        newCallbackBlock?: CallbackBlock<T>
    ): ResultPath;

    /**
     * Init the Cell grid used to compute a path.
     *
     * Note: Neighbors are not initialized.
     */
    init(): void {
        const h = this.grid.length;
        const w = this.grid[0].length;

        for (let x = 0; x < h; x++) {
            this.gridCell.push([]);
            for (let y = 0; y < w; y++) {
                this.gridCell[x].push(new Cell({ x: x, y: y }, this.grid[x][y]));
            }
        }
    }

    /**
     * Get all neighbors from the Cell (based on the topology).
     *
     * @param cell - Cell to get the neighbors of
     * @returns An array containing the neighbors and the topology it comes from
     */
    protected getNeighbors(cell: Cell<T>): Neighbor<T>[] {
        const neighbors: Neighbor<T>[] = [];

        const createNeighbor = (directions: number[][], type: number) => {
            directions.forEach((dir) => {
                const nx = cell.position.x + dir[0];
                const ny = cell.position.y + dir[1];

                if (this.isValidCell(nx, ny)) {
                    neighbors.push({
                        cell: this.gridCell[nx][ny],
                        topology: type === 4 ? { type: 4 } : { type: 8 }
                    });
                }
            });
        };

        createNeighbor(DIRECTIONS.ORTHOG, 4);

        if (this.topology.type === 8) createNeighbor(DIRECTIONS.DIAG, 8);

        return neighbors;
    }

    /**
     * Initialize the neighbors of the given Cell.
     *
     * @param cell - The Cell to initialize the neighbors
     */
    protected initNeighbors(cell: Cell<T>): void {
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
        return isPositionWithinGrid(this.grid, { x, y });
    }

    /**
     * Check that start and end are valid positions.
     * They must be existing coordinates and not one of a blocking Cell.
     *
     * @param start - The Cell position to start with
     * @param end   - The Cell position to end with
     * @returns A Result or undefined if they're valid coordinates
     */
    protected isValidPath(start: Position, end: Position): ResultPath | undefined {
        const containsStart = this.contains(start.x, start.y);
        const containsEnd = this.contains(end.x, end.y);

        if (!containsStart || !containsEnd) return { status: 'Invalid' };

        const startCell = this.gridCell[start.x][start.y];
        const endCell = this.gridCell[end.x][end.y];

        const startBlock = this.callbackBlock(startCell.data);
        const endBlock = this.callbackBlock(endCell.data);

        if (startBlock || endBlock) return { status: 'Block' };
    }
}

export default Path;
