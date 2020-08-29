import { Cell } from '../grid';
import { ORTHOG, DIAG } from '../../constants';
import { Position } from '../../position';
import Dungeon from './dungeon';

export interface Config {
    maxDeaths: number;
    maxBirths: number;
    birthRate: number;
    stepsNumber: number;
}

class Cellular extends Dungeon {
    maxDeaths: number;
    maxBirths: number; 
    birthRate: number;
    stepsNumber: number;

    constructor(width: number, height: number, config: Config) {
        super(width, height);
        this.maxDeaths = config.maxDeaths;
        this.maxBirths = config.maxBirths;
        this.birthRate = config.birthRate;
        this.stepsNumber = config.stepsNumber;
    }

    process(): void {
        this.fill(_ => Math.random() > this.birthRate ? 0 : 1);
        this.createCells();
        
        while (this.stepsNumber) {
            this.cells = this.steps();
            this.stepsNumber -= 1;
        }

        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                this.data[x][y] = this.cells[x][y].type;
            }
        }
    }

    protected steps(): Cell[][] {
        let newCells: Cell[][] = [];

        for(let x = 0; x < this.height; x++) {
            newCells.push([]);
            for (let y = 0; y < this.width; y++) {
                let alives = this.countAlives({x: x, y: y});

                if (this.cells[x][y].type) {
                    newCells[x][y] = {
                        position: {x: x, y: y},
                        type: (alives < this.maxDeaths) ? 0 : 1
                    };
                } else {
                    newCells[x][y] = {
                        position: {x: x, y: y},
                        type: (alives > this.maxBirths) ? 1 : 0
                    };
                }
            }
        }

        return newCells;
    }

    protected countAlives(position: Position): number {
        let count = 0;

        [...ORTHOG, ...DIAG].forEach(neighbor => {
            let nx = position.x + neighbor[0];
            let ny = position.y + neighbor[1];

            if (nx <= 0 || nx >= this.height - 1 || ny <= 0 || ny >= this.width - 1) {
                count += 1;
            } else {
                count += this.cells[nx][ny].type;
            }
        });

        return count;
    }
}

export default Cellular;