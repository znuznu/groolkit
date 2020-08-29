import { CallbackBlock } from '../callbacks';
import { D, D2 } from '../constants';
import Path, { Result, Topology } from './path';
import Position from '../position';
import MinBinaryHeap from '../struct/minBinaryHeap';
import Cell from './cell';

/**
 * A* algorithm with 4 or 8 directions.
 */
class AStar extends Path {
    constructor(grid: any[][], topology: Topology, callbackBlock: CallbackBlock) {
        super(grid, callbackBlock, topology);
    }

    search(start: Position, end: Position): Result {
        let validPositions = this.isValidPath(start, end);

        if (validPositions) return validPositions;

        let startCell = this.gridCell[start.x][start.y];
        let endCell = this.gridCell[end.x][end.y];

        /* Actual A* */

        let gScore: Map<Cell, number> = new Map();
        let fScore: Map<Cell, number> = new Map();
        this.parents = new Map();

        gScore.set(startCell, 0);

        let f = gScore.get(startCell) + this.distance(startCell, endCell);
        fScore.set(startCell, f);

        let open: MinBinaryHeap<Cell> = new MinBinaryHeap(cell => fScore.get(cell));
        let close: Set<Cell> = new Set();

        open.push(startCell);

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

            current.neighbors.forEach(neighbor => {
                let ncell = neighbor.cell;

                if (!close.has(ncell)) {
                    let score = neighbor.topology.type === 4 ? D : D2;
                    let g = gScore.get(current) + score;

                    if (!open.contains(ncell)) {
                        this.parents.set(ncell, current);
                        gScore.set(ncell, g);
                        fScore.set(ncell, gScore.get(ncell) + this.distance(ncell, endCell));
                        open.push(ncell);
                    } else {
                        if (g < gScore.get(ncell)) {
                            open.remove(ncell);
                            this.parents.set(ncell, current);
                            gScore.set(ncell, g);
                            fScore.set(ncell, gScore.get(ncell) + this.distance(ncell, endCell));
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
    protected distance(c1: Cell, c2: Cell): number | undefined {
        let c1x = c1.position.x, c1y = c1.position.y;
        let c2x = c2.position.x, c2y = c2.position.y;

        let distance: number | undefined = undefined;

        let dx = Math.abs(c1x - c2x);
        let dy = Math.abs(c1y - c2y);

        switch (this.topology.type) {
            case 4:
                distance = D * (dx + dy);
                break;
            case 8:
                distance = D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
                break;
            default:
                console.log('No such topology.');
                break;
        }

        return distance;
    }
}

export default AStar;
