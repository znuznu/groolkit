import Grid from '../grid';

abstract class Noise extends Grid {
    constructor(width: number, height: number) {
        super(width, height);
    }
}

export default Noise;