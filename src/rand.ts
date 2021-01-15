/**
 * Returns a number in [lower;upper[.
 *
 * @param lower - The lower limit (included)
 * @param upper - The upper limit (excluded)
 * @returns A random number between lower and upper (exclude)
 */
export function randInRange(lower: number = 0, upper: number) {
    return ~~(Math.random() * (upper - lower) + lower);
}
