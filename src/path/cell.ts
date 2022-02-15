import { Position } from '../helpers/types';
import { Neighbor } from './path';

/**
 * A class used to represent a copy of a cell from the original grid.
 */
class Cell<T> {
    position: Position;
    data: T;
    neighbors: Neighbor<T>[];

    /**
     * @constructor
     * @param position - The position of this Cell inside the grid
     * @param data     - The data of the original cell in the user grid
     */
    constructor(position: Position, data: T) {
        this.position = position;
        this.data = data;
        this.neighbors = undefined;
    }
}

export default Cell;
