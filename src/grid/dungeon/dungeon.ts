import Grid, { Cell } from '../grid';
import Room from './room';
import Corridor from './corridor';

abstract class Dungeon extends Grid {
    rooms: Room[];
    corridors: Set<Corridor>;
    void: Set<Cell>;

    constructor(width: number, height: number) {
        super(width, height);
        this.rooms = [];
        this.corridors = new Set();
        this.void = new Set();
    }

    /**
     * Following a "digger" algorithm, leave only walls surrounding passage.
     */
    createInnerWalls(): void {
        /* Create room walls */
        for (let room of this.rooms) {
            room.createInnerWalls();
        }

        /* Create corridors walls */

        // Scan the grid, remove each wall which are not side-by-side with at least one passage
        let gridWithWalls: number[][] = [];

        for (let x = 0; x < this.height; x++) {
            gridWithWalls.push([]);
            for (let y = 0; y < this.width; y++) {
                gridWithWalls[x][y] = 0;
            }
        }

        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [1, -1], [-1, -1], [-1, 1]
        ];

        let isWall = (cell: Cell): boolean => {
            let cx = cell.position.x, cy = cell.position.y;

            for (let d of directions) {
                let xneighbor = cx + d[0];
                let yneighbor = cy + d[1];

                if (xneighbor < 0 || xneighbor >= this.height || yneighbor < 0 || yneighbor >= this.width)
                    return false;

                if (this.cells[xneighbor][yneighbor].type === 0) {
                    return true;
                }
            }
        };

        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                if (this.cells[x][y].type === 1) {
                    if (isWall(this.cells[x][y])) {
                        gridWithWalls[x][y] = 1;
                    } else {
                        gridWithWalls[x][y] = 2;
                        this.void.add(this.cells[x][y]);
                    }
                }
            }
        }

        this.data = gridWithWalls;

        for (let cells of this.cells) {
            for (let cell of cells) {
                cell.type = this.data[cell.position.x][cell.position.y];
            }
        }
    }
}

export default Dungeon;