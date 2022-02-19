import { D, D2 } from './constants';
import { BlockCallbackFn, Cell, Path, ResultPath, Topology } from './path';
import { MinBinaryHeap } from '../struct/minBinaryHeap';
import { Position } from '../helpers/types';

/**
 * Represents a shortest path finder using Dijkstra algorithm.
 *
 * It works for a 4 or 8 topology.
 */
export class Dijkstra<T> extends Path<T> {
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
     * Find a path between a start {@linkcode Position} and an end {@linkcode Position} using Dijkstra algorithm.
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

        /* Start Dijkstra */

        this.blockCallbackFn = newBlockCallbackFn || this.blockCallbackFn;

        const distances: Map<Cell<T>, number> = new Map();
        const open: MinBinaryHeap<Cell<T>> = new MinBinaryHeap((cell) =>
            distances.get(cell)
        );
        const marked: Set<Cell<T>> = new Set();
        this.parents = new Map();

        this.gridCell.forEach((row: Cell<T>[], i: number) => {
            distances.set(row[i], Infinity);
        });

        const h = this.gridCell.length;
        const w = this.gridCell[0].length;

        // Init all distances to Infinity.
        for (let x = 0; x < h; x++) {
            for (let y = 0; y < w; y++) {
                const cell = this.gridCell[x][y];
                distances.set(cell, Infinity);
            }
        }

        distances.set(startCell, 0);
        this.initNeighbors(startCell);

        for (const neighbor of startCell.neighbors) {
            const topology = neighbor.topology.type;
            const distance = topology === 4 ? D : D2;
            distances.set(neighbor.cell, distance);
            open.push(neighbor.cell);
            this.parents.set(neighbor.cell, startCell);
        }

        marked.add(startCell);

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

            for (const neighbor of current.neighbors) {
                const ncell = neighbor.cell;

                if (marked.has(ncell)) continue;

                const topology = neighbor.topology.type;
                const distanceToCurrent = topology === 4 ? D : D2;
                const distance = distances.get(current) + distanceToCurrent;

                if (!open.contains(ncell)) {
                    distances.set(ncell, distance);
                    open.push(ncell);
                    this.parents.set(ncell, current);
                } else {
                    if (distances.get(ncell) > distance) {
                        distances.set(ncell, distance);
                        open.remove(ncell);
                        open.push(ncell);
                        this.parents.set(ncell, current);
                    }
                }
            }

            marked.add(current);
        }

        return { status: 'Unreachable' };
    }
}
