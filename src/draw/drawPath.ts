import { CallbackBlock } from '../callbacks';
import Draw, { DrawOptions, opacities } from './draw';
import COLOR from './colors';
import { ResultPath } from '../result';

interface PathColors {
    path: string,
    start: string,
    end: string,
}

export const colors: PathColors = {
    path: COLOR.PATH,
    start: COLOR.START,
    end: COLOR.END,
}

class DrawPath extends Draw {
    constructor(context: CanvasRenderingContext2D, grid: any[][], callback: CallbackBlock, drawOptions: DrawOptions) {
        super(context, grid, callback, drawOptions);
    }

    draw(result: ResultPath): void {
        if (result.status !== 'Found') {
            return;
        }

        this.clearCanvas();
        this.drawTiles();

        this.context.beginPath();
        this.context.globalAlpha = opacities.algorithm;

        result.path.forEach((tile, index) => {
            let color = colors.path;

            if (index === 0) {
                color = colors.start;
            } else if (index === result.path.length - 1) {
                color = colors.end;
            }

            this.context.fillStyle = color;

            let x = tile.x * this.drawOptions.heightTile;
            let y = tile.y * this.drawOptions.widthTile;
            this.context.fillRect(y, x, this.drawOptions.widthTile, this.drawOptions.heightTile);
        });

        this.context.closePath();
        this.context.globalAlpha = 1;
        this.drawLines();
    }
}

export default DrawPath;