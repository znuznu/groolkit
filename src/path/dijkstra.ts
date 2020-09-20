import { CallbackBlock } from '../callbacks';
import { D, D2 } from '../constants';
import Path, { Result, Topology } from './path';
import Position from '../position';
import MinBinaryHeap from '../struct/minBinaryHeap';
import Cell from './cell';

/**
 * Dijkstra algorithm with 4 or 8 directions.
 * 
 * @todo
 * The 8 directions needs huge improvements.
 */
class Dijkstra extends Path {
    constructor(grid: any[][], topology: Topology, callbackBlock: CallbackBlock) {
        super(grid, topology, callbackBlock);
    }

    search(start: Position, end: Position, newCallbackBlock?: CallbackBlock): Result {
        let validPositions = this.isValidPath(start, end);

        if (validPositions) return validPositions;

        let startCell = this.gridCell[start.x][start.y];
        let endCell = this.gridCell[end.x][end.y];

        /* Actual Dijsktra */

        this.callbackBlock = newCallbackBlock || this.callbackBlock;

        let distances: Map<Cell, number> = new Map();
        let open: MinBinaryHeap<Cell> = new MinBinaryHeap(cell => distances.get(cell));
        let marked: Set<Cell> = new Set();
        this.parents = new Map();

        this.gridCell.forEach((row: Cell[], i: number) => {
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
            let distance = (topology === 4) ? D : D2;
            distances.set(neighbor.cell, distance);
            open.push(neighbor.cell);
            this.parents.set(neighbor.cell, startCell);
        }

        marked.add(startCell);

        while (open.data.length) {
            let current: Cell = open.pop();

            // Target reached.
            if (current === endCell) {
                let path: Position[] = [];
                let cursor: Cell = current;

                while (cursor !== startCell) {
                    path.push({ x: cursor.position.x, y: cursor.position.y });
                    cursor = this.parents.get(cursor);
                }

                path.push({ x: cursor.position.x, y: cursor.position.y });

                return { status: 'Found', path: path.reverse() };
            }

            if (!current.neighbors) {
                this.initNeighbors(current);
            }

            for (let neighbor of current.neighbors) {
                let ncell = neighbor.cell;

                if (marked.has(ncell)) continue;

                let topology = neighbor.topology.type;
                let distanceToCurrent = (topology === 4) ? D : D2;
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