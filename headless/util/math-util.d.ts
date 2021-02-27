import { Point } from '../../realmlib/net';
/**
 * Checks whether or not the `point` falls inside of a square
 * of size `squareSize` with its center at `squarePoint`.
 * @param point The point to check.
 * @param squarePoint The square which the point might be inside of.
 * @param squareSize The size of the square.
 */
export declare function insideSquare<T extends Point>(point: T, squarePoint: T, squareSize: number): boolean;
