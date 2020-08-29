import { Position } from '../../position';
import { randInRange } from '../../rand';
import Grid, { Cell } from '../grid';

class Room {
    p1: Position;
    p2: Position;
    width: number;
    height: number;
    borderCells: Set<Cell>;
    grid: Grid;
    cells: Set<Cell>;

    constructor(p1: Position, p2: Position, width: number, height: number, grid: Grid) {
        this.p1 = p1;
        this.p2 = p2;
        this.width = width;
        this.height = height;
        this.borderCells = new Set();
        this.grid = grid;
        this.cells = new Set();
    }

    /**
     * Initialize the Cells of this Room.
     */
    initCells(): void {
        let h = this.p1.x + this.height;
        let w = this.p1.y + this.width;
        for (let x = this.p1.x; x < h; x++) {
            for (let y = this.p1.y; y < w; y++) {
                this.cells.add(this.grid.cells[x][y]);
            }
        }
    }

    /**
     * Check if this Room and an other one are overlapped.
     * 
     * @param other - The Room to test with this
     * @returns True if this Room is overlapping with other
     */
    doesOverlap(other: Room): boolean {
        let r1x = this.p1.x - 1, r1y = this.p1.y - 1;
        let r1h = this.height + 1, r1w = this.width + 1;
        let r2x = other.p1.x - 1, r2y = other.p1.y - 1;
        let r2h = other.height + 1, r2w = other.width + 1;

        return r1x < r2x + r2h && r1x + r1h > r2x && r1y < r2y + r2w && r1w + r1y > r2y;
    }

    /**
     * Get a random Cell and removes it from the border cells set.
     * 
     * @returns A random Cell from the border of this Room
     */
    popRandomBorderDoor(): Cell {
        let borderArray = Array.from(this.borderCells);
        let door = borderArray[randInRange(0, borderArray.length)];
        this.borderCells.delete(door);

        return door;
    }

    /**
     * Get the Cell in the center of this Room.
     * 
     * @returns The Cell in the center of this room
     */
    getCenterCell(): Cell {
        let centerX = this.p1.x + ~~(this.height / 2);
        let centerY = this.p1.y + ~~(this.width / 2);
        return this.grid.cells[centerX][centerY];
    }

    /**
     * @returns The center position of this Room
     */
    getCenterPosition(): Position {
        return {
            x: this.p1.x + ~~(this.height / 2),
            y: this.p1.y + ~~(this.width / 2)
        }
    }
}

export default Room;