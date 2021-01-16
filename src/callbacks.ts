/** True if `cell` is a blocking one. */
export interface CallbackBlock {
    (cell: any): boolean;
}

/** True if light doesn't passes through `cell`. */
export interface CallbackLight {
    (cell: any): boolean;
}

/** True if `cell` is a target to fill. */
export interface CallbackFill {
    (cell: any): boolean;
}
