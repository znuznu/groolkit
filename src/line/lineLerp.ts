import Position, { roundPosition } from '../position';
import { CallbackBlock } from '../callbacks';
import Line, { ResultLine } from './line';

class LineLerp<T> extends Line<T> {
    constructor(grid: T[][], callbackBlock: CallbackBlock<T>) {
        super(grid, callbackBlock);
    }

    process(start: Position, end: Position) {
        const outOfBound = super.process(start, end);
        if (outOfBound) {
            return outOfBound;
        }

        return this.getLine(start, end);
    }

    private getLine(start: Position, end: Position): ResultLine {
        const positions: Position[] = [];

        const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));

        for (let n = 0; n <= steps; n++) {
            const t = steps == 0 ? 0.0 : n / steps;

            const position = roundPosition(this.lerpPosition(start, end, t));

            if (this.callbackBlock(this.grid[position.x][position.y])) {
                break;
            }

            positions.push(position);
        }

        const isEmpty = !positions.length;
        let isIncomplete = false;

        if (isEmpty) {
            isIncomplete = true;
        } else {
            const lastPosition = positions[positions.length - 1];
            isIncomplete = lastPosition.x !== end.x || lastPosition.y !== end.y;
        }

        return {
            status: isEmpty || isIncomplete ? 'Incomplete' : 'Complete',
            positions: positions
        };
    }

    private lerp(start: number, target: number, t: number) {
        return start + t * (target - start);
    }

    private lerpPosition(p1: Position, p2: Position, t: number) {
        return {
            x: this.lerp(p1.x, p2.x, t),
            y: this.lerp(p1.y, p2.y, t)
        };
    }
}

export default LineLerp;
