import { CallbackBlock } from '../helpers/callbacks';
import { D, D2 } from './constants';
import Path, { ResultPath, Topology } from './path';
import MinBinaryHeap from '../struct/minBinaryHeap';
import Cell from './cell';
import { Position } from '../helpers/types';

/**
 * A* algorithm with 4 or 8 directions.
 */
class AStar<T> extends Path<T> {
    constructor(grid: T[][], topology: Topology, callbackBlock: CallbackBlock<T>) {
        super(grid, topology, callbackBlock);
    }

    search(
        start: Position,
        end: Position,
        newCallbackBlock?: CallbackBlock<T>
    ): ResultPath {
        const validPositions = this.isValidPath(start, end);

        if (validPositions) return validPositions;

        const startCell = this.gridCell[start.x][start.y];
        const endCell = this.gridCell[end.x][end.y];

        /* Actual A* */

        this.callbackBlock = newCallbackBlock || this.callbackBlock;

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
     * The distance between two cells (heuristic).
     *
     * @param c1 - The first Cell
     * @param c2 - The second Cell
     */
    protected distance(c1: Cell<T>, c2: Cell<T>): number | undefined {
        const c1x = c1.position.x,
            c1y = c1.position.y;
        const c2x = c2.position.x,
            c2y = c2.position.y;

        const dx = Math.abs(c1x - c2x);
        const dy = Math.abs(c1y - c2y);

        switch (this.topology.type) {
            case 4:
                return D * (dx + dy);
            case 8:
                return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
            default:
                throw new Error('No such topology.');
        }
    }
}

export default AStar;
