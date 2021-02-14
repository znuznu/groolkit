import Position from '../../position';
import Rogue, { Cell } from './rogue';

interface Doors {
    north: Cell[];
    south: Cell[];
    east: Cell[];
    west: Cell[];
}

class Room {
    private p1: Position;
    private p2: Position;
    private width: number;
    private height: number;
    private rogue: Rogue;
    private corners: Set<Cell>;

    cells: Set<Cell>;
    doors: Doors;

    constructor(p1: Position, width: number, height: number, rogue: Rogue) {
        this.p1 = p1;
        this.width = width;
        this.height = height;
        this.p2 = { x: p1.x + height - 1, y: p1.y + width - 1 };
        this.rogue = rogue;
        this.cells = new Set();
        this.corners = new Set();
        this.doors = {
            north: [],
            south: [],
            west: [],
            east: []
        };

        this.initCells();
    }

    private initCells(): void {
        for (let x = this.p1.x; x <= this.p2.x; x++) {
            for (let y = this.p1.y; y <= this.p2.y; y++) {
                let cell = this.rogue.cells[x][y];
                cell.type = 0;
                this.cells.add(cell);
            }
        }

        this.initCorners();
    }

    /**
     * Add the given door to the given side of this Room.
     *
     * @param side
     * @param doorCell
     */
    addDoors(side: string, doorCell: Cell): void {
        this.doors[side].push(doorCell);
    }

    private hasDoor(door: Cell): boolean {
        return (
            this.doors.north.includes(door) ||
            this.doors.south.includes(door) ||
            this.doors.west.includes(door) ||
            this.doors.east.includes(door)
        );
    }

    private initCorners(): void {
        let upperLeft = this.rogue.cells[this.p1.x][this.p1.y];
        let upperRight = this.rogue.cells[this.p1.x][this.p2.y];
        let downRight = this.rogue.cells[this.p2.x][this.p2.y];
        let downLeft = this.rogue.cells[this.p2.x][this.p1.y];

        this.corners = new Set([upperLeft, upperRight, downRight, downLeft]);
    }

    /**
     * Get all potential doors of this Room for the given side.
     * Potential means a Cell in the side, not already a door and not a corner.
     *
     * @param side - The side of the Room to check
     */
    getPotentialDoors(side: string): Cell[] {
        let cells: Cell[] = [];

        for (const cell of Array.from(this.cells)) {
            if (this.corners.has(cell) || this.hasDoor(cell)) {
                continue;
            }

            switch (side) {
                case 'north':
                    if (cell.position.x === this.p1.x) {
                        cells.push(cell);
                    }
                    break;
                case 'south':
                    if (cell.position.x === this.p2.x) {
                        cells.push(cell);
                    }
                    break;
                case 'west':
                    if (cell.position.y === this.p1.y) {
                        cells.push(cell);
                    }
                    break;
                case 'east':
                    if (cell.position.y === this.p2.y) {
                        cells.push(cell);
                    }
                    break;
                default:
                    throw new Error(`No side case found for '${side}'.`);
            }
        }

        return cells;
    }

    createInnerWalls(): void {
        for (let cell of Array.from(this.cells)) {
            let cx = cell.position.x;
            let cy = cell.position.y;

            if (
                !this.hasDoor(cell) &&
                (cx === this.p1.x || cy === this.p1.y || cx === this.p2.x || cy === this.p2.y)
            ) {
                cell.type = 1;
            }
        }
    }
}

export default Room;
