import { CallbackBlock } from '../callbacks';
import Position from '../position';
import { ResultLine } from '../result';
import COLOR from './colors';
import Draw, { DrawOptions, opacities } from './draw';

interface LineColors {
    tile: string;
}

export const colors: LineColors = {
    tile: COLOR.LINE_ALGORITHM,
}

class DrawLine extends Draw {
    constructor(context: CanvasRenderingContext2D, grid: any[][], callback: CallbackBlock, drawOptions: DrawOptions) {
        super(context, grid, callback, drawOptions);
    }

    draw(result: ResultLine) {
        this.clearCanvas();
        this.drawTiles();

        this.context.beginPath();
        this.context.globalAlpha = opacities.algorithm;
        this.context.fillStyle = colors.tile;

        result.positions.forEach((p: Position) => {
            this.context.fillRect(
                p.y * this.drawOptions.widthTile,
                p.x * this.drawOptions.heightTile,
                this.drawOptions.widthTile,
                this.drawOptions.heightTile
            );
        });

        this.context.closePath();
        this.context.globalAlpha = 1;
        this.drawLines();
    }
}

export default DrawLine;