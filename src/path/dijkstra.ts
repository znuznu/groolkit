import { CallbackBlock } from '../callbacks';
import { D, D2 } from './constants';
import { ResultPath } from '../result';
import Path, { Topology } from './path';
import Position from '../position';
import MinBinaryHeap from '../struct/minBinaryHeap';
import Cell from './cell';

/**
 * Dijkstra pathfinding algorithm with 4 or 8 directions.
 */
class Dijkstra<T> extends Path<T> {
    constructor(grid: T[][], topology: Topology, callbackBlock: CallbackBlock<T>) {
        super(grid, topology, callbackBlock);
    }

    search(
        start: Position,
        end: Position,
        newCallbackBlock?: CallbackBlock<T>
    ): ResultPath {
        let validPositions = this.isValidPath(start, end);

        if (validPositions) return validPositions;

        let startCell = this.gridCell[start.x][start.y];
        let endCell = this.gridCell[end.x][end.y];

        /* Actual Dijkstra */

        this.callbackBlock = newCallbackBlock || this.callbackBlock;

        let distances: Map<Cell<T>, number> = new Map();
        let open: MinBinaryHeap<Cell<T>> = new MinBinaryHeap((cell) =>
            distances.get(cell)
        );
        let marked: Set<Cell<T>> = new Set();
        this.parents = new Map();

        this.gridCell.forEach((row: Cell<T>[], i: number) => {
            distances.set(row[i], Infinity);
        });

        let h = this.gridCell.length;
        let w = this.gridCell[0].length;

        // Init all distances to Infinity.
        for (let x = 0; x < h; x++) {
            for (let y = 0; y < w; y++) {
                let cell = this.gridCell[x][y];
                distances.set(cell, Infinity);
            }
        }

        distances.set(startCell, 0);
        this.initNeighbors(startCell);

        for (let neighbor of startCell.neighbors) {
            let topology = neighbor.topology.type;
            let distance = topology === 4 ? D : D2;
            distances.set(neighbor.cell, distance);
            open.push(neighbor.cell);
            this.parents.set(neighbor.cell, startCell);
        }

        marked.add(startCell);

        while (open.data.length) {
            let current: Cell<T> = open.pop();

            // Target reached.
            if (current === endCell) {
                let path: Position[] = [];
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

            for (let neighbor of current.neighbors) {
                let ncell = neighbor.cell;

                if (marked.has(ncell)) continue;

                let topology = neighbor.topology.type;
                let distanceToCurrent = topology === 4 ? D : D2;
                let distance = distances.get(current) + distanceToCurrent;

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

export default Dijkstra;
