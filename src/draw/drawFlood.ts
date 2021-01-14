import { CallbackBlock } from '../callbacks';
import Draw, { DrawOptions } from './draw';

class DrawFlood extends Draw {
    constructor(context: CanvasRenderingContext2D, grid: any[][], callback: CallbackBlock, drawOptions: DrawOptions) {
        super(context, grid, callback, drawOptions);
    }

    draw(): void {
        // this.clearCanvas();

        // let h = this.grid.length;
        // let w = this.grid[0].length;
        // this.drawTiles();

        // this.context.beginPath();
        // this.context.globalAlpha = SHOW_OPTIONS.lineOpacity;

        // for (let x = 0; x < h; x++) {
        //     for (let y = 0; y < w; y++) {
        //         this.context.fillStyle = colorGrid[x][y].color;
        //         this.context.fillRect(
        //             y * SHOW_OPTIONS.tileWidth,
        //             x * SHOW_OPTIONS.tileHeight,
        //             SHOW_OPTIONS.tileWidth,
        //             SHOW_OPTIONS.tileHeight
        //         );
        //     }
        // }

        // this.context.closePath();
        // this.context.globalAlpha = 1;
        // this.drawLines();
    }
}