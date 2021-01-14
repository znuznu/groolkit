import { CallbackBlock } from '../callbacks';
import Position from '../position';

export interface ColorCell {
    position: Position;
    color: string;
}

type Index = [-1, 0] | [1, 0] | [0, -1] | [0, 1];

/**
 * Flood an area of a grid based on the cells type.
 */
class FloodFill {
    grid: any[][];
    colorGrid: ColorCell[][];
    callbackBlock: CallbackBlock;
    width: number;
    height: number;

    // /**
    //  * @constructor
    //  * @param grid          - The original grid
    //  * @param callbackBlock - A function to test if an element of the grid is a block 
    //  */
    // constructor(grid: any[][], callbackBlock: CallbackBlock) {
    //     this.grid = grid;
    //     this.height = this.grid.length;
    //     this.width = this.grid[0].length;
    //     this.callbackBlock = callbackBlock;
    //     this.colorGrid = [];
    // }

    // /**
    //  * Compute the flood filling.
    //  * 
    //  * @param x - The x coordinate of the Cell to start with
    //  * @param y - The y coordinate of the Cell to start with
    //  */
    // process(x: number = 0, y: number = 0) {
    //     this.createColorGrid();
    //     this.fill(this.colorGrid[x][y], COLORS.COLOR_PASSAGE, COLORS.COLOR_RFF);
    // }

    // /**
    //  * Init the grid used to compute the flood filling. 
    //  */
    // protected createColorGrid(): void {
    //     for (let x = 0; x < this.height; x++) {
    //         this.colorGrid.push([]);
    //         for (let y = 0; y < this.width; y++) {
    //             this.colorGrid[x][y] = {
    //                 position: { x: x, y: y },
    //                 color: this.callbackBlock(this.grid[x][y]) ? COLORS.COLOR_BLOCK : COLORS.COLOR_PASSAGE
    //             };
    //         }
    //     }
    // }

    // /**
    //  * Fill the grid line by line.
    //  * 
    //  * @param cell              - The ColorCell to start with
    //  * @param targetColor       - The color to replace
    //  * @param replacementColor  - The color used to replace the target color
    //  */
    // protected fill(cell: ColorCell, targetColor: string, replacementColor: string) {
    //     if (cell.color !== targetColor)
    //         return;

    //     let stack: ColorCell[] = [];
    //     stack.push(cell);

    //     while (stack.length) {
    //         let n = stack.shift();

    //         if (n.color === targetColor) {
    //             let w = n, e = n;
    //             this.processLine(w, [0, -1], targetColor, replacementColor, stack);
    //             this.processLine(e, [0, 1], targetColor, replacementColor, stack);

    //             this.checkVerticalNeighbors(n, targetColor, stack);

    //             n.color = COLORS.COLOR_RFF;
    //         }
    //     }
    // }

    // /**
    //  * Fill the line and check for each ColorCell of the line if their
    //  * vertical neighbours are target too.
    //  * 
    //  * @param cell              - The ColorCell of the line to start with
    //  * @param index             - Numbers to add to our ColorCell in order to find the neighbor
    //  * @param targetColor       - The color to replace
    //  * @param replacementColor  - The color used to replace the target color
    //  * @param stack             - The ColorCell stack containing cells to process
    //  */
    // protected processLine(cell: ColorCell, index: Index, targetColor: string, replacementColor: string, stack: ColorCell[]): void {
    //     let next1X = cell.position.x + index[0];
    //     let next1Y = cell.position.y + index[1];

    //     if (!this.contains({ x: next1X, y: next1Y })) {
    //         return;
    //     }

    //     let next1: ColorCell = this.colorGrid[next1X][next1Y];

    //     while (next1.color === targetColor) {
    //         next1.color = replacementColor;

    //         this.checkVerticalNeighbors(next1, targetColor, stack);

    //         let next2X = next1.position.x + index[0];
    //         let next2Y = next1.position.y + index[1];

    //         if (this.contains({ x: next2X, y: next2Y })) {
    //             next1 = this.colorGrid[next2X][next2Y];
    //         }
    //     }
    // };

    // /**
    //  * Check vertical neighbors and add them to the stack if they have a target color.
    //  * 
    //  * @param cell          - The ColorCell to start with
    //  * @param targetColor   - The color to find and replace
    //  * @param stack         - The ColorCell stack containing cells to process
    //  */
    // protected checkVerticalNeighbors(cell: ColorCell, targetColor: string, stack: ColorCell[]) {
    //     const verticals: Index[] = [[-1, 0], [1, 0]];
    //     verticals.forEach(v => {
    //         let neighborPositions = {
    //             x: cell.position.x + v[0],
    //             y: cell.position.y + v[1]
    //         };

    //         if (this.contains(neighborPositions)) {
    //             let neighbor = this.colorGrid[neighborPositions.x][neighborPositions.y];
    //             if (neighbor.color === targetColor) {
    //                 stack.unshift(neighbor);
    //             }
    //         }
    //     });
    // }

    // /**
    //  * Check if the Cell exists in the grid.
    //  * 
    //  * @param position - Position of the Cell to check
    //  * @returns True if the Cell exists
    //  */
    // protected contains(position: Position): boolean {
    //     let x = position.x;
    //     let y = position.y;

    //     return x >= 0 && x <= this.height - 1 && y >= 0 && y <= this.width - 1;
    // }
}

export default FloodFill;