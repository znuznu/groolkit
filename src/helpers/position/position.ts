import { Position } from '../types';

/**
 * Converts a {@linkcode Position} to a string value.
 *
 * @param position - A Position.
 * @param separator - An optional separator, default is `,`.
 * @returns A string representation of the Position.
 */
export function positionToString(position: Position, separator?: string): string {
    return `${position.x}${separator ?? ','}${position.y}`;
}

/**
 * Converts a {@linkcode Position} represented as a string to a {@linkcode Position} value.
 *
 * @param position - A Position.
 * @param separator - An optional separator, default is `,`.
 * @returns A Position.
 *
 * @throws
 * On invalid string value.
 */
export function stringToPosition(position: string, separator?: string): Position {
    if (!position.includes(separator ?? ',')) {
        throw new Error(`Expected separator ${separator ?? ','} not found`);
    }

    const splittedPositions = position.split(separator ?? ',');

    const xValue = splittedPositions[0].trim();
    const yValue = splittedPositions[1].trim();

    if (xValue === '') {
        throw new Error('Invalid position: x is missing');
    }

    if (yValue === '') {
        throw new Error('Invalid position: y is missing');
    }

    const xNumber = Number(xValue);
    const yNumber = Number(yValue);

    if (isNaN(xNumber)) {
        throw new Error('Invalid position: x is not a number');
    }

    if (isNaN(yNumber)) {
        throw new Error('Invalid position: y is not a number');
    }

    return { x: xNumber, y: yNumber };
}

/**
 * Rounds the value of a {@linkcode Position}.
 *
 * @param position - A Position.
 * @returns The Position with `x` and `y` rounded.
 */
export function getRoundedPosition(position: Position) {
    return { x: Math.round(position.x), y: Math.round(position.y) };
}

/**
 * Whether a {@linkcode Position} is within the boundaries a two dimensional array.
 *
 * @param grid - A two dimensional array.
 * @param position - A Position.
 * @returns `true` if the Position is within the boundaries of the grid.
 */
export function isPositionWithinGrid(grid: any[][], position: Position): boolean {
    if (grid.length <= 0) {
        return false;
    }

    const x = position.x;
    const y = position.y;
    const h = grid.length;
    const w = grid[0].length;

    return x >= 0 && x <= h - 1 && y >= 0 && y <= w - 1;
}
