import { Position } from '../position';
import { Neighbor } from './path';

/**
 * A Cell used to compute paths. 
 */
class Cell {
    position: Position;
    data: any;
    neighbors: Neighbor[];

    /**
     * @constructor
     * @param position - The position of this Cell inside the grid
     * @param data - The data of the original cell in the user grid
     */
    constructor(position: Position, data: any) {
        this.position = position;
        this.data = data;
        this.neighbors = undefined;
    }
}

export default Cell;