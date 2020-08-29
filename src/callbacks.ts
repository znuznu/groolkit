import { Position } from './position';

export interface CallbackBlock {
    (element: any): boolean;
};

export interface CallbackLight {
    (element: any): boolean;
}

export interface CallbackFill {
    (position: Position): number;
};
