import Position from '../../position';
import { randInRange } from '../../rand';
import Grid, { Cell } from '../grid';

export interface Doors {
    north: Cell[],
    south: Cell[],
    east: Cell[],
    west: Cell[]
}

class Room {
    private _p1: Position;
    private _p2: Position;
    private _width: number;
    private _height: number;
    private _cells: Set<Cell>;
    // Not used
    private _borderCells: Set<Cell>;
    private _grid: Grid;
    private _doors: Doors;
    private _corners: Set<Cell>;

    constructor(p1: Position, p2: Position, width: number, height: number, grid: Grid) {
        this._p1 = p1;
        this._p2 = p2;
        this._width = width;
        this._height = height;
        this._borderCells = new Set();
        this._grid = grid;
        this._cells = new Set();
        this._corners = new Set();
        this._doors = {
            north: [],
            south: [],
            west: [],
            east: []
        };
    }

    /**
     * Initialize the Cells of this Room.
     */
    initCells(): void {
        let h = this._p1.x + this._height;
        let w = this._p1.y + this._width;

        for (let x = this._p1.x; x <= this._p2.x; x++) {
            for (let y = this._p1.y; y <= this._p2.y; y++) {
                this._cells.add(this._grid.cells[x][y]);
            }
        }

        if (this._cells.size !== this._width * this._height)
            console.log(this._cells.size, this._width * this._height)

        this.initCorners();
    }

    /**
     * Check if this Room and an other one are overlapped.
     * 
     * @param other - The Room to test with this Room
     * @returns True if this Room is overlapping with other
     */
    doesOverlap(other: Room): boolean {
        let r1x = this._p1.x - 1, r1y = this._p1.y - 1;
        let r1h = this._height + 1, r1w = this._width + 1;
        let r2x = other.p1.x - 1, r2y = other.p1.y - 1;
        let r2h = other.height + 1, r2w = other.width + 1;

        return r1x < r2x + r2h && r1x + r1h > r2x && r1y < r2y + r2w && r1w + r1y > r2y;
    }

    /**
     * Get a random Cell and removes it from the border _cells set.
     * 
     * @returns A random Cell from the border of this Room
     */
    popRandomBorderDoor(): Cell {
        let borderArray = Array.from(this._borderCells);
        let door = borderArray[randInRange(0, borderArray.length)];
        this._borderCells.delete(door);

        return door;
    }

    /**
     * Get the Cell in the center of this Room.
     * 
     * @returns The Cell in the center of this room
     */
    getCenterCell(): Cell {
        let centerX = this._p1.x + ~~(this._height / 2);
        let centerY = this._p1.y + ~~(this._width / 2);
        return this._grid.cells[centerX][centerY];
    }

    /**
     * @returns The center position of this Room
     */
    getCenterPosition(): Position {
        return {
            x: this._p1.x + ~~(this._height / 2),
            y: this._p1.y + ~~(this._width / 2)
        }
    }

    /**
     * Check if this Room contains the given Cell.
     * 
     * @param cell - The Cell to check
     * @returns True if this Room contains the given Cell
     */
    contains(cell: Cell): boolean {
        return this._cells.has(cell);
    }

    /**
     * Add a door Cell to this Room.
     * 
     * @param doorCell - The given door position
     */
    addDoors(direction: string, doorCell: Cell): void {
        this._doors[direction].push(doorCell);
    }

    /**
     * Check if this Room has the given door.
     * 
     * @param doorCell - The given door Cell
     * 
     * @returns True if this Room has doorCell as a door
     */
    hasDoor(doorCell: Cell): boolean {
        return this._doors.north.includes(doorCell)
            || this._doors.south.includes(doorCell)
            || this._doors.west.includes(doorCell)
            || this._doors.east.includes(doorCell);
    }

    /**
     * Init all Cells of the Room's corners.
     */
    initCorners(): void {
        let p1x = this._p1.x, p1y = this._p1.y;
        let p2x = this._p2.x, p2y = this._p2.y;

        let ul = this._grid.cells[p1x][p1y];
        let ur = this._grid.cells[p1x][p1y + this._width - 1];
        let dr = this._grid.cells[p2x][p2y];
        let dl = this._grid.cells[p1x + this._height - 1][p1y];

        this._corners = new Set([ul, ur, dr, dl]);
    }

    /**
     * Get all potential doors of a this Room.
     * Potential means a Cell in a direction, not already a door and not a corner.
     * 
     * @param room 
     */
    public getPotentialDoors(direction: string): Cell[] {
        let cells: Cell[] = [];

        let rp1x = this._p1.x;
        let rp1y = this._p1.y;
        let rp2x = this._p2.x;
        let rp2y = this._p2.y;

        for (let cell of Array.from(this._cells)) {
            let cx = cell.position.x;
            let cy = cell.position.y;

            if (this._corners.has(cell) || this.hasDoor(cell))
                continue;


            switch (direction) {
                case 'north':
                    if (cx === rp1x) {
                        cells.push(cell);
                    }
                    break;

                case 'south':
                    if (cx === rp2x) {
                        cells.push(cell);
                    }
                    break;

                case 'west':
                    if (cy === rp1y) {
                        cells.push(cell);
                    }
                    break;

                case 'east':
                    if (cy === rp2y) {
                        cells.push(cell);
                    }
                    break;

                default:
                    throw new Error(`No direction case found for '${direction}'.`);
            }
        }

        return cells;
    }

    /**
     * Each cells of the border of this Room becomes a wall.
     */
    createInnerWalls(): void {
        let p1x = this.p1.x;
        let p1y = this.p1.y;
        let p2x = this.p2.x;
        let p2y = this.p2.y;

        for (let cell of Array.from(this.cells)) {
            let cx = cell.position.x;
            let cy = cell.position.y;

            if ((cx === p1x || cy === p1y || cx === p2x || cy === p2y) && !this.hasDoor(cell)) {
                cell.type = 1;
            }
        }
    }

    public get p1(): Position {
        return this._p1;
    }

    public set p1(value: Position) {
        this._p1 = value;
    }

    public get p2(): Position {
        return this._p2;
    }

    public set p2(value: Position) {
        this._p2 = value;
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: number) {
        this._height = value;
    }

    public get cells(): Set<Cell> {
        return this._cells;
    }

    public set cells(value: Set<Cell>) {
        this._cells = value;
    }

    public get borderCells(): Set<Cell> {
        return this._borderCells;
    }

    public set borderCells(value: Set<Cell>) {
        this._borderCells = value;
    }

    public get grid(): Grid {
        return this._grid;
    }

    public set grid(value: Grid) {
        this._grid = value;
    }

    public get doors(): Doors {
        return this._doors;
    }

    public set doors(value: Doors) {
        this._doors = value;
    }

    public get corners(): Set<Cell> {
        return this._corners;
    }

    public set corners(corners: Set<Cell>) {
        this._corners = corners;
    }
}

export default Room;