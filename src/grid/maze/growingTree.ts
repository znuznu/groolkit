import Maze from "./maze";
import { Cell } from "../grid";
import MinBinaryHeap from "../../struct/minBinaryHeap";
import { randInRange } from "../../rand";

interface Data {
    age: number;
    cell: Cell;
}

/**
 * Generate the maze based on the Growing Tree algorithm.
 */
class GrowingTree extends Maze {
    constructor(width: number, height: number) {
        super(width, height);
    }

    process() {
        this.fill(position => {
            return (position.x % 2 && position.y % 2) ? 0 : 1;
        });

        this.createCells();

        let marked: Set<Cell> = new Set();
        let c: MinBinaryHeap<Data> = new MinBinaryHeap((data: Data) => data.age);

        let xRand = randInRange(0, ~~(this.height / 2)) * 2 + 1;
        let yRand = randInRange(0, ~~(this.width / 2)) * 2 + 1;

        let age = this.height - 1 * this.width - 1;

        let start: Data = {
            age: age,
            cell: this.cells[xRand][yRand]
        }

        marked.add(start.cell);
        c.push(start);

        while (c.size()) {
            let pickedData = this.pick(c);
            let cell = pickedData.cell;
            let neighbors = this.validOnAllSides(cell, 2);

            let neighborsNotMarked = neighbors.filter(n => !marked.has(n.cell));

            if (neighborsNotMarked.length) {
                let randCellDirection = neighborsNotMarked[randInRange(0, neighborsNotMarked.length)];
                let wall = this.getCellInDirection(cell, randCellDirection.direction, 1);
                this.cells[wall.position.x][wall.position.y].type = 0;
                this.data[wall.position.x][wall.position.y] = 0;

                age -= 1;

                let neighbor: Data = {
                    age: age,
                    cell: randCellDirection.cell
                }

                c.push(pickedData);
                c.push(neighbor);
                marked.add(neighbor.cell);
            }
        }
    }

    /**
     * Pick a Cell using a random option between:
     * - the newest Cell
     * - a random Cell
     *
     * There's 50% chances to take an option or the other.
     *
     * @param heap - The Min Binary Heap containing the Cells to process.
     */
    protected pick(heap: MinBinaryHeap<Data>): Data {
        if (Math.random() < 0.5) {
            let randData = heap.data[randInRange(0, heap.size())];
            heap.remove(randData);
            return randData;
        } else {
            return heap.pop();
        }
    }
}

export default GrowingTree;