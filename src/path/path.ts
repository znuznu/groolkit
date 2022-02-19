import { DIRECTIONS } from './constants';
import { Position } from '../helpers/types';
import { isPositionWithinGrid } from '../helpers/position';

/**
 * A path finder topology.
 *
 * Either 4 (orthogonal) or 8 (orthogonal and diagonal).
 */
export interface Topology {
    type: 4 | 8;
}

export interface Neighbor<T> {
    cell: Cell<T>;
    topology: Topology;
}

/** Returns `true` if the given cell is a blocking one. */
export type BlockCallbackFn<T> = (cell: T) => boolean;

/** Represents a Cell used to compute shortest path(s). */
export class Cell<T> {
    position: Position;
    data: T;
    neighbors: Neighbor<T>[];

    /**
     * @constructor
     * @param position - The position of this Cell inside the grid
     * @param data - The data of the original cell in the user grid
     */
    constructor(position: Position, data: T) {
        this.position = position;
        this.data = data;
        this.neighbors = undefined;
    }
}

export interface ResultPath {
    status: 'Found' | 'Unreachable' | 'Invalid' | 'Block';
    positions?: Position[];
}

/**
 * @abstract
 * Represents a shortest path finder between two cells in a two dimensional array.
 *
 * @template T - Any type of data.
 */
export abstract class Path<T> {
    /** The grid for which to compute the flooding. */
    protected grid: T[][];

    /** The callback function used to determine if a cell is a blocking one. */
    protected blockCallbackFn: BlockCallbackFn<T>;

    /** The path finder topology. */
    protected topology: Topology;

    /** A grid containing the state of all cells during the computation. */
    protected gridCell: Cell<T>[][];

    /**
     * A structure that maps a {@linkcode Cell} to his parent.
     *
     * Used in order to reconstructs the path when the computation is done.
     */
    protected parents: Map<Cell<T>, Cell<T>>;

    /**
     * @constructor
     * @param grid - The grid for which to compute the path finding.
     * @param blockCallbackFn - A callback function used to determine if a cell is a blocking one.
     * @param topology - The topology of the grid.
     */
    constructor(grid: T[][], topology: Topology, blockCallbackFn: BlockCallbackFn<T>) {
        this.grid = grid;
        this.gridCell = [];
        this.topology = topology;
        this.blockCallbackFn = blockCallbackFn;
        this.parents = new Map();
    }

    /**
     * Find a path between a start {@linkcode Position} and an end {@linkcode Position}.
     *
     * Should be called after the {@link init} method.
     *
     * @param start - The start Position.
     * @param end - The end Position.
     * @param newBlockCallbackFn - A block testing function, different from the constructor one.
     */
    abstract search(
        start: Position,
        end: Position,
        newBlockCallbackFn?: BlockCallbackFn<T>
    ): ResultPath;

    /**
     * Initializes the grid used to compute a path.
     *
     * A mandatory step before calling the {@link search} method.
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
     * Retrieves all neighbors from the Cell based on the {@linkcode Topology}.
     *
     * @param cell - A Cell for which to get the neighbors.
     * @returns An array containing the neighbors and the topology it comes from.
     */
    protected getNeighbors(cell: Cell<T>): Neighbor<T>[] {
        const neighbors: Neighbor<T>[] = [];

        const createNeighbor = (directions: number[][], type: number) => {
            directions.forEach((dir) => {
                const nx = cell.position.x + dir[0];
                const ny = cell.position.y + dir[1];

                if (this.hasNonBlockingCellWithPosition({ x: nx, y: ny })) {
                    neighbors.push({
                        cell: this.gridCell[nx][ny],
                        topology: type === 4 ? { type: 4 } : { type: 8 }
                    });
                }
            });
        };

        createNeighbor(DIRECTIONS.ORTHOG, 4);

        if (this.topology.type === 8) {
            createNeighbor(DIRECTIONS.DIAG, 8);
        }

        return neighbors;
    }

    /**
     * Initializes the neighbors of a given {@linkcode Cell}.
     *
     * @param cell - The Cell for which to initialize the neighbors.
     */
    protected initNeighbors(cell: Cell<T>): void {
        cell.neighbors = this.getNeighbors(cell);
    }

    /**
     * Checks for a given {@linkcode Position} that a {@linkcode Cell} exists in the grid and isn't a blocking one.
     *
     * @param position - A Position
     * @returns `true` if the Position is the one from a non-blocking Cell.
     */
    private hasNonBlockingCellWithPosition(position: Position): boolean {
        if (!this.contains(position)) {
            return false;
        }

        return !this.blockCallbackFn(this.grid[position.x][position.y]);
    }

    /**
     * Checks that it's possible to search a shortest path between a start and end {@linkcode Position}.
     *
     * Both start and end must be positions of a non-blocking Cell.
     *
     * @param start - A start Position.
     * @param end - An end Position.
     * @returns A path finding result if one of the position is invalid, or undefined if they're both valid.
     */
    protected isValidPath(start: Position, end: Position): ResultPath | undefined {
        const isStartWithinGrid = this.contains({ x: start.x, y: start.y });
        const isEndWithinGrid = this.contains({ x: end.x, y: end.y });

        if (!isStartWithinGrid || !isEndWithinGrid) {
            return { status: 'Invalid' };
        }

        const startCell = this.gridCell[start.x][start.y];
        const endCell = this.gridCell[end.x][end.y];

        const startBlock = this.blockCallbackFn(startCell.data);
        const endBlock = this.blockCallbackFn(endCell.data);

        if (startBlock || endBlock) {
            return { status: 'Block' };
        }
    }

    protected contains(position: Position): boolean {
        return isPositionWithinGrid(this.grid, position);
    }
}
