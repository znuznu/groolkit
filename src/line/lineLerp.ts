import Position, { roundPosition } from '../position';
import { CallbackBlock } from '../callbacks';
import Line from './line';

class LineLerp extends Line {
    constructor(grid: number[][], callbackBlock: CallbackBlock) {
        super(grid, callbackBlock);
    }

    process(p1: Position, p2: Position) {
        let outOfBound = super.process(p1, p2);
        if (outOfBound) return outOfBound;

        return this.getLine(p1, p2);
    }

    getLine(p1: Position, p2: Position): Position[] {
        let positions: Position[] = [];
        
        let steps = Math.max(
            Math.abs(p2.x - p1.x),
            Math.abs(p2.y - p1.y)
        );

        for (let n = 0; n <= steps; n++) {
            let t = steps == 0 ? 0.0 : n / steps;

            let position = roundPosition(this.lerpPosition(p1, p2, t));

            if (this.callbackBlock(this.grid[position.x][position.y]))
                break;

            positions.push(position);
        }

        return positions;
    }
    
    lerp(start: number, target: number, t: number) {
        return start + t * (target - start);
    }

    lerpPosition(p1: Position, p2: Position, t: number) {
        return {
            x: this.lerp(p1.x, p2.x, t),
            y: this.lerp(p1.y, p2.y, t)
        }
    }
}

export default LineLerp;