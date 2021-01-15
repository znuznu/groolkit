/** 
 * BLOCK            - Tile block color to use in the grid drawing.
 * PASSAGE          - Tile passage color to use in the grid drawing.
 * LINE             - Line color to use in the grid drawing.
 * BG               - Background color to use in the grid drawing.
 * START            - Tile start color to use in the path drawing.
 * END              - Tile end color to use in the path drawing.
 * PATH             - Tile path color to use in the path drawing.
 * RFF              - The replacement color to use for Flood filling.
 * LINE_ALGORITHM   - The color to use for Line algorithms.
 * FOV              - The color to use for FOV algorithms.
 */
export const COLOR = {
    BLOCK: 'grey',
    PASSAGE: 'white',
    LINE: 'black',
    BG: 'white',
    START: 'pink',
    END: 'green',
    PATH: 'yellow',
    RFF: 'lightblue',
    LINE_ALGORITHM: 'red',
    FOV: 'wheat',
}

export interface FovColors {
    visible: string;
}

export const fovColors: FovColors = {
    visible: COLOR.FOV,
}

export interface LineColors {
    tile: string;
}

export const lineColors: LineColors = {
    tile: COLOR.LINE_ALGORITHM,
}

export interface PathColors {
    path: string,
    start: string,
    end: string,
}

export const pathColors: PathColors = {
    path: COLOR.PATH,
    start: COLOR.START,
    end: COLOR.END,
}

export interface BaseColors {
    passage: string,
    block: string,
    line: string,
}

export const baseColors: BaseColors = {
    passage: COLOR.PASSAGE,
    block: COLOR.BLOCK,
    line: COLOR.LINE,
}