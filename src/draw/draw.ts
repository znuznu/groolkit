import { CallbackBlock } from '../callbacks';
import {
    BaseColors,
    baseColors,
    FillColors,
    fillColors,
    FovColors,
    fovColors,
    LineColors,
    lineColors,
    PathColors,
    pathColors
} from './colors';
import { ResultFill, ResultFov, ResultLine, ResultPath } from '../result';
import OPACITY from './opacity';
import Position from '../position';

interface DrawColors {
    base: BaseColors;
    fill: FillColors;
    fov: FovColors;
    line: LineColors;
    path: PathColors;
}

interface CellSize {
    width: number;
    height: number;
}

export interface DrawOptions {
    widthTile: number;
    heightTile: number;
    colors: DrawColors;
}

interface BaseOpacity {
    line: number;
    algorithm: number;
}

export const opacities: BaseOpacity = {
    line: OPACITY.LINE,
    algorithm: OPACITY.TILE
};

class Draw {
    protected context: CanvasRenderingContext2D;
    private grid: any[][];
    private callback: CallbackBlock;
    protected drawOptions: Partial<DrawOptions>;

    constructor(
        context: CanvasRenderingContext2D,
        grid: any[][],
        callback: CallbackBlock,
        sizeOptions?: Partial<CellSize>
    ) {
        this.context = context;
        this.grid = grid;
        this.callback = callback;
        this.drawOptions = {
            widthTile: sizeOptions ? sizeOptions.width ?? 16 : 16,
            heightTile: sizeOptions ? sizeOptions.height ?? 16 : 16,
            colors: {
                base: {
                    passage: baseColors.passage,
                    block: baseColors.passage,
                    line: baseColors.line
                },
                fill: {
                    fill: fillColors.fill
                },
                fov: {
                    visible: fovColors.visible
                },
                line: {
                    tile: lineColors.tile
                },
                path: {
                    path: pathColors.path,
                    start: pathColors.start,
                    end: pathColors.end
                }
            }
        };
    }

    clearCanvas(): void {
        let h = this.grid.length * this.drawOptions.widthTile;
        let w = this.grid[0].length * this.drawOptions.heightTile;
        this.context.clearRect(0, 0, w, h);
    }

    drawGrid(): void {
        let h = this.grid.length;
        let w = this.grid[0].length;

        this.context.canvas.width = w * this.drawOptions.widthTile;
        this.context.canvas.height = h * this.drawOptions.heightTile;

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

        this.context.fillStyle = baseColors.passage;

        if (this.callback(this.grid[x][y])) {
            this.context.fillStyle = baseColors.block;
        }

        this.context.fillRect(
            y * this.drawOptions.widthTile,
            x * this.drawOptions.heightTile,
            this.drawOptions.widthTile,
            this.drawOptions.heightTile
        );
    }

    protected drawLines(): void {
        let h = this.grid.length * this.drawOptions.heightTile;
        let w = this.grid[0].length * this.drawOptions.widthTile;

        this.context.strokeStyle = baseColors.line;
        this.context.globalAlpha = opacities.line;

        let x: number,
            y: number = 0;

        for (x = this.drawOptions.heightTile; x < h; x += this.drawOptions.heightTile) {
            this.context.moveTo(y, x);
            this.context.lineTo(w, x);
        }

        x = 0;

        for (y = this.drawOptions.widthTile; y < w; y += this.drawOptions.widthTile) {
            this.context.moveTo(y, x);
            this.context.lineTo(y, h);
        }

        this.context.stroke();

        this.context.globalAlpha = 1;
    }

    drawPath(result: ResultPath): void {
        if (result.status !== 'Found') {
            return;
        }

        this.clearCanvas();
        this.drawTiles();

        this.context.beginPath();
        this.context.globalAlpha = opacities.algorithm;

        result.path.forEach((tile, index) => {
            let color = pathColors.path;

            if (index === 0) {
                color = pathColors.start;
            } else if (index === result.path.length - 1) {
                color = pathColors.end;
            }

            this.context.fillStyle = color;

            let x = tile.x * this.drawOptions.heightTile;
            let y = tile.y * this.drawOptions.widthTile;
            this.context.fillRect(
                y,
                x,
                this.drawOptions.widthTile,
                this.drawOptions.heightTile
            );
        });

        this.context.closePath();
        this.context.globalAlpha = 1;
        this.drawLines();
    }

    drawFov(result: ResultFov, dark: boolean = false): void {
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
            this.context.fillStyle = fovColors.visible;

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

    drawLine(result: ResultLine): void {
        this.clearCanvas();
        this.drawTiles();

        this.context.beginPath();
        this.context.globalAlpha = opacities.algorithm;
        this.context.fillStyle = lineColors.tile;

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

    drawFill(result: ResultFill): void {
        this.clearCanvas();
        this.drawTiles();

        this.context.beginPath();
        this.context.globalAlpha = opacities.line;

        result.filled.forEach((position) => {
            this.context.fillStyle = fillColors.fill;

            this.context.fillRect(
                position.y * this.drawOptions.widthTile,
                position.x * this.drawOptions.heightTile,
                this.drawOptions.widthTile,
                this.drawOptions.heightTile
            );
        });

        this.context.closePath();
        this.context.globalAlpha = 1;
        this.drawLines();
    }
}

export default Draw;
