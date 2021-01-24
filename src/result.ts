import Position from './position';

export interface Result {
    status: string;
}

export interface ResultLine extends Result {
    status: 'Complete' | 'Incomplete' | 'Failed';
    positions?: Position[];
}

export interface ResultPath extends Result {
    status: 'Found' | 'Unreachable' | 'Invalid' | 'Block';
    positions?: Position[];
}

export interface ResultFov extends Result {
    status: 'Success' | 'Failed';
    positions?: Position[];
}

export interface ResultFill extends Result {
    status: 'Success' | 'Block' | 'Failed';
    positions?: Position[];
}
