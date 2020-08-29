export interface Position {
    x: number;
    y: number;
}

export interface StringPositionDirection {
    position: string;
    direction: string;
}

export interface PositionDirection {
    position: Position;
    direction: string;
}

export function positionToString(position: Position): string {
    return position.x + ',' + position.y;
}

export function strToPosition(sPosition: string): Position {
    let [x, y] = sPosition.split(',').map(p => Number(p));
    return { x: x, y: y };
}

export function roundPosition(position: Position) {
    return { x: Math.round(position.x), y: Math.round(position.y) };
}