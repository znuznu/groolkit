import { Cell } from './rogue';
import Room from './room';

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

    hasCell(cell: Cell): boolean {
        return this.cells.find((c) => c === cell) != undefined;
    }
}

export default Corridor;
