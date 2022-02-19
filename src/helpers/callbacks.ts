/** True if `cell` is a blocking one. */
export interface CallbackBlock<T> {
    (cell: T): boolean;
}
