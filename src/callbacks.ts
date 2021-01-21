/** True if `cell` is a blocking one. */
export interface CallbackBlock<T> {
    (cell: T): boolean;
}

/** True if light doesn't passes through `cell`. */
export interface CallbackLight<T> {
    (cell: T): boolean;
}

/** True if `cell` is a target to fill. */
export interface CallbackFill<T> {
    (cell: T): boolean;
}
