import Noise from './noise';
import { randInRange } from '../../rand';

export interface Config {
    wallPercent: number;
}

class RegularNoise extends Noise {
    config: Config;

    constructor(width: number, height: number, config?: Config) {
        super(width, height);
        this.config = config || { wallPercent: 50 };
    }

    process(): void {
        this.fill(_ => {
            return (randInRange(1, 101) <= this.config.wallPercent) ? 1 : 0;
        });

        this.createCells();
    }
}

export default RegularNoise;