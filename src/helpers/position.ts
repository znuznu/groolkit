import { Position } from './types';

export function positionToString(position: Position, separator?: string): string {
    return `${position.x}${separator ?? ','}${position.y}`;
}

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

export function getRoundedPosition(position: Position) {
    return { x: Math.round(position.x), y: Math.round(position.y) };
}

export function gridContainsPosition(grid: any[][], position: Position): boolean {
    if (grid.length <= 0) {
        return false;
    }

    const x = position.x;
    const y = position.y;

    const height = grid.length;
    const width = grid[0].length;

    return x >= 0 && x <= height - 1 && y >= 0 && y <= width - 1;
}

export default {
    positionToString,
    stringToPosition,
    getRoundedPosition,
    gridContainsPosition
};
