import Grid from '../grid';
import Room from './room';

abstract class Dungeon extends Grid {
    rooms: Room[];

    constructor(width: number, height: number) {
        super(width, height);
        this.rooms = [];
    }
}

export default Dungeon;