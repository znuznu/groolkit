import Position from './position';

export interface Result {
    status: string;
}

export interface ResultLine extends Result {
    status: 'Complete' | 'Incomplete',
    positions: Position[]
}

export interface ResultPath extends Result {
    status: 'Found' | 'Unreachable' | 'Invalid' | 'Block';
    path?: Position[];
}

export interface ResultFov extends Result {
    status: 'Success' | 'Failed';
    visibles?: Position[];
}