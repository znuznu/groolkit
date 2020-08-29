import { CallbackBlock } from '../callbacks';
import { ColorCell } from '../paint/floodFill';
import Position from '../position';
import * as Path from '../path/path';
import { COLORS, TILE_HEIGHT, TILE_WIDTH, OPACITY } from '../constants';

interface ShowOptions {
    tileWidth: number;
    tileHeight: number;
    blockColor: string;
    passageColor: string;
    lineAlgorithmColor: string;
    bgColor: string;
    lineColor: string;
    lineOpacity: number;
    fovColor: string;
    pathColor: string;
    startColor: string;
    endColor: string;
    opacityAlgorithm: number;
}

const SHOW_OPTIONS: ShowOptions = {
    tileWidth: TILE_WIDTH,
    tileHeight: TILE_HEIGHT,
    blockColor: COLORS.COLOR_BLOCK,
    passageColor: COLORS.COLOR_PASSAGE,
    lineAlgorithmColor: COLORS.COLOR_LINE_ALGORITHM,
    bgColor: COLORS.COLOR_BG,
    lineColor: COLORS.COLOR_LINE,
    lineOpacity: OPACITY.OPACITY_LINE,
    fovColor: COLORS.COLOR_FOV,
    pathColor: COLORS.COLOR_PATH,
    startColor: COLORS.COLOR_START,
    endColor: COLORS.COLOR_END,
    opacityAlgorithm: OPACITY.OPACITY_ALGORITHM
};

class Show {
    context: CanvasRenderingContext2D;
    grid: any[][];
    callback: CallbackBlock;

    constructor(context: CanvasRenderingContext2D, grid: any[][], callback: CallbackBlock) {
        this.context = context;
        this.grid = grid;
        this.callback = callback;
    }

    clearCanvas() {
        let h = this.grid.length * SHOW_OPTIONS.tileWidth;
        let w = this.grid[0].length * SHOW_OPTIONS.tileWidth;
        this.context.clearRect(0, 0, w, h);
    }

    drawGrid() {
        let h = this.grid.length;
        let w = this.grid[0].length;

        this.context.canvas.width = w * SHOW_OPTIONS.tileWidth;
        this.context.canvas.height = h * SHOW_OPTIONS.tileHeight;

        this.context.beginPath();
        this.drawTiles();
        this.drawLines();
        this.context.closePath();
    }

    drawTiles() {
        let h = this.grid.length;
        let w = this.grid[0].length;

        for (let x = 0; x < h; x++) {
            for (let y = 0; y < w; y++) {
                this.drawTile({ x: x, y: y });
            }
        }
    }

    drawTile(position: Position) {
        let x = position.x;
        let y = position.y;

        this.context.fillStyle = SHOW_OPTIONS.passageColor;

        if (this.callback(this.grid[x][y])) {
            this.context.fillStyle = SHOW_OPTIONS.blockColor;
        }

        this.context.fillRect(
            y * SHOW_OPTIONS.tileWidth,
            x * SHOW_OPTIONS.tileHeight,
            SHOW_OPTIONS.tileWidth,
            SHOW_OPTIONS.tileHeight
        );
    }

    drawLines() {
        let h = this.grid.length * SHOW_OPTIONS.tileHeight;
        let w = this.grid[0].length * SHOW_OPTIONS.tileWidth;

        this.context.strokeStyle = SHOW_OPTIONS.lineColor;
        this.context.globalAlpha = SHOW_OPTIONS.lineOpacity;

        let x: number, y: number = 0;

        for (x = SHOW_OPTIONS.tileHeight; x < h; x += SHOW_OPTIONS.tileHeight) {
            this.context.moveTo(y, x);
            this.context.lineTo(w, x);
        }

        x = 0;

        for (y = SHOW_OPTIONS.tileWidth; y < w; y += SHOW_OPTIONS.tileWidth) {
            this.context.moveTo(y, x);
            this.context.lineTo(y, h);
        }

        this.context.stroke();

        this.context.globalAlpha = 1;
    }

    drawPath(result: Path.Result, laps: number): void {
        if (result.status !== 'Found')
            return;

        this.clearCanvas();
        this.drawTiles();

        this.context.beginPath();
        this.context.globalAlpha = SHOW_OPTIONS.lineOpacity;

        result.path.forEach((tile, index) => {
            let color = SHOW_OPTIONS.pathColor;

            if (index === 0)
                color = SHOW_OPTIONS.startColor;
            else if (index === result.path.length - 1)
                color = SHOW_OPTIONS.endColor;

            this.context.fillStyle = color;

            let x = tile.x * SHOW_OPTIONS.tileHeight;
            let y = tile.y * SHOW_OPTIONS.tileWidth;
            this.context.fillRect(y, x, SHOW_OPTIONS.tileWidth, SHOW_OPTIONS.tileHeight);
        });

        this.context.closePath();
        this.context.globalAlpha = 1;
        this.drawLines();
    }

    drawFlood(colorGrid: ColorCell[][]) {
        this.clearCanvas();

        let h = this.grid.length;
        let w = this.grid[0].length;
        this.drawTiles();

        this.context.beginPath();
        this.context.globalAlpha = SHOW_OPTIONS.lineOpacity;

        for (let x = 0; x < h; x++) {
            for (let y = 0; y < w; y++) {
                this.context.fillStyle = colorGrid[x][y].color;
                this.context.fillRect(
                    y * SHOW_OPTIONS.tileWidth,
                    x * SHOW_OPTIONS.tileHeight,
                    SHOW_OPTIONS.tileWidth,
                    SHOW_OPTIONS.tileHeight
                );
            }
        }

        this.context.closePath();
        this.context.globalAlpha = 1;
        this.drawLines();
    }

    drawLine(positions: Position[]) {
        this.clearCanvas();
        this.drawTiles();

        this.context.beginPath();
        this.context.globalAlpha = SHOW_OPTIONS.lineOpacity;
        this.context.fillStyle = SHOW_OPTIONS.lineAlgorithmColor;

        positions.forEach((p: Position) => {
            this.context.fillRect(
                p.y * SHOW_OPTIONS.tileWidth,
                p.x * SHOW_OPTIONS.tileHeight,
                SHOW_OPTIONS.tileWidth,
                SHOW_OPTIONS.tileHeight
            );
        });

        this.context.closePath();
        this.context.globalAlpha = 1;
        this.drawLines();
    }

    drawFOV(positions: Position[], dark: boolean = false) {
        this.clearCanvas();

        if (!dark)
            this.drawTiles();

        console.log('???')

        this.context.beginPath();
        positions.forEach((p: Position) => {
            if (dark)
                this.drawTile(p);

            this.context.globalAlpha = SHOW_OPTIONS.opacityAlgorithm;
            this.context.fillStyle = SHOW_OPTIONS.fovColor;

            this.context.fillRect(
                p.y * SHOW_OPTIONS.tileWidth,
                p.x * SHOW_OPTIONS.tileHeight,
                SHOW_OPTIONS.tileWidth,
                SHOW_OPTIONS.tileHeight
            );
        });

        this.context.closePath();
        this.context.globalAlpha = 1;
        this.drawLines();
    }
}

export default Show;