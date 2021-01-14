import { CallbackBlock } from '../callbacks';
import COLOR from './colors';
import OPACITY from './opacity';
import Position from '../position';
import { Result } from '../result';

interface MeasurementOptions {
    widthTile: number,
    heightTile: number,
}

const measurementOptions: MeasurementOptions = {
    widthTile: 16,
    heightTile: 16
}

export interface DrawOptions {
    widthTile: number,
    heightTile: number,
}

interface BaseColors {
    passage: string,
    block: string,
    line: string,
}

const colors: BaseColors = {
    passage: COLOR.PASSAGE,
    block: COLOR.BLOCK,
    line: COLOR.LINE,
}

interface BaseOpacity {
    line: number,
    algorithm: number,
}

export const opacities: BaseOpacity = {
    line: OPACITY.LINE,
    algorithm: OPACITY.ALGORITHM,
}

abstract class Draw {
    protected context: CanvasRenderingContext2D;
    private grid: any[][];
    private callback: CallbackBlock;
    protected drawOptions: DrawOptions;

    constructor(context: CanvasRenderingContext2D, grid: any[][], callback: CallbackBlock, drawOptions: DrawOptions) {
        this.context = context;
        this.grid = grid;
        this.callback = callback;
        this.drawOptions = drawOptions;
    }

    abstract draw(result: Result): void;

    clearCanvas(): void {
        let h = this.grid.length * measurementOptions.widthTile;
        let w = this.grid[0].length * measurementOptions.heightTile;
        this.context.clearRect(0, 0, w, h);
    }

    drawGrid(): void {
        let h = this.grid.length;
        let w = this.grid[0].length;

        this.context.canvas.width = w * measurementOptions.widthTile;
        this.context.canvas.height = h * measurementOptions.heightTile;

        this.context.beginPath();
        this.drawTiles();
        this.drawLines();
        this.context.closePath();
    }

    protected drawTiles(): void {
        let h = this.grid.length;
        let w = this.grid[0].length;

        for (let x = 0; x < h; x++) {
            for (let y = 0; y < w; y++) {
                this.drawTile({ x: x, y: y });
            }
        }
    }

    protected drawTile(position: Position): void {
        let x = position.x;
        let y = position.y;

        this.context.fillStyle = colors.passage;

        if (this.callback(this.grid[x][y])) {
            this.context.fillStyle = colors.block;
        }

        this.context.fillRect(
            y * measurementOptions.widthTile,
            x * measurementOptions.heightTile,
            measurementOptions.widthTile,
            measurementOptions.heightTile
        );
    }

    protected drawLines(): void {
        let h = this.grid.length * measurementOptions.heightTile;
        let w = this.grid[0].length * measurementOptions.widthTile;

        this.context.strokeStyle = colors.line;
        this.context.globalAlpha = opacities.line;

        let x: number, y: number = 0;

        for (x = measurementOptions.heightTile; x < h; x += measurementOptions.heightTile) {
            this.context.moveTo(y, x);
            this.context.lineTo(w, x);
        }

        x = 0;

        for (y = measurementOptions.widthTile; y < w; y += measurementOptions.widthTile) {
            this.context.moveTo(y, x);
            this.context.lineTo(y, h);
        }

        this.context.stroke();

        this.context.globalAlpha = 1;
    }
}

export default Draw;