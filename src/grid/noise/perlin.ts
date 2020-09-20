import Noise from './noise';

class PerlinNoise extends Noise {
    constructor(width: number, height: number) {
        super(width, height);
    }

    process(): void {
        this.fill(_ => {
            return 1;
        });

        this.createCells();
    }
}