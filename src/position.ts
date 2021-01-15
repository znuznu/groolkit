export default interface Position {
    x: number;
    y: number;
}

export function positionToString(position: Position): string {
    return position.x + ',' + position.y;
}

export function strToPosition(sPosition: string): Position {
    let [x, y] = sPosition.split(',').map((p) => Number(p));
    return { x: x, y: y };
}

export function roundPosition(position: Position) {
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
