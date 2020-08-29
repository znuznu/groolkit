import Grid from '../grid';

class Border extends Grid {
    constructor(width: number, height: number) {
        super(width, height);
    }

    process(): void {
        this.fill(pos => {
            let [w, h]: [number, number] = [this.width - 1, this.height - 1];
            return (pos.x && pos.y && pos.x < h && pos.y < w) ? 0 : 1;
        });

        this.createCells();
    }
}

export default Border;