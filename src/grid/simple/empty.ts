import Grid from '../grid';

class Empty extends Grid {
    constructor(width: number, height: number) {
        super(width, height);
    }

    process(): void {
        this.fill(_ => 0);
        this.createCells();
    }
}

export default Empty;