import { D, D2 } from './constants';
import { BlockCallbackFn, Cell, Path, ResultPath, Topology } from './path';
import { MinBinaryHeap } from '../struct/minBinaryHeap';
import { Position } from '../helpers/types';

/**
 * Represents a shortest path finder using the A Star algorithm.
 *
 * It works for a 4 or 8 topology. The heuristic used is the
 * Manhattan distance and the octile distance respectively.
 *
 * @template T - Any type of data.
 */
export class AStar<T> extends Path<T> {
    /**
     * @constructor
     * @param grid - The grid for which to compute the path finding.
     * @param blockCallbackFn - A callback function used to determine if a cell is a blocking one.
     * @param topology - The topology of the grid.
     */
    constructor(grid: T[][], topology: Topology, blockCallbackFn: BlockCallbackFn<T>) {
        super(grid, topology, blockCallbackFn);
    }

    /**
     * Finds a path between a start {@linkcode Position} and an end {@linkcode Position} using the A Star algorithm.
     *
     * Should be called after the {@link init} method.
     *
     * @param start - The start Position.
     * @param end - The end Position.
     * @param newBlockCallbackFn - A block testing function, different from the constructor one.
     */
    search(
        start: Position,
        end: Position,
        newBlockCallbackFn?: BlockCallbackFn<T>
    ): ResultPath {
        const validPositions = this.isValidPath(start, end);

        if (validPositions) return validPositions;

        const startCell = this.gridCell[start.x][start.y];
        const endCell = this.gridCell[end.x][end.y];

        /* Starting A* */

        this.blockCallbackFn = newBlockCallbackFn || this.blockCallbackFn;

        const gScore: Map<Cell<T>, number> = new Map();
        const fScore: Map<Cell<T>, number> = new Map();
        this.parents = new Map();

        gScore.set(startCell, 0);

        const f = gScore.get(startCell) + this.distance(startCell, endCell);
        fScore.set(startCell, f);

        const open: MinBinaryHeap<Cell<T>> = new MinBinaryHeap((cell) =>
            fScore.get(cell)
        );
        const close: Set<Cell<T>> = new Set();

        open.push(startCell);

        while (open.data.length) {
            const current: Cell<T> = open.pop();

            // Target reached.
            if (current === endCell) {
                const path: Position[] = [];
                let cursor: Cell<T> = current;

                while (cursor !== startCell) {
                    path.push({ x: cursor.position.x, y: cursor.position.y });
                    cursor = this.parents.get(cursor);
                }

                path.push({ x: cursor.position.x, y: cursor.position.y });

                return { status: 'Found', positions: path.reverse() };
            }

            if (!current.neighbors) {
                this.initNeighbors(current);
            }

            current.neighbors.forEach((neighbor) => {
                const ncell = neighbor.cell;

                if (!close.has(ncell)) {
                    const score = neighbor.topology.type === 4 ? D : D2;
                    const g = gScore.get(current) + score;

                    if (!open.contains(ncell)) {
                        this.parents.set(ncell, current);
                        gScore.set(ncell, g);
                        fScore.set(
                            ncell,
                            gScore.get(ncell) + this.distance(ncell, endCell)
                        );
                        open.push(ncell);
                    } else {
                        if (g < gScore.get(ncell)) {
                            open.remove(ncell);
                            this.parents.set(ncell, current);
                            gScore.set(ncell, g);
                            fScore.set(
                                ncell,
                                gScore.get(ncell) + this.distance(ncell, endCell)
                            );
                            open.push(ncell);
                        }
                    }
                }
            });

            if (!close.has(current)) {
                open.remove(current);
                close.add(current);
            }
        }

        return { status: 'Unreachable' };
    }

    /**
     * Retrieves the distance between two {@linkcode Cell}.
     *
     * The heuristic used is the Manhattan or octile distance, for a 4 or 8 topology respectively.
     *
     * @param c1 - A Cell.
     * @param c2 - A Cell.
     * @returns The distance between the two Cell.
     */
    private distance(c1: Cell<T>, c2: Cell<T>): number {
        const c1x = c1.position.x,
            c1y = c1.position.y;
        const c2x = c2.position.x,
            c2y = c2.position.y;

        const dx = Math.abs(c1x - c2x);
        const dy = Math.abs(c1y - c2y);

        if (this.topology.type === 4) {
            return D * (dx + dy);
        }

        if (this.topology.type === 8) {
            return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
        }

        throw new Error('No such topology.');
    }
}
