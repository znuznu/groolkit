import { CallbackBlock } from '../callbacks';
import Position from '../position';
import { ResultFov } from '../result';
import COLOR from './colors';
import Draw, { DrawOptions, opacities } from './draw';

interface FovColors {
    visible: string;
}

export const colors: FovColors = {
    visible: COLOR.FOV,
}

class DrawFov extends Draw {
    constructor(context: CanvasRenderingContext2D, grid: any[][], callback: CallbackBlock, drawOptions: DrawOptions) {
        super(context, grid, callback, drawOptions);
    }

    draw(result: ResultFov, dark: boolean = false): void {
        this.clearCanvas();

        if (!dark) {
            this.drawTiles();
        }

        this.context.beginPath();
        result.visibles.forEach((p: Position) => {
            if (dark) {
                this.drawTile(p);
            }

            this.context.globalAlpha = opacities.algorithm;
            this.context.fillStyle = colors.visible;

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

export default DrawFov;