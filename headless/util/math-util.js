"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks whether or not the `point` falls inside of a square
 * of size `squareSize` with its center at `squarePoint`.
 * @param point The point to check.
 * @param squarePoint The square which the point might be inside of.
 * @param squareSize The size of the square.
 */
function insideSquare(point, squarePoint, squareSize) {
    const dX = Math.abs(point.x - squarePoint.x);
    const dY = Math.abs(point.y - squarePoint.y);
    return dX <= squareSize && dY <= squareSize;
}
exports.insideSquare = insideSquare;
