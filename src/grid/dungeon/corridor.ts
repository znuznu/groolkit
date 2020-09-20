import Position from '../../position';
import Room from './room';
import { Cell } from '../grid';

class Corridor {
    cells: Cell[];
    connectedRooms: Room[];

    constructor() {
        this.cells = [];
        this.connectedRooms = [];
    }

    addCells(...cell: Cell[]): void {
        this.cells.push(...cell);
    }

    addConnectedRoom(...room: Room[]): void {
        this.connectedRooms.push(...room);
    }

    getCells(): Cell[] {
        return this.cells;
    }

    getConnectedRooms(): Room[] {
        return this.connectedRooms;
    }

    hasCell(cell: Cell): boolean {
        return this.cells.find(c => c === cell) != undefined;
    }
}

export default Corridor;