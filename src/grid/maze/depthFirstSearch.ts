import { randInRange } from '../../rand';
import { Cell } from '../grid';
import Maze from './maze';

class DepthFirstSearch extends Maze {
    constructor(width: number, height: number) {
        super(width, height);
    }

    process(x: number = 1, y: number = 1): void {
        this.fill(position => {
            return (position.x % 2 && position.y % 2) ? 0 : 1;
        });

        this.createCells();

        let stack: Cell[] = [];
        let marked: Set<Cell> = new Set();

        let cell = this.cells[x][y];
        stack.push(cell);
        marked.add(cell);

        while (stack.length) {
            let current = stack.pop();
            let neighbors = this.validOnAllSides(current, 2);
            let notMarked = neighbors.filter(
                n => !marked.has(n.cell)
            );

            if (notMarked.length) {
                stack.push(current);

                let pick = notMarked[randInRange(0, notMarked.length)];

                let wall = this.getCellInDirection(current, pick.direction, 1);

                this.data[wall.position.x][wall.position.y] = 0;
                
                marked.add(pick.cell);
                stack.push(pick.cell);
            }
        }
    }
}

export default DepthFirstSearch;