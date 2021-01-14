import { CallbackLight } from '../callbacks';
import Position, { strToPosition, positionToString } from '../position';
import { ResultFov } from '../result';
import FOV, { Options } from './fov';

const OCTANTS = [
    [1, 0, 0, 1],
    [1, 0, 0, -1],
    [-1, 0, 0, -1],
    [-1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, -1, 1, 0],
    [0, -1, -1, 0],
    [0, 1, -1, 0]
];

/**
 * Recursive Shadow Casting based on Björn Bergström's algorithm.
 * You can find an idea of how it works here:
 * http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 * 
 */
class RecursiveShadowCasting extends FOV {
    constructor(grid: any[][], callbackLight: CallbackLight, options?: Partial<Options>) {
        super(grid, callbackLight, options);
    }

    compute(start: Position): ResultFov {
        if (!this.isValidStart(start)) {
            return {
                status: 'Failed'
            }
        }

        let visiblesSet: Set<string> = new Set();

        visiblesSet.add(positionToString(start));

        let i = OCTANTS.length;

        while (i--) {
            this.processOctants(start, 1, 1.0, 0.0, OCTANTS[i], visiblesSet);
        }

        let visibles = Array.from(visiblesSet)
            .map((p: string) => strToPosition(p));

        return {
            status: 'Success',
            visibles: visibles
        };
    }

    /**
     * Compute each tile from the given octant.
     * 
     * @param start - The position of the tile to start
     * @param row - The current row
     * @param startSlope - The slope to start at
     * @param endSlope - The slope to end at
     * @param octant - The current octant
     * @param visiblesSet - The visibles tile positions (as a string)
     */
    protected processOctants(
        start: Position,
        row: number,
        startSlope: number,
        endSlope: number,
        octant: number[],
        visiblesSet: Set<string>
    ) {
        if (startSlope < endSlope) return;

        const xx = octant[0];
        const xy = octant[1];
        const yx = octant[2];
        const yy = octant[3];

        for (let i = row; i <= this.radius; i++) {
            let dx = -i - 1;
            let dy = -i;

            let newStart = 0;
            let blocked = false;

            while (dx <= 0) {
                dx += 1;

                // Map coordinates.
                let mx = start.x + dx * xx + dy * xy;
                let my = start.y + dx * yx + dy * yy;

                let h = this.grid.length;
                let w = this.grid[0].length;

                if (!(mx >= 0 && mx < h && my >= 0 && my < w))
                    break;

                let leftSlope = (dx - 0.5) / (dy + 0.5);
                let rightSlope = (dx + 0.5) / (dy - 0.5);

                if (startSlope < rightSlope)
                    continue;

                if (endSlope > leftSlope)
                    break;

                // Circle around the starting position.
                if (dx * dx + dy * dy < this.radius * this.radius) {
                    visiblesSet.add(mx + "," + my);
                }

                if (blocked) {
                    if (!this.callbackLight(this.grid[mx][my])) {
                        newStart = rightSlope;
                        continue;
                    } else {
                        blocked = false;
                        startSlope = newStart;
                    }
                } else {
                    if (!this.callbackLight(this.grid[mx][my]) && i < this.radius) {
                        blocked = true;
                        this.processOctants(start, i + 1, startSlope, leftSlope, octant, visiblesSet);
                        newStart = rightSlope;
                    }
                }
            }

            if (blocked) break;
        }
    }
}

export default RecursiveShadowCasting;