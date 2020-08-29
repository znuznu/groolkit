import Grid from '../grid';

abstract class Maze extends Grid {
    constructor(width: number, height: number) {
        super(width * 2 + 1, height * 2 + 1);
    }
}

export default Maze;